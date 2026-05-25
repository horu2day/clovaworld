export class Layout {
  constructor() {
    this.audioCtx = null;
    this.notificationBox = document.getElementById('notification-box');
    this.notificationText = document.getElementById('notification-text');
    this.logContainer = document.getElementById('agent-log-container');
    this.userBalanceEl = document.getElementById('user-balance');
    this.agentBalanceEl = document.getElementById('agent-balance');
  }

  // Web Audio API 오디오 컨텍스트 기동
  initAudio() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  // 오실레이터 기반 테크 비프 사운드 재생
  playSynthSound(freq = 440, type = 'sine', duration = 0.2) {
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gainNode = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.value = freq;

      gainNode.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);

      osc.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("Audio playback failed:", e);
    }
  }

  // 커스텀 우상단 토스트 알림창
  showNotification(text) {
    if (!this.notificationBox || !this.notificationText) return;
    this.notificationText.innerText = text;
    this.notificationBox.style.display = 'block';
    
    // 이전 타이머가 작동 중일 때를 고려하여 타임아웃 관리
    if (this.notifyTimeout) clearTimeout(this.notifyTimeout);
    this.notifyTimeout = setTimeout(() => {
      this.notificationBox.style.display = 'none';
    }, 3000);
  }

  // 에이전트 자율 활동 및 유저 행동 로그 콘솔 출력
  logEvent(sender, message) {
    if (!this.logContainer) return;
    const timeStr = new Date().toTimeString().split(' ')[0];
    const logLine = document.createElement('div');
    logLine.className = 'log-line';

    let tag = '<span class="log-tag-sys">[System]</span>';
    if (sender === 'Agent') tag = '<span class="log-tag-agent">[Agent]</span>';
    if (sender === 'User') tag = '<span class="log-tag-user">[User]</span>';

    logLine.innerHTML = `<span class="log-time">[${timeStr}]</span> ${tag} ${message}`;
    this.logContainer.appendChild(logLine);
    this.logContainer.scrollTop = this.logContainer.scrollHeight;
  }

  // UI 지갑 잔고 업데이트
  updateBalances(userBalance, agentBalance) {
    if (this.userBalanceEl) {
      this.userBalanceEl.innerText = userBalance.toFixed(2) + " CHKN";
    }
    if (this.agentBalanceEl) {
      this.agentBalanceEl.innerText = agentBalance.toFixed(2) + " CHKN";
    }
  }
}
