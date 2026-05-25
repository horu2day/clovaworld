import { FloorPlanParser } from './FloorPlanParser.js';

export class PromptInterpreter {
  constructor() {
    this.apiKey = null; 
    // 프로덕션 환경의 기본 Flash 모델명
    this.modelName = 'gemini-3.5-flash';
  }

  setApiKey(key) {
    this.apiKey = key;
  }

  setModelName(modelName) {
    this.modelName = modelName;
  }

  // LLM 프롬프트 분석 프로세스: 실제 Gemini API 연동 및 파라메트릭 도면 설계
  async interpret(prompt) {
    // 1. 실제 Gemini API를 사용하는 경우
    if (this.apiKey) {
      try {
        const systemInstructionText = `당신은 차세대 3D 가상현실 플랫폼의 공간 설계사이자 최고의 BIM(Building Information Modeling) 공학 엔지니어입니다.
사용자 프롬프트에 맞춰, BIM 표준 IFC 4.3 규격을 준수하고 미래지향적인 SF 네온 상상력을 가미한 '파라메트릭 인프라 도면(Parametric Blueprint)'을 설계해야 합니다.

당신이 설계 가능한 4대 파라메트릭 대분류 및 제어 변수 체계:
1. "IfcBridge" (토목 교량 자산)
   - predefinedType: "GIRDER" (거더교), "ARCHED" (아치교), "CABLE_STAYED" (사장교), "SUSPENSION" (현수교), "TRUSS" (트러스교), "VIADOTTO_ACERNO" (ACCA MINnD 아체르노 고가교 - 3D 완만한 곡선 선형 궤적 및 16개 격자 지하 수직 말뚝 기초 적용)
   - dimensions:
     * length: 전체 연장 (단위: m, 기본 32, 범위 15 ~ 60)
     * width: 상판 폭 (기본 6, 범위 4 ~ 10)
     * height: 바닥에서 상판까지 높이 (기본 10, 범위 4 ~ 20)
     * spanCount: 하부 교각 개수 (기본 3, 범위 1 ~ 8)
     * pierRadius: 교각 단면 반지름 (기본 0.4, 범위 0.2 ~ 1.0)
     * pylonHeight: 사장교/현수교 주탑 높이 (기본 15, 범위 8 ~ 40)
     * cableDensity: 인장 강선 및 행거 케이블 개수 (기본 8, 범위 4 ~ 20)

2. "IfcRoad" (토목 도로 자산)
   - predefinedType: "CARRIAGEWAY" (일반 차도망), "ROUNDABOUT" (회전교차로)
   - dimensions:
     * length: 도로 총 연장 (기본 30, 범위 10 ~ 80)
     * width: 도로 총 폭 (기본 6, 범위 4 ~ 12)
     * lanes: 차선 개수 (기본 2, 범위 1 ~ 6)
     * hasLights: 가로등 배치 여부 (boolean, true/false)

3. "IfcTunnel" (토목 터널 자산)
   - predefinedType: "SEGMENTAL" (쉴드 세그먼트 라이닝 터널)
   - dimensions:
     * length: 터널 연장 (기본 25, 범위 10 ~ 50)
     * radius: 터널 튜브 내경 반지름 (기본 4, 범위 3 ~ 8)
     * liningThickness: 터널 벽체 두께 (기본 0.3, 범위 0.1 ~ 0.8)
     * rings: 보강 세그먼트 링 개수 (기본 6, 범위 3 ~ 15)

4. "IfcFacility" (미래형 에너지/우주 인프라 자산)
   - predefinedType: "POWER_STATION" (냉각탑 & 플라즈마 코어), "BIOSPHERE" (지오데식 바이오돔), "SPACE_PORT" (우주선 활주로 & 가속 링)
   - dimensions:
     * height: 구조물 전고 높이 (기본 12, 범위 5 ~ 30)
     * radius: 구조물 바닥 반경 (기본 5, 범위 3 ~ 15)
     * modules: 대칭 분할 모듈 수 (기본 4, 범위 3 ~ 12)

5. "IfcConstructionEquipment" (건설기계 자산)
   - predefinedType: "EXCAVATOR" (굴착기), "TOWER_CRANE" (타워크레인), "CRAWLER_CRANE" (이동식 크레인)
   - dimensions: {} (장비는 기본 형상을 사용하므로 빈 객체 리턴)

SF/네온 장식 및 애니메이션 제어 변수:
- neonStyle: "pulse" (주기적 펄싱), "flow" (한 방향 흐름), "rainbow" (무지개색 변환), "cyber" (디지털 도트 점멸), "plasma" (플라즈마 파동), "work" (건설 장비 작동 펄스)
- customColor: 메인 구조물 색상 (#HEX 형식)
- emissiveColor: 발광부 네온 색상 (#HEX 형식)
- physicsScript: time(ms)을 인수로 받아 메쉬 및 하위 노드(예: "fan-blade", "float-ring", "energy-core" 등)를 회전시키거나 유기적으로 움직일 애니메이션 틱 Javascript 코드를 작성하십시오.

사용자가 요청한 3D 구상을 완벽히 파악하여 다음 JSON 스키마만을 순수하게 출력하십시오.
설명이나 대화, 마크다운 코드 블록(\`\`\`)은 절대로 포함하지 말고 오직 규격에 맞는 JSON 데이터만 리턴해야 합니다.

JSON 출력 스키마 명세:
{
  "geometryType": "IfcBridge" | "IfcRoad" | "IfcTunnel" | "IfcFacility" | "IfcConstructionEquipment",
  "predefinedType": "GIRDER" | "ARCHED" | "CABLE_STAYED" | "SUSPENSION" | "TRUSS" | "VIADOTTO_ACERNO" | "CARRIAGEWAY" | "ROUNDABOUT" | "SEGMENTAL" | "POWER_STATION" | "BIOSPHERE" | "SPACE_PORT" | "EXCAVATOR" | "TOWER_CRANE" | "CRAWLER_CRANE",
  "dimensions": { ...해당 대분류에 맞는 차원 매개변수 값들... },
  "neonStyle": "pulse" | "flow" | "rainbow" | "cyber" | "plasma" | "work",
  "customColor": "#HEXCOLOR",
  "emissiveColor": "#HEXCOLOR",
  "physicsScript": "function animate(mesh, time) { // 하위 파트를 동적으로 제어할 코드를 작성하십시오. }"
}`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent?key=${this.apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: `Design this 3D concept: "${prompt}"` }]
                }
              ],
              systemInstruction: {
                parts: [{ text: systemInstructionText }]
              },
              generationConfig: {
                responseMimeType: 'application/json'
              }
            })
          }
        );

        if (!response.ok) {
          throw new Error(`Gemini API HTTP Error status: ${response.status}`);
        }

        const data = await response.json();
        const responseText = data.candidates[0].content.parts[0].text.trim();
        
        const parsed = JSON.parse(responseText);
        if (!parsed.geometryType) {
          throw new Error("Invalid output JSON blueprint from Gemini API");
        }
        
        return parsed;
      } catch (e) {
        console.warn("Gemini API call failed, falling back to local geometric parsing:", e);
      }
    }

    // 2. Fallback 로컬 절차적 해석 (BIM 파라메트릭 도면 기본 구성)
    const normalized = prompt.toLowerCase();

    // A0. 4개의 도로로 둘러싸인 1개의 가로구역(Block) 및 4개의 다양하고 독특한 주택 시공 (층고 및 문/창고 정밀 정합)
    if (normalized.includes('블록') || normalized.includes('가로구역') || normalized.includes('block') || normalized.includes('street block')) {
      const assemblyItems = [
        // 1. 도로용 기본 아스팔트 바닥 (30m x 30m)
        {
          blockType: 'block-wall',
          customColor: '#202025',
          position: [0, 0.05, 0],
          scale: [30, 0.1, 30]
        },
        // 2. 가로구역 잔디밭 블록 (22m x 22m)
        {
          blockType: 'block-wall',
          customColor: '#27541b',
          position: [0, 0.15, 0],
          scale: [22, 0.1, 22]
        },
        // 3. 가로구역 경계부 가로등/기둥 (4개소)
        {
          blockType: 'block-pillar',
          customColor: '#555560',
          position: [-11.5, 0.2, -11.5],
          scale: [0.4, 1.2, 0.4]
        },
        {
          blockType: 'block-pillar',
          customColor: '#555560',
          position: [11.5, 0.2, -11.5],
          scale: [0.4, 1.2, 0.4]
        },
        {
          blockType: 'block-pillar',
          customColor: '#555560',
          position: [-11.5, 0.2, 11.5],
          scale: [0.4, 1.2, 0.4]
        },
        {
          blockType: 'block-pillar',
          customColor: '#555560',
          position: [11.5, 0.2, 11.5],
          scale: [0.4, 1.2, 0.4]
        },
        // 4. 도로 구분용 네온 차선들 (4개 도로 시각화)
        {
          blockType: 'block-wall',
          customColor: '#e6a100',
          position: [0, 0.11, -13.5],
          scale: [30, 0.02, 0.15]
        },
        {
          blockType: 'block-wall',
          customColor: '#e6a100',
          position: [0, 0.11, 13.5],
          scale: [30, 0.02, 0.15]
        },
        {
          blockType: 'block-wall',
          customColor: '#e6a100',
          position: [-13.5, 0.11, 0],
          scale: [0.15, 0.02, 30]
        },
        {
          blockType: 'block-wall',
          customColor: '#e6a100',
          position: [13.5, 0.11, 0],
          scale: [0.15, 0.02, 30]
        }
      ];

      // 4개소의 고유한 주택들 일괄 빌딩 프로세스 (층고 2.8m, 창/문 헤더 클리어런스 표준 매핑)
      const buildHouse = (X_0, Z_0, palette, winType, doorType, roofType, roofScale, name) => {
        assemblyItems.push(
          // Floor Slab (두께 0.1m, 상단 Y = 0.3)
          {
            blockType: 'block-wall',
            customColor: palette.slab,
            position: [X_0, 0.25, Z_0],
            scale: [4.0, 0.1, 4.0]
          },
          // Corner Pillars (층고 2.8m에 완벽 싱크, Y = 0.3에서 시작하여 Y = 3.1에 안착)
          {
            blockType: 'block-pillar',
            customColor: '#7a7a85',
            position: [X_0 - 1.9, 0.3, Z_0 + 1.9],
            scale: [0.8, 1.26, 0.8]
          },
          {
            blockType: 'block-pillar',
            customColor: '#7a7a85',
            position: [X_0 + 1.9, 0.3, Z_0 + 1.9],
            scale: [0.8, 1.26, 0.8]
          },
          {
            blockType: 'block-pillar',
            customColor: '#7a7a85',
            position: [X_0 - 1.9, 0.3, Z_0 - 1.9],
            scale: [0.8, 1.26, 0.8]
          },
          {
            blockType: 'block-pillar',
            customColor: '#7a7a85',
            position: [X_0 + 1.9, 0.3, Z_0 - 1.9],
            scale: [0.8, 1.26, 0.8]
          },
          // 4 Walls (높이 2.8m, 상단 Y = 3.1)
          {
            blockType: 'block-wall',
            customColor: palette.wall,
            position: [X_0 - 1.95, 1.7, Z_0],
            scale: [0.1, 2.8, 4.0]
          },
          {
            blockType: 'block-wall',
            customColor: palette.wall,
            position: [X_0 + 1.95, 1.7, Z_0],
            scale: [0.1, 2.8, 4.0]
          },
          {
            blockType: 'block-wall',
            customColor: palette.wall,
            position: [X_0, 1.7, Z_0 - 1.95],
            scale: [4.0, 2.8, 0.1]
          },
          {
            blockType: 'block-wall',
            customColor: palette.wall,
            position: [X_0, 1.7, Z_0 + 1.95],
            scale: [4.0, 2.8, 0.1]
          },
          // Window (창대 높이 0.9m + 창고 1.2m = 상단 Y = 2.4m, 벽 높이 3.1m 내 완벽 인입)
          {
            blockType: winType,
            customColor: palette.emissive,
            position: [X_0, 1.2, Z_0 - 1.9],
            scale: [0.8, 0.67, 0.8]
          },
          // Door (바닥 탭 Y = 0.3 + 문높이 2.0m = 상단 Y = 2.3m, 벽 높이 3.1m 내 완벽 인입)
          {
            blockType: doorType,
            customColor: palette.emissive,
            position: [X_0, 0.3, Z_0 + 2.0],
            scale: [0.8, 0.8, 0.8]
          },
          // Roof (벽체 상단 Y = 3.1m에 밀착 시공)
          {
            blockType: roofType,
            customColor: '#7a2b9e',
            position: [X_0, 3.1, Z_0],
            scale: roofScale
          }
        );
      };

      // 4대 하우스 배치 정의
      const palettes = [
        { wall: '#60586e', slab: '#1b1424', emissive: '#00FFFF' }, // Dome House
        { wall: '#34343d', slab: '#121217', emissive: '#FF0055' }, // Gabled House
        { wall: '#8c8c96', slab: '#2b2b35', emissive: '#00FF99' }, // Flat House
        { wall: '#4a3e5c', slab: '#201830', emissive: '#ffaa00' }  // Pyramid House
      ];

      buildHouse(-5.0, -5.0, palettes[0], 'block-window-circle', 'block-gate-slide', 'block-roof-dome', [4.2, 4.2, 4.2], 'Dome House');
      buildHouse(5.0, -5.0, palettes[1], 'block-window-tall', 'block-gate', 'block-roof', [4.2, 3.0, 4.2], 'Classic Gabled');
      buildHouse(-5.0, 5.0, palettes[2], 'block-window', 'block-gate-hatch', 'block-roof-flat', [4.2, 0.5, 4.2], 'Eco Flat Terrace');
      buildHouse(5.0, 5.0, palettes[3], 'block-window-hexagon', 'block-gate-portal', 'block-roof-pyramid', [4.2, 3.0, 4.2], 'Quantum Pyramid');

      return {
        geometryType: 'modular-assembly',
        title: 'BIM 가로구역(Street Block) - 4대 네온 하우스 패키지',
        assembly: assemblyItems,
        customColor: '#27541b',
        emissiveColor: '#00FFFF',
        physicsScript: `function animate(mesh, time) {
          mesh.traverse(c => {
            if ((c.name === 'portal-ring') && c.material) {
              c.rotation.z = time * 0.002;
            }
            if ((c.name === 'portal-forcefield' || c.name === 'window-glass' || c.name === 'gate-core') && c.material) {
              c.material.emissiveIntensity = 1.0 + Math.sin(time * 0.005) * 0.4;
            }
          });
        }`
      };
    }

    // Special Zero-Shot training: Building-Structural.ifc 및 구조 프레임 파싱
    if (normalized.includes('building-structural.ifc') || normalized.includes('structural.ifc') || normalized.includes('구조 훈련') || normalized.includes('structural') || normalized.includes('구조') || normalized.includes('skeleton')) {
      const palette = {
        slab: '#3e3e48',
        wall: '#55555f',
        emissive: '#00f0ff',
        beam: '#8c8c96',
        title: 'Cyber Structural'
      };

      return {
        geometryType: 'modular-assembly',
        title: `BIM Structural Frame - ${palette.title} Edition`,
        assembly: [
          // 1. Concrete floor slab (IfcSlab - 두께 0.3m, 상단 Y = 0.3)
          {
            blockType: 'block-slab',
            customColor: palette.slab,
            position: [0, 0.15, 0],
            scale: [8, 0.3, 8]
          },
          // 2. Concrete footings (IfcFooting) under each corner column
          {
            blockType: 'block-footing',
            customColor: '#55555c',
            position: [-3.8, 0, 3.8],
            scale: [1.2, 1.0, 1.2]
          },
          {
            blockType: 'block-footing',
            customColor: '#55555c',
            position: [3.8, 0, 3.8],
            scale: [1.2, 1.0, 1.2]
          },
          {
            blockType: 'block-footing',
            customColor: '#55555c',
            position: [-3.8, 0, -3.8],
            scale: [1.2, 1.0, 1.2]
          },
          {
            blockType: 'block-footing',
            customColor: '#55555c',
            position: [3.8, 0, -3.8],
            scale: [1.2, 1.0, 1.2]
          },
          // 3. Corner Columns (IfcColumn - Y = 0.3에서 Y = 3.8까지 연장)
          {
            blockType: 'block-pillar',
            customColor: '#7a7a85',
            position: [-3.8, 0.3, 3.8],
            scale: [1.5, 1.573, 1.5]
          },
          {
            blockType: 'block-pillar',
            customColor: '#7a7a85',
            position: [3.8, 0.3, 3.8],
            scale: [1.5, 1.573, 1.5]
          },
          {
            blockType: 'block-pillar',
            customColor: '#7a7a85',
            position: [-3.8, 0.3, -3.8],
            scale: [1.5, 1.573, 1.5]
          },
          {
            blockType: 'block-pillar',
            customColor: '#7a7a85',
            position: [3.8, 0.3, -3.8],
            scale: [1.5, 1.573, 1.5]
          },
          // 4. Horizontal Beams / Girders (IfcBeam - Y = 3.5에서 Y = 3.8까지)
          {
            blockType: 'block-beam',
            customColor: palette.beam,
            position: [0, 3.65, -3.8],
            scale: [7.6, 1.0, 1.0]
          },
          {
            blockType: 'block-beam',
            customColor: palette.beam,
            position: [0, 3.65, 3.8],
            scale: [7.6, 1.0, 1.0]
          },
          {
            blockType: 'block-beam',
            customColor: palette.beam,
            position: [-3.8, 3.65, 0],
            rotation: [0, Math.PI / 2, 0],
            scale: [7.6, 1.0, 1.0]
          },
          {
            blockType: 'block-beam',
            customColor: palette.beam,
            position: [3.8, 3.65, 0],
            rotation: [0, Math.PI / 2, 0],
            scale: [7.6, 1.0, 1.0]
          },
          // 5. Connecting steel shoes / brackets (IfcDiscreteAccessory) at top column-beam joints
          {
            blockType: 'block-accessory',
            customColor: '#aaaaaf',
            position: [-3.8, 3.5, 3.8],
            scale: [0.8, 0.8, 0.8]
          },
          {
            blockType: 'block-accessory',
            customColor: '#aaaaaf',
            position: [3.8, 3.5, 3.8],
            scale: [0.8, 0.8, 0.8]
          },
          {
            blockType: 'block-accessory',
            customColor: '#aaaaaf',
            position: [-3.8, 3.5, -3.8],
            scale: [0.8, 0.8, 0.8]
          },
          {
            blockType: 'block-accessory',
            customColor: '#aaaaaf',
            position: [3.8, 3.5, -3.8],
            scale: [0.8, 0.8, 0.8]
          },
          // 6. Coordinates origin reference proxies (IfcBuildingElementProxy)
          {
            blockType: 'block-proxy',
            customColor: '#ffffff',
            position: [0, 0.5, 0],
            scale: [1.2, 1.2, 1.2]
          },
          // 7. Partial concrete wall skeletons (IfcWall) to represent construction site
          {
            blockType: 'block-wall',
            customColor: palette.wall,
            position: [0, 1.9, -3.9],
            scale: [7.6, 3.2, 0.15]
          }
        ],
        customColor: palette.wall,
        emissiveColor: palette.emissive,
        physicsScript: `function animate(mesh, time) {
          mesh.traverse(c => {
            if ((c.name === 'proxy-ring') && c.material) {
              c.rotation.y = time * 0.001;
            }
            if ((c.name.startsWith('bolt-') || c.name.startsWith('beam-neon-') || c.name.startsWith('shoe-pin') || c.name.startsWith('axis-')) && c.material) {
              c.material.emissiveIntensity = 1.0 + Math.sin(time * 0.005) * 0.3;
            }
          });
        }`
      };
    }

    // Special Zero-Shot training: Building-Architecture.ifc 및 일반 주택/건축물 파싱
    if (normalized.includes('building-architecture.ifc') || normalized.includes('architecture.ifc') || normalized.includes('silly sample scene') || normalized.includes('single-family house') || normalized.includes('house.ifc') || normalized.includes('집') || normalized.includes('주택') || normalized.includes('빌딩') || normalized.includes('house') || normalized.includes('building') || normalized.includes('건물')) {
      const roofStyles = ['block-roof', 'block-roof-dome', 'block-roof-flat', 'block-roof-pyramid'];
      const windowStyles = ['block-window', 'block-window-circle', 'block-window-tall', 'block-window-hexagon'];
      const doorStyles = ['block-gate', 'block-gate-slide', 'block-gate-hatch', 'block-gate-portal'];
      
      let roofType = roofStyles[Math.floor(Math.random() * roofStyles.length)];
      let winType = windowStyles[Math.floor(Math.random() * windowStyles.length)];
      let doorType = doorStyles[Math.floor(Math.random() * doorStyles.length)];

      // 프롬프트 상의 특정 지붕/창/문 지형 꼼꼼히 파싱
      if (normalized.includes('돔') || normalized.includes('둥근 지붕') || normalized.includes('dome')) roofType = 'block-roof-dome';
      else if (normalized.includes('평평') || normalized.includes('평지붕') || normalized.includes('납작') || normalized.includes('flat') || normalized.includes('terrace')) roofType = 'block-roof-flat';
      else if (normalized.includes('피라미드') || normalized.includes('pyramid') || normalized.includes('사각뿔')) roofType = 'block-roof-pyramid';
      else if (normalized.includes('삼각') || normalized.includes('뾰족') || normalized.includes('gable') || normalized.includes('classic')) roofType = 'block-roof';

      if (normalized.includes('원형') || normalized.includes('둥근 창') || normalized.includes('circle') || normalized.includes('circular')) winType = 'block-window-circle';
      else if (normalized.includes('세로') || normalized.includes('긴 창') || normalized.includes('tall') || normalized.includes('vertical')) winType = 'block-window-tall';
      else if (normalized.includes('육각') || normalized.includes('hexagon')) winType = 'block-window-hexagon';
      else if (normalized.includes('격자') || normalized.includes('classic') || normalized.includes('standard')) winType = 'block-window';

      if (normalized.includes('슬라이드') || normalized.includes('미닫이') || normalized.includes('slide') || normalized.includes('sliding')) doorType = 'block-gate-slide';
      else if (normalized.includes('해치') || normalized.includes('hatch')) doorType = 'block-gate-hatch';
      else if (normalized.includes('포탈') || normalized.includes('에너지 문') || normalized.includes('portal')) doorType = 'block-gate-portal';
      else if (normalized.includes('클래식') || normalized.includes('arch') || normalized.includes('hinge')) doorType = 'block-gate';

      const colorPalettes = [
        { wall: '#8c8c96', slab: '#2b2b35', emissive: '#00FF99', title: 'Cyber Quartz' },
        { wall: '#34343d', slab: '#121217', emissive: '#FF0055', title: 'Neon Obsidian' },
        { wall: '#60586e', slab: '#1b1424', emissive: '#00FFFF', title: 'Geode Plasma' }
      ];
      const palette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];

      const roofScale = roofType === 'block-roof-dome' ? [8.4, 8.4, 8.4] : (roofType === 'block-roof-flat' ? [8.4, 1.0, 8.4] : [8.4, 6.0, 8.4]);

      return {
        geometryType: 'modular-assembly',
        title: `BIM House - ${palette.title} Edition`,
        assembly: [
          // 1. Concrete floor slab (IfcSlab - 두께 0.3m, 상단 Y = 0.3)
          {
            blockType: 'block-wall', 
            customColor: palette.slab,
            position: [0, 0.15, 0],
            scale: [8, 0.3, 8]
          },
          // 2. Corner Columns (IfcColumn - 층고 3.5m 완벽 싱크, Y = 0.3에서 Y = 3.8까지 연장)
          {
            blockType: 'block-pillar',
            customColor: '#7a7a85',
            position: [-3.8, 0.3, 3.8],
            scale: [1.5, 1.573, 1.5]
          },
          {
            blockType: 'block-pillar',
            customColor: '#7a7a85',
            position: [3.8, 0.3, 3.8],
            scale: [1.5, 1.573, 1.5]
          },
          {
            blockType: 'block-pillar',
            customColor: '#7a7a85',
            position: [-3.8, 0.3, -3.8],
            scale: [1.5, 1.573, 1.5]
          },
          {
            blockType: 'block-pillar',
            customColor: '#7a7a85',
            position: [3.8, 0.3, -3.8],
            scale: [1.5, 1.573, 1.5]
          },
          // 3. Four Outer Walls (IfcWall - 높이 3.5m, 상단 Y = 3.8)
          // West Wall (Left)
          {
            blockType: 'block-wall',
            customColor: palette.wall,
            position: [-3.9, 2.05, 0],
            scale: [0.2, 3.5, 8.0]
          },
          // East Wall (Right)
          {
            blockType: 'block-wall',
            customColor: palette.wall,
            position: [3.9, 2.05, 0],
            scale: [0.2, 3.5, 8.0]
          },
          // North Wall (Back) - with embedded window
          {
            blockType: 'block-wall',
            customColor: palette.wall,
            position: [0, 2.05, -3.9],
            scale: [8.0, 3.5, 0.2]
          },
          // South Wall (Front) - with embedded door
          {
            blockType: 'block-wall',
            customColor: palette.wall,
            position: [0, 2.05, 3.9],
            scale: [8.0, 3.5, 0.2]
          },
          // 4. Window (IfcWindow) - 창대 높이 0.9m + 창높이 1.4m = 상단 Y = 2.6m (벽체 높이 Y = 3.8m 내 안전 인입)
          {
            blockType: winType,
            customColor: palette.emissive,
            position: [0, 1.2, -3.8],
            scale: [1.5, 0.78, 1.0]
          },
          // 5. Door (IfcDoor) - 바닥 Y = 0.3 + 문높이 2.1m = 상단 Y = 2.4m (벽체 높이 Y = 3.8m 내 안전 인입)
          {
            blockType: doorType,
            customColor: palette.emissive,
            position: [0, 0.3, 4.0],
            scale: [1.5, 0.84, 1.0]
          },
          // 6. Gabled/Dome/Flat/Pyramid Roof (IfcRoof) - 벽체 상단 Y = 3.8m에 완벽 밀착 시공
          {
            blockType: roofType,
            customColor: '#7a2b9e',
            position: [0, 3.8, 0],
            scale: roofScale
          }
        ],
        customColor: palette.wall,
        emissiveColor: palette.emissive,
        physicsScript: `function animate(mesh, time) {
          mesh.traverse(c => {
            if ((c.name === 'portal-ring') && c.material) {
              c.rotation.z = time * 0.002;
            }
            if ((c.name === 'block-gate' || c.name === 'gate-core' || c.name === 'window-glass' || c.name === 'portal-forcefield') && c.material) {
              c.material.emissiveIntensity = 1.0 + Math.sin(time * 0.005) * 0.4;
            }
          });
        }`
      };
    }

    // A. 교량 관련 키워드 감지
    if (normalized.includes('교량') || normalized.includes('다리') || normalized.includes('bridge') || normalized.includes('대교') || normalized.includes('아체르노') || normalized.includes('acerno') || normalized.includes('minnd')) {
      let bridgeType = 'GIRDER';
      let emColor = '#00F0FF';
      let style = 'pulse';

      if (normalized.includes('acerno') || normalized.includes('아체르노') || normalized.includes('minnd')) {
        bridgeType = 'VIADOTTO_ACERNO';
        emColor = '#00FFFF';
        style = 'flow';
      } else if (normalized.includes('현수교') || normalized.includes('suspension')) {
        bridgeType = 'SUSPENSION';
        emColor = '#FF0055';
        style = 'flow';
      } else if (normalized.includes('사장교') || normalized.includes('stayed') || normalized.includes('케이블')) {
        bridgeType = 'CABLE_STAYED';
        emColor = '#00FF99';
        style = 'rainbow';
      } else if (normalized.includes('아치') || normalized.includes('arch')) {
        bridgeType = 'ARCHED';
        emColor = '#FFFF00';
        style = 'pulse';
      } else if (normalized.includes('트러스') || normalized.includes('truss')) {
        bridgeType = 'TRUSS';
        emColor = '#B57EDC';
        style = 'cyber';
      }

      return {
        geometryType: 'IfcBridge',
        predefinedType: bridgeType,
        dimensions: {
          length: 32,
          width: 5.5,
          height: 10,
          spanCount: 3,
          pierRadius: 0.35,
          pylonHeight: 18,
          cableDensity: 10
        },
        neonStyle: style,
        customColor: '#4f4f5a',
        emissiveColor: emColor,
        physicsScript: `function animate(mesh, time) {
          // 아체르노 난간 및 거더 광속 펄스 애니메이션
          const wires = [];
          mesh.traverse(c => { if(c.name === 'cable-wire' || c.name === 'truss-neon' || c.name === 'neon-tube') wires.push(c); });
          wires.forEach((w, idx) => {
            w.material.emissiveIntensity = 1.0 + Math.sin(time * 0.005 + idx * 0.3) * 0.45;
          });
        }`
      };
    }
    // B. 도로 관련 키워드 감지
    else if (normalized.includes('도로') || normalized.includes('차선') || normalized.includes('길') || normalized.includes('road') || normalized.includes('highway') || normalized.includes('차도')) {
      return {
        geometryType: 'IfcRoad',
        predefinedType: 'CARRIAGEWAY',
        dimensions: {
          length: 35,
          width: 6.5,
          lanes: 3,
          hasLights: true
        },
        neonStyle: 'flow',
        customColor: '#25252b',
        emissiveColor: '#FF9900',
        physicsScript: `function animate(mesh, time) {
          const rails = [];
          mesh.traverse(c => { if(c.name === 'neon-rail') rails.push(c); });
          rails.forEach(r => {
            r.material.emissiveIntensity = 1.0 + Math.sin(time * 0.008) * 0.3;
          });
        }`
      };
    }
    // B2. 지형/DTM/TIN 키워드 감지 (IfcGeotechnicalElement)
    else if (normalized.includes('지형') || normalized.includes('terrain') || normalized.includes('dtm') || normalized.includes('tin') || normalized.includes('측량') || normalized.includes('ground')) {
      return {
        geometryType: 'IfcGeotechnicalElement',
        predefinedType: 'TIN',
        dimensions: { width: 80, depth: 80, cols: 24, rows: 24, maxHeight: 10 },
        neonStyle: 'wireframe',
        customColor: '#4a5a38',
        emissiveColor: '#88FF44',
        physicsScript: `function animate(mesh, time) {
          const pts = mesh.getObjectByName('survey-points');
          if (pts && pts.material) {
            pts.material.opacity = 0.45 + Math.sin(time * 0.002) * 0.25;
          }
          const wire = mesh.getObjectByName('tin-wireframe');
          if (wire && wire.material) {
            wire.material.opacity = 0.05 + Math.abs(Math.sin(time * 0.001)) * 0.05;
          }
        }`
      };
    }
    // B3. 신호기 키워드 감지 (IfcSignal)
    else if (normalized.includes('신호') || normalized.includes('signal') || normalized.includes('신호기') || normalized.includes('철도 신호')) {
      return {
        geometryType: 'IfcSignal',
        predefinedType: 'RAILWAY',
        dimensions: { height: 5.2 },
        neonStyle: 'blink',
        customColor: '#222230',
        emissiveColor: '#FF3300',
        physicsScript: `function animate(mesh, time) {
          const cycle = Math.floor(time / 1500) % 3;
          const r = mesh.getObjectByName('signal-red');
          const y = mesh.getObjectByName('signal-yellow');
          const g = mesh.getObjectByName('signal-green');
          if (r && r.material) r.material.emissiveIntensity = cycle === 0 ? 2.5 : 0.04;
          if (y && y.material) y.material.emissiveIntensity = cycle === 1 ? 2.5 : 0.04;
          if (g && g.material) g.material.emissiveIntensity = cycle === 2 ? 2.5 : 0.04;
        }`
      };
    }
    // B4. 에너지 주탑 / 전주 키워드 감지 (IfcDistributionElement)
    else if (normalized.includes('에너지') || normalized.includes('전주') || normalized.includes('급전') || normalized.includes('mast') || normalized.includes('energy mast') || normalized.includes('전력주')) {
      return {
        geometryType: 'IfcDistributionElement',
        predefinedType: 'ENERGY_MAST',
        dimensions: { height: 8.5 },
        neonStyle: 'corona',
        customColor: '#3a3a4a',
        emissiveColor: '#FFD700',
        physicsScript: `function animate(mesh, time) {
          const corona = mesh.getObjectByName('corona-ring');
          if (corona) corona.rotation.y = time * 0.0015;
          const glow = mesh.getObjectByName('corona-glow');
          if (glow && glow.material) glow.material.opacity = 0.6 + Math.sin(time * 0.008) * 0.3;
        }`
      };
    }
    // B5. 항만 / 해양 키워드 감지 (IfcMarineFacility)
    else if (normalized.includes('항만') || normalized.includes('항구') || normalized.includes('marine') || normalized.includes('port') || normalized.includes('부두') || normalized.includes('등대')) {
      return {
        geometryType: 'IfcMarineFacility',
        predefinedType: 'PORT',
        dimensions: { length: 30, width: 20, height: 3 },
        neonStyle: 'pulse',
        customColor: '#2a2a32',
        emissiveColor: '#00FFFF',
        physicsScript: `function animate(mesh, time) {
          const pivot = mesh.getObjectByName('beacon-beam-pivot');
          if (pivot) pivot.rotation.y = time * 0.001;
          const core = mesh.getObjectByName('energy-core');
          if (core && core.material) core.material.emissiveIntensity = 1.5 + Math.sin(time * 0.006) * 0.5;
        }`
      };
    }
    // B6. 톨게이트 / 요금소 키워드 감지 (IfcRoadPart)
    else if (normalized.includes('톨게이트') || normalized.includes('요금소') || normalized.includes('toll') || normalized.includes('gate') || normalized.includes('차단기')) {
      return {
        geometryType: 'IfcRoadPart',
        predefinedType: 'TOLL_GATE',
        dimensions: { width: 6.5 },
        neonStyle: 'pulse',
        customColor: '#33333f',
        emissiveColor: '#FF3300',
        physicsScript: `function animate(mesh, time) {
          const cycle = Math.floor(time / 1000) % 3;
          const r = mesh.getObjectByName('red-bulb');
          const y = mesh.getObjectByName('yellow-bulb');
          const g = mesh.getObjectByName('green-bulb');
          if (r && r.material) r.material.emissiveIntensity = cycle === 0 ? 2.0 : 0.05;
          if (y && y.material) y.material.emissiveIntensity = cycle === 1 ? 2.0 : 0.05;
          if (g && g.material) g.material.emissiveIntensity = cycle === 2 ? 2.0 : 0.05;
        }`
      };
    }
    // B7. 건설 기계 / 크레인 / 굴착기 감지 (IfcConstructionEquipment)
    else if (normalized.includes('굴착기') || normalized.includes('excavator') || normalized.includes('포크레인') || normalized.includes('크레인') || normalized.includes('crane') || normalized.includes('장비') || normalized.includes('기계')) {
      let eqType = 'EXCAVATOR';
      let eqColor = '#e6a100';
      let emColor = '#FFCC00';
      
      if (normalized.includes('타워') || normalized.includes('tower')) {
        eqType = 'TOWER_CRANE';
        eqColor = '#e6a100';
        emColor = '#FFCC00';
      } else if (normalized.includes('이동식') || normalized.includes('crawler') || normalized.includes('mobile') || normalized.includes('ltm')) {
        eqType = 'CRAWLER_CRANE';
        eqColor = '#d9c21a';
        emColor = '#FFFF00';
      }

      return {
        geometryType: 'IfcConstructionEquipment',
        predefinedType: eqType,
        dimensions: {},
        neonStyle: 'work',
        customColor: eqColor,
        emissiveColor: emColor,
        physicsScript: `function animate(mesh, time) {
          // 건설장비 관절형 물리 모션 시뮬레이션
          if ("${eqType}" === "EXCAVATOR") {
            const cab = mesh.getObjectByName('excavator-cabin-group');
            if (cab) cab.rotation.y = Math.sin(time * 0.001) * 0.6;
            const boom = mesh.getObjectByName('excavator-boom');
            if (boom) boom.rotation.z = Math.PI / 5 + Math.sin(time * 0.002) * 0.15;
          } else if ("${eqType}" === "TOWER_CRANE") {
            const slewing = mesh.getObjectByName('crane-slewing-group');
            if (slewing) slewing.rotation.y = time * 0.0004;
          }
        }`
      };
    }

    // C. 터널 관련 키워드 감지
    else if (normalized.includes('터널') || normalized.includes('tunnel') || normalized.includes('지하')) {
      return {
        geometryType: 'IfcTunnel',
        predefinedType: 'SEGMENTAL',
        dimensions: {
          length: 26,
          radius: 4.2,
          liningThickness: 0.3,
          rings: 8
        },
        neonStyle: 'cyber',
        customColor: '#3a3a40',
        emissiveColor: '#00FF99',
        physicsScript: `function animate(mesh, time) {
          // 천장 팬 회전
          const blade = mesh.getObjectByName('fan-blade');
          if(blade) {
            blade.rotation.z = time * 0.008;
          }
          // 링 에너지 번쩍임
          const rings = [];
          mesh.traverse(c => { if(c.name === 'neon-ring') rings.push(c); });
          rings.forEach((r, idx) => {
            r.material.emissiveIntensity = 0.8 + Math.sin(time * 0.005 + idx * 1.2) * 0.5;
          });
        }`
      };
    }
    // D-0a. OBJ 내장오브젝트 훈련 (위생기구/가구 레이어)
    else if (normalized.includes('obj 훈련') || normalized.includes('apt_fp_obj') || normalized.includes('가구 훈련') || normalized.includes('객체 훈련') || normalized.includes('내장 훈련') || normalized.includes('화장실 훈련') || normalized.includes('주방 훈련')) {
      const OBJ_FILES = [
        'APT_FP_OBJ_000425766',
        'APT_FP_OBJ_007187965',
        'APT_FP_OBJ_009075352',
        'APT_FP_OBJ_010458794',
        'APT_FP_OBJ_011792381',
        'APT_FP_OBJ_016402051',
        'APT_FP_OBJ_020978354',
        'APT_FP_OBJ_028485799',
        'APT_FP_OBJ_029272188',
        'APT_FP_OBJ_029401189',
        'APT_FP_OBJ_030315116',
        'APT_FP_OBJ_030727367',
        'APT_FP_OBJ_031509211',
        'APT_FP_OBJ_035115868',
        'APT_FP_OBJ_042566692',
        'APT_FP_OBJ_043009329',
        'APT_FP_OBJ_044707175',
        'APT_FP_OBJ_045018673',
        'APT_FP_OBJ_048411654',
        'APT_FP_OBJ_052254652',
      ];

      // 프롬프트에 파일명 포함 시 직접 선택, 아니면 순환
      let selectedFile = null;
      let fileIdx = 0;
      for (let i = 0; i < OBJ_FILES.length; i++) {
        const f = OBJ_FILES[i];
        if (normalized.includes(f.toLowerCase())) {
          selectedFile = f;
          fileIdx = i;
          break;
        }
      }
      if (!selectedFile) {
        fileIdx = Math.floor(Date.now() / 30000) % OBJ_FILES.length;
        selectedFile = OBJ_FILES[fileIdx];
      }

      // 페어링할 OBJ to STR/SPA 맵 (가구, 벽체, 바닥 완벽 매핑 좌표 정합 - 백그라운드 제외 실 footprint 매핑)
      const MAP_OBJ_TO_STR_SPA = {
        'APT_FP_OBJ_000425766': { str: 'APT_FP_STR_033918198', spa: 'APT_FP_SPA_019298304' },
        'APT_FP_OBJ_007187965': { str: 'APT_FP_STR_044417683', spa: 'APT_FP_SPA_001168733' },
        'APT_FP_OBJ_009075352': { str: 'APT_FP_STR_047218263', spa: 'APT_FP_SPA_030335659' },
        'APT_FP_OBJ_010458794': { str: 'APT_FP_STR_036892827', spa: 'APT_FP_SPA_004998964' },
        'APT_FP_OBJ_011792381': { str: 'APT_FP_STR_041610658', spa: 'APT_FP_SPA_038204532' },
        'APT_FP_OBJ_016402051': { str: 'APT_FP_STR_033918198', spa: 'APT_FP_SPA_027688831' },
        'APT_FP_OBJ_020978354': { str: 'APT_FP_STR_030218405', spa: 'APT_FP_SPA_003254436' },
        'APT_FP_OBJ_028485799': { str: 'APT_FP_STR_033918198', spa: 'APT_FP_SPA_019298304' },
        'APT_FP_OBJ_029272188': { str: 'APT_FP_STR_030218405', spa: 'APT_FP_SPA_009340288' },
        'APT_FP_OBJ_029401189': { str: 'APT_FP_STR_041610658', spa: 'APT_FP_SPA_038204532' },
        'APT_FP_OBJ_030315116': { str: 'APT_FP_STR_030218405', spa: 'APT_FP_SPA_003254436' },
        'APT_FP_OBJ_030727367': { str: 'APT_FP_STR_030218405', spa: 'APT_FP_SPA_003254436' },
        'APT_FP_OBJ_031509211': { str: 'APT_FP_STR_044417683', spa: 'APT_FP_SPA_031053614' },
        'APT_FP_OBJ_035115868': { str: 'APT_FP_STR_041610658', spa: 'APT_FP_SPA_005790892' },
        'APT_FP_OBJ_042566692': { str: 'APT_FP_STR_036892827', spa: 'APT_FP_SPA_004998964' },
        'APT_FP_OBJ_043009329': { str: 'APT_FP_STR_036892827', spa: 'APT_FP_SPA_004799251' },
        'APT_FP_OBJ_044707175': { str: 'APT_FP_STR_044417683', spa: 'APT_FP_SPA_031053614' },
        'APT_FP_OBJ_045018673': { str: 'APT_FP_STR_006574532', spa: 'APT_FP_SPA_013556836' },
        'APT_FP_OBJ_048411654': { str: 'APT_FP_STR_036892827', spa: 'APT_FP_SPA_004998964' },
        'APT_FP_OBJ_052254652': { str: 'APT_FP_STR_030218405', spa: 'APT_FP_SPA_003254436' }
      };

      const pair = MAP_OBJ_TO_STR_SPA[selectedFile] || { str: 'APT_FP_STR_000477071', spa: 'APT_FP_SPA_004998964' };
      const selectedStrFile = pair.str;
      const selectedSpaFile = pair.spa;

      try {
        const objUrl = `/data/image-drawing/02.%EB%9D%BC%EB%B2%A8%EB%A7%81%EB%8D%B0%EC%9D%B4%ED%84%B0/OBJ/${selectedFile}.json`;
        const strUrl = `/data/image-drawing/02.%EB%9D%BC%EB%B2%A8%EB%A7%81%EB%8D%B0%EC%9D%B4%ED%84%B0/STR/${selectedStrFile}.json`;
        const spaUrl = `/data/image-drawing/02.%EB%9D%BC%EB%B2%A8%EB%A7%81%EB%8D%B0%EC%9D%B4%ED%84%B0/SPA/${selectedSpaFile}.json`;

        const [objRes, strRes, spaRes] = await Promise.all([fetch(objUrl), fetch(strUrl), fetch(spaUrl)]);
        if (!objRes.ok) throw new Error(`OBJ HTTP ${objRes.status}`);

        const [objJson, strJson, spaJson] = await Promise.all([
          objRes.json(),
          strRes.ok ? strRes.json() : null,
          spaRes.ok ? spaRes.json() : null
        ]);

        // 스케일 자동 보정: 욕조(1.4m) → 싱크대(0.6m) → 가스레인지(0.6m) 순 fallback
        let scaleMperPx = 0.00399;
        const tubAnn = objJson.annotations?.find(a => a.category_id === 7);
        if (tubAnn?.bbox) {
          // 욕조 실물 장변 = 1.4m (한국 APT 표준)
          const [,, bw, bh] = tubAnn.bbox;
          const longestPx = Math.max(bw, bh);
          if (longestPx > 0) scaleMperPx = 1.4 / longestPx;
        } else {
          // 욕조 없는 도면 (샤워부스형) → 싱크대 장변 0.6m 기준
          const kitAnn = objJson.annotations?.find(a => a.category_id === 6)
                      ?? objJson.annotations?.find(a => a.category_id === 8);
          if (kitAnn?.bbox) {
            const [,, bw, bh] = kitAnn.bbox;
            const longestPx = Math.max(bw, bh);
            if (longestPx > 0) scaleMperPx = 0.6 / longestPx;
          }
        }

        const parser  = new FloorPlanParser({ scaleMperPx, floorHeight: 2.8, maxElements: 150 });
        const parsedObj = parser.parseObjects(objJson, { floorY: 0 });
        const parsedStr = strJson ? parser.parse(strJson, { categoryFilter: [9, 10, 11], floorY: 0 }) : { walls: [], windows: [], doors: [], total: 0 };
        const parsedSpa = spaJson ? parser.parseSpaces(spaJson, { floorY: 0 }) : { spaces: [], total: 0 };

        // 모든 레이어 병합 (구조 + 내장가구 + 공간 색상마감)
        const merged = {
          ...parsedStr,
          objects: parsedObj.objects,
          spaces:  parsedSpa.spaces,
          total:   parsedStr.total + parsedObj.total + parsedSpa.total,
          fileName: selectedFile,
        };

        const summary = parser.summarize(merged);
        console.log('[FloorPlanParser OBJ] 통합 평면도 훈련 완료:', summary, `scale=${(scaleMperPx*1000).toFixed(2)}mm/px`);

        const assembly = parser.toAssembly(merged, {
          wallColor:   '#55555f',
          windowColor: '#00DDFF',
          doorColor:   '#FF6633',
          emissive:    '#00f0ff',
          floorY:      0,
        });
        assembly._trainingMeta = summary;
        assembly._datasetType  = 'OBJ';
        return assembly;
      } catch (err) {
        console.warn('[FloorPlanParser OBJ] 로드 실패:', err.message);
        return {
          geometryType: 'modular-assembly',
          title: `OBJ 훈련 폴백 (${selectedFile})`,
          assembly: [
            // 바닥 지글거림 해결: 슬래브 제외 완료
            { blockType: 'block-toilet',  customColor: '#e8e8f0', position: [-2, 0.2, 0], scale: [0.36, 0.4, 0.7] },
            { blockType: 'block-sink',    customColor: '#e8e8f0', position: [ 0, 0.43, 0], scale: [0.45, 0.85, 0.45] },
            { blockType: 'block-bathtub', customColor: '#e0e0ee', position: [ 2, 0.25, 0], scale: [1.4, 0.5, 0.7] },
            { blockType: 'block-kitchen', customColor: '#c0c0cc', position: [ 0, 0.43, 2], scale: [1.2, 0.85, 0.55] },
            { blockType: 'block-gas',     customColor: '#888890', position: [ 0, 0.43,-2], scale: [0.6, 0.85, 0.55] },
          ],
          customColor: '#55555f', emissiveColor: '#00f0ff',
          physicsScript: 'function animate(mesh, time) {}'
        };
      }
    }
    // D-0b. 평면도 훈련 키워드 (FloorPlanParser 연동)
    else if (normalized.includes('평면도 훈련') || normalized.includes('apt_fp_str') || normalized.includes('평면도') || normalized.includes('floor plan') || normalized.includes('floorplan') || normalized.includes('도면 훈련') || normalized.includes('도면훈련') || normalized.includes('구조 평면')) {
      // 훈련 데이터셋 목록 (순환 로드용)
      const TRAINING_FILES = [
        'APT_FP_STR_000477071',
        'APT_FP_STR_000608681',
        'APT_FP_STR_006574532',
        'APT_FP_STR_009278212',
        'APT_FP_STR_011460835',
        'APT_FP_STR_014442174',
        'APT_FP_STR_015141781',
        'APT_FP_STR_027300144',
        'APT_FP_STR_028450603',
        'APT_FP_STR_030218405',
        'APT_FP_STR_031691685',
        'APT_FP_STR_033918198',
        'APT_FP_STR_036892827',
        'APT_FP_STR_041610658',
        'APT_FP_STR_043989218',
        'APT_FP_STR_044417683',
        'APT_FP_STR_044477111',
        'APT_FP_STR_047218263',
        'APT_FP_STR_047223161',
        'APT_FP_STR_047765291',
      ];

      // 프롬프트에서 파일명 추출 또는 순환 선택
      let selectedFile = null;
      let selectedObjFile = null;
      let fileIdx = 0;

      for (let i = 0; i < TRAINING_FILES.length; i++) {
        const f = TRAINING_FILES[i];
        if (normalized.includes(f.toLowerCase())) {
          selectedFile = f;
          fileIdx = i;
          break;
        }
      }
      if (!selectedFile) {
        fileIdx = Math.floor(Date.now() / 30000) % TRAINING_FILES.length;
        selectedFile = TRAINING_FILES[fileIdx];
      }

      // OBJ 파일 목록 & 페어링
      const OBJ_FILES = [
        'APT_FP_OBJ_000425766',
        'APT_FP_OBJ_007187965',
        'APT_FP_OBJ_009075352',
        'APT_FP_OBJ_010458794',
        'APT_FP_OBJ_011792381',
        'APT_FP_OBJ_016402051',
        'APT_FP_OBJ_020978354',
        'APT_FP_OBJ_028485799',
        'APT_FP_OBJ_029272188',
        'APT_FP_OBJ_029401189',
        'APT_FP_OBJ_030315116',
        'APT_FP_OBJ_030727367',
        'APT_FP_OBJ_031509211',
        'APT_FP_OBJ_035115868',
        'APT_FP_OBJ_042566692',
        'APT_FP_OBJ_043009329',
        'APT_FP_OBJ_044707175',
        'APT_FP_OBJ_045018673',
        'APT_FP_OBJ_048411654',
        'APT_FP_OBJ_052254652',
      ];
      for (const objF of OBJ_FILES) {
        if (normalized.includes(objF.toLowerCase())) {
          selectedObjFile = objF;
          break;
        }
      }
      if (!selectedObjFile) {
        selectedObjFile = OBJ_FILES[fileIdx % OBJ_FILES.length];
      }

      // 페어링할 STR to OBJ/SPA 맵 (가구, 벽체, 바닥 완벽 매핑 좌표 정합)
      const MAP_STR_TO_OBJ_SPA = {
        'APT_FP_STR_000477071': { obj: 'APT_FP_OBJ_000425766', spa: 'APT_FP_SPA_000310275' },
        'APT_FP_STR_000608681': { obj: 'APT_FP_OBJ_000425766', spa: 'APT_FP_SPA_000310275' },
        'APT_FP_STR_006574532': { obj: 'APT_FP_OBJ_000425766', spa: 'APT_FP_SPA_000310275' },
        'APT_FP_STR_009278212': { obj: 'APT_FP_OBJ_000425766', spa: 'APT_FP_SPA_000310275' },
        'APT_FP_STR_011460835': { obj: 'APT_FP_OBJ_035115868', spa: 'APT_FP_SPA_005790892' },
        'APT_FP_STR_014442174': { obj: 'APT_FP_OBJ_000425766', spa: 'APT_FP_SPA_000310275' },
        'APT_FP_STR_015141781': { obj: 'APT_FP_OBJ_020978354', spa: 'APT_FP_SPA_007562895' },
        'APT_FP_STR_027300144': { obj: 'APT_FP_OBJ_000425766', spa: 'APT_FP_SPA_000310275' },
        'APT_FP_STR_028450603': { obj: 'APT_FP_OBJ_000425766', spa: 'APT_FP_SPA_000310275' },
        'APT_FP_STR_030218405': { obj: 'APT_FP_OBJ_035115868', spa: 'APT_FP_SPA_005790892' },
        'APT_FP_STR_031691685': { obj: 'APT_FP_OBJ_000425766', spa: 'APT_FP_SPA_000310275' },
        'APT_FP_STR_033918198': { obj: 'APT_FP_OBJ_000425766', spa: 'APT_FP_SPA_000310275' },
        'APT_FP_STR_036892827': { obj: 'APT_FP_OBJ_020978354', spa: 'APT_FP_SPA_007562895' },
        'APT_FP_STR_041610658': { obj: 'APT_FP_OBJ_035115868', spa: 'APT_FP_SPA_005790892' },
        'APT_FP_STR_043989218': { obj: 'APT_FP_OBJ_000425766', spa: 'APT_FP_SPA_000310275' },
        'APT_FP_STR_044417683': { obj: 'APT_FP_OBJ_020978354', spa: 'APT_FP_SPA_007562895' },
        'APT_FP_STR_044477111': { obj: 'APT_FP_OBJ_020978354', spa: 'APT_FP_SPA_007562895' },
        'APT_FP_STR_047218263': { obj: 'APT_FP_OBJ_000425766', spa: 'APT_FP_SPA_000310275' },
        'APT_FP_STR_047223161': { obj: 'APT_FP_OBJ_000425766', spa: 'APT_FP_SPA_000310275' },
        'APT_FP_STR_047765291': { obj: 'APT_FP_OBJ_000425766', spa: 'APT_FP_SPA_000310275' }
      };
      const pair = MAP_STR_TO_OBJ_SPA[selectedFile] || { obj: 'APT_FP_OBJ_000425766', spa: 'APT_FP_SPA_000310275' };
      selectedObjFile = pair.obj;
      let selectedSpaFile = pair.spa;

      // 다층 구조 아파트 지원 (예: "7층", "7-story", "5층 아파트")
      let floorCount = 1;
      const floorMatch = normalized.match(/(\d+)\s*(층|story|level|floor|fl)/i);
      if (floorMatch) {
        floorCount = parseInt(floorMatch[1], 10);
      }

      // JSON 라벨 비동기 병렬 로드 (STR + OBJ + SPA 동시 로드)
      try {
        const strUrl = `/data/image-drawing/02.%EB%9D%BC%EB%B2%A8%EB%A7%81%EB%8D%B0%EC%9D%B4%ED%84%B0/STR/${selectedFile}.json`;
        const objUrl = `/data/image-drawing/02.%EB%9D%BC%EB%B2%A8%EB%A7%81%EB%8D%B0%EC%9D%B4%ED%84%B0/OBJ/${selectedObjFile}.json`;
        const spaUrl = `/data/image-drawing/02.%EB%9D%BC%EB%B2%A8%EB%A7%81%EB%8D%B0%EC%9D%B4%ED%84%B0/SPA/${selectedSpaFile}.json`;

        const [strRes, objRes, spaRes] = await Promise.all([fetch(strUrl), fetch(objUrl), fetch(spaUrl)]);
        if (!strRes.ok) throw new Error(`STR HTTP ${strRes.status} / OBJ HTTP ${objRes.status} / SPA HTTP ${spaRes.status}`);

        const [strJson, objJson, spaJson] = await Promise.all([strRes.json(), objRes.json(), spaRes.json()]);

        const parser = new FloorPlanParser({ scaleMperPx: 0.00399, floorHeight: 2.8, maxElements: 150 });
        let mergedAssembly = [];
        let summaryList = [];

        for (let i = 0; i < floorCount; i++) {
          const floorY = i * 2.8;
          // 구조(STR), 내장(OBJ), 공간(SPA) 각각 파싱
          const parsedStr = parser.parse(strJson,       { categoryFilter: [9, 10, 11], floorY });
          const parsedObj = parser.parseObjects(objJson, { floorY });
          const parsedSpa = parser.parseSpaces(spaJson,   { floorY });

          // 모든 요소 병합 (바닥 마감 컬러맵 반영)
          const merged = {
            ...parsedStr,
            objects: parsedObj.objects,
            spaces:  parsedSpa.spaces,
            total:   parsedStr.total + parsedObj.total + parsedSpa.total,
          };

          const palette = {
            wallColor:   '#55555f',
            windowColor: '#00DDFF',
            doorColor:   '#FF6633',
            emissive:    '#00f0ff',
            floorY:      floorY,
          };
          const floorAssembly = parser.toAssembly(merged, palette);

          for (const item of floorAssembly.assembly) {
            // 바닥/지붕 슬라브 중복 렌더링 방지: 최하층만 바닥 슬라브 생성, 그외는 지붕 슬라브로 상부 마감
            if (item.blockType === 'block-slab' && item.label.includes('바닥') && i > 0) continue;
            // 최상층이 아니면 지붕 슬라브 제외하여 드로우콜 최적화
            if (item.blockType === 'block-slab' && item.label.includes('지붕') && i < floorCount - 1) continue;

            item.label = `${i + 1}층 ${item.label}`;
            mergedAssembly.push(item);
          }
          summaryList.push(parser.summarize(merged));
        }

        const finalAssembly = {
          geometryType: 'modular-assembly',
          title: `${floorCount}층 아파트: 구조 ${selectedFile} + 가구 ${selectedObjFile} (적층 완료)`,
          assembly: mergedAssembly,
          customColor: '#55555f',
          emissiveColor: '#00f0ff',
          physicsScript: `function animate(mesh, time) {
            mesh.traverse(c => {
              if (c.name === 'window-glass' && c.material) {
                c.material.emissiveIntensity = 0.6 + Math.sin(time * 0.003) * 0.3;
              }
            });
          }`,
          _trainingMeta: {
            strFile: selectedFile,
            objFile: selectedObjFile,
            층수: floorCount,
            단층요약: summaryList[0],
            총블록수: mergedAssembly.length
          }
        };

        console.log(`[FloorPlanParser] ${floorCount}층 통합 아파트 훈련 완료:`, finalAssembly._trainingMeta);
        return finalAssembly;
      } catch (err) {
        console.warn('[FloorPlanParser] 통합 JSON 로드 실패, 폴백 사용:', err.message);
        // 폴백: 기본 구조 + 내장 가구 혼합 아파트 (다층 대응)
        const fallbackAssembly = [];
        for (let i = 0; i < floorCount; i++) {
          const floorY = i * 2.8;
          // 구조 부재
          fallbackAssembly.push(
            // 구조 부재 (기둥/바닥 제거 규정 준수)
            { blockType: 'block-wall',   customColor: '#55555f', position: [0, floorY + 1.4, -7.4], scale: [18, 2.8, 0.2] },
            { blockType: 'block-wall',   customColor: '#55555f', position: [0, floorY + 1.4,  7.4], scale: [18, 2.8, 0.2] },
            { blockType: 'block-wall',   customColor: '#55555f', position: [-9.4, floorY + 1.4, 0], scale: [0.2, 2.8, 15] },
            { blockType: 'block-wall',   customColor: '#55555f', position: [ 9.4, floorY + 1.4, 0], scale: [0.2, 2.8, 15] },
          );
          // 내장 가구
          fallbackAssembly.push(
            { blockType: 'block-toilet',  customColor: '#e8e8f0', position: [-2, floorY + 0.2, 0], scale: [0.36, 0.4, 0.7] },
            { blockType: 'block-sink',    customColor: '#e8e8f0', position: [ 0, floorY + 0.43, 0], scale: [0.45, 0.85, 0.45] },
            { blockType: 'block-bathtub', customColor: '#e0e0ee', position: [ 2, floorY + 0.25, 0], scale: [1.4, 0.5, 0.7] },
            { blockType: 'block-kitchen', customColor: '#c0c0cc', position: [ 0, floorY + 0.43, 2], scale: [1.2, 0.85, 0.55] },
            { blockType: 'block-gas',     customColor: '#888890', position: [ 0, floorY + 0.43,-2], scale: [0.6, 0.85, 0.55] },
          );
        }
        return {
          geometryType: 'modular-assembly',
          title: `${floorCount}층 통합 아파트 훈련 폴백 (${selectedFile})`,
          assembly: fallbackAssembly,
          customColor: '#55555f', emissiveColor: '#00f0ff',
          physicsScript: 'function animate(mesh, time) {}'
        };
      }
    }

    // D-0b. 방/공간 키워드 (IfcSpace)
    else if (normalized.includes('방') || normalized.includes('room') || normalized.includes('벽') || normalized.includes('wall') || normalized.includes('공간') || normalized.includes('space') || normalized.includes('문')) {
      return {
        geometryType: 'IfcSpace',
        predefinedType: 'ROOM',
        title: '네온 룸',
        dimensions: { width: 6, depth: 6, wallHeight: 3, wallThickness: 0.2, doorWidth: 1.0, doorHeight: 2.1 },
        neonStyle: 'pulse',
        customColor: '#2a2a35',
        emissiveColor: '#00F0FF',
        physicsScript: `function animate(mesh, time) {
          mesh.traverse(c => {
            if (c.name && c.name.startsWith('neon-')) {
              c.material.emissiveIntensity = 1.2 + Math.sin(time * 0.003 + c.name.charCodeAt(5) * 0.5) * 0.5;
            }
            if (c.name === 'door-panel') {
              c.material.emissiveIntensity = 0.3 + Math.abs(Math.sin(time * 0.002)) * 0.4;
            }
          });
        }`
      };
    }
    // D. 미래 에너지/우주 설비 및 Fallback
    else {
      let facilityType = 'POWER_STATION';
      let emColor = '#B57EDC';
      let script = `function animate(mesh, time) {
        const coil = mesh.getObjectByName('energy-coil');
        if(coil) {
          coil.position.y = 12.0 + Math.sin(time * 0.004) * 0.15;
          coil.rotation.z = time * 0.001;
        }
      }`;

      if (normalized.includes('돔') || normalized.includes('바이오') || normalized.includes('greenhouse') || normalized.includes('biosphere')) {
        facilityType = 'BIOSPHERE';
        emColor = '#00FF99';
        script = `function animate(mesh, time) {
          const nodes = [];
          mesh.traverse(c => { if(c.name === 'dome-node') nodes.push(c); });
          nodes.forEach((n, idx) => {
            n.material.emissiveIntensity = 0.6 + Math.sin(time * 0.006 + idx * 0.4) * 0.4;
          });
        }`;
      } else if (normalized.includes('포트') || normalized.includes('우주') || normalized.includes('port') || normalized.includes('가속기')) {
        facilityType = 'SPACE_PORT';
        emColor = '#00FFFF';
        script = `function animate(mesh, time) {
          const core = mesh.getObjectByName('energy-core');
          if(core) {
            core.position.y = 2.0 + Math.sin(time * 0.005) * 0.3;
            core.scale.setScalar(1.0 + Math.sin(time * 0.01) * 0.08);
          }
          const ring = mesh.getObjectByName('float-ring');
          if(ring) {
            ring.rotation.z = time * 0.002;
            ring.position.y = 2.0 + Math.cos(time * 0.005) * 0.2;
          }
        }`;
      }

      return {
        geometryType: 'IfcFacility',
        predefinedType: facilityType,
        dimensions: {
          height: 12,
          radius: 5,
          modules: 4
        },
        neonStyle: 'plasma',
        customColor: '#2b2b35',
        emissiveColor: emColor,
        physicsScript: script
      };
    }
  }
}
