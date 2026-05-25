# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

---

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- **State your assumptions explicitly.** If uncertain, ask.
- **If multiple interpretations exist, present them** - don't pick silently.
- **If a simpler approach exists, say so.** Push back when warranted.
- **If something is unclear, stop.** Name what's confusing. Ask.

## 2. Goal-Driven Execution

**Transform vague tasks into verifiable goals.**

- **Define success criteria:** Instead of "fix the bug", make the goal: "Write a test that reproduces the bug, then make it pass."
- **Loop until verified:** Strong success criteria let you iterate independently. Weak criteria (e.g., "make it work") lead to constant clarification and rewrites.

## 3. Simplicity and Scope

**Minimum code that solves the problem. Nothing speculative.**

- **No features beyond what was asked.** Avoid adding "flexibility" or "configurability" that wasn't requested.
- **No abstractions for single-use code.**
- **Simplify:** If you write 200 lines and it could be 50, rewrite it.
- **No impossible error handling:** Avoid writing error handling for scenarios that cannot occur.

*Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.*

## 4. Editing Existing Code

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- **Don't "improve" adjacent code, comments, or formatting.** Only touch what is broken or part of the task.
- **Match existing style,** even if you would do it differently.
- **Manage dead code:** If you notice unrelated dead code, mention it but don't delete it unless asked. Remove any imports, variables, or functions that *your* changes rendered unused.
- **Traceability:** Every changed line should trace directly to the user's request.

---

## 🌐 가상현실 플랫폼 3대 원칙 (ClovaWorld 핵심 설계 철학)

> 모든 기능 구현 시 아래 3원칙을 **항상** 기준으로 삼는다.

### 원칙 1 — 경량 렌더링 (Performance First)
**3D visualization + 물리법칙이 추가되어도 무거워지지 않을 것.**

- InstancedMesh, LOD, Frustum Culling 우선 적용
- 물리 연산은 틱(tick) 기반 스크립트(physicsScript)로 격리 — 렌더 루프 분리
- SpatialStreamingManager로 뷰 밖 청크 비활성화
- 드로우콜 최소화: 동종 오브젝트는 반드시 병합
- 목표: **60 FPS 유지**, 씬 오브젝트 수 무관

### 원칙 2 — 현실 기반 사물 (Real-World Fidelity)
**Content(사물)는 현실 사물처럼 만들 것. 상호작용은 프로그램으로 구현.**

- 모든 사물은 **BIM IFC 4.3 표준** 타입 준수 (IfcBridge, IfcRoad, IfcTunnel, IfcFacility 등)
- 사물은 **City Agent** 또는 개발자가 파라메트릭 스키마로 생성
- **상호작용(Interaction)**은 `physicsScript` 코드 블록으로 구현:
  - 사물 ↔ 사물 (충돌, 반응, 연동)
  - Agent ↔ 사물 (자율 제어, 감지, 명령 수행)
  - User ↔ 사물 (Raycaster 클릭, 원격 제어)
- `userData`에 타입, 이름, 상태, 스크립트 모두 포함 — 사물이 자기 설명을 가짐

### 원칙 3 — 모든 것은 거래 가능 (Tradable Economy)
**원칙 2에서 만들어진 모든 것은 마켓플레이스에서 거래 가능해야 함.**

- 생성된 모든 사물 → 자동으로 **MarketView 에셋 카드** 등록
- 에셋 단위: 3D 메쉬 + physicsScript + IFC 메타데이터 묶음
- 거래 통화: **CHKN** (스마트 컨트랙트 기반)
- City Agent가 생성한 에셋: creator = `"City Agent"`, 자동 가격 책정
- 사용자 생성 에셋: creator = `"User"`, 직접 가격 설정 가능
- 라이선스 이전 시 원 제작자(City Agent/User)에게 수익 배분
