import * as THREE from 'three';
import { ThreeRenderer } from './engine/ThreeRenderer.js';
import { EnvironmentManager } from './engine/EnvironmentManager.js';
import { InteractionRaycaster } from './engine/InteractionRaycaster.js';
import { ProceduralGenerator } from './ai/ProceduralGenerator.js';
import { PromptInterpreter } from './ai/PromptInterpreter.js';
import { AgentSimulator } from './ai/AgentSimulator.js';
import { Layout } from './ui/Layout.js';
import { Inspector } from './ui/Inspector.js';
import { MarketView } from './ui/MarketView.js';
import { WalletConnector } from './blockchain/WalletConnector.js';
import { ContractService } from './blockchain/ContractService.js';

// ============================================================
// 초기 마켓플레이스 에셋 데이터 (City Agent 제작)
// ============================================================
const INITIAL_ASSETS = [
  {
    id: 'asset-railway',
    title: "RFI - Track Line & Express Train",
    creator: "City Agent",
    price: 4.20,
    type: 'IfcRailway',
    description: "BIM IfcRailway 표준의 S자 복선 강레일, 자갈 도상, 침목 및 고속열차. 다관절 선형 물리 틱 탑재.",
    code: `function animate(mesh, time) {
    mesh.traverse(c => {
        if(c.userData && c.userData.type === 'train') {
            c.position.z = Math.sin(time * 0.0004) * 35;
        }
    });
}`
  },
  {
    id: 'asset-bridge-cable',
    title: "IFC - Cable-Stayed Skybridge",
    creator: "City Agent",
    price: 6.80,
    type: 'IfcBridge',
    description: "Anti-gravity 네온 사장교. 파라메트릭 케이블 밀도와 주탑 높이 자동 계산.",
    code: `function animate(mesh, time) {
    mesh.traverse(c => {
        if(c.material && c.material.emissive) {
            c.material.emissiveIntensity = 0.5 + Math.sin(time * 0.003) * 0.4;
        }
    });
}`
  },
  {
    id: 'asset-power-station',
    title: "POWER - Plasma Fusion Reactor",
    creator: "City Agent",
    price: 9.50,
    type: 'IfcFacility',
    description: "양자 플라즈마 핵융합 반응로. 냉각탑 회전 애니메이션 및 코어 에너지 광방출.",
    code: `function animate(mesh, time) {
    mesh.rotation.y = time * 0.0003;
    mesh.traverse(c => {
        if(c.name === 'core') c.material.emissiveIntensity = 0.8 + Math.sin(time * 0.005) * 0.5;
    });
}`
  },
  {
    id: 'asset-tunnel-shield',
    title: "TUN - Shield Segment Hyperloop",
    creator: "City Agent",
    price: 5.30,
    type: 'IfcTunnel',
    description: "지하 쉴드 세그멘탈 하이퍼루프 터널. LED 링 가이드 및 공기압 가속 구간.",
    code: `function animate(mesh, time) {
    mesh.traverse(c => {
        if(c.userData.ledRing) {
            c.material.emissiveIntensity = 0.3 + Math.sin(time * 0.01 + c.position.z * 0.1) * 0.7;
        }
    });
}`
  },
  {
    id: 'asset-marine-port',
    title: "PORT - Gravity Quantum Harbor",
    creator: "City Agent",
    price: 7.20,
    type: 'IfcMarineFacility',
    description: "사이버네틱 심해 중력 항만. 회전 탐색등과 화물 크레인 적재 시뮬레이션.",
    code: `function animate(mesh, time) {
    mesh.traverse(c => {
        if(c.name === 'crane-arm') c.rotation.z = Math.sin(time * 0.0008) * 0.25;
    });
}`
  },
  {
    id: 'asset-road-toll',
    title: "ROAD - Holographic Toll Gate",
    creator: "City Agent",
    price: 2.80,
    type: 'IfcRoadPart',
    description: "홀로그래픽 스카이하이웨이 자동 요금소. 블록체인 서명 잔액 확인 게이트.",
    code: `function animate(mesh, time) {
    mesh.traverse(c => {
        if(c.name === 'gate-bar') c.rotation.z = Math.max(0, Math.sin(time * 0.002)) * 1.4;
    });
}`
  },
];

// ============================================================
// 메인 애플리케이션 클래스
// ============================================================
class App {
  constructor() {
    // 핵심 엔진
    this.renderer = new ThreeRenderer('viewport-canvas');
    this.envManager = new EnvironmentManager(this.renderer);
    this.generator = new ProceduralGenerator(this.renderer);
    this.interpreter = new PromptInterpreter();

    // UI
    this.layout = new Layout();
    this.inspector = null;
    this.marketView = null;

    // 블록체인
    this.wallet = new WalletConnector();
    this.contract = new ContractService();

    // 상태
    this.assetsMarket = [...INITIAL_ASSETS];
    this.userBalance = 100.0;
    this.agentBalance = 0.0;
    this.selectedObject = null;
    this.lastCreatedMesh = null; // City Agent가 마지막으로 생성한 메쉬

    // City Agent
    this.agent = new AgentSimulator({
      onAssetCreated: (asset) => this.handleAssetCreated(asset),
      onBuildRequested: (prompt, type) => this.generateAIProceduralAsset(prompt, type),
      onStatusChanged: (payload) => this.handleAgentStatusChanged(payload),
      onLog: (sender, msg) => this.layout.logEvent(sender === 'City Agent' ? 'Agent' : 'System', msg),
    });

    this.init();
  }

  init() {
    // 환경 빌드
    this.envManager.build('urban');

    // UI 초기화
    this.inspector = new Inspector(
      () => this.handleTriggerAction(),
      this.layout
    );

    this.marketView = new MarketView({
      onLoadAsset: (asset) => this.handleLoadAsset(asset),
      onAcquireAsset: (assetId) => this.handleAcquireAsset(assetId),
    });

    // Raycaster
    this.raycaster = new InteractionRaycaster(this.renderer, {
      onSelect: (obj) => {
        this.selectedObject = obj;
        this.inspector.update(obj);
      },
      onDeselect: () => {
        this.selectedObject = null;
        this.inspector.reset();
      },
    });

    // 마켓 렌더
    this.marketView.render(this.assetsMarket);
    this.layout.updateBalances(this.userBalance, this.agentBalance);

    // 이벤트 바인딩
    this.bindUIEvents();

    // City Agent 자율 스케줄러 시작
    this.agent.start();

    // 렌더 루프
    this.renderer.startLoop(() => {
      this.raycaster.update();
      if (this.renderer.streamingManager) {
        this.renderer.streamingManager.update(this.renderer.camera.position.z);
      }
    });

    this.layout.logEvent('System', '🤖 City Agent 시스템 초기화 완료 — 빈 캔버스에서 시작합니다.');
    this.layout.logEvent('Agent', '대기 중... "City Agent 생성" 버튼을 누르거나 자율 모드로 기다려 주세요.');
  }

  // ============================================================
  // UI 이벤트 바인딩
  // ============================================================
  bindUIEvents() {
    // 공간 Clear 버튼
    const clearBtn = document.getElementById('btn-viewport-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.envManager.build('urban');
        this.lastCreatedMesh = null;
        this.assetsMarket = this.assetsMarket.filter(a => a.creator !== 'City Agent' || INITIAL_ASSETS.find(i => i.id === a.id));
        this.marketView.render(this.assetsMarket);
        this.layout.showNotification('🧹 가상공간이 초기화되었습니다.');
        this.layout.logEvent('System', '가상공간 초기화 완료.');
        this.updateZoomLastBtn();
      });
    }

    // City Agent 수동 생성 버튼
    const agentBuildBtn = document.getElementById('btn-agent-build');
    if (agentBuildBtn) {
      agentBuildBtn.addEventListener('click', () => {
        this.agent.forceTrigger();
        this.layout.playSynthSound(880, 'sine', 0.15);
      });
    }

    // Zoom to Last Created 버튼
    const zoomLastBtn = document.getElementById('btn-zoom-last');
    if (zoomLastBtn) {
      zoomLastBtn.addEventListener('click', () => {
        this.zoomToLastCreated();
      });
    }

    // 수동 프롬프트 생성
    const manualBtn = document.getElementById('btn-manual-generate');
    if (manualBtn) {
      manualBtn.addEventListener('click', () => this.handleManualGenerate());
    }

    // 환경 전환 버튼들
    ['btn-env-urban', 'btn-env-indoor', 'btn-env-rural'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('click', () => {
          const envType = id.replace('btn-env-', '');
          this.envManager.build(envType);
          this.lastCreatedMesh = null;
          this.updateZoomLastBtn();
        });
      }
    });

    // API Key 저장
    const apiKeyBtn = document.getElementById('btn-save-apikey');
    if (apiKeyBtn) {
      apiKeyBtn.addEventListener('click', () => {
        const keyInput = document.getElementById('gemini-api-key');
        if (keyInput && keyInput.value.trim()) {
          this.interpreter.setApiKey(keyInput.value.trim());
          this.layout.showNotification('✅ Gemini API Key 저장 완료');
          this.layout.logEvent('System', 'Gemini API Key 등록. 실제 LLM 설계 모드 활성화.');
        }
      });
    }
  }

  // ============================================================
  // Zoom to Last Created
  // ============================================================
  zoomToLastCreated() {
    if (!this.lastCreatedMesh) {
      this.layout.showNotification('⚠️ 아직 생성된 사물이 없습니다. City Agent 생성 버튼을 눌러주세요.');
      return;
    }

    const box = new THREE.Box3().setFromObject(this.lastCreatedMesh);
    const center = new THREE.Vector3();
    box.getCenter(center);
    const size = new THREE.Vector3();
    box.getSize(size);

    // 타겟을 오브젝트 중심으로
    this.renderer.target.set(center.x, center.y, center.z);

    // 크기 기반 최적 줌
    const diagonal = Math.sqrt(size.x * size.x + size.z * size.z);
    const fovRad = (this.renderer.camera.fov * Math.PI) / 180;
    const fitRadius = Math.max(20, (diagonal / 2) / Math.tan(fovRad / 2) * 1.8);

    this.renderer.cameraTargetRadius = fitRadius;
    this.renderer.cameraTargetPitch = 38;

    // 버튼 피드백
    const btn = document.getElementById('btn-zoom-last');
    if (btn) {
      btn.style.background = 'rgba(0, 255, 150, 0.15)';
      btn.style.boxShadow = '0 0 20px rgba(0, 255, 150, 0.5)';
      setTimeout(() => {
        btn.style.background = 'rgba(12, 12, 18, 0.9)';
        btn.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)';
      }, 350);
    }

    this.layout.logEvent('System', `📸 카메라 → "${this.lastCreatedMesh.name}" 오브젝트로 포커스 이동`);
  }

  // Zoom Last 버튼 활성/비활성 업데이트
  updateZoomLastBtn() {
    const btn = document.getElementById('btn-zoom-last');
    if (!btn) return;
    if (this.lastCreatedMesh) {
      btn.style.opacity = '1';
      btn.style.cursor = 'pointer';
      btn.style.borderColor = '#00FF99';
      btn.style.color = '#00FF99';
    } else {
      btn.style.opacity = '0.4';
      btn.style.cursor = 'not-allowed';
      btn.style.borderColor = '#555';
      btn.style.color = '#555';
    }
  }

  // ============================================================
  // City Agent 사물 생성 (Zero → 3D Object)
  // ============================================================
  async generateAIProceduralAsset(prompt, type) {
    try {
      // PromptInterpreter로 파라메트릭 스키마 추출
      const schema = await this.interpreter.interpret(prompt);
      if (!schema || !schema.geometryType) return false;

      // ProceduralGenerator로 3D 메쉬 생성
      const mesh = this.generator.generate(schema, schema.title || prompt.substring(0, 30));
      if (!mesh) return false;

      // 랜덤 배치 (그라운드 위 중심 근처)
      const spread = 40;
      mesh.position.set(
        (Math.random() - 0.5) * spread,
        0,
        (Math.random() - 0.5) * spread
      );

      // 씬에 추가
      this.renderer.worldGroup.add(mesh);

      // 마지막 생성 오브젝트 추적
      this.lastCreatedMesh = mesh;
      this.updateZoomLastBtn();

      // 마켓플레이스에 신규 에셋 등록
      const newAsset = {
        id: `asset-agent-${Date.now()}`,
        title: schema.title || `City Agent: ${type}`,
        creator: 'City Agent',
        price: parseFloat((3.0 + Math.random() * 8.0).toFixed(2)),
        type: type || schema.geometryType,
        description: prompt.substring(0, 80),
        code: `function animate(mesh, time) {\n    mesh.traverse(c => {\n        if(c.material && c.material.emissive) {\n            c.material.emissiveIntensity = 0.5 + Math.sin(time * 0.003) * 0.4;\n        }\n    });\n}`,
      };

      this.assetsMarket.unshift(newAsset);
      this.marketView.render(this.assetsMarket);

      // 에이전트 수입
      const earnings = newAsset.price * 0.3;
      this.agentBalance += earnings;
      this.layout.updateBalances(this.userBalance, this.agentBalance);

      this.layout.showNotification(`✅ City Agent 생성 완료: ${newAsset.title}`);
      this.layout.playSynthSound(660, 'triangle', 0.3);

      return true;
    } catch (err) {
      console.error('generateAIProceduralAsset error:', err);
      return false;
    }
  }

  // ============================================================
  // 수동 프롬프트 생성
  // ============================================================
  async handleManualGenerate() {
    const inputEl = document.getElementById('prompt-input');
    const prompt = inputEl ? inputEl.value.trim() : '';
    if (!prompt) {
      this.layout.showNotification('프롬프트를 입력해주세요.');
      return;
    }

    this.agent.learnPrompt(prompt);
    this.layout.logEvent('User', `수동 설계 명령: "${prompt}"`);

    const schema = await this.interpreter.interpret(prompt);
    if (!schema) {
      this.layout.showNotification('설계 명령을 해석할 수 없습니다.');
      return;
    }

    const mesh = this.generator.generate(schema, prompt.substring(0, 30));
    if (mesh) {
      mesh.position.set((Math.random() - 0.5) * 30, 0, (Math.random() - 0.5) * 30);
      this.renderer.worldGroup.add(mesh);
      this.lastCreatedMesh = mesh;
      this.updateZoomLastBtn();

      if (inputEl) inputEl.value = '';
      this.layout.showNotification(`🏗️ 생성 완료: ${prompt.substring(0, 30)}`);
      this.layout.logEvent('User', `직접 설계 완료: ${prompt.substring(0, 30)}`);
    }
  }

  // ============================================================
  // City Agent 상태 변화 처리
  // ============================================================
  handleAgentStatusChanged(payload) {
    const statusEl = document.getElementById('agent-status');
    const goalEl = document.getElementById('agent-goal');
    const moduleEl = document.getElementById('agent-module');

    if (statusEl) statusEl.innerText = payload.status;
    if (goalEl) goalEl.innerText = payload.goal || '-';
    if (moduleEl) moduleEl.innerText = payload.activeModule || '-';

    // 상태별 버튼 텍스트 변경
    const agentBuildBtn = document.getElementById('btn-agent-build');
    if (agentBuildBtn) {
      if (payload.status === 'DORMANT') {
        agentBuildBtn.innerText = '🤖 City Agent 생성';
        agentBuildBtn.style.opacity = '1';
        agentBuildBtn.disabled = false;
      } else {
        const statusIcon = { THINKING: '🧠', COMPILING: '⚙️', BUILT: '✅' }[payload.status] || '⏳';
        agentBuildBtn.innerText = `${statusIcon} ${payload.status}...`;
        agentBuildBtn.style.opacity = '0.7';
        agentBuildBtn.disabled = true;
      }
    }
  }

  // ============================================================
  // 마켓플레이스 핸들러
  // ============================================================
  handleLoadAsset(asset) {
    if (asset.code) {
      this.marketView.updateCodeView(asset.code);
    }
    this.layout.logEvent('User', `에셋 로드: ${asset.title}`);
  }

  handleAcquireAsset(assetId) {
    const asset = this.assetsMarket.find(a => a.id === assetId);
    if (!asset) return;

    if (asset.creator === 'User') {
      this.layout.showNotification('이미 소유한 에셋입니다.');
      return;
    }

    if (this.userBalance < asset.price) {
      this.layout.showNotification('잔액이 부족합니다.');
      return;
    }

    this.userBalance -= asset.price;
    this.agentBalance += asset.price * 0.7;
    asset.creator = 'User';
    this.layout.updateBalances(this.userBalance, this.agentBalance);
    this.marketView.render(this.assetsMarket);
    this.layout.showNotification(`✅ 라이선스 획득: ${asset.title}`);
    this.layout.logEvent('User', `에셋 구매: ${asset.title} (${asset.price} CHKN)`);
  }

  handleAssetCreated(asset) {
    this.layout.logEvent('Agent', `에셋 생성됨: ${asset?.title || '(unnamed)'}`);
  }

  // ============================================================
  // 인스펙터 원격 제어
  // ============================================================
  handleTriggerAction() {
    if (!this.selectedObject || !this.selectedObject.userData?.physicsScript) {
      this.layout.showNotification('물리 스크립트가 없는 오브젝트입니다.');
      return;
    }
    this.layout.logEvent('User', `원격 제어: ${this.selectedObject.userData.name}`);
  }
}

// 앱 기동
window.addEventListener('DOMContentLoaded', () => {
  window.__app = new App();
});
