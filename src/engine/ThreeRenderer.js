import * as THREE from 'three';

export class ThreeRenderer {
  constructor(containerId, onInteractionStart) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`Container element with id '${containerId}' not found.`);
    }

    this.onInteractionStart = onInteractionStart; // 오디오 기동용 콜백
    this.animationCallbacks = []; // 매 프레임 업데이트할 틱 콜백 어레이

    // 씬 및 카메라 설정
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      8000
    );
    this.camera.position.set(0, 50, 150);

    // WebGL 렌더러 및 그림자 맵 설정
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, logarithmicDepthBuffer: true });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // 월드 환경 루트 그룹 생성
    this.worldGroup = new THREE.Group();
    this.scene.add(this.worldGroup);

    // 인터랙션 대상 메쉬 목록
    this.interactiveObjects = [];

    // --- [고도화] RTS & 3rd 궤도 카메라 조작 변수 캡슐화 ---
    this.isDragging = false; // 좌클릭 3인칭 궤도 회전
    this.isPanning = false;   // 우클릭/Shift 평행 이동 (RTS 스타일 지면 스크롤)
    this.prevMousePosition = { x: 0, y: 0 };
    
    // 1. 회전 및 피치 각 조작 (피치는 degree 단위로 제어)
    this.cameraAngle = Math.PI / 4; // 45도 회전된 완벽한 대각선 Isometric 각도
    this.cameraTargetAngle = Math.PI / 4;
    this.cameraTargetPitch = 42; // 조금 높은 곳에서 사선을 내려다보는 42도 쿼터뷰 각도
    this.cameraPitch = 42;

    // 2. 줌(Zoom) 궤도 반경 조작
    this.cameraRadius = 380; // 초반 도시 시인성 확보를 위해 높이 대폭 상향 (120 -> 380)
    this.cameraTargetRadius = 380;

    // 3. 팬(Pan) 평행 이동 카메라 타겟 (기본: 중심 좌표 (30, 0, 0) - 도시 구획 중심부 조준)
    this.target = new THREE.Vector3(30, 0, 0);

    // 시네마틱 카메라 비행 설정
    this.cinematicMode = false; // 디폴트 높은 사선 뷰포트 정위를 위해 시네마틱 비행 기본 비활성화
    this.cinematicProgress = 900;

    this.startTime = Date.now();

    // FPS 카운터 변수 초기화
    this.fpsLastTime = Date.now();
    this.fpsFrames = 0;
    
    // 일주 시뮬레이션 상태 변수
    this.isNight = false;
    this.nightIntensityFactor = 0.2; // 주간에는 네온 약하게, 야간에는 강하게 조절
    
    // 초기화
    this.initLights();
    this.initSkyDome();
    this.bindEvents();
    this.setCinematicMode(false); // 디폴트 RTS 모드 및 OFF 뱃지 동기화
  }

  // 시네마틱 모드 설정 및 UI 연계 토글
  setCinematicMode(enabled) {
    this.cinematicMode = enabled;
    const btn = document.getElementById('btn-viewport-cinematic');
    if (btn) {
      if (enabled) {
        btn.innerText = "🎥 시네마틱 뷰: ON";
        btn.style.borderColor = "var(--lyt-accent-cyan)";
        btn.style.color = "var(--lyt-accent-cyan)";
      } else {
        btn.innerText = "🎥 시네마틱 뷰: OFF";
        btn.style.borderColor = "var(--lyt-text-muted)";
        btn.style.color = "var(--lyt-text-muted)";
      }
    }
  }

  // 조명 시스템 설계 (교각 및 상판 입체광 극대화, 전체 화면 밝기 상향)
  initLights() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.85); // 0.4 -> 0.85 대폭 상향
    this.scene.add(this.ambientLight);

    // 밝고 푸르른 대기 대비 광원 (Hemisphere) 추가로 어둠 최소화
    this.hemiLight = new THREE.HemisphereLight(0x4a62d6, 0x1f3030, 1.2); // 0.65 -> 1.2 상향
    this.scene.add(this.hemiLight);

    // 메인 태양광: 교량과 지면을 전체적으로 비추어 형태 부각
    this.sunLight = new THREE.DirectionalLight(0xffffff, 2.5); // 1.2 -> 2.5 상향
    this.sunLight.position.set(50, 150, 50);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.bias = -0.0003;
    this.scene.add(this.sunLight);

    // 반대측 그림자 음영부 보정용 Warm Fill Light 추가 (역광 해소)
    this.fillLight = new THREE.DirectionalLight(0xffecd6, 1.6);
    this.fillLight.position.set(-60, 100, -60);
    this.scene.add(this.fillLight);

    // 네온 충전 영역 및 교각 하부 점멸 라이트 범위/강도 증폭
    this.cyanNeon = new THREE.PointLight(0x00F0FF, 4.0, 75); // 3.0 -> 4.0, 반경 45 -> 75
    this.cyanNeon.position.set(-20, 15, -10);
    this.scene.add(this.cyanNeon);

    this.purpleNeon = new THREE.PointLight(0xB57EDC, 4.0, 75); // 3.0 -> 4.0, 반경 45 -> 75
    this.purpleNeon.position.set(20, 15, 10);
    this.scene.add(this.purpleNeon);
  }

  // 성운 그라데이션 스카이 돔 및 은하수(Milky Way) 별빛 흐름 시스템 구축
  initSkyDome() {
    const domeGeo = new THREE.SphereGeometry(3000, 32, 15);

    // 1. 거대 스카이 돔 - 화창한 낮 그라데이션
    const canvasDay = document.createElement('canvas');
    canvasDay.width = 512;
    canvasDay.height = 512;
    const ctxDay = canvasDay.getContext('2d');
    const gradDay = ctxDay.createLinearGradient(0, 0, 0, 512);
    gradDay.addColorStop(0, '#2d7be8');    // Deep sky blue
    gradDay.addColorStop(0.4, '#5296ed');  // Vibrant daylight blue
    gradDay.addColorStop(0.75, '#82b5ff'); // Light warm blue
    gradDay.addColorStop(1, '#ffffff');    // Bright warm horizon white
    ctxDay.fillStyle = gradDay;
    ctxDay.fillRect(0, 0, 512, 512);

    const domeTexDay = new THREE.CanvasTexture(canvasDay);
    const domeMatDay = new THREE.MeshBasicMaterial({
      map: domeTexDay,
      side: THREE.BackSide,
      transparent: true,
      opacity: 1.0
    });
    this.skyDomeDay = new THREE.Mesh(domeGeo, domeMatDay);
    this.scene.add(this.skyDomeDay);

    // 2. 거대 스카이 돔 - 밤 성운 그라데이션
    const canvasNight = document.createElement('canvas');
    canvasNight.width = 512;
    canvasNight.height = 512;
    const ctxNight = canvasNight.getContext('2d');
    const gradNight = ctxNight.createLinearGradient(0, 0, 0, 512);
    gradNight.addColorStop(0, '#020208');    // Deep black top
    gradNight.addColorStop(0.3, '#0a081a');  // Nebula indigo
    gradNight.addColorStop(0.7, '#160627');  // Nebula deep violet
    gradNight.addColorStop(1, '#020a12');    // Deep teal horizon
    ctxNight.fillStyle = gradNight;
    ctxNight.fillRect(0, 0, 512, 512);

    const domeTexNight = new THREE.CanvasTexture(canvasNight);
    const domeMatNight = new THREE.MeshBasicMaterial({
      map: domeTexNight,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.0
    });
    this.skyDomeNight = new THREE.Mesh(domeGeo, domeMatNight);
    this.scene.add(this.skyDomeNight);
  }

  // 마우스 조작 (회전, 줌, 팬) 및 리사이즈 이벤트 바인딩
  bindEvents() {
    // 마우스 우클릭 시 컨텍스트 메뉴 무력화 (팬 조작 충돌 차단)
    this.container.addEventListener('contextmenu', (e) => e.preventDefault());

    this.container.addEventListener('mousedown', (e) => {
      // 우클릭(button === 2)이거나 ShiftKey가 눌린 좌클릭인 경우 -> 팬(Pan) 기동 (시네마틱 해제)
      if (e.button === 2 || e.shiftKey) {
        if (this.cinematicMode) {
          this.setCinematicMode(false);
        }
        this.isPanning = true;
      } else if (e.button === 0) {
        // 일반 좌클릭 -> 시네마틱 모드 유지한 채 사용자가 마우스로 시선 방향 변경하도록 유도
        this.isDragging = true;
      }
      
      this.prevMousePosition = { x: e.offsetX, y: e.offsetY };
      
      if (this.onInteractionStart) {
        this.onInteractionStart();
      }
    });

    this.container.addEventListener('mouseup', () => {
      this.isDragging = false;
      this.isPanning = false;
    });

    this.container.addEventListener('mouseleave', () => {
      this.isDragging = false;
      this.isPanning = false;
    });

    this.container.addEventListener('mousemove', (e) => {
      const deltaX = e.offsetX - this.prevMousePosition.x;
      const deltaY = e.offsetY - this.prevMousePosition.y;

      if (this.isPanning) {
        // A. RTS 스타일 지면 평행 이동 (Map Scrolling)
        // 카메라 전방의 지면 투사 벡터와 우측 벡터를 이용하여 고도를 고정한 채 평행 이동합니다.
        const headingVector = new THREE.Vector3();
        this.camera.getWorldDirection(headingVector);
        
        const forwardVector = new THREE.Vector3(headingVector.x, 0, headingVector.z).normalize();
        const rightVector = new THREE.Vector3();
        rightVector.crossVectors(forwardVector, new THREE.Vector3(0, 1, 0)).normalize();

        const factor = this.cameraRadius * 0.0022;
        this.target.addScaledVector(rightVector, -deltaX * factor);
        this.target.addScaledVector(forwardVector, deltaY * factor);

      } else if (this.isDragging) {
        // B. 3인칭 구면 궤도(Orbit) 회전 기하 연산
        this.cameraTargetAngle -= deltaX * 0.005;
        this.cameraTargetPitch = Math.max(10, Math.min(85, this.cameraTargetPitch + deltaY * 0.15));
      }

      this.prevMousePosition = { x: e.offsetX, y: e.offsetY };
    });

    // C. 줌(Zoom) 마우스 휠 이벤트 바인딩
    this.container.addEventListener('wheel', (e) => {
      e.preventDefault();
      // 휠 델타 스크롤 량에 따라 궤도 반지름 조절 (최소 3m, 최대 800m 제한)
      const zoomFactor = this.cameraRadius * 0.05;
      const direction = e.deltaY > 0 ? 1 : -1;
      this.cameraTargetRadius = Math.max(
        3,
        Math.min(800, this.cameraTargetRadius + direction * zoomFactor)
      );
    }, { passive: false });

    // D. 시네마틱 뷰 토글 버튼 바인딩
    const cinematicBtn = document.getElementById('btn-viewport-cinematic');
    if (cinematicBtn) {
      cinematicBtn.addEventListener('click', () => {
        this.setCinematicMode(!this.cinematicMode);
      });
    }

    // E. Zoom Fit 버튼 바인딩
    const zoomFitBtn = document.getElementById('btn-viewport-zoomfit');
    if (zoomFitBtn) {
      zoomFitBtn.addEventListener('click', () => {
        this.zoomFit();
        // 버튼 피드백 애니메이션
        zoomFitBtn.style.background = 'rgba(255, 215, 0, 0.15)';
        zoomFitBtn.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.4)';
        setTimeout(() => {
          zoomFitBtn.style.background = 'rgba(12, 12, 18, 0.9)';
          zoomFitBtn.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)';
        }, 300);
      });
    }

    window.addEventListener('resize', () => this.handleResize());
  }

  handleResize() {
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  // 매 프레임 업데이트될 애니메이션 콜백 등록
  registerAnimationCallback(callback) {
    if (typeof callback === 'function') {
      this.animationCallbacks.push(callback);
    }
  }

  // 씬을 초기화할 때 호출하는 유틸리티
  clearWorld() {
    while (this.worldGroup.children.length > 0) {
      this.worldGroup.remove(this.worldGroup.children[0]);
    }
    this.interactiveObjects.length = 0;
    
    // 월드를 비울 때 카메라 초점 타겟도 초기 중심 좌표로 복원
    this.target.set(0, 1.5, 0);
    this.cameraTargetRadius = 120;
    this.cameraTargetAngle = 0.5;
    this.cameraTargetPitch = 55;
  }

  // 씬 내 모든 오브젝트를 카메라 뷰에 맞추는 Zoom Fit
  zoomFit() {
    const box = new THREE.Box3();
    let hasContent = false;

    this.worldGroup.traverse((obj) => {
      if (obj.isMesh && obj.name !== 'ground-plane') {
        const meshBox = new THREE.Box3().setFromObject(obj);
        box.union(meshBox);
        hasContent = true;
      }
    });

    // 콘텐츠가 없으면 ground-plane 포함
    if (!hasContent) {
      this.worldGroup.traverse((obj) => {
        if (obj.isMesh) {
          box.union(new THREE.Box3().setFromObject(obj));
          hasContent = true;
        }
      });
    }

    if (!hasContent) {
      // 아무것도 없으면 기본값으로
      this.target.set(0, 0, 0);
      this.cameraTargetRadius = 380;
      this.cameraTargetPitch = 42;
      return;
    }

    // 바운딩 박스 센터 → 카메라 타겟
    const center = new THREE.Vector3();
    box.getCenter(center);
    this.target.set(center.x, center.y, center.z);

    // 바운딩 박스 대각선 길이 기반으로 radius 계산
    const size = new THREE.Vector3();
    box.getSize(size);
    const diagonal = Math.sqrt(size.x * size.x + size.z * size.z);
    const fovRad = (this.camera.fov * Math.PI) / 180;
    const fitRadius = (diagonal / 2) / Math.tan(fovRad / 2) * 1.4; // 1.4 = 여유 마진

    this.cameraTargetRadius = Math.max(30, Math.min(1200, fitRadius));
    this.cameraTargetPitch = 42;
    // 현재 각도 유지 (회전은 건드리지 않음)
  }

  // 메인 렌더 업데이트 틱
  update() {
    const now = Date.now();
    const elapsed = now - this.startTime;

    // 실시간 FPS 계산 및 UI 엘리먼트 갱신 (1초마다)
    this.fpsFrames++;

    if (now >= this.fpsLastTime + 1000) {
      const fps = Math.round((this.fpsFrames * 1000) / (now - this.fpsLastTime) * 10) / 10;
      this.fpsFrames = 0;
      this.fpsLastTime = now;

      const fpsValEl = document.getElementById('fps-value');
      const fpsDotEl = document.getElementById('fps-dot');
      const fpsStatusEl = document.getElementById('fps-status');

      if (fpsValEl) {
        fpsValEl.innerText = fps.toFixed(1);
        
        if (fps >= 55) {
          fpsValEl.style.color = '#00FFCC';
          if (fpsDotEl) {
            fpsDotEl.style.background = '#00FFCC';
            fpsDotEl.style.boxShadow = '0 0 6px #00FFCC';
          }
          if (fpsStatusEl) {
            fpsStatusEl.innerText = 'OPTIMIZED';
            fpsStatusEl.style.color = 'rgba(0, 255, 204, 0.6)';
          }
        } else if (fps >= 40) {
          fpsValEl.style.color = '#FFCC00';
          if (fpsDotEl) {
            fpsDotEl.style.background = '#FFCC00';
            fpsDotEl.style.boxShadow = '0 0 6px #FFCC00';
          }
          if (fpsStatusEl) {
            fpsStatusEl.innerText = 'WARNING';
            fpsStatusEl.style.color = 'rgba(255, 204, 0, 0.6)';
          }
        } else {
          fpsValEl.style.color = '#FF3300';
          if (fpsDotEl) {
            fpsDotEl.style.background = '#FF3300';
            fpsDotEl.style.boxShadow = '0 0 8px #FF3300';
          }
          if (fpsStatusEl) {
            fpsStatusEl.innerText = 'HEAVY';
            fpsStatusEl.style.color = 'rgba(255, 51, 0, 0.6)';
          }
        }
      }
    }

    if (this.cinematicMode) {
      // 시네마틱 비행 모드: 카메라가 도로/교량 선형을 따라 5m 위에서 날아가며 활공
      this.cinematicProgress -= 1.0; // 날아가는 진행 속도
      if (this.cinematicProgress < -900) {
        this.cinematicProgress = 900; // 루프 리셋
      }

      const normT = (this.cinematicProgress + 900) / 1800;
      // 교량의 3D 선형 수학 공식 동기화
      const targetX = -8 + (this.cinematicProgress * this.cinematicProgress) / (-1800 * 1.68);
      const targetY = 12.65 + Math.sin(normT * Math.PI) * 1.5;
      const targetZ = this.cinematicProgress;

      // 카메라 포지션을 교량 한차선 위 5m 높이에 완벽 안착!
      this.camera.position.set(targetX, targetY + 5.0, targetZ);

      // 사용자가 마우스 드래그 조작으로 주는 시선 방향(Angle, Pitch) 스무스 lerp 연산
      this.cameraAngle = THREE.MathUtils.lerp(this.cameraAngle, this.cameraTargetAngle, 0.08);
      this.cameraTargetPitch = Math.max(-15, Math.min(25, this.cameraTargetPitch)); // 시선 피치 제한

      // 전진 방향(PI) 기준으로 사용자의 뷰 회전각(Angle, Pitch)을 투사하여 3D 시선 타겟 계산
      const lookX = this.camera.position.x + Math.sin(this.cameraAngle + Math.PI) * 50;
      const lookZ = this.camera.position.z + Math.cos(this.cameraAngle + Math.PI) * 50;
      const lookY = this.camera.position.y + this.cameraTargetPitch * 1.5;

      this.target.set(lookX, lookY, lookZ);
      this.camera.lookAt(this.target);
    } else {
      // 1. 카메라 줌 반지름 스무스 lerp 적용
      this.cameraRadius = THREE.MathUtils.lerp(this.cameraRadius, this.cameraTargetRadius, 0.08);

      // 2. 카메라 회전각 및 피칭각 스무스 lerp 적용
      this.cameraAngle = THREE.MathUtils.lerp(this.cameraAngle, this.cameraTargetAngle, 0.05);
      this.cameraPitch = THREE.MathUtils.lerp(this.cameraPitch, this.cameraTargetPitch, 0.08);

      const pitchRad = (this.cameraPitch * Math.PI) / 180;
      const horizontalDist = Math.cos(pitchRad) * this.cameraRadius;

      // 3. RTS/3인칭 구면 궤도 좌표계 기반 최종 포지션 갱신
      this.camera.position.x = this.target.x + Math.sin(this.cameraAngle) * horizontalDist;
      this.camera.position.z = this.target.z + Math.cos(this.cameraAngle) * horizontalDist;
      this.camera.position.y = this.target.y + Math.sin(pitchRad) * this.cameraRadius;
      
      this.camera.lookAt(this.target);
    }

    // 외부 애니메이션 틱 실행
    this.animationCallbacks.forEach((callback) => {
      try {
        callback(elapsed);
      } catch (e) {
        console.error('Error in animation callback:', e);
      }
    });

    // 4. 일주 시뮬레이션 (Day-Night Cycle) — 태양 및 조명의 원형 공전 (약 60초 주기, 낮 12시 기점 시작을 위해 PI/3 오프셋 추가)
    const cycleAngle = ((elapsed * 0.0001) + Math.PI / 3) % (Math.PI * 2);
    const sunRadius = 250;
    
    const sunX = Math.cos(cycleAngle) * sunRadius;
    const sunY = Math.sin(cycleAngle) * sunRadius;
    const sunZ = Math.sin(cycleAngle * 0.5) * 50;
    
    if (this.sunLight) {
      this.sunLight.position.set(sunX, sunY, sunZ);
      
      if (sunY < -10) {
        // 밤 (지평선 밑)
        this.sunLight.intensity = 0.0;
        this.isNight = true;
        this.nightIntensityFactor = THREE.MathUtils.lerp(this.nightIntensityFactor, 2.2, 0.05);
        if (this.ambientLight) this.ambientLight.color.setHex(0x050512);
        if (this.hemiLight) this.hemiLight.intensity = 0.15;
      } 
      else if (sunY < 40) {
        // 노을 및 여명 타임 (지평선 근처)
        const t = Math.max(0, (sunY + 10) / 50);
        this.sunLight.intensity = t * 1.2;
        this.sunLight.color.setHex(0xff5500);
        this.isNight = true;
        this.nightIntensityFactor = THREE.MathUtils.lerp(this.nightIntensityFactor, 1.6, 0.05);
        if (this.ambientLight) this.ambientLight.color.setHex(0x2a1510);
        if (this.hemiLight) this.hemiLight.intensity = 0.45;
      } 
      else {
        // 낮 (하늘 높이 뜸)
        this.sunLight.intensity = 2.5;
        this.sunLight.color.setHex(0xffffff);
        this.isNight = false;
        this.nightIntensityFactor = THREE.MathUtils.lerp(this.nightIntensityFactor, 0.2, 0.05);
        if (this.ambientLight) this.ambientLight.color.setHex(0xffffff);
        if (this.hemiLight) this.hemiLight.intensity = 1.2;
      }
    }

    // 2중 스카이돔 실시간 크로스페이드 감쇠 연동
    if (this.skyDomeDay && this.skyDomeNight) {
      let dayRatio = 0.0;
      if (sunY > 40) {
        dayRatio = 1.0;
      } else if (sunY < -10) {
        dayRatio = 0.0;
      } else {
        dayRatio = (sunY + 10) / 50; // -10m ~ 40m 구간 부드러운 스위칭
      }
      
      this.skyDomeDay.material.opacity = THREE.MathUtils.lerp(this.skyDomeDay.material.opacity, dayRatio, 0.05);
      this.skyDomeNight.material.opacity = THREE.MathUtils.lerp(this.skyDomeNight.material.opacity, 1.0 - dayRatio, 0.05);

      this.skyDomeDay.rotation.y = elapsed * 0.000004;
      this.skyDomeNight.rotation.y = elapsed * 0.000004;
    }

    this.renderer.render(this.scene, this.camera);
  }

  // 렌더 루프 가동
  start() {
    const loop = () => {
      requestAnimationFrame(loop);
      this.update();
    };
    loop();
  }
}
