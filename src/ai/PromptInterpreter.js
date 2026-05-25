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
