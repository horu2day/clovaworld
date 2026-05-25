import * as THREE from 'three';

export class BimCreator {
  constructor(callbacks) {
    this.onBuildRequested = callbacks.onBuildRequested || (() => {});
    this.onLog = callbacks.onLog || (() => {});
    this.onSound = callbacks.onSound || (() => {});
    this.showNotification = callbacks.showNotification || (() => {});

    this.subtypes = {
      IfcBridge: [
        { value: 'GIRDER', label: 'GIRDER (거더교)' },
        { value: 'ARCHED', label: 'ARCHED (아치교)' },
        { value: 'CABLE_STAYED', label: 'CABLE_STAYED (사장교)' },
        { value: 'SUSPENSION', label: 'SUSPENSION (현수교)' },
        { value: 'TRUSS', label: 'TRUSS (트러스교)' },
        { value: 'VIADOTTO_ACERNO', label: 'VIADOTTO_ACERNO (곡선 고가교)' }
      ],
      IfcRoad: [
        { value: 'CARRIAGEWAY', label: 'CARRIAGEWAY (차선 도로)' },
        { value: 'ROUNDABOUT', label: 'ROUNDABOUT (회전 교차로)' }
      ],
      IfcTunnel: [
        { value: 'SEGMENTAL', label: 'SEGMENTAL (쉴드 세그먼트)' }
      ],
      IfcFacility: [
        { value: 'POWER_STATION', label: 'POWER_STATION (발전 및 냉각탑)' },
        { value: 'BIOSPHERE', label: 'BIOSPHERE (지오데식 바이오돔)' },
        { value: 'SPACE_PORT', label: 'SPACE_PORT (우주선 이착륙 링)' }
      ],
      IfcConstructionEquipment: [
        { value: 'EXCAVATOR', label: 'EXCAVATOR (굴착기)' },
        { value: 'TOWER_CRANE', label: 'TOWER_CRANE (타워크레인)' },
        { value: 'CRAWLER_CRANE', label: 'CRAWLER_CRANE (이동식 모바일크레인)' }
      ]
    };

    this.sliderSpecs = {
      IfcBridge: [
        { id: 'length', label: '교량 총연장 (Length)', min: 15, max: 60, val: 32, step: 1, unit: 'm' },
        { id: 'width', label: '교량 상판폭 (Width)', min: 4, max: 10, val: 5.5, step: 0.5, unit: 'm' },
        { id: 'height', label: '교량 전고 (Height)', min: 4, max: 20, val: 10, step: 0.5, unit: 'm' },
        { id: 'spanCount', label: '교량 경간수 (Span Count)', min: 1, max: 8, val: 3, step: 1, unit: '개' },
        { id: 'pierRadius', label: '교각 반경 (Pier Radius)', min: 0.2, max: 1.0, val: 0.35, step: 0.05, unit: 'm' }
      ],
      IfcRoad: [
        { id: 'length', label: '도로 총연장 (Length)', min: 10, max: 80, val: 35, step: 1, unit: 'm' },
        { id: 'width', label: '도로 총폭 (Width)', min: 4, max: 12, val: 6.5, step: 0.5, unit: 'm' },
        { id: 'lanes', label: '도로 차선수 (Lanes)', min: 1, max: 6, val: 3, step: 1, unit: '차선' }
      ],
      IfcTunnel: [
        { id: 'length', label: '터널 총연장 (Length)', min: 10, max: 50, val: 25, step: 1, unit: 'm' },
        { id: 'radius', label: '터널 튜브반경 (Radius)', min: 3, max: 8, val: 4, step: 0.5, unit: 'm' },
        { id: 'liningThickness', label: '터널 외벽두께 (Lining)', min: 0.1, max: 0.8, val: 0.3, step: 0.05, unit: 'm' },
        { id: 'rings', label: '세그먼트 링수 (Rings)', min: 3, max: 15, val: 6, step: 1, unit: '개' }
      ],
      IfcFacility: [
        { id: 'height', label: '시설물 전고 (Height)', min: 5, max: 30, val: 12, step: 1, unit: 'm' },
        { id: 'radius', label: '시설물 반경 (Radius)', min: 3, max: 15, val: 5, step: 0.5, unit: 'm' },
        { id: 'modules', label: '대칭 분할 모듈수 (Modules)', min: 3, max: 12, val: 4, step: 1, unit: '개' }
      ],
      IfcConstructionEquipment: []
    };

    this.initElements();
    this.bindEvents();
    this.updateSubtypes();
    this.updateSliders();
  }

  initElements() {
    this.selectType = document.getElementById('bim-select-type');
    this.selectSubtype = document.getElementById('bim-select-subtype');
    this.slidersContainer = document.getElementById('bim-sliders-container');
    this.colorMain = document.getElementById('bim-color-main');
    this.colorEmissive = document.getElementById('bim-color-emissive');
    this.selectNeonStyle = document.getElementById('bim-select-neonstyle');
    this.btnBuild = document.getElementById('btn-bim-build');
  }

  bindEvents() {
    if (this.selectType) {
      this.selectType.addEventListener('change', () => {
        this.updateSubtypes();
        this.updateSliders();
      });
    }

    if (this.btnBuild) {
      this.btnBuild.addEventListener('click', () => this.handleBuild());
    }
  }

  updateSubtypes() {
    if (!this.selectType || !this.selectSubtype) return;
    const activeType = this.selectType.value;
    const list = this.subtypes[activeType] || [];

    this.selectSubtype.innerHTML = list.map(item => 
      `<option value="${item.value}">${item.label}</option>`
    ).join('');
  }

  updateSliders() {
    if (!this.selectType || !this.slidersContainer) return;
    const activeType = this.selectType.value;
    const specs = this.sliderSpecs[activeType] || [];

    if (specs.length === 0) {
      this.slidersContainer.innerHTML = `
        <div style="text-align: center; color: var(--lyt-text-muted); font-size: 0.72rem; padding: 0.5rem 0;">
          공학 기본 라이브러리 형상을 소환합니다 (변수 고정)
        </div>`;
      return;
    }

    this.slidersContainer.innerHTML = specs.map(s => `
      <div style="display: flex; flex-direction: column; gap: 0.2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="color: var(--lyt-text-muted);">${s.label}</span>
          <span id="val-${s.id}" style="color: var(--lyt-accent-yellow); font-family: var(--font-mono); font-weight: bold;">
            ${s.val}${s.unit}
          </span>
        </div>
        <input type="range" id="slide-${s.id}" min="${s.min}" max="${s.max}" step="${s.step}" value="${s.val}" style="
          width: 100%;
          accent-color: var(--lyt-accent-purple);
          background: #333;
          height: 4px;
          border-radius: 2px;
          cursor: pointer;
        ">
      </div>
    `).join('');

    // 슬라이더 변경 시 수치 텍스트 업데이트 리스너 연결
    specs.forEach(s => {
      const el = document.getElementById(`slide-${s.id}`);
      const textEl = document.getElementById(`val-${s.id}`);
      if (el && textEl) {
        el.addEventListener('input', (e) => {
          textEl.innerText = `${e.target.value}${s.unit}`;
        });
      }
    });
  }

  handleBuild() {
    if (!this.selectType || !this.selectSubtype) return;

    const geometryType = this.selectType.value;
    const predefinedType = this.selectSubtype.value;
    const customColor = this.colorMain ? this.colorMain.value : '#4f4f5a';
    const emissiveColor = this.colorEmissive ? this.colorEmissive.value : '#00f0ff';
    const neonStyle = this.selectNeonStyle ? this.selectNeonStyle.value : 'pulse';

    const dimensions = {};
    const specs = this.sliderSpecs[geometryType] || [];
    specs.forEach(s => {
      const el = document.getElementById(`slide-${s.id}`);
      if (el) {
        dimensions[s.id] = parseFloat(el.value);
      }
    });

    const schema = {
      geometryType,
      predefinedType,
      dimensions,
      customColor,
      emissiveColor,
      neonStyle,
      physicsScript: this.createDefaultPhysicsScript(geometryType, neonStyle)
    };

    const title = `${predefinedType} BIM 시공`;

    this.onLog('User', `[파라메트릭 Creator] ${geometryType} 직접 시공 명령 실행: ${predefinedType}`);
    this.onSound(587.33, 'triangle', 0.15); // 레 음향

    const success = this.onBuildRequested(schema, title);
    if (success) {
      this.showNotification(`[${predefinedType}] 정밀 변수 시공 완료!`);
      this.onLog('System', `[크리에이터 코어] B-Rep 지오메트리 조립 정렬 완료.`);
    } else {
      this.showNotification(`BIM 시공에 실패하였습니다.`);
      this.onLog('System', `[에러] 파라메트릭 크리에이터 지오메트리 컴파일 충돌.`);
    }
  }

  createDefaultPhysicsScript(type, style) {
    if (type === 'IfcBridge') {
      return `function animate(mesh, time) {
        const components = [];
        mesh.traverse(c => {
          if(c.name === 'neon-tube' || c.name === 'truss-neon' || c.name === 'cable-wire') {
            components.push(c);
          }
        });
        components.forEach((comp, idx) => {
          comp.material.emissiveIntensity = 1.0 + Math.sin(time * 0.005 + idx * 0.3) * 0.45;
        });
      }`;
    } else if (type === 'IfcRoad') {
      return `function animate(mesh, time) {
        const rails = [];
        mesh.traverse(c => { if(c.name === 'neon-rail') rails.push(c); });
        rails.forEach(r => {
          r.material.emissiveIntensity = 1.0 + Math.sin(time * 0.008) * 0.3;
        });
      }`;
    } else if (type === 'IfcTunnel') {
      return `function animate(mesh, time) {
        const lights = [];
        mesh.traverse(c => { if(c.name.includes('led')) lights.push(c); });
        lights.forEach((l, idx) => {
          l.material.emissiveIntensity = 1.2 + Math.sin(time * 0.006 + idx * 0.2) * 0.4;
        });
      }`;
    } else if (type === 'IfcFacility') {
      return `function animate(mesh, time) {
        const core = mesh.getObjectByName('reactor-core') || mesh.getObjectByName('dome-node') || mesh.getObjectByName('ring-core');
        if (core && core.material && core.material.emissive) {
          core.material.emissiveIntensity = 1.5 + Math.sin(time * 0.005) * 0.5;
        }
        const rotating = mesh.getObjectByName('rotator-group');
        if (rotating) {
          rotating.rotation.y = time * 0.001;
        }
      }`;
    }
    return `function animate(mesh, time) {}`;
  }
}
