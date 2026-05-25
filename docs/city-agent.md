# City Agent — 설계 문서 (v0.1)

> **ClovaWorld**는 모든 것이 가능한 가상현실 플랫폼이다.  
> City Agent는 그 세계를 스스로 설계하고 건설하는 첫 번째 자율 AI 크리에이터다.

---

## 1. 개요

**City Agent**는 ClovaWorld 내에서 동작하는 자율 도시 설계 AI다.  
인간 개발자의 개입 없이 BIM 표준 기반의 현실적인 인프라 사물을 Zero에서 생성하고,  
그 결과물을 마켓플레이스에 자동 등록하여 거래 가능한 디지털 에셋으로 만든다.

### 위치
```
src/ai/AgentSimulator.js   — 자율 생성 스케줄러 & 상태 머신
src/ai/PromptInterpreter.js — 자연어 → 파라메트릭 스키마 변환
src/ai/ProceduralGenerator.js — 스키마 → Three.js 3D 메쉬 생성
```

---

## 2. 설계 철학

ClovaWorld 3대 원칙을 City Agent는 모두 구현한다.

| 원칙 | City Agent의 역할 |
|------|------------------|
| **경량 렌더링** | InstancedMesh 기반 생성, physicsScript 틱 격리 |
| **현실 기반 사물** | IFC 4.3 표준 타입 준수, 파라메트릭 공학 설계 |
| **모든 것 거래 가능** | 생성 즉시 MarketView에 CHKN 에셋으로 자동 등록 |

---

## 3. 아키텍처

```
사용자 클릭 / 자율 스케줄러
        │
        ▼
  AgentSimulator
  ┌─────────────────────────────┐
  │ 1. THINKING (목표 선정)      │
  │ 2. COMPILING (스키마 생성)   │
  │ 3. BUILT (3D 배치 완료)      │
  │ 4. DORMANT (대기 복귀)       │
  └───────────┬─────────────────┘
              │ onBuildRequested(prompt, type)
              ▼
       PromptInterpreter
       ┌──────────────────────────┐
       │ Gemini API (key 있을 때)  │
       │ 또는 내장 규칙 엔진       │
       │ → Parametric Schema JSON  │
       └──────────┬───────────────┘
                  │ schema
                  ▼
         ProceduralGenerator
         ┌───────────────────────┐
         │ generate(schema)      │
         │ → Three.js Group/Mesh │
         │ → userData 주입       │
         │ → physicsScript 삽입  │
         └──────────┬────────────┘
                    │
                    ▼
          renderer.worldGroup.add(mesh)
          + MarketView.assetsMarket.unshift(asset)
          + CHKN 수익 배분
```

---

## 4. 생성 가능 사물 (IFC 4.3 기반)

| IFC 타입 | 실세계 대응 | 파라메트릭 변수 |
|----------|------------|----------------|
| `IfcBridge` | 교량 (거더교, 아치교, 사장교, 현수교, 트러스교) | length, width, height, spanCount, pylonHeight, cableDensity |
| `IfcRoad` | 도로 (차도, 회전교차로) | length, width, lanes, hasLights |
| `IfcTunnel` | 터널 (쉴드 세그멘탈) | length, radius, liningThickness, rings |
| `IfcFacility` | 에너지 인프라 (발전소, 바이오돔, 우주항) | height, radius, modules |
| `IfcRailway` | 철도 (복선, 역사) | length, trackGauge, signals |
| `IfcMarineFacility` | 항만 (부두, 크레인) | pierCount, craneHeight |
| `IfcRoadPart` | 요금소, 인터체인지 | gateCount, laneWidth |
| `IfcConstructionEquipment` | 건설기계 (굴착기, 크레인) | armLength, cabHeight |
| `IfcDistributionElement` | 전력 마스트, 에너지 그리드 | mastHeight, ringCount |
| `IfcSignal` | 철도 신호기 | signalHeight, colorCount |
| `IfcGeotechnicalElement` | 지반 (TIN 지형) | resolution, heightScale |

---

## 5. 상태 머신

```
DORMANT ──[trigger]──► THINKING (2.5초)
                            │
                            ▼
                      COMPILING (1.5초)
                            │
                            ▼
                       BUILT (3.5초)
                            │
                            ▼
                         DORMANT
```

- **DORMANT**: 대기. 자율 스케줄러는 20초마다 30% 확률로 생성 트리거
- **THINKING**: 목표/프롬프트 선정. UI에 현재 목표 표시
- **COMPILING**: PromptInterpreter → ProceduralGenerator 파이프라인 실행
- **BUILT**: 씬 배치 완료, 마켓 등록, 수익 배분

---

## 6. 학습 기능 (learnedPrompts)

사용자가 수동으로 입력한 프롬프트를 최대 20개 환형 버퍼에 저장.  
다음 자율 생성 시 50% 확률로 학습된 패턴을 변형하여 새로운 설계 생성.

```
사용자 입력: "강 위의 아치교"
저장 → learnedPrompts[]

다음 자율 생성:
"Quantum evolved 강 위의 아치교 with cyber plasma energy"
```

---

## 7. 마켓플레이스 통합

생성 완료 즉시 에셋 객체 자동 구성:

```javascript
{
  id: `asset-agent-${Date.now()}`,
  title: schema.title,
  creator: "City Agent",          // 항상 City Agent
  price: 3.0 ~ 11.0 CHKN,        // 자동 책정
  type: "IfcBridge" | ...,        // IFC 타입
  description: prompt.substring(0, 80),
  code: physicsScript              // 애니메이션 틱 스크립트
}
```

수익 배분:
- 에셋 판매 시 City Agent 수입: 판매가 × 70%
- 생성 시 즉시 적립: 판매가 × 30% (선적립)

---

## 8. UI 제어

| 버튼 | 기능 |
|------|------|
| `🤖 City Agent 생성` | 수동 forceTrigger — 즉시 생성 사이클 시작 |
| `📸 Zoom to Last` | 마지막 생성 오브젝트로 카메라 포커스 |
| `⊡ Zoom Fit` | 씬 전체 오브젝트 뷰에 맞춤 |

---

## 9. 확장 로드맵

> ClovaWorld는 진화한다. City Agent도 함께 진화한다.

### v0.2 — 계획
- [ ] 멀티 에이전트: Structural Agent, Civil Agent, Plant Agent 분리
- [ ] 에이전트 간 협업: Civil이 도로 생성 → Structural이 교량 자동 배치
- [ ] 메모리 강화: 과거 생성 이력 기반 도시 패턴 학습

### v0.3 — 계획
- [ ] 실시간 Gemini API 설계: 프롬프트 → 정밀 파라메트릭 BIM 도면
- [ ] LOD 자동 조절: 거리에 따라 LOD 100 / 200 / 300 자동 전환
- [ ] 물리 시뮬레이션: 구조 하중, 트래픽 흐름, 에너지 분배

### v1.0 — 비전
- [ ] 사용자 요청 → City Agent가 전체 도시 구획 자율 설계
- [ ] IFC 파일 내보내기: 현실 BIM 소프트웨어(Revit, ArchiCAD)와 연동
- [ ] DAO 거버넌스: 에셋 가격을 커뮤니티가 투표로 결정

---

## 10. 핵심 설계 결정

### Why IFC 4.3?
BIM(Building Information Modeling) 국제 표준. 건축·토목·플랜트 모든 사물을 동일한 정보 모델로 표현.  
현실 세계 인프라와 1:1 대응되어 디지털 트윈 구축의 기반이 된다.

### Why Parametric?
하나의 스키마로 무한한 변형 생성. 길이/폭/높이/색상 파라미터만 바꾸면 수천 가지 다른 교량이 탄생.  
코드 재사용 극대화, 렌더링 비용 최소화.

### Why physicsScript?
물리/애니메이션 로직을 메쉬 내부 userData에 격리. 렌더 루프가 아닌 틱 단위 실행.  
오브젝트 수가 늘어도 메인 스레드 블로킹 없음 → 원칙 1(경량 렌더링) 준수.

---

*Last updated: 2026-05-25*  
*Author: ClovaWorld Development (City Agent v0.1)*
