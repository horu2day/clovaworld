import { BrowserProvider } from 'ethers';

export class WalletConnector {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.userAddress = "0xUser...F8a1"; // 기본 임시 주소 (Fallback)
    this.agentAddress = "0xAgent...3c99"; // AI 에이전트 가상 주소
  }

  // Web3 지갑 연결 시도
  async connect() {
    // Browser 환경이며 window.ethereum(MetaMask 등)이 설치된 경우
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        this.provider = new BrowserProvider(window.ethereum);
        
        // 지갑 주소 승인 요청
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        this.signer = await this.provider.getSigner();
        
        const rawAddress = accounts[0];
        // 주소 간략 표현 처리 (0x1234...abcd)
        this.userAddress = `${rawAddress.substring(0, 6)}...${rawAddress.substring(rawAddress.length - 4)}`;
        
        return {
          connected: true,
          userAddress: this.userAddress,
          rawAddress: rawAddress
        };
      } catch (e) {
        console.warn("MetaMask connection rejected/failed. Falling back to local virtual wallet:", e);
      }
    } else {
      console.info("No Web3 Provider (MetaMask) detected. Using static default wallet address.");
    }

    // fallback 반환
    return {
      connected: false,
      userAddress: this.userAddress
    };
  }

  getUserAddress() {
    return this.userAddress;
  }

  getAgentAddress() {
    return this.agentAddress;
  }
}
