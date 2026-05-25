export class MarketView {
  constructor(callbacks) {
    this.container = document.getElementById('marketplace-assets');
    this.codeViewEl = document.getElementById('program-code-view');
    this.countEl = document.getElementById('city-agent-asset-count');

    this.onLoadAsset = callbacks.onLoadAsset || (() => {});
    this.onAcquireAsset = callbacks.onAcquireAsset || (() => {});
  }

  // 가상 마켓플레이스 카드 리스트 동적 생성
  render(assetsList) {
    if (!this.container) return;
    this.container.innerHTML = '';

    // City Agent 에셋 개수 카운트 업데이트
    const cityAgentCount = assetsList.filter(a => a.creator === 'City Agent').length;
    if (this.countEl) {
      this.countEl.innerText = cityAgentCount;
    }

    assetsList.forEach((asset) => {
      const card = document.createElement('div');
      card.className = 'asset-card';

      const isCityAgent = asset.creator === 'City Agent';
      const isUserOwner = asset.creator === 'User';

      if (isCityAgent) {
        card.style.borderColor = 'rgba(181, 126, 220, 0.4)';
        card.style.background = 'linear-gradient(145deg, #14141f 0%, #1a1027 100%)';
        card.style.boxShadow = '0 0 12px rgba(181, 126, 220, 0.08)';
      }

      const actionButtonText = isUserOwner ? 'My Asset (Load)' : 'Acquire License';

      // Creator 배지 표시
      let creatorBadge = '';
      if (isCityAgent) {
        creatorBadge = `
          <span style="
            background: linear-gradient(90deg, #B57EDC, #00F0FF);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            background-clip: text;
            font-size: 0.58rem; font-weight: bold;
            border: 1px solid rgba(181,126,220,0.35);
            border-radius: 2px; padding: 0.02rem 0.25rem;
            display: inline-block; margin-left: 0.2rem;
            vertical-align: middle;
          ">AI</span>`;
      }

      // IFC 타입 배지
      let ifcBadge = '';
      if (asset.type && asset.type.startsWith('Ifc')) {
        const ifcColor = {
          'IfcBridge': '#00F0FF',
          'IfcRoad': '#FF9900',
          'IfcTunnel': '#00FF99',
          'IfcFacility': '#B57EDC',
          'IfcRailway': '#00FFCC',
          'IfcMarineFacility': '#0066FF',
          'IfcConstructionEquipment': '#FFCC00',
          'IfcDistributionElement': '#FFD700',
          'IfcGeotechnicalElement': '#88FF44',
        }[asset.type] || '#7d7d93';
        ifcBadge = `<span style="
          font-size: 0.55rem; color: ${ifcColor};
          border: 1px solid ${ifcColor}44;
          border-radius: 2px; padding: 0.02rem 0.2rem;
          font-family: var(--font-mono);
          background: ${ifcColor}11;
        ">${asset.type}</span>`;
      }

      card.innerHTML = `
        <div>
          <div class="asset-meta">
            <span>ID: ${asset.id.substring(0, 10)}</span>
            <span class="asset-creator" style="${isCityAgent ? 'color: #B57EDC;' : ''}">
              ${isCityAgent ? '🤖 ' : ''}${asset.creator}${creatorBadge}
            </span>
          </div>
          <div class="asset-title">${asset.title}</div>
          <div style="margin-bottom: 0.3rem;">${ifcBadge}</div>
          <div class="asset-program-desc">${asset.description}</div>
        </div>
        <div class="asset-footer">
          <span class="asset-price" style="${isCityAgent ? 'color: #B57EDC;' : ''}">♦ ${parseFloat(asset.price).toFixed(2)} CHKN</span>
          <button class="btn-buy" data-id="${asset.id}" style="${isCityAgent ? 'border-color: #B57EDC; color: #B57EDC;' : ''}">${actionButtonText}</button>
        </div>
      `;

      // 카드 본문 영역 클릭 시: 가속 물리 프로그램 코드 로드
      card.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON') {
          this.onLoadAsset(asset);
        }
      });

      // 액션 버튼 클릭 시: 소유권 거래 또는 로드
      const actionBtn = card.querySelector('.btn-buy');
      if (actionBtn) {
        actionBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.onAcquireAsset(asset.id);
        });
      }

      this.container.appendChild(card);
    });
  }

  // 액티브 가상 프로그램 코드 뷰 텍스트 업데이트
  updateCodeView(codeString) {
    if (this.codeViewEl) {
      this.codeViewEl.innerText = codeString;
    }
  }
}
