export class Inspector {
  constructor(onTriggerAction, layoutInstance) {
    this.sheetEl = document.getElementById('inspect-property-sheet');
    this.badgeEl = document.getElementById('inspect-class-badge');
    this.triggerBtn = document.getElementById('btn-trigger-action');
    this.layout = layoutInstance;

    this.onTriggerAction = onTriggerAction; // 원격 제어 버튼 클릭 시 Raycaster 제어 위임 콜백

    this.initEvents();
  }

  initEvents() {
    if (this.triggerBtn) {
      this.triggerBtn.addEventListener('click', () => {
        try {
          this.onTriggerAction();
        } catch (error) {
          this.layout.showNotification("화면 상에서 먼저 상호작용할 사물을 탭해주세요!");
        }
      });
    }
  }

  // 선택된 사물의 명세로 UI 필드를 실시간 갱신 (BIM 속성창 렌더링)
  update(object) {
    if (!object || !object.userData) {
      this.reset();
      return;
    }

    if (this.badgeEl) {
      this.badgeEl.innerText = (object.userData.type || 'IFC ELEMENT').toUpperCase();
    }

    if (this.sheetEl) {
      this.sheetEl.innerHTML = '';
      
      const addRow = (name, value) => {
        const row = document.createElement('div');
        row.className = 'property-row';
        row.innerHTML = `
          <span class="property-name">${name}</span>
          <span class="property-value">${value}</span>
        `;
        this.sheetEl.appendChild(row);
      };

      // 1. buildingSMART IFC 표준 속성 세트(Pset) 매핑
      addRow('IfcClass', object.userData.type || 'IfcElement');
      addRow('Entity Name', object.userData.name || 'Unnamed Object');
      addRow('State (Pset_State)', object.userData.state || 'Active');
      
      if (object.userData.neonStyle) {
        addRow('NeonStyle (Pset_Style)', object.userData.neonStyle);
      }
      if (object.userData.emissiveColor) {
        addRow('Emissive Color', object.userData.emissiveColor);
      }

      // 2. 3D 공간 기하 파라메트릭 특성치 연동
      const formatVec = (v) => v ? `(${v.x.toFixed(1)}, ${v.y.toFixed(1)}, ${v.z.toFixed(1)})` : 'N/A';
      addRow('Position (X, Y, Z)', formatVec(object.position));
      addRow('Rotation (Pitch, Yaw, Roll)', `(${object.rotation.x.toFixed(1)}, ${object.rotation.y.toFixed(1)}, ${object.rotation.z.toFixed(1)})`);
      addRow('Scale (W, H, D)', formatVec(object.scale));
    }
  }

  // 인스펙터 필드 초기화
  reset() {
    if (this.badgeEl) {
      this.badgeEl.innerText = "IFC ELEMENT";
    }
    if (this.sheetEl) {
      this.sheetEl.innerHTML = `
        <div style="color: rgba(255,255,255,0.4); text-align: center; padding: 1.5rem 0;" id="property-sheet-empty">
          화면 내 3D 사물을 클릭하여 속성을 확인하세요.
        </div>
      `;
    }
  }
}
