import * as THREE from 'three';

export class InteractionRaycaster {
  constructor(rendererInstance, callbacks) {
    this.renderer = rendererInstance;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // UI 및 이벤트 연동 콜백
    this.onObjectSelected = callbacks.onObjectSelected || (() => {});
    this.onStateChanged = callbacks.onStateChanged || (() => {});
    this.onLog = callbacks.onLog || (() => {});
    this.onSound = callbacks.onSound || (() => {});

    this.selectedObject = null;

    this.bindEvents();
  }

  // 뷰포트 내 클릭 이벤트 바인딩
  bindEvents() {
    const dom = this.renderer.renderer.domElement;
    dom.addEventListener('click', (e) => this.handleClick(e));
  }

  handleClick(e) {
    const dom = this.renderer.renderer.domElement;
    const rect = dom.getBoundingClientRect();

    // 마우스 좌표 정규화 (-1 to +1)
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    // Raycast 광선 추적 실행
    this.raycaster.setFromCamera(this.mouse, this.renderer.camera);
    const intersects = this.raycaster.intersectObjects(this.renderer.interactiveObjects, true);

    if (intersects.length > 0) {
      // 상호작용 명세를 포함한 최상위 부모 노드 탐색
      let hitObj = intersects[0].object;
      while (hitObj && !hitObj.userData.interactive) {
        hitObj = hitObj.parent;
      }

      if (hitObj) {
        this.selectedObject = hitObj;

        // 경쾌한 오디오 비프음 출력
        this.onSound(587.33, 'triangle', 0.15);

        // UI 인스펙터 선택 콜백 호출
        this.onObjectSelected(hitObj);

        // 즉각적 물리/애니메이션 상태 전환
        this.handleImmediateAction(hitObj);
      }
    }
  }

  // 객체 타입별 물리/구조적 상태 전환 및 사운드 발생
  handleImmediateAction(obj) {
    if (!obj || !obj.userData) return;

    const type = obj.userData.type;

    if (type === 'door') {
      obj.userData.isOpen = !obj.userData.isOpen;
      obj.userData.state = obj.userData.isOpen ? "완전 열림 (물리 각도: 90도)" : "닫힘";
      this.onLog('User', `'${obj.userData.name}'의 위상 기하 도어 상태를 토글했습니다.`);
      this.onSound(obj.userData.isOpen ? 440 : 220, 'sine', 0.3);
    } 
    else if (type === 'computer') {
      obj.userData.isOn = !obj.userData.isOn;
      obj.userData.state = obj.userData.isOn ? "작동 중 (전력 가속)" : "절전 대기";
      this.onLog('User', `'${obj.userData.name}'의 전원을 제어했습니다.`);
      this.onSound(obj.userData.isOn ? 880 : 110, 'sawtooth', 0.2);
    } 
    else if (type === 'cup') {
      obj.userData.isFloating = !obj.userData.isFloating;
      obj.userData.state = obj.userData.isFloating ? "부유 모드 작동 (반중력)" : "테이블 안착";
      this.onLog('User', `'${obj.userData.name}'에 반중력 충격을 가했습니다.`);
      this.onSound(obj.userData.isFloating ? 659.25 : 329.63, 'square', 0.25);
    }
    else if (type === 'IfcRoadPart') {
      const gatePivot = obj.getObjectByName('toll-gate-pivot');
      if (gatePivot) {
        const nextOpen = !gatePivot.userData.isOpen;
        if (nextOpen) {
          this.onLog('User', `'${obj.userData.name}'의 블록체인 통행료 0.50 CHKN 지불을 승인했습니다.`);
          this.onLog('System', `Web3 스마트 컨트랙트 승인 완료: 트랜잭션 정상 검증.`);
          gatePivot.userData.isOpen = true;
          obj.userData.state = "게이트 승인 개방 (통행 통과)";
          this.onSound(880, 'sine', 0.4);
        } else {
          this.onLog('User', `'${obj.userData.name}' 스마트 게이트 차단을 수동 복귀했습니다.`);
          gatePivot.userData.isOpen = false;
          obj.userData.state = "게이트 닫힘 (상시 보안 차단)";
          this.onSound(220, 'sawtooth', 0.3);
        }
      }
    }
    else if (type === 'light') {
      const bulb = this.renderer.scene.getObjectByName("streetlight-bulb");
      if (bulb) {
        const isLit = bulb.userData.state === "켜짐";
        bulb.userData.state = isLit ? "소등" : "켜짐";
        bulb.material.emissiveIntensity = isLit ? 0.05 : 1.5;
        this.onLog('User', `'${obj.userData.name}' 가로등의 조명을 전환했습니다.`);
        this.onSound(isLit ? 150 : 600, 'sine', 0.1);
      }
    }
    else {
      // 기타 커스텀 에셋
      obj.userData.state = "물리 충돌 체크 통과";
    }

    // 변경된 객체 상태 정보 UI 갱신 유도 콜백
    this.onStateChanged(obj);
  }

  // 인스펙터 등의 원격 액션 물리 제어 실행 시
  triggerSelectedAction() {
    if (this.selectedObject) {
      this.handleImmediateAction(this.selectedObject);
    } else {
      throw new Error("No object selected to trigger action.");
    }
  }
}
