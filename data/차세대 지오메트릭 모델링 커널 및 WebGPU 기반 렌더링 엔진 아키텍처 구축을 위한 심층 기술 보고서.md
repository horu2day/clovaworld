# 차세대 지오메트릭 모델링 커널 및 WebGPU 기반 렌더링 엔진 아키텍처 구축을 위한 심층 기술 보고서

## 1. 서론: 현대적 CAD 커널 개발의 기술적 요구사항과 패러다임 전환

컴퓨터 지원 설계(CAD, Computer-Aided Design) 시스템의 핵심인 지오메트릭 모델링 커널(Geometric Modeling Kernel)을 개발하는 과제는 소프트웨어 공학에서 가장 난이도가 높은 분야 중 하나로 꼽힙니다. 이는 순수 수학적 이론, 수치 해석학적 견고성, 그리고 대용량 데이터의 효율적인 처리 능력이 동시에 요구되기 때문입니다. 사용자가 제시한 워크플로우는 단순한 형상 모델링을 넘어, NURBS 기반의 정밀한 수학적 정의부터 불리언(Boolean) 연산을 거쳐 IFC/STEP과 같은 산업 표준 데이터의 파싱, 그리고 WebGPU를 활용한 하드웨어 가속 렌더링까지 이어지는 전체 파이프라인을 포괄하고 있습니다.

과거 1990년대의 고전적인 접근 방식은 Piegl의 NURBS 이론이나 Mantyla의 솔리드 모델링 기초에 의존했으나, 현대의 커널 개발은 이보다 훨씬 복잡한 요구사항에 직면해 있습니다. 특히 부동소수점 연산 오차로 인한 위상(Topology) 붕괴를 방지하는 '수치적 견고성(Robustness)', 연속적인 수학적 모델을 이산적인 메쉬로 변환하는 '테셀레이션(Tessellation)'의 최적화, 그리고 웹 환경에서의 고성능 처리를 위한 'WebGPU 컴퓨트 쉐이더(Compute Shader)'의 도입은 기존의 교과서들이 다루지 못한 새로운 영역입니다.

본 보고서는 사용자가 제외를 요청한 고전 서적 3권(_The NURBS Book_, _An Introduction to Solid Modeling_, _Geometric and Solid Modeling_)을 대체하고, 현대적 커널 아키텍처를 구축하는 데 필수적인 전문 서적과 최신 연구 결과를 심층 분석합니다. 이를 통해 수학적 코어(Math Core), 기하 연산(Geometry), 위상 관리(Solid/Topology), 이산 처리(Tessellation), 그리고 시각화(Renderer)로 이어지는 5단계 개발 로드맵에 따른 구체적인 구현 전략을 제시합니다.

---

## 2. 수학적 아키텍처와 커널 코어: 상용 커널의 설계 원칙

지오메트릭 커널의 가장 밑바닥에는 기하학적 형상을 수학적으로 정의하고 이를 컴퓨터 메모리 상의 데이터 구조로 표현하는 '코어(Core)'가 존재합니다. 이 단계에서는 순수 수학적 이론을 실제 구동 가능한 소프트웨어 아키텍처로 변환하는 것이 핵심입니다. 제외된 고전 서적들이 이론적 정의에 치중했다면, 본 보고서에서 추천하는 현대적 자료들은 '상용 수준의 구현'에 초점을 맞춥니다.

### 2.1 상용 커널 아키텍처의 청사진: Nikolay Golovanov의 『Geometric Modeling』

러시아의 C3D Labs에서 개발한 C3D 커널은 Parasolid나 ACIS와 경쟁하는 상용 지오메트릭 커널입니다. 이 커널의 수석 아키텍트인 Nikolay Golovanov가 저술한 **『Geometric Modeling: The Mathematics of Shapes』** 는 커널 개발자에게 있어 실전적인 청사진을 제공하는 독보적인 자료입니다.

#### 2.1.1 위상(Topology)과 기하(Geometry)의 상호 의존성 설계

지오메트릭 모델링 시스템은 크게 형상의 수학적 정의인 '기하(Geometry)'와 형상의 연결 관계를 정의하는 '위상(Topology)'으로 나뉩니다. Golovanov의 저서는 이 두 요소가 상용 커널 내부에서 어떻게 유기적으로 연결되는지를 상세히 기술합니다. 예를 들어, B-Rep(경계 표현) 모델에서 '면(Face)'은 위상학적 개체이지만, 이는 반드시 수학적인 '서피스(Surface)' 정의를 참조해야 합니다. 또한 '에지(Edge)'는 위상적으로 두 면의 경계를 나타내지만, 기하학적으로는 3차원 공간상의 '곡선(Curve)'으로 정의됩니다.

이 책은 단순한 수학 공식을 나열하는 것을 넘어, 객체 지향 프로그래밍 관점에서 기하 객체의 클래스 상속 구조와 데이터 멤버 설계를 다룹니다. 이는 개발자가 NURBS 곡면을 구현할 때, 제어점(Control Points)과 매듭 벡터(Knot Vector)를 어떻게 메모리에 효율적으로 배치하고, 이를 위상 구조인 루프(Loop)와 쉘(Shell)에 연결할 것인지에 대한 직접적인 해답을 제공합니다.

#### 2.1.2 구성적 솔리드 기하학(CSG)과 B-Rep의 통합

현대의 CAD 시스템은 CSG(Constructive Solid Geometry)의 절차적 편의성과 B-Rep의 표현력을 동시에 요구합니다. Golovanov는 CSG 트리를 B-Rep으로 평가(Evaluation)하는 과정에서 발생하는 데이터 구조의 변환 과정을 다룹니다. 특히, '포인트 멤버십 분류(Point Membership Classification, PMC)' 문제는 불리언 연산의 기초가 되는 중요한 알고리즘입니다. 특정 점이 솔리드의 내부에 있는지, 외부에 있는지, 혹은 경계 위에 있는지를 판별하는 PMC 알고리즘은 CSG 트리를 순회하며 B-Rep의 최종 형상을 결정하는 데 필수적입니다. 이 책은 이러한 이론이 실제 C3D 커널에서 어떻게 최적화되어 구현되었는지를 보여줌으로써, 개발자가 직면할 수 있는 성능 병목 현상을 미리 예방할 수 있게 합니다.

### 2.2 구현 중심의 알고리즘 가이드: Max K. Agoston의 『Computer Graphics and Geometric Modeling』

Golovanov의 저서가 시스템 아키텍처를 다룬다면,**Max K. Agoston의 『Computer Graphics and Geometric Modeling』 (특히 Volume 1: Implementation and Algorithms)** 는 구체적인 코딩 레벨의 가이드를 제공합니다. 이 책은 이론과 실제 구현 사이의 간극을 메우는 데 탁월하며, 특히 자료구조와 기초 알고리즘 구현에 강점을 가집니다.

#### 2.2.1 반-에지(Half-Edge) 자료구조와 위상 순회

솔리드 모델링에서 가장 빈번하게 일어나는 연산은 인접한 면이나 에지를 찾는 위상 순회(Traversal)입니다. Agoston은 윙드-에지(Winged-Edge) 자료구조와 이를 개선한 반-에지(Half-Edge) 자료구조의 구현 방법을 상세히 설명합니다. 반-에지 자료구조는 에지를 방향성 있는 두 개의 반쪽으로 나누어 관리함으로써, 임의의 면에서 인접한 모든 면을 시계 방향 혹은 반시계 방향으로 순회하는 연산을 상수 시간(O(1)) 내에 수행할 수 있게 합니다. 이는 불리언 연산 후 위상을 재봉합(Stitching)하거나, 테셀레이션 과정에서 법선 벡터(Normal Vector)를 평활화하는 데 필수적인 기초 기술입니다.

#### 2.2.2 NURBS의 베지어(Bezier) 분해와 고속 연산

NURBS 곡선이나 곡면을 직접 렌더링하거나 교차점을 계산하는 것은 수치적으로 매우 불안정하고 비용이 많이 듭니다. 따라서 대부분의 커널은 NURBS를 수학적으로 더 단순한 베지어 패치(Bezier Patch)로 분해(Decomposition)하여 처리합니다. Agoston의 책은 드 보어(de Boor) 알고리즘과 매듭 삽입(Knot Insertion) 알고리즘을 통해 NURBS를 손실 없이 베지어 조각으로 변환하는 과정을 코드 레벨에서 설명합니다. 이 과정은 렌더링 엔진으로 데이터를 넘기기 전, 형상을 전처리하는 단계에서 핵심적인 역할을 수행합니다.

**표 1. 커널 코어 개발을 위한 핵심 도서 비교 분석**

|**비교 항목**|**Geometric Modeling (Golovanov)**|**Computer Graphics & Geometric Modeling (Agoston)**|
|---|---|---|
|**핵심 초점**|상용 커널(C3D) 아키텍처 및 수학적 코어|알고리즘 구현 및 자료구조(C++ 기반)|
|**위상(Topology)**|B-Rep과 CSG의 통합, 객체 간 연결성 설계|Half-Edge 등 구체적 자료구조의 메모리 설계|
|**기하(Geometry)**|곡면/솔리드 구성의 수학적 원리 (수치 모델)|NURBS 분해, 좌표계 변환, 기하 연산 함수|
|**개발 단계 활용**|시스템 설계 및 클래스 구조 설계 단계|구체적 함수 구현 및 디버깅 단계|
|**대체 고전**|_Geometric and Solid Modeling_ (Hoffmann)|_An Introduction to Solid Modeling_ (Mantyla)|

---

## 3. 수치적 견고성(Robustness) 확보와 불리언 연산의 난제 해결

개발자가 마주할 가장 큰 장벽은 '불리언 연산의 실패'입니다. 이론적으로 완벽한 교차 연산도 부동소수점(Floating-point) 연산의 미세한 오차로 인해 위상 정보가 꼬이거나, 미세한 구멍이 발생하는 등 치명적인 오류를 일으킬 수 있습니다. 이를 해결하기 위해서는 '강건한 기하 연산(Robust Geometric Computing)'이라는 특수한 분야의 지식이 필요합니다.

### 3.1 부동소수점의 한계 극복: Dave Eberly의 『Robust and Error-Free Geometric Computing』

이 분야의 필독서인 **Dave Eberly의 『Robust and Error-Free Geometric Computing』** 는 기하 연산에서 발생하는 수치적 오류를 체계적으로 분석하고 해결책을 제시합니다. Eberly는 유명한 기하 라이브러리인 'Geometric Tools'의 개발자로서, 이론가가 아닌 엔지니어의 관점에서 문제를 해결합니다.

#### 3.1.1 정확한 산술(Exact Arithmetic)과 필터링 기법

부동소수점 연산(IEEE 754)은 본질적으로 근사값을 사용하므로, 매우 가까운 두 점이 겹쳐 있는지 판단하는 것과 같은 민감한 연산에서 오류를 발생시킵니다. 예를 들어, 점이 선분의 왼쪽, 오른쪽, 혹은 위에 있는지를 판별하는 '오리엔테이션 검사(Orientation Predicate)'에서 미세한 오차는 전체 위상 구조를 뒤집어버릴 수 있습니다.

Eberly는 이를 해결하기 위해 **정확한 산술(Arbitrary Precision Arithmetic)** 의 도입을 제안합니다. 하지만 모든 연산을 정확한 산술로 처리하면 속도가 극도로 느려집니다. 따라서 그는**구간 산술(Interval Arithmetic)** 을 이용한 필터링 기법을 소개합니다. 먼저 빠른 부동소수점 연산으로 계산하되, 결과값의 오차 범위(구간)가 0을 포함하지 않으면 그 결과를 신뢰하고, 0을 포함하는 불확실한 경우에만 비용이 높은 정확한 산술을 수행하는 방식입니다. 이 하이브리드 접근법은 상용 커널의 성능과 안정성을 동시에 확보하는 핵심 기술입니다.

#### 3.1.2 교차 검사(Intersection Queries)의 견고성

불리언 연산(합집합, 교집합, 차집합)의 첫 단계는 두 솔리드의 표면이 만나는 교차 곡선(Intersection Curve)을 구하는 것입니다. 이 교차 곡선이 닫혀 있지 않거나, 표면에서 약간 떠 있는 경우 불리언 연산은 실패합니다. Eberly의 책은 선분 대 삼각형, 삼각형 대 삼각형 교차 검사에서 발생할 수 있는 모든 예외 케이스(Degenerate Cases)를 다루며, 오차 없는 교차 판정 알고리즘을 제시합니다. 이는 단순히 엡실론(Epsilon) 값을 조절하는 임시방편이 아니라, 수학적으로 증명된 견고함을 제공합니다.

### 3.2 보조 자료: Joseph O'Rourke의 『Computational Geometry in C』

**Joseph O'Rourke의 『Computational Geometry in C』** 는 3차원 볼록 껍질(Convex Hull)이나 다면체 내부 점 판별(Point-in-Polyhedron)과 같은 특정 알고리즘의 구현에 있어 표준과도 같은 참고서입니다. 특히 2판에서는 코드의 견고성(Robustness)이 대폭 강화되었습니다. 이 책의 코드는 C로 작성되어 있어, C++ 기반의 커널 개발 시 저수준 최적화에 직접적인 도움을 줍니다. 불리언 연산 전, 객체의 충돌 가능성을 빠르게 배제하기 위한 바운딩 볼륨 계층(BVH) 구성 시 O'Rourke의 알고리즘들이 유용하게 사용됩니다.

---

## 4. 연속체에서 이산체로: 테셀레이션 및 메쉬 처리 파이프라인

커널 내부에서 NURBS와 같은 연속적인 수학적 모델로 정의된 형상은 렌더링이나 물리 시뮬레이션을 위해 삼각형 집합인 '메쉬(Mesh)'로 변환되어야 합니다. 이 과정을**테셀레이션(Tessellation)** 이라 하며, 생성된 메쉬를 다듬는 과정을 **지오메트리 프로세싱(Geometry Processing)** 이라 합니다.

### 4.1 이산 기하학의 바이블: Botsch 등의 『Polygon Mesh Processing』

**Mario Botsch 등이 저술한 『Polygon Mesh Processing』** 은 이산 기하학 분야의 바이블로 불리며, 테셀레이션 이후의 모든 파이프라인을 커버합니다.

#### 4.1.1 테셀레이션 후처리와 리메싱(Remeshing)

CAD 모델을 테셀레이션하면, 곡률이 급격한 부분이나 트리밍(Trimming) 곡선 주변에서 길고 얇은 삼각형(Sliver Triangle)이 다수 생성됩니다. 이러한 삼각형은 렌더링 시 쉐이딩 아티팩트(Artifact)를 유발하고, 유한요소해석(FEM) 시 수치적 불안정을 야기합니다. 이 책은 불규칙한 삼각형들을 정삼각형에 가깝게 재배열하는 **등방성 리메싱(Isotropic Remeshing)** 알고리즘을 상세히 다룹니다. 또한, 이산 미분 기하학(Discrete Differential Geometry)을 기반으로 한 라플라스-벨트라미(Laplace-Beltrami) 연산자를 이용해, 형상의 특징(Feature)은 유지하면서 노이즈를 제거하는 **스무딩(Smoothing)** 기법을 제공합니다. 이는 사용자가 화면에서 보는 최종 결과물의 품질을 결정짓는 중요한 단계입니다.

#### 4.1.2 모델 복구(Model Repair) 알고리즘

외부에서 가져온 CAD 데이터나 불리언 연산 결과물은 종종 '터진 메쉬(Non-manifold geometry)'나 '구멍(Hole)'을 포함합니다. 이 책의 'Model Repair' 챕터는 이러한 기형적인 메쉬를 복구하여 '닫힌 솔리드(Watertight Solid)'로 만드는 알고리즘을 분류하고 설명합니다. 구멍을 메우는 홀 필링(Hole Filling) 알고리즘과 겹친 버텍스를 병합하는 과정은 3D 프린팅이나 물리 엔진과의 연동을 위해 반드시 구현되어야 하는 기능입니다.

---

## 5. 상호운용성: STEP 및 IFC 파서 구현 전략

자체 커널을 개발하더라도, 산업 표준 포맷인 STEP(ISO 10303)과 IFC(Industry Foundation Classes)를 지원하지 않으면 고립된 시스템이 됩니다. 이 두 포맷은 텍스트 기반이지만 매우 복잡한 스키마 구조를 가지고 있어 단순한 파싱 이상의 기술이 요구됩니다.

### 5.1 데이터 모델링의 이해: Borrmann 등의 『Building Information Modeling』

**André Borrmann 등의 『Building Information Modeling: Technology Foundations and Industry Practice』 (특히 Chapter 6)** 는 IFC와 STEP의 기반 기술을 가장 명확하게 설명하는 자료입니다.

#### 5.1.1 EXPRESS 언어와 STEP 물리적 파일 구조

IFC와 STEP은 **EXPRESS (ISO 10303-11)** 라는 데이터 모델링 언어로 정의됩니다. 파서를 개발하기 위해서는 먼저 이 EXPRESS 스키마를 이해하고, 이를 C++이나 WebAssembly 클래스로 매핑하는 과정이 필요합니다. Borrmann의 책은 EXPRESS의 상속(Inheritance), 집합(Aggregation - Set, List, Bag), 그리고 제약 조건(Where rules)이 어떻게 작동하는지 설명합니다. 또한, 실제 데이터가 저장되는** STEP Physical File (ISO 10303-21)** 포맷인 'Part 21' 파일의 구조를 분석합니다. 이 파일은 `#10=WALL(...)`과 같이 엔티티 ID를 이용한 후방 참조(Backward Reference) 구조를 가지므로, 파서는 반드시 두 번의 패스(Two-pass)를 거치거나 의존성 그래프를 구성하여 객체를 생성해야 합니다.

#### 5.1.2 바인딩 전략: 초기 바인딩(Early Binding) vs 지연 바인딩(Late Binding)

파서 개발 시 가장 중요한 아키텍처 결정은 바인딩 방식입니다.

- **초기 바인딩(Early Binding):** EXPRESS 스키마를 컴파일 타임에 C++ 클래스로 변환합니다. `IfcOpenShell`과 같은 라이브러리가 사용하는 방식으로, 실행 속도가 빠르고 타입 안정성이 높지만, 스키마 버전(IFC2x3, IFC4)이 바뀔 때마다 코드를 재생성해야 합니다.
    
- **지연 바인딩(Late Binding):** 런타임에 스키마를 읽어들여 데이터를 딕셔너리나 맵 형태로 저장합니다. 유연성은 높지만 성능 오버헤드가 큽니다. 이 책은 이러한 전략적 선택에 필요한 기술적 배경을 제공합니다. 대용량 건설 모델을 다루는 엔진이라면 초기 바인딩 방식이나 하이브리드 방식이 유리할 수 있습니다.
    

**표 2. 상호운용성 및 테셀레이션 핵심 기술 요약**

|**영역**|**핵심 도서**|**주요 기술적 내용**|
|---|---|---|
|**테셀레이션**|Polygon Mesh Processing|등방성 리메싱, 라플라시안 스무딩, Non-manifold 복구 알고리즘|
|**IFC/STEP**|Building Information Modeling|EXPRESS 스키마 파싱, ISO 10303-21 파일 구조 분석, 초기/지연 바인딩 아키텍처|
|**데이터 구조**|(상기 도서 공통)|반-에지(Half-Edge) 구조(메쉬), 의존성 그래프(파싱)|

---

## 6. 차세대 렌더링 아키텍처: WebGPU와 실시간 시각화

워크플로우의 마지막 단계는 WebGPU를 활용한 렌더링 최적화입니다. WebGL이 단순히 화면에 그림을 그리는 그래픽스 API였다면, WebGPU는 GPU의 강력한 병렬 처리 능력을 일반 연산(Compute)에 활용할 수 있는 차세대 표준입니다.

### 6.1 렌더링 이론의 집대성: 『Real-Time Rendering, 4th Edition』

**Tomas Akenine-Möller 등의 『Real-Time Rendering, 4th Edition』** 은 그래픽스 엔진 개발의 필수 불가결한 참고서입니다. 이 책은 단순한 API 사용법이 아닌, 렌더링 엔진의 아키텍처를 다룹니다.

#### 6.1.1 물리 기반 렌더링(PBR)과 대용량 씬 관리

현대의 CAD 뷰어는 실사에 가까운 재질 표현을 위해 **물리 기반 렌더링(PBR)** 을 채택하고 있으며, 이는 glTF 포맷의 표준이기도 합니다. 이 책은 PBR의 수학적 이론(Microfacet Theory)을 상세히 다룹니다. 또한, 수백만 개의 부품으로 구성된 CAD 모델을 웹에서 끊김 없이 보여주기 위해 **LOD(Level of Detail)** 관리 기법과 **오클루전 컬링(Occlusion Culling)** 알고리즘을 설명합니다. 보이지 않는 부품을 GPU에 보내지 않도록 사전에 걸러내는 이 기술은 대용량 CAD 엔진의 성능을 좌우합니다.

### 6.2 WebGPU 구현 가이드: Jack Xu와 Matthew Scarpino의 저서

WebGPU의 구체적인 구현을 위해서는 **Jack Xu의 『WebGPU and Compute Shaders for Real-Time Graphics』** 와 **Matthew Scarpino의 『The WebGPU Sourcebook』** 가 필요합니다.

#### 6.2.1 컴퓨트 쉐이더(Compute Shader)를 이용한 기하 연산 가속화

WebGPU의 가장 큰 혁신은 **컴퓨트 쉐이더**입니다. 기존에는 CPU(자바스크립트)에서 수행하던 무거운 기하 연산을 GPU로 옮길 수 있습니다.

- **GPU 기반 프러스텀 컬링(Frustum Culling):** CPU가 각 객체를 순회하며 화면에 보이는지 검사하는 대신, 컴퓨트 쉐이더가 수만 개의 객체에 대해 병렬로 가시성을 판단하고, 그 결과를 간접 묘화(Indirect Draw) 버퍼에 기록하여 렌더링 파이프라인으로 넘깁니다. 이는 CPU-GPU 간의 데이터 전송 병목을 제거하여 획기적인 성능 향상을 가져옵니다.
    
- **GPU 기반 테셀레이션 및 스키닝:** 파라메트릭 서피스의 테셀레이션이나 애니메이션 스키닝 연산도 컴퓨트 쉐이더로 처리할 수 있습니다. Scarpino의 책은 이러한 GPGPU(General-Purpose computing on Graphics Processing Units) 작업을 WebGPU API로 구현하는 구체적인 예제를 제공합니다. 연구 결과에 따르면, WebGPU를 활용한 파티클 시스템이나 기하 연산은 WebGL 대비 약 5~6배, 특정 상황에서는 100배 가까운 성능 향상을 보여줍니다.
    

---

## 7. 결론: 통합 개발 로드맵

사용자의 워크플로우를 완성하기 위해, 본 보고서는 고전 서적을 배제하고 현대적 기술 요구사항에 부합하는 새로운 도서 목록과 기술적 근거를 제시하였습니다.

1. **Math & Geometry Core:** Golovanov의 **『Geometric Modeling』** 을 통해 상용 커널 수준의 B-Rep/CSG 아키텍처를 설계하고, Agoston의 **『Computer Graphics and Geometric Modeling』** 을 통해 구체적인 NURBS 알고리즘을 구현합니다.
    
2. **Solid & Robustness:** Eberly의 **『Robust and Error-Free Geometric Computing』** 을 도입하여, 불리언 연산에서 발생할 수 있는 수치적 불안정성을 구간 산술과 정확한 산술의 하이브리드 방식으로 해결합니다.
    
3. **Tessellation:** Botsch의 **『Polygon Mesh Processing』** 을 참고하여, NURBS에서 변환된 메쉬를 리메싱하고 복구하는 고품질 파이프라인을 구축합니다.
    
4. **Interoperability:** Borrmann의 **『Building Information Modeling』** 을 기반으로 ISO 10303 표준을 준수하는 강력한 IFC/STEP 파서를 개발합니다.
    
5. **Renderer Optimization:** **『Real-Time Rendering 4th Ed.』** 의 이론적 토대 위에 **『WebGPU and Compute Shaders』** 의 기술을 적용하여, 기하 연산과 렌더링을 GPU로 가속화하는 차세대 웹 뷰어를 완성합니다.
    

이러한 접근은 단순히 책을 읽는 것을 넘어, 각 단계의 기술이 유기적으로 연결된 고성능의 3D 엔진을 구축하는 실질적인 가이드라인이 될 것입니다.