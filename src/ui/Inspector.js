export class Inspector {
  constructor(onTriggerAction, layoutInstance) {
    this.nameEl = document.getElementById('inspect-name');
    this.stateEl = document.getElementById('inspect-state');
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

  // 선택된 사물의 명세로 UI 필드를 실시간 갱신
  update(object) {
    if (!object || !object.userData) {
      this.reset();
      return;
    }

    if (this.nameEl) {
      this.nameEl.innerText = object.userData.name || '알 수 없는 객체';
    }
    if (this.stateEl) {
      this.stateEl.innerText = object.userData.state || '-';
    }
  }

  // 인스펙터 필드 초기화
  reset() {
    if (this.nameEl) {
      this.nameEl.innerText = "없음 (화면 내 사물 클릭)";
    }
    if (this.stateEl) {
      this.stateEl.innerText = "-";
    }
  }
}
