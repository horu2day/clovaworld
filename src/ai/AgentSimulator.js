export class AgentSimulator {
  constructor(callbacks) {
    this.onAssetCreated = callbacks.onAssetCreated || (() => {});
    this.onBuildRequested = callbacks.onBuildRequested || (() => {});
    this.onStatusChanged = callbacks.onStatusChanged || (() => {});
    this.onLog = callbacks.onLog || (() => {});
    
    this.intervalId = null;
    this.status = 'DORMANT'; // DORMANT, THINKING, COMPILING, BUILT
    this.currentGoal = 'Plan future smart infrastructure';
    this.autoMode = true;
    
    this.activeModule = 'Structural'; // Structural, Civil, Plant
    this.lod = 'LOD 300 (Schematic)';

    // 시티 에이전트 페르소나의 미래지향적 공학 목표군
    this.goals = [
      "Plan carbon-neutral power grid infrastructure",
      "Expand ultra-high-speed hyperloop network",
      "Deploy automated maglev railway node",
      "Establish maritime gravity quantum harbor",
      "Construct anti-gravity elevated road networks",
      "Deploy solar luffing heavy crane assembly",
      "Install secure scanning signal mast checkpoints"
    ];

    // 3대 공학 모듈(Structural, Civil, Plant) 카테고리를 포함한 자율 기하 설계 프롬프트 그룹
    this.prompts = [
      { module: 'Plant', type: 'IfcFacility', prompt: "Quantum plasma fusion reactor power tower with cooling masts", goal: "Plan carbon-neutral power grid infrastructure" },
      { module: 'Structural', type: 'IfcFacility', prompt: "Atmospheric geothermal biosphere dome with geodesic grids", goal: "Plan carbon-neutral power grid infrastructure" },
      { module: 'Civil', type: 'IfcTunnel', prompt: "Subterranean shield segment hyperloop tunnel with glowing ring guides", goal: "Expand ultra-high-speed hyperloop network" },
      { module: 'Civil', type: 'IfcBridge', prompt: "Anti-gravity neon suspension skybridge connecting quantum sector grids", goal: "Construct anti-gravity elevated road networks" },
      { module: 'Plant', type: 'IfcMarineFacility', prompt: "Cybernetic deep water gravity port equipped with rotating orbit searchlights", goal: "Establish maritime gravity quantum harbor" },
      { module: 'Civil', type: 'IfcRailway', prompt: "Quantum maglev double track railway node with automated signals", goal: "Deploy automated maglev railway node" },
      { module: 'Civil', type: 'IfcRoadPart', prompt: "Holographic sky-highway automated toll gate checking balance signatures", goal: "Construct anti-gravity elevated road networks" },
      { module: 'Plant', type: 'IfcDistributionElement', prompt: "Superluminal grid energy mast with corona discharge ring", goal: "Plan carbon-neutral power grid infrastructure" },
      { module: 'Civil', type: 'IfcSignal', prompt: "Automated quantum rail signaling mast with tri-color holographic beacon", goal: "Install secure scanning signal mast checkpoints" },
      { module: 'Civil', type: 'IfcConstructionEquipment', prompt: "Solar-powered heavy hydraulic crawler crane crawler assembly", goal: "Deploy solar luffing heavy crane assembly" }
    ];
    this.learnedPrompts = [];
  }

  // 자율 창작 백그라운드 스케줄러 가동 (30초 주기)
  start() {
    if (this.intervalId) return;

    this.intervalId = setInterval(() => {
      if (!this.autoMode) return;
      
      // 30%의 확률로 자율 진화 명령 발생 (DORMANT 상태일 때만)
      if (this.status === 'DORMANT' && Math.random() < 0.3) {
        this.triggerAutonomousCreation();
      }
    }, 20000);
  }

  // 에이전트 활동 중단
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  learnPrompt(prompt) {
    if (!prompt) return;
    // 중복 방지 및 최대 20개 환형 버퍼로 학습
    if (!this.learnedPrompts.includes(prompt)) {
      this.learnedPrompts.push(prompt);
      if (this.learnedPrompts.length > 20) {
        this.learnedPrompts.shift();
      }
      this.onLog('City Agent', `[학습 엔진] 사용자 설계 패턴 분석 완료 및 시티 에이전트 신경망 저장.`);
    }
  }

  setAutoMode(enabled) {
    this.autoMode = enabled;
    this.onLog('System', `시티 에이전트 자율 설계 모드가 ${enabled ? '활성화' : '비활성화'}되었습니다.`);
  }

  // 수동 명령 트리거 (UI 버튼 클릭 시 즉시 구상 프로세스 시동)
  forceTrigger() {
    if (this.status !== 'DORMANT') {
      this.onLog('City Agent', "현재 도시 구조체 생성 연산이 진행 중입니다. 잠시만 기다려주십시오.");
      return;
    }
    this.triggerAutonomousCreation();
  }

  // 자율 도시 창조자 설계 큐 & 상태 머신 라이프사이클 구동
  async triggerAutonomousCreation() {
    // 50%의 확률로 사용자가 입력했던 설계 프롬프트를 기계학습/모방 변형하여 생성
    let selectedPrompt = '';
    let selectedGoal = 'Evolve user-inspired smart structure';
    let selectedType = 'IfcFacility';

    if (this.learnedPrompts.length > 0 && Math.random() < 0.5) {
      const learned = this.learnedPrompts[Math.floor(Math.random() * this.learnedPrompts.length)];
      
      const prefixes = ["Quantum evolved ", "Next-generation BIM ", "Smart digital twin ", "Eco-friendly autonomous ", "Hyper-optimized "];
      const suffixes = [" with cyber plasma energy", " complying to IFC 4.3 standard", " for future metropolis evolution", " featuring neon light guides"];
      
      selectedPrompt = prefixes[Math.floor(Math.random() * prefixes.length)] + learned + suffixes[Math.floor(Math.random() * suffixes.length)];
      selectedGoal = `Evolve city based on user's concept of "${learned.substring(0, 15)}..."`;
      
      const normalized = learned.toLowerCase();
      if (normalized.includes('교량') || normalized.includes('다리') || normalized.includes('bridge')) selectedType = 'IfcBridge';
      else if (normalized.includes('도로') || normalized.includes('차선') || normalized.includes('road')) selectedType = 'IfcRoad';
      else if (normalized.includes('터널') || normalized.includes('tunnel')) selectedType = 'IfcTunnel';
      else if (normalized.includes('항만') || normalized.includes('port')) selectedType = 'IfcMarineFacility';
      else if (normalized.includes('철도') || normalized.includes('역') || normalized.includes('rail')) selectedType = 'IfcRailway';

      // 배정 타겟 모듈 분석
      if (['IfcBridge', 'IfcRoad', 'IfcTunnel', 'IfcRailway'].includes(selectedType)) {
        this.activeModule = 'Civil';
      } else if (['IfcFacility', 'IfcDistributionElement', 'IfcMarineFacility'].includes(selectedType)) {
        this.activeModule = 'Plant';
      } else {
        this.activeModule = 'Structural';
      }
    } else {
      const randomPick = this.prompts[Math.floor(Math.random() * this.prompts.length)];
      selectedPrompt = randomPick.prompt;
      selectedGoal = randomPick.goal;
      selectedType = randomPick.type;
      this.activeModule = randomPick.module || 'Structural';
    }

    const statusPayload = {
      status: this.status,
      goal: this.currentGoal,
      prompt: selectedPrompt,
      activeModule: this.activeModule,
      lod: this.lod,
      learnedCount: this.learnedPrompts.length
    };

    // 1단계: THINKING (두뇌 큐 연산)
    this.status = 'THINKING';
    this.currentGoal = selectedGoal;
    statusPayload.status = this.status;
    statusPayload.goal = this.currentGoal;
    this.onStatusChanged(statusPayload);
    this.onLog('City Agent', `[시티 에이전트] 진화 구상 중: "${selectedGoal}" [LOD 300]`);
    this.onLog('City Agent', `[자율 설계 명령 발송]: "${selectedPrompt}"`);

    await new Promise(resolve => setTimeout(resolve, 2500));

    // 2단계: COMPILING (BIM 테셀레이션 컴파일)
    this.status = 'COMPILING';
    statusPayload.status = this.status;
    this.onStatusChanged(statusPayload);
    this.onLog('City Agent', `[${this.activeModule} 모듈] 3D 형상 지오메트리 조립 및 IFC 4.3 표준 정합성 검증 시작.`);

    await new Promise(resolve => setTimeout(resolve, 1500));

    // 3단계: BUILT (실제 3D 공간 소환 배치 완료)
    try {
      const success = await this.onBuildRequested(selectedPrompt, selectedType);
      if (success) {
        this.status = 'BUILT';
        statusPayload.status = this.status;
        this.onStatusChanged(statusPayload);
        this.onLog('City Agent', `[시티 에이전트] ${this.activeModule} 계열 BIM 인프라 자율 시공 완료.`);
      } else {
        throw new Error("Build callback returned false");
      }
    } catch (e) {
      console.error("City Agent simulator autonomous build failed:", e);
      this.status = 'DORMANT';
      statusPayload.status = this.status;
      statusPayload.goal = 'Idle';
      statusPayload.prompt = '';
      this.onStatusChanged(statusPayload);
      this.onLog('System', `[에러] 시티 에이전트 자율 설계 연산이 무산되었습니다.`);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 3500));

    // 4단계: 다시 DORMANT (대기 상태로 복귀)
    this.status = 'DORMANT';
    statusPayload.status = this.status;
    statusPayload.goal = 'Plan next smart infrastructure';
    statusPayload.prompt = '';
    this.onStatusChanged(statusPayload);
  }
}
