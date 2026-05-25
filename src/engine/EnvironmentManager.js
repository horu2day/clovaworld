import * as THREE from 'three';
import { ProceduralGenerator } from '../ai/ProceduralGenerator.js';
import { SpatialStreamingManager } from './SpatialStreamingManager.js';

export class EnvironmentManager {
  constructor(rendererInstance) {
    this.renderer = rendererInstance;
    this.generator = new ProceduralGenerator(rendererInstance);
    this.streamingManager = null;
  }

  // 지정한 테마 환경으로 전환하는 진입 메서드
  build(envType) {
    if (this.streamingManager) {
      this.streamingManager.clear();
      this.streamingManager = null;
    }
    this.renderer.clearWorld();
    const group = this.renderer.worldGroup;
    const interactives = this.renderer.interactiveObjects;

    switch (envType) {
      case 'urban':
        this.buildUrban(group, interactives);
        break;
      case 'indoor':
        this.buildIndoor(group, interactives);
        break;
      case 'rural':
        this.buildRural(group, interactives);
        break;
      default:
        console.warn(`Unknown environment type: ${envType}. Defaulting to urban.`);
        this.buildUrban(group, interactives);
    }
  }

  // [도시 메트로폴리스 환경] 구축 — 빈 그라운드만, City Agent가 채운다
  buildUrban(worldGroup, interactiveObjects) {
    // 스트리밍 매니저 기동
    this.streamingManager = new SpatialStreamingManager(this.renderer);

    // 바닥 플레인 (단일 평면, 2000×2000m)
    const groundGeo = new THREE.PlaneGeometry(2000, 2000);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0a0b0d,
      roughness: 0.92,
      metalness: 0.08
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    ground.name = 'ground-plane';
    ground.userData = {
      interactive: false,
      type: 'IfcGeotechnicalElement',
      name: 'City Agent Ground — Empty Canvas',
      state: 'ready'
    };
    worldGroup.add(ground);
  }


  // [실내 인테리어 아늑한 방] 구축: 공간 규모 유지
  buildIndoor(worldGroup, interactiveObjects) {
    const groundGeo = new THREE.PlaneGeometry(12, 12);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x221a24, roughness: 0.95 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    worldGroup.add(ground);

    const wallMat = new THREE.MeshStandardMaterial({ color: 0x12121b, roughness: 0.6 });

    const wallLeft = new THREE.Mesh(new THREE.PlaneGeometry(12, 5), wallMat);
    wallLeft.position.set(-6, 2.5, 0);
    wallLeft.rotation.y = Math.PI / 2;
    wallLeft.receiveShadow = true;
    worldGroup.add(wallLeft);

    const wallBack = new THREE.Mesh(new THREE.PlaneGeometry(12, 5), wallMat);
    wallBack.position.set(0, 2.5, -6);
    wallBack.receiveShadow = true;
    worldGroup.add(wallBack);

    const ws = this.generator.createBlockWorkstation('#00F0FF');
    ws.position.set(0, 0, -4);
    worldGroup.add(ws);
    
    ws.name = "workstation-desk";
    ws.userData = { interactive: true, type: 'computer', name: "코어 워크스테이션", state: "켜짐", isOn: true };
    interactiveObjects.push(ws);

    const cupGeo = new THREE.CylinderGeometry(0.12, 0.09, 0.35, 12);
    const cupMat = new THREE.MeshStandardMaterial({ color: 0xff3366, roughness: 0.3 });
    const cup = new THREE.Mesh(cupGeo, cupMat);
    cup.position.set(0.8, 0.85, -4);
    cup.castShadow = true;
    cup.name = "ceramics-cup";
    cup.userData = { interactive: true, type: 'cup', name: "반중력 세라믹 컵", state: "테이블에 놓임", isFloating: false };
    worldGroup.add(cup);
    interactiveObjects.push(cup);

    const gate = this.generator.createBlockGate('#555560');
    gate.position.set(3.5, 0, -5.9);
    worldGroup.add(gate);

    const doorHinged = gate.getObjectByName('interactive-door');
    if (doorHinged) {
      doorHinged.userData = { interactive: true, type: 'door', name: "위상 힌지 게이트", state: "닫힘", isOpen: false };
      interactiveObjects.push(doorHinged);
    }
  }

  // [시골 농촌 들판 환경] 구축: 드넓은 언덕 들판(160x160)과 원거리 산맥 정위
  buildRural(worldGroup, interactiveObjects) {
    // 1. 바닥 (완만한 대형 구릉 지형) - 300m 확장
    const groundGeo = new THREE.PlaneGeometry(300, 300, 48, 48);
    const pos = groundGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const z = Math.sin(vx * 0.04) * Math.cos(vy * 0.04) * 2.5; // 넓은 면적에 맞춘 사인파 노이즈 완화
      pos.setZ(i, z);
    }
    groundGeo.computeVertexNormals();

    const groundMat = new THREE.MeshStandardMaterial({ color: 0x142510, roughness: 0.95 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    worldGroup.add(ground);

    // 2. 평화로운 작은 호수
    const lakeGeo = new THREE.CircleGeometry(15, 32);
    const lakeMat = new THREE.MeshStandardMaterial({ color: 0x102b4d, roughness: 0.15, metalness: 0.85 });
    const lake = new THREE.Mesh(lakeGeo, lakeMat);
    lake.rotation.x = -Math.PI / 2;
    lake.position.set(-30, 0.1, -20);
    worldGroup.add(lake);

    // 3. 뒷배경 먼 산맥
    const mountainMat = new THREE.MeshStandardMaterial({ color: 0x0a160c, roughness: 0.95 });
    const mountain1 = new THREE.Mesh(new THREE.ConeGeometry(30, 40, 6), mountainMat);
    mountain1.position.set(-80, 19.8, -80);
    worldGroup.add(mountain1);

    const mountain2 = mountain1.clone();
    mountain2.scale.set(1.4, 1.4, 1.4);
    mountain2.position.set(80, 27.8, -90);
    worldGroup.add(mountain2);

    // 4. 파라메트릭 미래 친환경 바이오돔 (IfcFacility - BIOSPHERE)
    const biosphere = this.generator.createParametricFacility(
      'BIOSPHERE',
      { height: 10, radius: 8, modules: 8 },
      '#154a2a',
      'pulse',
      '#00FF99'
    );
    biosphere.position.set(25, 0.2, 15);
    biosphere.name = "biosphere-dome";
    biosphere.userData = { interactive: true, type: 'greenhouse', name: "친환경 바이오돔", state: "안전 가동 중" };

    // 5. 시골 농촌의 정자 (Pavilion)
    const pavGroup = new THREE.Group();
    pavGroup.position.set(-20, 0.2, 25);

    const pLegGeo = new THREE.CylinderGeometry(0.1, 0.1, 2.0);
    const pLegMat = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.8 });

    const px = [-1.2, 1.2, -1.2, 1.2];
    const pz = [-1.2, -1.2, 1.2, 1.2];
    for (let i = 0; i < 4; i++) {
      const leg = new THREE.Mesh(pLegGeo, pLegMat);
      leg.position.set(px[i], 1.0, pz[i]);
      leg.castShadow = true;
      pavGroup.add(leg);
    }

    const roofGeo = new THREE.ConeGeometry(2.0, 1.2, 4);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x243328, roughness: 0.75 });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.set(0, 2.6, 0);
    roof.rotation.y = Math.PI / 4;
    roof.name = "roof";
    roof.castShadow = true;
    pavGroup.add(roof);

    pavGroup.name = "traditional-pavilion";
    pavGroup.userData = { interactive: true, type: 'pavilion', name: "전통 대야 정자", state: "대기 상태" };
    worldGroup.add(pavGroup);
    interactiveObjects.push(pavGroup);
  }
}
