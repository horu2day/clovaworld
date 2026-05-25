/**
 * FloorPlanParser.js
 * 
 * 건축 평면도 라벨 JSON → 3D IFC 요소 변환 파서
 * 
 * 데이터셋 종류:
 *   STR (구조): data/image-drawing/02.라벨링데이터/STR/*.json
 *     id=9  → 구조_출입문 (IfcDoor)
 *     id=10 → 구조_창호   (IfcWindow)
 *     id=11 → 구조_벽체   (IfcWall)
 * 
 *   OBJ (내장오브젝트): data/image-drawing/02.라벨링데이터/OBJ/*.json
 *     id=4  → 객체_변기   (IfcSanitaryTerminal / 변기)
 *     id=5  → 객체_세면대 (IfcSanitaryTerminal / 세면대)
 *     id=6  → 객체_싱크대 (IfcElectricAppliance / 싱크대)
 *     id=7  → 객체_욕조   (IfcSanitaryTerminal / 욕조)
 *     id=8  → 객체_가스레인지 (IfcElectricAppliance / 가스레인지)
 * 
 * 좌표 변환:
 *   - 이미지는 픽셀(px) 단위. 1px ≈ SCALE_FACTOR m
 *   - 이미지 Y축(아래↓)을 3D Z축(앞↑)으로 뒤집는다
 *   - bbox = [x_min, y_min, w, h] (COCO 형식)
 *   - OBJ의 rotation 속성: 도 단위 → 라디안 Y 회전
 * 
 * 실제 APT 도면 규격 분석:
 *   - 4963 x 3509 px → 실제 약 19,780mm x 11,410mm (1:200 축척)
 *   - 즉 1px ≈ 3.99mm ≈ 0.00399m
 *   - 층고 표준: 2.8m (APT 기준)
 *   - 벽체 두께: 일반벽 120mm ~ 외벽 200mm
 */

// ─── 카테고리 ID 상수 ───────────────────────────────────────────
const CAT = {
  DOOR:   9,   // 구조_출입문
  WINDOW: 10,  // 구조_창호
  WALL:   11,  // 구조_벽체
};

// OBJ (내장 오브젝트) 카테고리
const OBJ_CAT = {
  TOILET:   4,  // 객체_변기
  SINK:     5,  // 객체_세면대
  KITCHEN:  6,  // 객체_싱크대
  BATHTUB:  7,  // 객체_욕조
  GAS:      8,  // 객체_가스레인지
};

// OBJ 카테고리 → 3D 메타데이터 매핑
const OBJ_META = {
  4: { blockType: 'block-toilet',   ifcType: 'IfcSanitaryTerminal', label: '변기',        color: '#e8e8f0', height: 0.4,  depth: 0.7,  width: 0.36 },
  5: { blockType: 'block-sink',     ifcType: 'IfcSanitaryTerminal', label: '세면대',      color: '#e8e8f0', height: 0.85, depth: 0.45, width: 0.45 },
  6: { blockType: 'block-kitchen',  ifcType: 'IfcElectricAppliance',label: '싱크대',      color: '#c0c0cc', height: 0.85, depth: 0.55, width: 1.2  },
  7: { blockType: 'block-bathtub',  ifcType: 'IfcSanitaryTerminal', label: '욕조',        color: '#e0e0ee', height: 0.5,  depth: 0.7,  width: 1.4  },
  8: { blockType: 'block-gas',      ifcType: 'IfcElectricAppliance',label: '가스레인지',  color: '#888890', height: 0.85, depth: 0.55, width: 0.6  },
};

// ─── 좌표 변환 파라미터 ─────────────────────────────────────────
// 평면도 이미지 기준 픽셀→미터 스케일
// 분석: 000477071 도면 총폭 19,780mm / 4963px ≈ 3.99mm/px
const DEFAULT_SCALE_M_PER_PX = 0.00399; 

// 3D 공간 중앙 오프셋 (이미지 원점을 3D 원점으로 매핑)
// 이미지 중심 → 3D (0, 0, 0)으로 이동
const DEFAULT_CENTER_OFFSET = { x: 0.5, y: 0.5 }; // 이미지 너비/높이의 비율

// 층고 (벽 높이) - 한국 APT 표준
const FLOOR_HEIGHT = 2.8; // m

// 벽체 두께 분류 임계값 (px 기준 → m 변환 후)
const WALL_THIN_THRESHOLD = 0.25;   // m 이하 → 단변이 두께
const WALL_MAX_THICKNESS   = 0.35;  // m, 벽 두께 최대 클램프

export class FloorPlanParser {
  /**
   * @param {object} options
   * @param {number} [options.scaleMperPx] - m/px 스케일 (기본: 0.00399)
   * @param {number} [options.floorHeight] - 벽체 층고 (기본: 2.8m)
   * @param {number} [options.worldScale]  - 3D 뷰 추가 배율 (기본: 1.0)
   * @param {number} [options.maxElements] - 최대 파싱 요소 수 (메모리 제한, 기본: 200)
   */
  constructor(options = {}) {
    this.scaleMperPx  = options.scaleMperPx  ?? DEFAULT_SCALE_M_PER_PX;
    this.floorHeight  = options.floorHeight  ?? FLOOR_HEIGHT;
    this.worldScale   = options.worldScale   ?? 1.0;
    this.maxElements  = options.maxElements  ?? 200;
  }

  /**
   * JSON 라벨 데이터를 파싱하여 3D 배치 명령 배열로 변환
   * 
   * @param {object} labelJson - JSON.parse(file) 결과
   * @param {object} [opts]
   * @param {number[]} [opts.categoryFilter] - 파싱할 카테고리 ID 배열 (기본: [9,10,11])
   * @param {number} [opts.floorY]           - 바닥면 Y 좌표 (기본: 0)
   * @returns {ParsedFloorPlan}
   */
  parse(labelJson, opts = {}) {
    const { categoryFilter = [CAT.WALL, CAT.WINDOW, CAT.DOOR], floorY = 0 } = opts;

    // 이미지 크기 추출
    const imgMeta = labelJson.images?.[0] ?? { width: 4963, height: 3509 };
    const imgW    = imgMeta.width;
    const imgH    = imgMeta.height;

    // 이미지 중심 (3D 원점 매핑)
    const cx = imgW / 2;
    const cy = imgH / 2;

    const walls   = [];
    const windows = [];
    const doors   = [];

    let count = 0;
    for (const ann of (labelJson.annotations ?? [])) {
      if (count >= this.maxElements) break;
      if (!categoryFilter.includes(ann.category_id)) continue;

      const bbox = ann.bbox; // [x_min, y_min, w_px, h_px]
      if (!bbox || bbox.length < 4) continue;

      const [bx, by, bw, bh] = bbox;

      // bbox 중심 픽셀
      const pcx = bx + bw / 2;
      const pcy = by + bh / 2;

      // → 3D XZ 좌표 (이미지 Y↓ → 3D Z↑)
      const x3d = (pcx - cx) * this.scaleMperPx * this.worldScale;
      const z3d = -(pcy - cy) * this.scaleMperPx * this.worldScale; // Y 반전

      // bbox 변 → 실세계 크기 (m)
      const rw = bw * this.scaleMperPx * this.worldScale;
      const rh = bh * this.scaleMperPx * this.worldScale;

      // 장변=length, 단변=thickness 판별
      let wallLen, wallThick, isHorizontal;
      if (rw >= rh) {
        wallLen   = rw;
        wallThick = Math.min(rh, WALL_MAX_THICKNESS);
        isHorizontal = true;  // X 방향
      } else {
        wallLen   = rh;
        wallThick = Math.min(rw, WALL_MAX_THICKNESS);
        isHorizontal = false; // Z 방향
      }

      // 극소 요소 필터 (노이즈 제거)
      if (wallLen < 0.05 || wallThick < 0.01) continue;

      const element = {
        x: x3d,
        y: floorY,
        z: z3d,
        length:      wallLen,
        thickness:   wallThick,
        height:      this.floorHeight,
        isHorizontal,
        rotationY:   isHorizontal ? 0 : Math.PI / 2,
        area:        ann.area ?? 0,
        attributes:  ann.attributes ?? {},
        annotationId: ann.id,
      };

      if (ann.category_id === CAT.WALL) {
        walls.push(element);
      } else if (ann.category_id === CAT.WINDOW) {
        // 창문: 벽보다 낮게, 창대 0.9m, 창고 최대 floorHeight - 창대 - 0.3m
        const winH = Math.min(rw, rh, this.floorHeight - 0.9 - 0.3);
        windows.push({
          ...element,
          height: Math.max(winH, 0.5),
          y:      floorY + 0.9, // 창대 높이
        });
      } else if (ann.category_id === CAT.DOOR) {
        // 문: 높이 최대 floorHeight - 0.1m
        const doorH = Math.min(this.floorHeight - 0.1, 2.1);
        doors.push({
          ...element,
          height: doorH,
          y:      floorY,
        });
      }

      count++;
    }

    return {
      imageWidth:  imgW,
      imageHeight: imgH,
      scaleMperPx: this.scaleMperPx,
      floorHeight: this.floorHeight,
      walls,
      windows,
      doors,
      objects: [],  // STR 파싱에선 빈 배열
      total: walls.length + windows.length + doors.length,
      fileName: labelJson.images?.[0]?.file_name ?? 'unknown',
    };
  }

  /**
   * OBJ 라벨 JSON 파싱 → 내장 오브젝트 배열 반환
   * OBJ 데이터셋은 가구/위생기구 레이어 전용
   * 
   * @param {object} labelJson - OBJ/*.json 파일
   * @param {object} [opts]
   * @param {number} [opts.floorY] - 바닥면 Y 좌표 (기본: 0)
   * @returns {ParsedFloorPlan}
   */
  parseObjects(labelJson, opts = {}) {
    const { floorY = 0 } = opts;

    const imgMeta = labelJson.images?.[0] ?? { width: 4963, height: 3509 };
    const imgW    = imgMeta.width;
    const imgH    = imgMeta.height;
    const cx = imgW / 2;
    const cy = imgH / 2;

    const objects = [];
    const OBJ_IDS = Object.keys(OBJ_META).map(Number);

    let count = 0;
    for (const ann of (labelJson.annotations ?? [])) {
      if (count >= this.maxElements) break;
      if (!OBJ_IDS.includes(ann.category_id)) continue;

      const bbox = ann.bbox;
      if (!bbox || bbox.length < 4) continue;

      const [bx, by, bw, bh] = bbox;
      const pcx = bx + bw / 2;
      const pcy = by + bh / 2;

      // 픽셀 → 3D 좌표
      const x3d = (pcx - cx) * this.scaleMperPx * this.worldScale;
      const z3d = -(pcy - cy) * this.scaleMperPx * this.worldScale;

      // OBJ rotation 속성: 도 → 라디안
      const rotDeg = ann.attributes?.rotation ?? 0;
      const rotRad = (rotDeg * Math.PI) / 180;

      const meta = OBJ_META[ann.category_id];

      objects.push({
        x: x3d,
        y: floorY,
        z: z3d,
        rotationY: rotRad,
        categoryId: ann.category_id,
        blockType:  meta.blockType,
        ifcType:    meta.ifcType,
        label:      meta.label,
        color:      meta.color,
        objHeight:  meta.height,
        objDepth:   meta.depth,
        objWidth:   meta.width,
        annotationId: ann.id,
        area:         ann.area ?? 0,
      });

      count++;
    }

    return {
      imageWidth:  imgW,
      imageHeight: imgH,
      scaleMperPx: this.scaleMperPx,
      floorHeight: this.floorHeight,
      walls:   [],
      windows: [],
      doors:   [],
      objects,
      total: objects.length,
      fileName: labelJson.images?.[0]?.file_name ?? 'unknown',
    };
  }

  /**
   * 파싱 결과를 PromptInterpreter modular-assembly 형식으로 변환
   * ProceduralGenerator의 block-* 타입들과 호환
   * 
   * @param {ParsedFloorPlan} parsed
   * @param {object} [palette]
   * @returns {object} modular-assembly JSON
   */
  toAssembly(parsed, palette = {}) {
    const {
      wallColor    = '#55555f',
      windowColor  = '#00DDFF',
      doorColor    = '#FF6633',
      emissive     = '#00f0ff',
      floorY       = 0,
      hasRoof      = false,
    } = palette;

    // ─── STR-SPA 및 STR-OBJ 자동 위치/크기 정합 캘리브레이션 (Strategy B) ───
    const walls = parsed.walls || [];
    const spaces = parsed.spaces || [];
    const objects = parsed.objects || [];

    if (walls.length > 0) {
      // 1. STR 벽체들의 글로벌 바운딩 박스 계산
      let minX_str = Infinity, maxX_str = -Infinity;
      let minZ_str = Infinity, maxZ_str = -Infinity;
      for (const w of walls) {
        const hw = (w.isHorizontal ? w.length : w.thickness) / 2;
        const hd = (w.isHorizontal ? w.thickness : w.length) / 2;
        minX_str = Math.min(minX_str, w.x - hw);
        maxX_str = Math.max(maxX_str, w.x + hw);
        minZ_str = Math.min(minZ_str, w.z - hd);
        maxZ_str = Math.max(maxZ_str, w.z + hd);
      }
      
      const centerStrX = (minX_str + maxX_str) / 2;
      const centerStrZ = (minZ_str + maxZ_str) / 2;
      const sizeStrX = maxX_str - minX_str;
      const sizeStrZ = maxZ_str - minZ_str;

      // 2. SPA 공간 구획 글로벌 바운딩 박스 계산 및 정합
      if (spaces.length > 0) {
        let minX_spa = Infinity, maxX_spa = -Infinity;
        let minZ_spa = Infinity, maxZ_spa = -Infinity;
        for (const s of spaces) {
          minX_spa = Math.min(minX_spa, s.x - s.width / 2);
          maxX_spa = Math.max(maxX_spa, s.x + s.width / 2);
          minZ_spa = Math.min(minZ_spa, s.z - s.depth / 2);
          maxZ_spa = Math.max(maxZ_spa, s.z + s.depth / 2);
        }
        
        const centerSpaX = (minX_spa + maxX_spa) / 2;
        const centerSpaZ = (minZ_spa + maxZ_spa) / 2;
        const sizeSpaX = maxX_spa - minX_spa;
        const sizeSpaZ = maxZ_spa - minZ_spa;

        let scaleSpaX = 1.0;
        let scaleSpaZ = 1.0;
        if (sizeSpaX > 0.05) scaleSpaX = sizeStrX / sizeSpaX;
        if (sizeSpaZ > 0.05) scaleSpaZ = sizeStrZ / sizeSpaZ;

        // 극단적 스케일 왜곡 방지를 위한 안전 클램핑 (0.85 ~ 1.15)
        scaleSpaX = Math.max(0.85, Math.min(1.15, scaleSpaX));
        scaleSpaZ = Math.max(0.85, Math.min(1.15, scaleSpaZ));

        for (const s of spaces) {
          const dx = s.x - centerSpaX;
          const dz = s.z - centerSpaZ;
          s.x = centerStrX + dx * scaleSpaX;
          s.z = centerStrZ + dz * scaleSpaZ;
          s.width *= scaleSpaX;
          s.depth *= scaleSpaZ;
        }
      }

      // 3. OBJ 내장가구 글로벌 바운딩 박스 계산 및 정합
      if (objects.length > 0) {
        let minX_obj = Infinity, maxX_obj = -Infinity;
        let minZ_obj = Infinity, maxZ_obj = -Infinity;
        for (const o of objects) {
          minX_obj = Math.min(minX_obj, o.x - o.objWidth / 2);
          maxX_obj = Math.max(maxX_obj, o.x + o.objWidth / 2);
          minZ_obj = Math.min(minZ_obj, o.z - o.objDepth / 2);
          maxZ_obj = Math.max(maxZ_obj, o.z + o.objDepth / 2);
        }
        
        const centerObjX = (minX_obj + maxX_obj) / 2;
        const centerObjZ = (minZ_obj + maxZ_obj) / 2;
        const sizeObjX = maxX_obj - minX_obj;
        const sizeObjZ = maxZ_obj - minZ_obj;

        let scaleObjX = 1.0;
        let scaleObjZ = 1.0;
        if (sizeObjX > 0.05) scaleObjX = sizeStrX / sizeObjX;
        if (sizeObjZ > 0.05) scaleObjZ = sizeStrZ / sizeObjZ;

        scaleObjX = Math.max(0.85, Math.min(1.15, scaleObjX));
        scaleObjZ = Math.max(0.85, Math.min(1.15, scaleObjZ));

        for (const o of objects) {
          const dx = o.x - centerObjX;
          const dz = o.z - centerObjZ;
          o.x = centerStrX + dx * scaleObjX;
          o.z = centerStrZ + dz * scaleObjZ;
        }
      }
    }

    const assembly = [];
    const entranceSpace = spaces.find(s => s.categoryId === 16);
    const balconySpace  = spaces.find(s => s.categoryId === 17);

    // ─── 공간 바닥 마감 (Room Floor Finishes - 구별 색상 부여 및 지글거림 방지) ───
    for (const s of spaces) {
      assembly.push({
        blockType:   'block-slab',
        customColor: s.color,
        emissiveColor: s.emissive || s.color, // 방 구역 색상과 연동된 구역별 발광 색상 주입
        position:    [s.x, floorY + 0.025, s.z], // Z-fighting 완전히 피하기 위한 2.5cm 상향 오프셋
        scale:       [s.width - 0.02, 0.04, s.depth - 0.02], // 캘리브레이션 완료로 2cm 초미세 수평 축소 (틈새 0mm 칼재단 정합)
        ifcType:     'IfcCovering',
        label:       `${s.label} 바닥마감`,
        meta:        { annotationId: s.annotationId, area: s.area },
      });
    }

    // ─── 구조 기둥 (Pillars) 검출 및 배치 ───────────────────────
    const pillars = [];
    if (parsed.walls && parsed.walls.length > 0) {
      const endpoints = [];
      for (const w of parsed.walls) {
        const halfL = w.length / 2;
        if (w.isHorizontal) {
          endpoints.push({ x: w.x - halfL, z: w.z });
          endpoints.push({ x: w.x + halfL, z: w.z });
        } else {
          endpoints.push({ x: w.x, z: w.z - halfL });
          endpoints.push({ x: w.x, z: w.z + halfL });
        }
      }

      // 끝점/교차점 클러스터링
      const clusteredPoints = [];
      const distThreshold = 0.45; // 45cm

      for (const pt of endpoints) {
        let found = false;
        for (const cpt of clusteredPoints) {
          const dx = pt.x - cpt.x;
          const dz = pt.z - cpt.z;
          if (Math.sqrt(dx * dx + dz * dz) < distThreshold) {
            cpt.count++;
            // 약간의 평균 보정으로 중심 맞춤
            cpt.x = (cpt.x * (cpt.count - 1) + pt.x) / cpt.count;
            cpt.z = (cpt.z * (cpt.count - 1) + pt.z) / cpt.count;
            found = true;
            break;
          }
        }
        if (!found) {
          clusteredPoints.push({ x: pt.x, z: pt.z, count: 1 });
        }
      }

      // 외벽 경계 파악
      let minX = 1e9, maxX = -1e9, minZ = 1e9, maxZ = -1e9;
      for (const w of parsed.walls) {
        const hw = (w.isHorizontal ? w.length : w.thickness) / 2;
        const hd = (w.isHorizontal ? w.thickness : w.length) / 2;
        minX = Math.min(minX, w.x - hw);
        maxX = Math.max(maxX, w.x + hw);
        minZ = Math.min(minZ, w.z - hd);
        maxZ = Math.max(maxZ, w.z + hd);
      }

      const boundaryThreshold = 0.8; // 80cm 내에 있으면 외벽 기둥으로 간주

      for (const cpt of clusteredPoints) {
        const isNearBoundary = (
          Math.abs(cpt.x - minX) < boundaryThreshold ||
          Math.abs(cpt.x - maxX) < boundaryThreshold ||
          Math.abs(cpt.z - minZ) < boundaryThreshold ||
          Math.abs(cpt.z - maxZ) < boundaryThreshold
        );

        const label = isNearBoundary ? '외벽 구조 기둥' : '내부 구조 기둥';
        pillars.push({
          blockType:   'block-pillar',
          customColor: '#7a7a85',
          position:    [cpt.x, floorY, cpt.z],
          scale:       [0.45, parsed.floorHeight / 2.3, 0.45],
          ifcType:     'IfcColumn',
          label:       label,
          meta:        { isExternal: isNearBoundary, count: cpt.count }
        });
      }
    }

      // 아파트 구조체 규칙 반영: 기둥은 원형이 아니며 내력 구조벽체가 하중을 대신하므로 기둥 배치 제외.
      // (기존 기둥 생성 로직 유지하되 어셈블리 추가 단계에서 제외함)

    // 구조 기둥 추가 생략 (내력벽체로 대체)

    // ─── 지붕 슬라브 (지붕도 기둥 사이 벽을 덮음) ───────────
    if (hasRoof) {
      assembly.push({
        blockType:   'block-slab',
        customColor: '#4f4f5a',
        position:    [0, floorY + parsed.floorHeight + 0.15, 0],
        scale:       [totalW, 0.3, totalD],
        ifcType:     'IfcSlab',
        label:       '지붕 슬라브',
      });
    }

    // ─── 구조 벽체 ─────────────────────────────────────────
    for (const w of parsed.walls) {
      assembly.push({
        blockType:   'block-wall',
        customColor: wallColor,
        position:    [w.x, w.y + w.height / 2, w.z],
        scale:       w.isHorizontal
          ? [w.length, w.height, w.thickness]
          : [w.thickness, w.height, w.length],
        ifcType:     'IfcWall',
        label:       w.attributes?.['구조_벽체'] ?? '구조벽',
        meta:        { annotationId: w.annotationId, area: w.area },
      });
    }

    // ─── 창호 및 하부/상부 구조벽 ───────────────────────────
    for (const win of parsed.windows) {
      // 대형 베란다창(너비 > 1.6m) vs 일반 방창 분류 (창호 높이 버그 완벽 수정)
      const isVerandaWin = win.length > 1.6;
      const targetWinH   = isVerandaWin ? 2.1 : 1.2;
      const targetSillY  = isVerandaWin ? floorY : (floorY + 0.9);

      // 1. 실제 창문 개체 (창문의 바닥 원점 위치와 네이티브 높이 1.8m 정밀 피팅)
      assembly.push({
        blockType:   'block-window',
        customColor: windowColor,
        position:    [win.x, targetSillY, win.z], // 바닥 원점에 밀착
        scale:       [win.length / 1.8, targetWinH / 1.8, win.thickness / 0.12], // 네이티브 크기 보정 (폭 1.8m, 높이 1.8m, 두께 0.12m)
        rotation:    [0, win.isHorizontal ? 0 : Math.PI / 2, 0], // 회전을 통해 비틀림 및 틈새 방지
        ifcType:     'IfcWindow',
        label:       isVerandaWin ? '대형 베란다창호' : '일반 방창호',
        meta:        { annotationId: win.annotationId, isVeranda: isVerandaWin },
      });

      // 2. 창호 하부 창대벽 (Sill Wall - 일반 방창호에만 시공)
      const sillH = targetSillY - floorY;
      if (sillH > 0.05) {
        assembly.push({
          blockType:   'block-wall',
          customColor: wallColor,
          position:    [win.x, floorY + sillH / 2, win.z],
          scale:       win.isHorizontal
            ? [win.length, sillH, win.thickness]
            : [win.thickness, sillH, win.length],
          ifcType:     'IfcWall',
          label:       '창대벽 (창호 하부)',
          meta:        { annotationId: win.annotationId },
        });
      }

      // 3. 창호 상부 인방벽 (Lintel Wall)
      const winTopY = targetSillY + targetWinH;
      const lintelH = (floorY + parsed.floorHeight) - winTopY;
      if (lintelH > 0.05) {
        assembly.push({
          blockType:   'block-wall',
          customColor: wallColor,
          position:    [win.x, winTopY + lintelH / 2, win.z],
          scale:       win.isHorizontal
            ? [win.length, lintelH, win.thickness]
            : [win.thickness, lintelH, win.length],
          ifcType:     'IfcWall',
          label:       '인방벽 (창호 상부)',
          meta:        { annotationId: win.annotationId },
        });
      }
    }

    // ─── 출입문 및 상부 인방벽 (현관은 철제 대문, 베란다는 유리 슬라이딩문, 방문은 나무 사각문 분류 적용) ───
    for (const door of parsed.doors) {
      let isEntranceDoor = false;
      let isBalconyDoor  = false;

      // 1. 현관문 여부 판별
      if (entranceSpace) {
        const dx = door.x - entranceSpace.x;
        const dz = door.z - entranceSpace.z;
        if (Math.sqrt(dx * dx + dz * dz) < 2.5) {
          isEntranceDoor = true;
        }
      } else {
        let minX = 1e9, maxX = -1e9;
        for (const d of parsed.doors) {
          minX = Math.min(minX, d.x);
          maxX = Math.max(maxX, d.x);
        }
        if (Math.abs(door.x - minX) < 0.8 || Math.abs(door.x - maxX) < 0.8) {
          isEntranceDoor = true;
        }
      }

      // 2. 발코니/베란다 유리 슬라이딩문 여부 판별
      if (!isEntranceDoor) {
        if (balconySpace) {
          const dx = door.x - balconySpace.x;
          const dz = door.z - balconySpace.z;
          if (Math.sqrt(dx * dx + dz * dz) < 2.5) {
            isBalconyDoor = true;
          }
        } else {
          // 발코니 공간 정보가 없는 경우 문 너비가 넓은 경우 (1.1m 이상)
          if (door.length > 1.1) {
            isBalconyDoor = true;
          }
        }
      }

      // 문 종류 지정
      let doorBlockType = 'block-door-wood';
      let doorLabel = '목재 방문';
      if (isEntranceDoor) {
        doorBlockType = 'block-door-steel';
        doorLabel = '철제 현관문';
      } else if (isBalconyDoor) {
        doorBlockType = 'block-door-glass';
        doorLabel = '베란다 유리문';
      }

      // 1. 실제 사각 문 개체 (틀 포함 - 문의 바닥 원점 위치와 네이티브 높이 2.1m 정밀 피팅)
      const nativeThick = isEntranceDoor ? 0.16 : 0.12; // 철제현관문 16cm, 그외 12cm 프레임
      assembly.push({
        blockType:   doorBlockType,
        customColor: doorColor,
        position:    [door.x, door.y, door.z], // 바닥 원점에 밀착
        scale:       [door.length / 1.0, door.height / 2.1, door.thickness / nativeThick], // 네이티브 크기 보정 (폭 1.0m, 높이 2.1m)
        rotation:    [0, door.isHorizontal ? 0 : Math.PI / 2, 0], // 회전을 통해 비틀림 및 틈새 방지
        ifcType:     'IfcDoor',
        label:       doorLabel,
        meta:        { annotationId: door.annotationId, isEntrance: isEntranceDoor, isBalcony: isBalconyDoor },
      });

      // 2. 문 상부 인방벽 (Lintel Wall)
      const doorTopY = door.y + door.height;
      const lintelH = (floorY + parsed.floorHeight) - doorTopY;
      if (lintelH > 0.05) {
        assembly.push({
          blockType:   'block-wall',
          customColor: wallColor,
          position:    [door.x, doorTopY + lintelH / 2, door.z],
          scale:       door.isHorizontal
            ? [door.length, lintelH, door.thickness]
            : [door.thickness, lintelH, door.length],
          ifcType:     'IfcWall',
          label:       '인방벽 (출입문 상부)',
          meta:        { annotationId: door.annotationId },
        });
      }
    }

    // ─── 내장 오브젝트 (OBJ 레이어) ────────────────────────
    for (const obj of (parsed.objects ?? [])) {
      assembly.push({
        blockType:   obj.blockType,
        customColor: obj.color,
        position:    [obj.x, obj.y + obj.objHeight / 2, obj.z],
        scale:       [obj.objWidth, obj.objHeight, obj.objDepth],
        rotation:    [0, obj.rotationY, 0],
        ifcType:     obj.ifcType,
        label:       obj.label,
        meta:        { annotationId: obj.annotationId, area: obj.area },
      });
    }

    return {
      geometryType: 'modular-assembly',
      title: `Floor Plan: ${parsed.fileName} (벽체 ${parsed.walls.length}개, 기둥 ${pillars.length}개, 창호 ${parsed.windows.length}개, 문 ${parsed.doors.length}개, 오브젝트 ${(parsed.objects ?? []).length}개)`,
      assembly,
      customColor:   wallColor,
      emissiveColor: emissive,
      physicsScript: `function animate(mesh, time) {
        mesh.traverse(c => {
          if (c.name === 'window-glass' && c.material) {
            c.material.emissiveIntensity = 0.6 + Math.sin(time * 0.003) * 0.3;
          }
        });
      }`,
      _meta: {
        source: 'FloorPlanParser',
        fileName:    parsed.fileName,
        wallCount:   parsed.walls.length,
        pillarCount: pillars.length,
        windowCount: parsed.windows.length,
        doorCount:   parsed.doors.length,
        objectCount: (parsed.objects ?? []).length,
        scaleMperPx: parsed.scaleMperPx,
        floorHeight: parsed.floorHeight,
      },
    };
  }

  /**
   * STR + OBJ + SPA 세 JSON을 합쳐서 공간별 바닥 색상을 포함한 완벽한 세대 평면도 씬 생성
   * @param {object} strJson - STR 라벨 JSON (구조요소)
   * @param {object} objJson - OBJ 라벨 JSON (내장오브젝트)
   * @param {object} [spaJson] - SPA 라벨 JSON (공간구획)
   * @param {object} [palette]
   * @returns {object} modular-assembly JSON
   */
  toAssemblyFull(strJson, objJson, spaJson = null, palette = {}) {
    const strParsed = this.parse(strJson,       { categoryFilter: [9, 10, 11], floorY: 0 });
    const objParsed = this.parseObjects(objJson, { floorY: 0 });

    let spaParsed = { spaces: [] };
    if (spaJson) {
      spaParsed = this.parseSpaces(spaJson, { floorY: 0 });
    }

    // STR + OBJ + SPA 결과 병합
    const merged = {
      ...strParsed,
      objects: objParsed.objects,
      spaces:  spaParsed.spaces,
      total:   strParsed.total + objParsed.total + (spaParsed.spaces?.length ?? 0),
      fileName: strParsed.fileName,
    };
    return this.toAssembly(merged, palette);
  }

  /**
   * SPA 라벨 JSON 파싱 → 공간(Room) 배열 반환
   * @param {object} labelJson - SPA/*.json 파일
   * @param {object} [opts]
   * @param {number} [opts.floorY] - 바닥면 Y 좌표 (기본: 0)
   * @returns {object} ParsedFloorPlan
   */
  parseSpaces(labelJson, opts = {}) {
    const { floorY = 0 } = opts;

    const imgMeta = labelJson.images?.[0] ?? { width: 4963, height: 3509 };
    const imgW    = imgMeta.width;
    const imgH    = imgMeta.height;
    const cx = imgW / 2;
    const cy = imgH / 2;

    const spaces = [];
    const SPACE_COLORS = {
      1:  { color: '#b39ddb', label: '다목적공간', emissive: '#bf5fff' }, // 연자주 -> 밝은 보라
      2:  { color: '#eeeeee', label: '엘리베이터홀', emissive: '#a0c0ff' }, // 밝은회색 -> 사이버 쿨블루
      3:  { color: '#dddddd', label: '계단실', emissive: '#ffbf00' }, // 회색 -> 경고 황색
      13: { color: '#ffe082', label: '거실', emissive: '#ff8c00' }, // 진한 오렌지-옐로우 -> 테라 네온 오렌지
      14: { color: '#90caf9', label: '침실', emissive: '#0066ff' }, // 밝은 스카이블루 -> 딥 블루 네온
      15: { color: '#a5d6a7', label: '주방', emissive: '#00ff66' }, // 싱그러운 그린 -> 에메랄드 네온 그린
      16: { color: '#ffab91', label: '현관', emissive: '#ff3300' }, // 진한 코랄 -> 강렬한 레드 오렌지
      17: { color: '#c5e1a5', label: '발코니', emissive: '#7cff00' }, // 라임그린 -> 일렉트릭 라임 그린
      18: { color: '#80deea', label: '화장실', emissive: '#00ffff' }, // 선명한 시안 -> 청정 아쿠아 시안
      19: { color: '#cfd8dc', label: '실외기실', emissive: '#ff0033' }, // 회색 -> 경보 루비 레드
      20: { color: '#f48fb1', label: '드레스룸', emissive: '#ff007f' }, // 핑크 -> 핫 핑크 네온
      22: { color: '#eeeeee', label: '복도/기타', emissive: '#ffff33' }, // 밝은회색 -> 가이드 라인 옐로우
      23: { color: '#ffe0b2', label: '엘리베이터', emissive: '#ffaa00' }, // 연황토 -> 사이버 골드
    };

    let count = 0;
    for (const ann of (labelJson.annotations ?? [])) {
      if (count >= this.maxElements) break;
      
      const isSpace = Object.keys(SPACE_COLORS).map(Number).includes(ann.category_id);
      if (!isSpace) continue;

      const bbox = ann.bbox;
      if (!bbox || bbox.length < 4) continue;

      const [bx, by, bw, bh] = bbox;
      const pcx = bx + bw / 2;
      const pcy = by + bh / 2;

      // 픽셀 → 3D 좌표
      const x3d = (pcx - cx) * this.scaleMperPx * this.worldScale;
      const z3d = -(pcy - cy) * this.scaleMperPx * this.worldScale;

      const rw = bw * this.scaleMperPx * this.worldScale;
      const rh = bh * this.scaleMperPx * this.worldScale;

      const meta = SPACE_COLORS[ann.category_id] ?? { color: '#fafafa', label: '공간', emissive: '#00f0ff' };

      spaces.push({
        x: x3d,
        y: floorY,
        z: z3d,
        width:  rw,
        depth:  rh,
        color:  meta.color,
        emissive: meta.emissive || meta.color,
        label:  meta.label,
        categoryId: ann.category_id,
        annotationId: ann.id,
        area:   ann.area ?? 0,
      });

      count++;
    }

    return {
      imageWidth:  imgW,
      imageHeight: imgH,
      scaleMperPx: this.scaleMperPx,
      floorHeight: this.floorHeight,
      walls:   [],
      windows: [],
      doors:   [],
      objects: [],
      spaces,
      total: spaces.length,
      fileName: labelJson.images?.[0]?.file_name ?? 'unknown',
    };
  }

  /**
   * 통계 요약 출력 (훈련 로그용)
   */
  summarize(parsed) {
    const wallTypes = {};
    for (const w of parsed.walls) {
      const t = w.attributes?.['구조_벽체'] ?? '미분류';
      wallTypes[t] = (wallTypes[t] ?? 0) + 1;
    }
    // OBJ 오브젝트 유형별 카운트
    const objTypes = {};
    for (const o of (parsed.objects ?? [])) {
      objTypes[o.label] = (objTypes[o.label] ?? 0) + 1;
    }
    // SPA 공간 유형별 카운트
    const spaceTypes = {};
    for (const s of (parsed.spaces ?? [])) {
      spaceTypes[s.label] = (spaceTypes[s.label] ?? 0) + 1;
    }
    return {
      file:       parsed.fileName,
      총요소수:   parsed.total,
      벽체:       parsed.walls.length,
      창호:       parsed.windows.length,
      출입문:     parsed.doors.length,
      내장오브젝트: (parsed.objects ?? []).length,
      공간구획:   (parsed.spaces ?? []).length,
      벽체유형:   wallTypes,
      오브젝트유형: objTypes,
      공간유형:   spaceTypes,
      축척:       `1px = ${(parsed.scaleMperPx * 1000).toFixed(2)}mm`,
      층고:       `${parsed.floorHeight}m`,
    };
  }
}

/**
 * @typedef {object} ParsedElement
 * @property {number} x
 * @property {number} y
 * @property {number} z
 * @property {number} length
 * @property {number} thickness
 * @property {number} height
 * @property {boolean} isHorizontal
 * @property {number} rotationY
 * @property {number} area
 * @property {object} attributes
 * @property {number} annotationId
 */

/**
 * @typedef {object} ParsedFloorPlan
 * @property {number} imageWidth
 * @property {number} imageHeight
 * @property {number} scaleMperPx
 * @property {number} floorHeight
 * @property {ParsedElement[]} walls
 * @property {ParsedElement[]} windows
 * @property {ParsedElement[]} doors
 * @property {ParsedObjElement[]} objects  - 내장 오브젝트 (OBJ 레이어)
 * @property {number} total
 * @property {string} fileName
 */

/**
 * @typedef {object} ParsedObjElement
 * @property {number} x
 * @property {number} y
 * @property {number} z
 * @property {number} rotationY       - 라디안 Y 회전
 * @property {number} categoryId
 * @property {string} blockType       - block-toilet 등
 * @property {string} ifcType
 * @property {string} label
 * @property {string} color
 * @property {number} objHeight
 * @property {number} objDepth
 * @property {number} objWidth
 * @property {number} annotationId
 * @property {number} area
 */
