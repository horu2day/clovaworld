---
name: ifc43-civil
description: IFC 4.3 ADD2 (ISO 16739:2024) 인프라 도메인 전문 지식 — 교량, 도로, 터널,
             선형(Alignment), IfcFacility 계층구조. IFC2x3/IFC4 빌딩 중심의 지식으로는
             토목 인프라 BIM 작업 시 심각한 스키마 오류 발생.
---

# IFC 4.3 토목 인프라 스키마 완전 참조

## ⚠️ 핵심 경고: IFC4 빌딩 스키마 != IFC4.3 인프라 스키마

IFC 4.3(IFC4X3_ADD2)는 2024년 ISO 16739로 정식 승인된 인프라 확장 버전이다.
IfcBuilding → IfcFacility, IfcBuildingStorey → IfcFacilityPart 로의 패러다임 전환.
IFC2x3/IFC4의 빌딩 중심 스키마를 토목에 그대로 적용하면 MVD 검증 실패.

---

## 1. IFC4.3 공간 계층구조 (토목)

```
IfcProject
└── IfcSite                           ← 건설 현장/위치
    └── IfcFacility                   ← 시설물 (교량/도로/터널의 최상위)
        ├── IfcBridge                 ← 교량
        │   ├── IfcBridgePart         ← 교량 부분 (상부구조/하부구조/etc.)
        │   │   └── IfcBuildingElement 계열  ← 실제 구조 요소들
        │   └── IfcAlignment          ← 교량 선형 (별도 배치)
        ├── IfcRoad                   ← 도로
        │   ├── IfcRoadPart           ← 도로 부분 (차로/보도/측대)
        │   └── IfcAlignment          ← 도로 선형
        ├── IfcRailway                ← 철도
        │   └── IfcFacilityPart       ← 시설 부분
        └── IfcMarineFacility         ← 항만
```

---

## 2. IfcAlignment — 선형 (도로/철도의 핵심)

### 선형 구조 계층

```
IfcAlignment                          ← 선형 전체 (IFC 필수 관계: IfcProject)
├── IfcAlignmentHorizontal            ← 평면선형 (x/y 평면)
│   └── IfcAlignmentSegment[]
│       └── IfcAlignmentHorizontalSegment (PredefinedType)
│           ├── LINE                  ← 직선
│           ├── CIRCULARARC           ← 원곡선
│           ├── CLOTHOID              ← 클로소이드 (완화곡선)
│           ├── CUBIC                 ← 3차포물선
│           └── HELMERTCURVE          ← 헬머트 곡선
├── IfcAlignmentVertical              ← 종단선형 (거리/고도)
│   └── IfcAlignmentSegment[]
│       └── IfcAlignmentVerticalSegment (PredefinedType)
│           ├── CONSTANTGRADIENT      ← 등경사
│           └── PARABOLICARC          ← 포물선 (종단곡선)
└── IfcAlignmentCant (선택)           ← 켄트 (철도만 해당)
```

### STEP Physical File 예시 (IFC4X3_ADD2)

```ifc
FILE_SCHEMA (('IFC4X3_ADD2'));
...
#1=IFCPROJECT('0vGCH5MKb7IxXhcP$Yz3$a',$,'교량 BIM 프로젝트',$,$,$,$,(#14),#2);
#2=IFCUNITASSIGNMENT((#3,#4,#5));
#3=IFCSIUNIT(*,.LENGTHUNIT.,.MILLI.,.METRE.);     // mm 단위
#4=IFCSIUNIT(*,.AREAUNIT.,$,.SQUARE_METRE.);
#5=IFCSIUNIT(*,.PLANEANGLEUNIT.,$,.RADIAN.);

/* 교량 공간 구조 */
#20=IFCSITE('사이트ID',$,'건설 현장',$,$,#21,$,$,.ELEMENT.,$,$,$,$,$);
#22=IFCBRIDGE('교량ID',$,'한강대교',$,$,#23,$,$,.ELEMENT.,.GIRDER.);
/* PredefinedType: .ARCHED., .CABLE_STAYED., .CULVERT., .FRAMEWORK.,
                   .GIRDER., .SUSPENSION., .TRUSS., .USERDEFINED., .NOTDEFINED. */

/* 교량 부분 (상부구조) */
#30=IFCBRIDGEPART('상부ID',$,'상부구조',$,$,#31,$,$,.ELEMENT.,.SUPERSTRUCTURE.);
/* BridgePartTypeEnum: .ABUTMENT., .DECK., .DECK_SEGMENT., .FOUNDATION.,
                       .PIER., .PIER_SEGMENT., .PYLON., .SUBSTRUCTURE.,
                       .SUPERSTRUCTURE., .SURFACESTRUCTURE. */

/* 선형 */
#40=IFCALIGNMENT('선형ID',$,'교량 선형',$,$,#41,$,.NOTDEFINED.);
```

### 선형 배치 규칙

```
⚠️ 중요:
- IfcAlignment는 반드시 IfcProject와 IfcRelAggregates로 연결
- IfcRelContainedInSpatialStructure 사용 금지 (선형에 사용 불가)
- 자식 선형(child alignment)은 부모 선형과 IfcRelAggregates로 연결

선형 기하 표현:
- IfcCompositeCurve → 2D 평면선형만
- IfcGradientCurve → 3D 평면+종단선형
- IfcSegmentedReferenceCurve → 켄트 포함 3D
- IfcPolyline / IfcIndexedPolyCurve → 측량 데이터
```

---

## 3. IfcBridge — 교량 상세

### PropertySet 목록 (Pset_BridgeCommon)

```
Pset_BridgeCommon:
  SpanType          IfcLabel        // 경간 형식 (단순교/연속교)
  TotalSpan         IfcLengthMeasure // 전체 연장 (m)
  NumberOfSpans     IfcCountMeasure  // 경간 수
  ConstructionType  IfcLabel        // 시공 방식
  DesignLife        IfcTimeMeasure   // 설계 수명 (년)

Pset_ConcreteElementGeneral:
  CompressiveStrength  IfcPressureMeasure  // fck (MPa)
  ReinforcementClass   IfcLabel
  WaterCementRatio     IfcRatioMeasure

Pset_ReinforcedConcreteElementGeneral:
  CompressiveStrength  IfcPressureMeasure
```

### 교량 구조 요소 매핑

```
IfcBeam        → 거더(Girder), 가로보(Cross beam)
IfcColumn      → 교각(Pier), 교대(Abutment의 기둥부)
IfcSlab        → 슬래브(Deck slab), 상판
IfcFoundation  → 기초(Foundation): IfcFooting 또는 IfcPile
IfcBearing     → 받침(교좌장치): .DISK., .ELASTOMERIC., .POT., .ROCKER., etc.
IfcPile        → 말뚝기초
IfcTendon      → 강선/강봉 (PS concrete에서)
IfcTendonConduit → 쉬스(덕트)
IfcVibrationDamper → 방진/제진 장치
IfcDeepFoundation  → 깊은기초 (말뚝, 케이슨 등)
```

---

## 4. IfcRoad — 도로

### IfcRoadPart PredefinedType 목록

```
BICYCLECROSSING   자전거 횡단보도
BUS_STOP          버스 정류장
CARRIAGEWAY       차도
CENTRALISLAND     중앙도로섬
CENTRALRESERVE    중앙분리대
HARDSHOULDER      갓길(포장)
INTERSECTION      교차로
LAYBY             대피소
PARKINGBAY        주차구획
PEDESTRIAN_CROSSING  횡단보도
RAILWAYCROSSING   철도 건널목
REFUGEISLAND      교통섬
ROADSEGMENT       도로 구간
ROADSIDE          도로 측면
ROADSIDEPART      측도부
ROADWAYPLATEAU    도로 고원
ROUNDABOUT        회전교차로
SHOULDER          길어깨
SIDEWALK          보도
SOFTSHOULDER      비포장 갓길
TOLLPLAZA         요금소
TRAFFICISLAND     교통섬
TRAFFICLANE       차선
```

### 도로 단면 구성 패턴

```
UsageType 파라미터 활용:
- LONGITUDINAL: 종방향 분할 (구간 단위)
- LATERAL: 횡단면 분할 (차도/보도/측구 등)

계층:
IfcRoad
├── IfcRoadPart [CARRIAGEWAY] (차도)
│   └── IfcRoadPart [TRAFFICLANE] (차선)
├── IfcRoadPart [SHOULDER] (길어깨)
├── IfcRoadPart [SIDEWALK] (보도)
└── IfcRoadPart [ROADSEGMENT] (도로 구간, 종방향)
```

---

## 5. 기하 표현 — 인프라 특화

### IfcSectionedSolidHorizontal (인프라 핵심 기하)

```
용도: 선형을 따라 단면을 스윕하는 솔리드 생성
     도로/철도/교량 거더의 3D 형상 표현에 최적
     
구성:
- Directrix: IfcGradientCurve (선형)
- CrossSectionPositions: 구간별 횡단면 위치
- CrossSections: IfcProfileDef 배열

주의: IFC4 이전에는 없던 기하 타입
     IFC4.3 이전 뷰어에서는 IfcFacetedBrep으로 대체 필요
```

### IfcLinearPlacement (선형 배치)

```
기존 IfcLocalPlacement → 절대 좌표계 배치
IfcLinearPlacement     → 선형 기준 상대 배치 (인프라에서 선호)

파라미터:
- PlacementRelTo: IfcLinearPositioningElement (기준 선형)
- Distance: IfcDistanceExpression (선형 기준점으로부터 거리)
- Lateral, Vertical: 횡방향/수직 오프셋
- LongitudinalAlignment: 종방향 정렬
```

---

## 6. IFC4.3 STEP 파일 헤더

```ifc
/* 현행 IFC4.3 표준 식별자 */
FILE_SCHEMA (('IFC4X3_ADD2'));

/* 빌딩(IFC4) */
FILE_SCHEMA (('IFC4'));

/* 구형 호환 */
FILE_SCHEMA (('IFC2X3'));
```

---

## 7. xBIM C# 라이브러리 활용 (IFC4.3)

```csharp
// NuGet: Xbim.Ifc (4.x 이상 IFC4.3 지원)
using Xbim.Ifc;
using Xbim.Ifc4x3.Interfaces;  // IFC4.3 인터페이스

// IFC4.3 파일 읽기
using (var model = IfcStore.Open("bridge.ifc"))
{
    // 교량 요소
    var bridges = model.Instances.OfType<IIfcBridge>();
    
    // 선형 요소
    var alignments = model.Instances.OfType<IIfcAlignment>();
    
    // PropertySet 읽기
    foreach (var bridge in bridges)
    {
        var psets = bridge.IsDefinedBy
            .SelectMany(r => r.RelatingPropertyDefinition
                .OfType<IIfcPropertySet>());
    }
}

// IFC4.3 모델 생성
using (var model = IfcStore.Create(IfcSchemaVersion.Ifc4x3))
{
    using (var txn = model.BeginTransaction("Create Bridge"))
    {
        var project = model.Instances.New<IfcProject>(p => {
            p.Name = "한강 교량 프로젝트";
        });
        // ... 
        txn.Commit();
    }
}
```

---

## 8. IntelliCAD의 IFC 지원 현황

```
IntelliCAD 12.x: IFC4 / IFC4x3 스키마 선택 내보내기
IntelliCAD 13.x: IFC 유효성 검사, RVT→IFC 변환, AEC 치수
IntelliCAD 14.x: 건축 공간 생성 강화

⚠️ 주의:
- IntelliCAD의 내장 IFC 내보내기는 AEC(건축) 요소 중심
- 인프라(교량/도로) IFC4.3 내보내기는 별도 플러그인/커스텀 개발 필요
- 커스텀 개발 시 xBIM 또는 IfcOpenShell 직접 사용 권장
```
