import * as THREE from 'three';

export class ProceduralGenerator {
  constructor(rendererInstance) {
    this.renderer = rendererInstance;
  }

  // 3D 가상 사물 절차적 생성 메인 진입점
  generate(schema, title) {
    const group = this.renderer.worldGroup;
    const interactives = this.renderer.interactiveObjects;

    let createdMesh;
    const type = schema.geometryType;

    // A. 파라메트릭 인프라 BIM 모델 생성 (IfcBridge, IfcRoad, IfcTunnel, IfcFacility)
    if (type === 'IfcBridge') {
      createdMesh = this.createParametricBridge(
        schema.predefinedType || 'GIRDER',
        schema.dimensions || {},
        schema.customColor || '#7d7d93',
        schema.neonStyle || 'pulse',
        schema.emissiveColor || '#00F0FF'
      );
      createdMesh.name = `bridge-${Date.now().toString().substring(8)}`;
    }
    else if (type === 'IfcRoad') {
      createdMesh = this.createParametricRoad(
        schema.predefinedType || 'CARRIAGEWAY',
        schema.dimensions || {},
        schema.customColor || '#33333d',
        schema.neonStyle || 'flow',
        schema.emissiveColor || '#ffaa00'
      );
      createdMesh.name = `road-${Date.now().toString().substring(8)}`;
    }
    else if (type === 'IfcTunnel') {
      createdMesh = this.createParametricTunnel(
        schema.predefinedType || 'SEGMENTAL',
        schema.dimensions || {},
        schema.customColor || '#44444a',
        schema.neonStyle || 'cyber',
        schema.emissiveColor || '#00FF99'
      );
      createdMesh.name = `tunnel-${Date.now().toString().substring(8)}`;
    }
    else if (type === 'IfcFacility') {
      createdMesh = this.createParametricFacility(
        schema.predefinedType || 'POWER_STATION',
        schema.dimensions || {},
        schema.customColor || '#2a2a35',
        schema.neonStyle || 'plasma',
        schema.emissiveColor || '#B57EDC'
      );
      createdMesh.name = `facility-${Date.now().toString().substring(8)}`;
    }
    else if (type === 'IfcRailway') {
      createdMesh = this.createParametricRailway(
        schema.predefinedType || 'TRACK',
        schema.dimensions || {},
        schema.customColor || '#444450',
        schema.neonStyle || 'flow',
        schema.emissiveColor || '#00FFCC'
      );
      createdMesh.name = `railway-${Date.now().toString().substring(8)}`;
    }
    else if (type === 'IfcMarineFacility') {
      createdMesh = this.createParametricMarineFacility(
        schema.predefinedType || 'PORT',
        schema.dimensions || {},
        schema.customColor || '#2a2a32',
        schema.neonStyle || 'pulse',
        schema.emissiveColor || '#00FFFF'
      );
      createdMesh.name = `marine-${Date.now().toString().substring(8)}`;
    }
    else if (type === 'IfcRoadPart') {
      createdMesh = this.createParametricRoadPart(
        schema.predefinedType || 'TOLL_GATE',
        schema.dimensions || {},
        schema.customColor || '#33333f',
        schema.neonStyle || 'pulse',
        schema.emissiveColor || '#FF3300'
      );
      createdMesh.name = `roadpart-${Date.now().toString().substring(8)}`;
    }
    else if (type === 'IfcGeotechnicalElement') {
      createdMesh = this.createParametricTerrain(
        schema.predefinedType || 'TIN',
        schema.dimensions || {},
        schema.customColor || '#4a5a38',
        schema.neonStyle || 'wireframe',
        schema.emissiveColor || '#88FF44'
      );
      createdMesh.name = `terrain-${Date.now().toString().substring(8)}`;
    }
    else if (type === 'IfcSignal') {
      createdMesh = this.createParametricSignal(
        schema.predefinedType || 'RAILWAY',
        schema.dimensions || {},
        schema.customColor || '#222230',
        schema.neonStyle || 'blink',
        schema.emissiveColor || '#FF3300'
      );
      createdMesh.name = `signal-${Date.now().toString().substring(8)}`;
    }
    else if (type === 'IfcDistributionElement') {
      createdMesh = this.createParametricEnergyMast(
        schema.predefinedType || 'ENERGY_MAST',
        schema.dimensions || {},
        schema.customColor || '#3a3a4a',
        schema.neonStyle || 'corona',
        schema.emissiveColor || '#FFD700'
      );
      createdMesh.name = `energymast-${Date.now().toString().substring(8)}`;
    }
    else if (type === 'IfcConstructionEquipment') {
      createdMesh = this.createParametricConstructionEquipment(
        schema.predefinedType || 'EXCAVATOR',
        schema.dimensions || {},
        schema.customColor || '#e6a100',
        schema.neonStyle || 'work',
        schema.emissiveColor || '#FFCC00'
      );
      createdMesh.name = `equipment-${Date.now().toString().substring(8)}`;
    }
    else if (type === 'IfcSpace') {
      createdMesh = this.createParametricRoom(
        schema.predefinedType || 'ROOM',
        schema.dimensions || {},
        schema.customColor || '#2a2a35',
        schema.neonStyle || 'pulse',
        schema.emissiveColor || '#00F0FF'
      );
      createdMesh.name = `room-${Date.now().toString().substring(8)}`;
    }
    else if (type === 'IfcWall') {
      createdMesh = this.createParametricWall(
        schema.predefinedType || 'SOLIDWALL',
        schema.dimensions || {},
        schema.customColor || '#8c8c96',
        schema.neonStyle || 'pulse',
        schema.emissiveColor || '#00FF99'
      );
      createdMesh.name = `wall-${Date.now().toString().substring(8)}`;
    }
    else if (type === 'IfcColumn') {
      createdMesh = this.createParametricColumn(
        schema.predefinedType || 'COLUMN',
        schema.dimensions || {},
        schema.customColor || '#7a7a85',
        schema.neonStyle || 'pulse',
        schema.emissiveColor || '#00FFFF'
      );
      createdMesh.name = `column-${Date.now().toString().substring(8)}`;
    }
    else if (type === 'IfcSlab') {
      createdMesh = this.createParametricSlab(
        schema.predefinedType || 'FLOOR',
        schema.dimensions || {},
        schema.customColor || '#3e3e48',
        schema.neonStyle || 'flow',
        schema.emissiveColor || '#FF33AA'
      );
      createdMesh.name = `slab-${Date.now().toString().substring(8)}`;
    }
    else if (type === 'IfcRoof') {
      createdMesh = this.createParametricRoof(
        schema.predefinedType || 'ROOF',
        schema.dimensions || {},
        schema.customColor || '#6c4c8c',
        schema.neonStyle || 'pulse',
        schema.emissiveColor || '#FFAA00'
      );
      createdMesh.name = `roof-${Date.now().toString().substring(8)}`;
    }
    else if (type === 'IfcFooting') {
      createdMesh = this.createParametricFooting(
        schema.predefinedType || 'STRIP_FOOTING',
        schema.dimensions || {},
        schema.customColor || '#55555c',
        schema.neonStyle || 'pulse',
        schema.emissiveColor || '#00F0FF'
      );
      createdMesh.name = `footing-${Date.now().toString().substring(8)}`;
    }
    else if (type === 'IfcBeam') {
      createdMesh = this.createParametricBeam(
        schema.predefinedType || 'GIRDER',
        schema.dimensions || {},
        schema.customColor || '#8c8c96',
        schema.neonStyle || 'pulse',
        schema.emissiveColor || '#00FF99'
      );
      createdMesh.name = `beam-${Date.now().toString().substring(8)}`;
    }
    else if (type === 'IfcDiscreteAccessory') {
      createdMesh = this.createParametricDiscreteAccessory(
        schema.predefinedType || 'SHOE',
        schema.dimensions || {},
        schema.customColor || '#aaaaaf',
        schema.neonStyle || 'pulse',
        schema.emissiveColor || '#00FFFF'
      );
      createdMesh.name = `accessory-${Date.now().toString().substring(8)}`;
    }
    else if (type === 'IfcBuildingElementProxy') {
      createdMesh = this.createParametricBuildingElementProxy(
        schema.predefinedType || 'USERDEFINED',
        schema.dimensions || {},
        schema.customColor || '#ffffff',
        schema.neonStyle || 'pulse',
        schema.emissiveColor || '#ffffff'
      );
      createdMesh.name = `proxy-${Date.now().toString().substring(8)}`;
    }

    else if (type === 'modular-assembly' || schema.assembly) {
      const assemblyGroup = new THREE.Group();
      assemblyGroup.name = `assembly-${Date.now().toString().substring(8)}`;
      
      const assemblyItems = schema.assembly || [];
      
      assemblyItems.forEach(item => {
        let blockMesh;
        const colorHex = item.customColor || '#7d7d93';

        switch (item.blockType) {
          case 'block-pillar':
            blockMesh = this.createBlockPillar(colorHex);
            break;
          case 'block-window':
            blockMesh = this.createBlockWindow(colorHex);
            break;
          case 'block-window-circle': {
            const circleGroup = new THREE.Group();
            const frame = new THREE.Mesh(
              new THREE.TorusGeometry(0.8, 0.08, 12, 32),
              new THREE.MeshStandardMaterial({ color: 0x22222b, roughness: 0.5 })
            );
            frame.position.y = 0.8;
            const glass = new THREE.Mesh(
              new THREE.CylinderGeometry(0.76, 0.76, 0.04, 32),
              new THREE.MeshStandardMaterial({ color: colorHex, emissive: colorHex, emissiveIntensity: 1.0, transparent: true, opacity: 0.4 })
            );
            glass.rotation.x = Math.PI / 2;
            glass.position.set(0, 0.8, 0);
            glass.name = 'window-glass';
            circleGroup.add(frame, glass);
            blockMesh = circleGroup;
            break;
          }
          case 'block-window-tall': {
            const tallGroup = new THREE.Group();
            const frame = new THREE.Mesh(
              new THREE.BoxGeometry(0.4, 2.2, 0.12),
              new THREE.MeshStandardMaterial({ color: 0x22222b })
            );
            frame.position.y = 1.1;
            const glass = new THREE.Mesh(
              new THREE.BoxGeometry(0.24, 2.0, 0.04),
              new THREE.MeshStandardMaterial({ color: colorHex, emissive: colorHex, emissiveIntensity: 1.5 })
            );
            glass.position.set(0, 1.1, 0.05);
            glass.name = 'window-glass';
            tallGroup.add(frame, glass);
            blockMesh = tallGroup;
            break;
          }
          case 'block-bench':
            blockMesh = this.createBlockBench(colorHex);
            break;
          case 'block-workstation':
            blockMesh = this.createBlockWorkstation(colorHex);
            break;
          case 'block-gate':
            blockMesh = this.createBlockGate(colorHex);
            break;
          case 'block-door-wood':
            blockMesh = this.createBlockDoorWood(colorHex);
            break;
          case 'block-door-steel':
            blockMesh = this.createBlockDoorSteel(colorHex);
            break;
          case 'block-door-glass':
            blockMesh = this.createBlockDoorGlass(colorHex);
            break;
          case 'block-gate-slide': {
            const slideGroup = new THREE.Group();
            const frame = new THREE.Mesh(
              new THREE.BoxGeometry(1.8, 2.2, 0.16),
              new THREE.MeshStandardMaterial({ color: 0x22222b })
            );
            frame.position.y = 1.1;
            const doorL = new THREE.Mesh(
              new THREE.BoxGeometry(0.76, 2.0, 0.06),
              new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.2, metalness: 0.8 })
            );
            doorL.position.set(-0.4, 1.1, 0);
            doorL.name = 'slide-door-l';
            const doorR = doorL.clone();
            doorR.position.x = 0.4;
            doorR.name = 'slide-door-r';
            slideGroup.add(frame, doorL, doorR);
            blockMesh = slideGroup;
            break;
          }
          case 'block-gate-hatch': {
            const hatchGroup = new THREE.Group();
            const frame = new THREE.Mesh(
              new THREE.TorusGeometry(1.0, 0.1, 12, 32),
              new THREE.MeshStandardMaterial({ color: 0x55555f, metalness: 0.8 })
            );
            frame.position.y = 1.0;
            const door = new THREE.Mesh(
              new THREE.CylinderGeometry(0.9, 0.9, 0.08, 32),
              new THREE.MeshStandardMaterial({ color: 0x222225, roughness: 0.3 })
            );
            door.rotation.x = Math.PI / 2;
            door.position.set(0, 1.0, 0);
            const core = new THREE.Mesh(
              new THREE.SphereGeometry(0.25, 16, 16),
              new THREE.MeshStandardMaterial({ color: colorHex, emissive: colorHex, emissiveIntensity: 2.0 })
            );
            core.position.set(0, 1.0, 0.05);
            core.name = 'gate-core';
            hatchGroup.add(frame, door, core);
            blockMesh = hatchGroup;
            break;
          }
          case 'block-slab':
            blockMesh = new THREE.Mesh(
              new THREE.BoxGeometry(1.0, 1.0, 1.0),
              new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.8, metalness: 0.1 })
            );
            break;
          case 'block-wall':
            blockMesh = new THREE.Mesh(
              new THREE.BoxGeometry(1.0, 1.0, 1.0),
              new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.7, metalness: 0.2 })
            );
            break;
          case 'block-roof':
            // Triangular prism roof geometry (1m wide, 0.5m high, 1m deep)
            const roofGeom = new THREE.BufferGeometry();
            const rv = new Float32Array([
              -0.5, 0, 0.5,    0.5, 0, 0.5,     0, 0.5, 0.5,
              -0.5, 0, -0.5,   0, 0.5, -0.5,   0.5, 0, -0.5,
              -0.5, 0, -0.5,  -0.5, 0, 0.5,     0, 0.5, 0.5,
              -0.5, 0, -0.5,   0, 0.5, 0.5,     0, 0.5, -0.5,
               0.5, 0, 0.5,    0.5, 0, -0.5,    0, 0.5, -0.5,
               0.5, 0, 0.5,    0, 0.5, -0.5,    0, 0.5, 0.5
            ]);
            roofGeom.setAttribute('position', new THREE.BufferAttribute(rv, 3));
            roofGeom.computeVertexNormals();
            blockMesh = new THREE.Mesh(
              roofGeom,
              new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.6, metalness: 0.3, side: THREE.DoubleSide })
            );
            break;
          case 'block-roof-dome': {
            const domeGroup = new THREE.Group();
            const domeGeo = new THREE.SphereGeometry(0.5, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2);
            const frame = new THREE.Mesh(
              domeGeo,
              new THREE.MeshBasicMaterial({ color: 0x22222b, wireframe: true })
            );
            const skin = new THREE.Mesh(
              domeGeo,
              new THREE.MeshStandardMaterial({ color: colorHex, emissive: colorHex, emissiveIntensity: 0.4, transparent: true, opacity: 0.5, side: THREE.DoubleSide })
            );
            domeGroup.add(frame, skin);
            blockMesh = domeGroup;
            break;
          }
          case 'block-roof-pyramid': {
            const pyrGroup = new THREE.Group();
            const pyrGeo = new THREE.ConeGeometry(0.707, 0.5, 4);
            pyrGeo.translate(0, 0.25, 0);
            const body = new THREE.Mesh(
              pyrGeo,
              new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.5, metalness: 0.3 })
            );
            body.rotation.y = Math.PI / 4;
            pyrGroup.add(body);
            blockMesh = pyrGroup;
            break;
          }
          case 'block-roof-flat': {
            const flatGroup = new THREE.Group();
            const base = new THREE.Mesh(
              new THREE.BoxGeometry(1.0, 0.1, 1.0),
              new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.8 })
            );
            base.position.y = 0.05;
            const rim = new THREE.Mesh(
              new THREE.BoxGeometry(1.02, 0.04, 1.02),
              new THREE.MeshBasicMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.8 })
            );
            rim.position.y = 0.12;
            flatGroup.add(base, rim);
            blockMesh = flatGroup;
            break;
          }
          case 'block-window-hexagon': {
            const hexGroup = new THREE.Group();
            const frame = new THREE.Mesh(
              new THREE.RingGeometry(0.7, 0.8, 6),
              new THREE.MeshStandardMaterial({ color: 0x22222b, roughness: 0.5, side: THREE.DoubleSide })
            );
            frame.position.y = 0.8;
            frame.rotation.z = Math.PI / 6;
            const glass = new THREE.Mesh(
              new THREE.RingGeometry(0, 0.7, 6),
              new THREE.MeshStandardMaterial({ color: colorHex, emissive: colorHex, emissiveIntensity: 1.2, transparent: true, opacity: 0.4, side: THREE.DoubleSide })
            );
            glass.position.set(0, 0.8, 0.02);
            glass.rotation.z = Math.PI / 6;
            glass.name = 'window-glass';
            hexGroup.add(frame, glass);
            blockMesh = hexGroup;
            break;
          }
          case 'block-gate-portal': {
            const portalGroup = new THREE.Group();
            const frame = new THREE.Mesh(
              new THREE.BoxGeometry(1.8, 2.2, 0.2),
              new THREE.MeshStandardMaterial({ color: 0x33333f, metalness: 0.8, roughness: 0.2 })
            );
            frame.position.y = 1.1;
            
            const ring = new THREE.Mesh(
              new THREE.TorusGeometry(0.85, 0.05, 8, 32),
              new THREE.MeshStandardMaterial({ color: colorHex, emissive: colorHex, emissiveIntensity: 1.5 })
            );
            ring.position.set(0, 1.1, 0.06);
            ring.name = 'portal-ring';
            
            const forcefield = new THREE.Mesh(
              new THREE.PlaneGeometry(1.4, 2.0),
              new THREE.MeshStandardMaterial({
                color: colorHex,
                emissive: colorHex,
                emissiveIntensity: 2.0,
                transparent: true,
                opacity: 0.6,
                side: THREE.DoubleSide
              })
            );
            forcefield.position.set(0, 1.1, 0.01);
            forcefield.name = 'portal-forcefield';
            
            portalGroup.add(frame, ring, forcefield);
            blockMesh = portalGroup;
            break;
          }
          case 'block-footing': {
            const footingGroup = new THREE.Group();
            const footingBase = new THREE.Mesh(
              new THREE.BoxGeometry(1.5, 0.4, 1.5),
              new THREE.MeshStandardMaterial({ color: 0x55555c, roughness: 0.9, metalness: 0.1 })
            );
            footingBase.position.y = 0.2;
            const footingTop = new THREE.Mesh(
              new THREE.BoxGeometry(1.0, 0.2, 1.0),
              new THREE.MeshStandardMaterial({ color: 0x3d3d44, roughness: 0.8 })
            );
            footingTop.position.y = 0.5;
            
            const boltMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 1.5 });
            const bp = [[0.4, 0.4], [-0.4, 0.4], [0.4, -0.4], [-0.4, -0.4]];
            bp.forEach(([bx, bz], i) => {
              const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.15, 6), boltMat);
              bolt.position.set(bx, 0.625, bz);
              bolt.name = `bolt-${i}`;
              footingGroup.add(bolt);
            });

            footingGroup.add(footingBase, footingTop);
            blockMesh = footingGroup;
            break;
          }
          case 'block-beam': {
            const beamGroup = new THREE.Group();
            const body = new THREE.Mesh(
              new THREE.BoxGeometry(1.0, 0.3, 0.3),
              new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.6, metalness: 0.8 })
            );
            body.name = 'beam-body';
            
            const neonMat = new THREE.MeshStandardMaterial({ color: 0x00ff99, emissive: 0x00ff99, emissiveIntensity: 1.5 });
            const stripeL = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.04, 0.02), neonMat);
            stripeL.position.set(0, 0, 0.16);
            stripeL.name = 'beam-neon-l';
            const stripeR = stripeL.clone();
            stripeR.position.z = -0.16;
            stripeR.name = 'beam-neon-r';
            
            beamGroup.add(body, stripeL, stripeR);
            blockMesh = beamGroup;
            break;
          }
          case 'block-accessory': {
            const shoeGroup = new THREE.Group();
            const plateBase = new THREE.Mesh(
              new THREE.BoxGeometry(0.5, 0.1, 0.5),
              new THREE.MeshStandardMaterial({ color: 0xaaaaaf, roughness: 0.3, metalness: 0.8 })
            );
            plateBase.position.y = 0.05;
            
            const wallL = new THREE.Mesh(
              new THREE.BoxGeometry(0.06, 0.4, 0.5),
              new THREE.MeshStandardMaterial({ color: 0x99999f, roughness: 0.3, metalness: 0.8 })
            );
            wallL.position.set(-0.22, 0.25, 0);
            const wallR = wallL.clone();
            wallR.position.x = 0.22;
            
            const pin = new THREE.Mesh(
              new THREE.CylinderGeometry(0.03, 0.03, 0.52, 8),
              new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 1.2 })
            );
            pin.rotation.z = Math.PI / 2;
            pin.position.set(0, 0.25, 0);
            pin.name = 'shoe-pin';
            
            shoeGroup.add(plateBase, wallL, wallR, pin);
            blockMesh = shoeGroup;
            break;
          }
          case 'block-proxy': {
            const proxyGroup = new THREE.Group();
            const ring = new THREE.Mesh(
              new THREE.TorusGeometry(0.6, 0.03, 8, 32),
              new THREE.MeshStandardMaterial({ color: colorHex, emissive: colorHex, emissiveIntensity: 1.2 })
            );
            ring.rotation.x = Math.PI / 2;
            ring.name = 'proxy-ring';
            
            const axisX = new THREE.Mesh(
              new THREE.CylinderGeometry(0.02, 0.02, 1.4, 8),
              new THREE.MeshStandardMaterial({ color: 0xff3333, emissive: 0xff3333, emissiveIntensity: 1.5 })
            );
            axisX.rotation.z = Math.PI / 2;
            axisX.name = 'axis-x';
            
            const axisY = new THREE.Mesh(
              new THREE.CylinderGeometry(0.02, 0.02, 1.4, 8),
              new THREE.MeshStandardMaterial({ color: 0x33ff33, emissive: 0x33ff33, emissiveIntensity: 1.5 })
            );
            axisY.name = 'axis-y';
            
            const axisZ = new THREE.Mesh(
              new THREE.CylinderGeometry(0.02, 0.02, 1.4, 8),
              new THREE.MeshStandardMaterial({ color: 0x3333ff, emissive: 0x3333ff, emissiveIntensity: 1.5 })
            );
            axisZ.rotation.x = Math.PI / 2;
            axisZ.name = 'axis-z';
            
            proxyGroup.add(ring, axisX, axisY, axisZ);
            blockMesh = proxyGroup;
            break;
          }
          case 'block-slab': {
            const slabGroup = new THREE.Group();
            const slabBody = new THREE.Mesh(
              new THREE.BoxGeometry(1.0, 1.0, 1.0),
              new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.85, metalness: 0.1 })
            );
            slabBody.name = 'slab-body';
            slabGroup.add(slabBody);
            // Neon border edges
            const neonSlabMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 0.8 });
            const edgeGeoX = new THREE.BoxGeometry(1.02, 0.03, 0.03);
            const edgeGeoZ = new THREE.BoxGeometry(0.03, 0.03, 1.02);
            const borders = [
              { geo: edgeGeoX, pos: [0, 0.51, 0.51] },
              { geo: edgeGeoX, pos: [0, 0.51, -0.51] },
              { geo: edgeGeoZ, pos: [0.51, 0.51, 0] },
              { geo: edgeGeoZ, pos: [-0.51, 0.51, 0] },
            ];
            borders.forEach(({ geo, pos }, i) => {
              const e = new THREE.Mesh(geo, neonSlabMat);
              e.position.set(...pos);
              e.name = `slab-edge-${i}`;
              slabGroup.add(e);
            });
            blockMesh = slabGroup;
            break;
          }
          // ─── OBJ 내장 오브젝트 ──────────────────────────────
          case 'block-toilet': {
            const toiletGrp = new THREE.Group();
            // 변기 볈 (소도구)
            const seat = new THREE.Mesh(
              new THREE.BoxGeometry(1.0, 0.12, 0.8),
              new THREE.MeshStandardMaterial({ color: 0xe8e8f0, roughness: 0.3, metalness: 0.1 })
            );
            seat.position.y = 0.06;
            // 나팔 (tank)
            const tank = new THREE.Mesh(
              new THREE.BoxGeometry(0.65, 0.35, 0.18),
              new THREE.MeshStandardMaterial({ color: 0xe8e8f0, roughness: 0.3 })
            );
            tank.position.set(0, 0.3, -0.41);
            tank.name = 'toilet-tank';
            // 변기 발광 라인
            const rim = new THREE.Mesh(
              new THREE.TorusGeometry(0.3, 0.025, 8, 24),
              new THREE.MeshStandardMaterial({ color: 0x00ccff, emissive: 0x00ccff, emissiveIntensity: 0.4 })
            );
            rim.rotation.x = Math.PI / 2;
            rim.position.set(0, 0.13, 0.05);
            rim.name = 'toilet-rim';
            toiletGrp.add(seat, tank, rim);
            blockMesh = toiletGrp;
            break;
          }
          case 'block-sink': {
            const sinkGrp = new THREE.Group();
            // 세면대 본체
            const basin = new THREE.Mesh(
              new THREE.BoxGeometry(1.0, 0.18, 1.0),
              new THREE.MeshStandardMaterial({ color: 0xe8e8f0, roughness: 0.25, metalness: 0.2 })
            );
            basin.position.y = 0.09;
            // 세면대 볼
            const bowl = new THREE.Mesh(
              new THREE.CylinderGeometry(0.24, 0.2, 0.12, 16),
              new THREE.MeshStandardMaterial({ color: 0xd0d0e0, roughness: 0.2, metalness: 0.3 })
            );
            bowl.position.set(0, 0.18, 0);
            bowl.name = 'sink-bowl';
            // 수도꼭
            const faucet = new THREE.Mesh(
              new THREE.CylinderGeometry(0.02, 0.02, 0.22, 8),
              new THREE.MeshStandardMaterial({ color: 0xaaaacc, metalness: 0.9, roughness: 0.1 })
            );
            faucet.position.set(0, 0.33, -0.1);
            faucet.name = 'sink-faucet';
            sinkGrp.add(basin, bowl, faucet);
            blockMesh = sinkGrp;
            break;
          }
          case 'block-bathtub': {
            const tubGrp = new THREE.Group();
            // 욕조 외경
            const outer = new THREE.Mesh(
              new THREE.BoxGeometry(1.0, 0.55, 1.0),
              new THREE.MeshStandardMaterial({ color: 0xe0e0f0, roughness: 0.3, metalness: 0.1 })
            );
            outer.position.y = 0.275;
            // 욕조 내부 (hollowed feel 시각화)
            const inner = new THREE.Mesh(
              new THREE.BoxGeometry(0.84, 0.38, 0.84),
              new THREE.MeshStandardMaterial({ color: 0xb8d4f0, roughness: 0.1, metalness: 0.3, transparent: true, opacity: 0.85 })
            );
            inner.position.y = 0.46;
            inner.name = 'tub-water';
            // 림 네온
            const tubRim = new THREE.Mesh(
              new THREE.BoxGeometry(1.02, 0.04, 1.02),
              new THREE.MeshStandardMaterial({ color: 0x00ddff, emissive: 0x00ddff, emissiveIntensity: 0.5 })
            );
            tubRim.position.y = 0.572;
            tubRim.name = 'tub-rim';
            tubGrp.add(outer, inner, tubRim);
            blockMesh = tubGrp;
            break;
          }
          case 'block-kitchen': {
            const kitGrp = new THREE.Group();
            // 싱크대 본체
            const cabinet = new THREE.Mesh(
              new THREE.BoxGeometry(1.0, 0.9, 1.0),
              new THREE.MeshStandardMaterial({ color: colorHex || '#c0c0cc', roughness: 0.5, metalness: 0.2 })
            );
            cabinet.position.y = 0.45;
            cabinet.name = 'kitchen-cabinet';
            // 싱크 본체
            const kitSink = new THREE.Mesh(
              new THREE.BoxGeometry(0.7, 0.06, 0.42),
              new THREE.MeshStandardMaterial({ color: 0xaaaacc, metalness: 0.8, roughness: 0.1 })
            );
            kitSink.position.set(-0.12, 0.93, 0);
            kitSink.name = 'kitchen-sink';
            // 수도꼭
            const kitFaucet = new THREE.Mesh(
              new THREE.CylinderGeometry(0.018, 0.018, 0.18, 8),
              new THREE.MeshStandardMaterial({ color: 0xbbbbcc, metalness: 0.95 })
            );
            kitFaucet.position.set(-0.12, 1.06, -0.12);
            kitFaucet.name = 'kitchen-faucet';
            // 카운터탑 라인 조명
            const kitLine = new THREE.Mesh(
              new THREE.BoxGeometry(1.02, 0.02, 0.02),
              new THREE.MeshStandardMaterial({ color: 0x00ffcc, emissive: 0x00ffcc, emissiveIntensity: 0.8 })
            );
            kitLine.position.set(0, 0.91, 0.51);
            kitLine.name = 'kitchen-neon';
            kitGrp.add(cabinet, kitSink, kitFaucet, kitLine);
            blockMesh = kitGrp;
            break;
          }
          case 'block-gas': {
            const gasGrp = new THREE.Group();
            // 레인지 본체
            const top = new THREE.Mesh(
              new THREE.BoxGeometry(1.0, 0.08, 1.0),
              new THREE.MeshStandardMaterial({ color: 0x888890, roughness: 0.4, metalness: 0.6 })
            );
            top.position.y = 0.04;
            // 버너 4개
            const burnerMat = new THREE.MeshStandardMaterial({ color: 0x444455, roughness: 0.3, metalness: 0.8 });
            const flameMat  = new THREE.MeshStandardMaterial({ color: 0xff6600, emissive: 0xff6600, emissiveIntensity: 2.0, transparent: true, opacity: 0.85 });
            const burnerPos = [[-0.28, 0.28], [0.28, 0.28], [-0.28, -0.28], [0.28, -0.28]];
            burnerPos.forEach(([bx, bz], i) => {
              const ring = new THREE.Mesh(
                new THREE.TorusGeometry(0.1, 0.02, 8, 20),
                burnerMat
              );
              ring.rotation.x = Math.PI / 2;
              ring.position.set(bx, 0.09, bz);
              ring.name = `burner-ring-${i}`;
              const flame = new THREE.Mesh(
                new THREE.ConeGeometry(0.07, 0.06, 8),
                flameMat
              );
              flame.position.set(bx, 0.135, bz);
              flame.name = `burner-flame-${i}`;
              gasGrp.add(ring, flame);
            });
            gasGrp.add(top);
            blockMesh = gasGrp;
            break;
          }
          default:
            blockMesh = new THREE.Mesh(
              new THREE.BoxGeometry(0.5, 0.5, 0.5),
              new THREE.MeshStandardMaterial({ color: colorHex })
            );
        }

        let ifcType = 'IfcElement';
        const typeL = item.blockType.toLowerCase();
        if (typeL.includes('wall')) ifcType = 'IfcWall';
        else if (typeL.includes('pillar')) ifcType = 'IfcColumn';
        else if (typeL.includes('window')) ifcType = 'IfcWindow';
        else if (typeL.includes('gate') || typeL.includes('door') || typeL.includes('hatch') || typeL.includes('portal')) ifcType = 'IfcDoor';
        else if (typeL.includes('roof')) ifcType = 'IfcRoof';
        else if (typeL.includes('slab')) ifcType = 'IfcSlab';
        else if (typeL.includes('footing')) ifcType = 'IfcFooting';
        else if (typeL.includes('beam')) ifcType = 'IfcBeam';
        else if (typeL.includes('accessory')) ifcType = 'IfcDiscreteAccessory';
        else if (typeL.includes('proxy')) ifcType = 'IfcBuildingElementProxy';
        else if (typeL.includes('bench') || typeL.includes('workstation')) ifcType = 'IfcSpace';
        // OBJ 내장 시설
        else if (typeL.includes('toilet') || typeL.includes('sink') || typeL.includes('bathtub')) ifcType = 'IfcSanitaryTerminal';
        else if (typeL.includes('kitchen') || typeL.includes('gas')) ifcType = 'IfcElectricAppliance';

        blockMesh.userData = {
          interactive: true,
          type: ifcType,
          name: `${ifcType} (${item.blockType.replace('block-', '')})`,
          state: 'BIM 개별 부재 시공 완료',
          neonStyle: 'pulse'
        };

        // If block has a child (e.g. portal-forcefield, screen, glass, gate-core) that has a glowing emissive material, let's copy its color to userData
        blockMesh.traverse(child => {
          if (child.isMesh && child.material && child.material.emissive && child.material.emissive.getHex() !== 0) {
            blockMesh.userData.emissiveColor = '#' + child.material.emissive.getHexString();
          }
        });

        if (item.position) {
          blockMesh.position.set(item.position[0], item.position[1], item.position[2]);
        }
        if (item.rotation) {
          blockMesh.rotation.set(item.rotation[0], item.rotation[1], item.rotation[2]);
        }
        if (item.scale) {
          blockMesh.scale.set(item.scale[0], item.scale[1], item.scale[2]);
        }

        assemblyGroup.add(blockMesh);
      });

      assemblyGroup.userData = { 
        interactive: true, 
        type: 'composite-assembly', 
        name: title, 
        state: "조립 활성화 완료" 
      };

      if (schema.emissiveColor) {
        assemblyGroup.traverse(child => {
          if (child.isMesh && child.material && child.material.emissive) {
            child.material.emissive = new THREE.Color(schema.emissiveColor);
            child.material.emissiveIntensity = 0.5;
          }
        });
      }

      group.add(assemblyGroup);
      interactives.push(assemblyGroup);
      createdMesh = assemblyGroup;
    } 
    // C. 레거시 및 단일 뼈대(Fallback Primitives) 처리
    else {
      if (type === 'light') {
        const poleGeo = new THREE.CylinderGeometry(
          schema.dimensions?.radiusTop || 0.08,
          schema.dimensions?.radiusBottom || 0.12,
          schema.dimensions?.height || 3,
          8
        );
        const poleMat = new THREE.MeshStandardMaterial({ color: 0x555577 });
        const pole = new THREE.Mesh(poleGeo, poleMat);
        pole.position.set(0, (schema.dimensions?.height || 3) / 2, 0);

        const capGeo = new THREE.SphereGeometry(0.3, 16, 16);
        const capMat = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          emissive: new THREE.Color(schema.emissiveColor || '#00F0FF'),
          emissiveIntensity: 1.2
        });
        const cap = new THREE.Mesh(capGeo, capMat);
        cap.position.set(0, (schema.dimensions?.height || 3) / 2 + 1.5, 0);
        cap.name = 'glowing-cap';
        pole.add(cap);

        pole.userData = { interactive: true, type: 'light', name: title, state: "작동 상태" };
        group.add(pole);
        interactives.push(pole);
        createdMesh = pole;
      } 
      else if (type === 'greenhouse') {
        const frameGeo = new THREE.TorusGeometry(
          schema.dimensions?.radius || 1,
          schema.dimensions?.tube || 0.08,
          schema.dimensions?.radialSegments || 8,
          schema.dimensions?.tubularSegments || 24,
          Math.PI
        );
        const frameMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(schema.emissiveColor || '#00FF99') });
        const frame = new THREE.Mesh(frameGeo, frameMat);
        frame.position.set(0, 0, 0);

        frame.userData = { interactive: true, type: 'greenhouse', name: title, state: "자연풍 동화" };
        group.add(frame);
        interactives.push(frame);
        createdMesh = frame;
      } 
      else {
        const boxGeo = new THREE.BoxGeometry(
          schema.dimensions?.width || 1.2,
          schema.dimensions?.height || 0.8,
          schema.dimensions?.depth || 1.2
        );
        const boxMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(schema.emissiveColor || '#B57EDC'),
          roughness: 0.3,
          metalness: 0.6
        });
        const box = new THREE.Mesh(boxGeo, boxMat);
        box.position.set(0, (schema.dimensions?.height || 0.8) / 2, 0);
        box.castShadow = true;

        box.userData = { interactive: true, type: 'furniture', name: title, state: "배치 대기" };
        group.add(box);
        interactives.push(box);
        createdMesh = box;
      }
    }

    // 공통 메타데이터 주입
    if (createdMesh) {
      createdMesh.userData.interactive = true;
      if (!createdMesh.userData.type) {
        createdMesh.userData.type = type;
      }
      if (!createdMesh.userData.name) {
        createdMesh.userData.name = title;
      }
      createdMesh.userData.state = "BIM 기하 활성화";
      createdMesh.userData.neonStyle = schema.neonStyle || 'pulse';
      createdMesh.userData.emissiveColor = schema.emissiveColor || '#00F0FF';
      createdMesh.userData.physicsScript = schema.physicsScript;
    }

    return createdMesh;
  }

  // ==========================================================================
  // 3D 파라메트릭 인프라 기하 엔진 (BIM IFC 4.3 구현)
  // ==========================================================================

  // 1. [IfcBridge] 파라메트릭 교량 설계
  createParametricBridge(predefinedType, dims, color, neonStyle, emissiveColor) {
    const bridgeGroup = new THREE.Group();
    const mainColor = new THREE.Color(color);
    const emColor = new THREE.Color(emissiveColor);

    // 차원 매개변수 바인딩
    const length = dims.length || 30;
    const width = dims.width || 6;
    const height = dims.height || 10;
    const spanCount = dims.spanCount || 3;
    const pierRadius = dims.pierRadius || 0.4;
    const pylonHeight = dims.pylonHeight || 15;
    const cableDensity = dims.cableDensity || 8;

    // 공통 재질 정의
    const concreteMat = new THREE.MeshStandardMaterial({ color: mainColor, roughness: 0.8, metalness: 0.2 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x44444c, roughness: 0.4, metalness: 0.8 });
    const neonMat = new THREE.MeshStandardMaterial({
      color: emColor,
      emissive: emColor,
      emissiveIntensity: 1.5,
      transparent: true,
      opacity: 0.9
    });

    // 1-1. 상판 슬래브 (Deck - IfcSlab)
    const deckGeo = new THREE.BoxGeometry(width, 0.4, length);
    const deck = new THREE.Mesh(deckGeo, concreteMat);
    deck.position.set(0, height, 0);
    deck.castShadow = true;
    deck.receiveShadow = true;
    bridgeGroup.add(deck);

    // 1-2. 측면 네온 가이드 튜브 (SF 데코)
    const tubeLGeo = new THREE.CylinderGeometry(0.08, 0.08, length, 8);
    const tubeL = new THREE.Mesh(tubeLGeo, neonMat);
    tubeL.rotation.x = Math.PI / 2;
    tubeL.position.set(-width / 2 - 0.1, height, 0);
    tubeL.name = "neon-tube";
    bridgeGroup.add(tubeL);

    const tubeR = tubeL.clone();
    tubeR.position.x = width / 2 + 0.1;
    bridgeGroup.add(tubeR);

    // 1-3. 하부 교각 배열 (Pier / Column - IfcColumn)
    const step = length / (spanCount + 1);
    for (let i = 1; i <= spanCount; i++) {
      const zPos = -length / 2 + step * i;
      const pierGeo = new THREE.CylinderGeometry(pierRadius * 0.8, pierRadius, height, 12);
      const pier = new THREE.Mesh(pierGeo, concreteMat);
      pier.position.set(0, height / 2, zPos);
      pier.castShadow = true;
      pier.receiveShadow = true;
      bridgeGroup.add(pier);

      // 교좌장치 (Bearing - IfcBearing)
      const bearingGeo = new THREE.BoxGeometry(pierRadius * 2.5, 0.2, pierRadius * 2.5);
      const bearing = new THREE.Mesh(bearingGeo, metalMat);
      bearing.position.set(0, height - 0.2, zPos);
      bridgeGroup.add(bearing);
    }

    // 1-4. 세부 교량 공학 유형(PredefinedType)에 따른 상부 기하 생성
    if (predefinedType === 'ARCHED') {
      // 아치 구조물 지지대
      const archPoints = [];
      const segments = 32;
      for (let i = 0; i <= segments; i++) {
        const t = (i / segments) * 2 - 1; // -1 ~ 1
        const z = t * (length / 2);
        // 포물선 방정식: y = height + (1 - t^2) * (length * 0.18)
        const y = height + (1 - t * t) * (length * 0.18);
        archPoints.push(new THREE.Vector3(0, y, z));
      }
      const archCurve = new THREE.CatmullRomCurve3(archPoints);
      const archGeo = new THREE.TubeGeometry(archCurve, 64, 0.25, 8, false);
      const arch = new THREE.Mesh(archGeo, metalMat);
      arch.castShadow = true;
      bridgeGroup.add(arch);

      // 아치와 상판 잇는 수직 서스펜션 와이어
      for (let i = 1; i < segments; i++) {
        if (i % 2 === 0) {
          const t = (i / segments) * 2 - 1;
          const z = t * (length / 2);
          const archY = height + (1 - t * t) * (length * 0.18);
          const wireGeo = new THREE.CylinderGeometry(0.02, 0.02, Math.abs(archY - height), 6);
          const wire = new THREE.Mesh(wireGeo, metalMat);
          wire.position.set(0, (archY + height) / 2, z);
          bridgeGroup.add(wire);
        }
      }
    }
    else if (predefinedType === 'CABLE_STAYED') {
      // 사장교 주탑 (Pylon)
      const pylonGeo = new THREE.BoxGeometry(0.6, pylonHeight, 0.6);
      const pylon = new THREE.Mesh(pylonGeo, concreteMat);
      pylon.position.set(0, height + pylonHeight / 2 - 1, 0);
      pylon.castShadow = true;
      bridgeGroup.add(pylon);

      // 양방향 방사상 사선 인장 강선 (Tendon - IfcTendon)
      const sideStep = (length / 2) / (cableDensity + 1);
      for (let side = -1; side <= 1; side += 2) {
        for (let i = 1; i <= cableDensity; i++) {
          const zTarget = side * (sideStep * i);
          const pylonAttachY = height + (pylonHeight * 0.4) + (i * (pylonHeight * 0.5) / cableDensity);

          // 강선 벡터 수학적 계산 및 드로잉
          const startPt = new THREE.Vector3(0, pylonAttachY, 0);
          const endPt = new THREE.Vector3(0, height, zTarget);
          
          const wireDir = new THREE.Vector3().subVectors(endPt, startPt);
          const wireLen = wireDir.length();
          const wireGeo = new THREE.CylinderGeometry(0.03, 0.03, wireLen, 6);
          const wire = new THREE.Mesh(wireGeo, neonMat);
          
          // 실린더 회전 행렬 계산
          wire.position.copy(startPt).addScaledVector(wireDir, 0.5);
          wire.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), wireDir.clone().normalize());
          wire.name = "cable-wire";
          bridgeGroup.add(wire);
        }
      }
    }
    else if (predefinedType === 'SUSPENSION') {
      // 현수교 양 끝단 주탑 (Pylons)
      const pylons = [];
      const pylonZDist = length * 0.4;
      
      const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.5, pylonHeight, 0.5), concreteMat);
      p1.position.set(0, height + pylonHeight / 2 - 1, -pylonZDist);
      p1.castShadow = true;
      bridgeGroup.add(p1);
      pylons.push(p1);

      const p2 = p1.clone();
      p2.position.z = pylonZDist;
      bridgeGroup.add(p2);
      pylons.push(p2);

      // 수학적 현수선 (Catenary Curve)에 따른 메인 현수 와이어 생성
      // 공식: y = h_min + a * (cosh((z - z_mid)/a) - 1)
      const hMin = height + 1; // 케이블 최소 처짐 높이
      const hMax = height + pylonHeight - 1; // 주탑 부착 높이
      const L = pylonZDist * 2;
      
      // 현수선 형상 계수 'a' 수치 대수 근사값 계산
      const a = (L * L) / (8 * (hMax - hMin));

      const mainWirePoints = [];
      const stepCount = 50;
      for (let i = 0; i <= stepCount; i++) {
        const t = (i / stepCount) * 2 - 1; // -1 ~ 1
        const z = t * pylonZDist;
        const y = hMin + a * (Math.cosh(z / a) - 1);
        mainWirePoints.push(new THREE.Vector3(0, y, z));
      }

      const catenaryCurve = new THREE.CatmullRomCurve3(mainWirePoints);
      const catenaryGeo = new THREE.TubeGeometry(catenaryCurve, 64, 0.12, 8, false);
      const catenaryMesh = new THREE.Mesh(catenaryGeo, metalMat);
      catenaryMesh.castShadow = true;
      bridgeGroup.add(catenaryMesh);

      // 수직 행거 케이블 (Hanger / Drop wire) 배열
      const hangerCount = cableDensity * 2;
      const hangerStep = (pylonZDist * 2) / (hangerCount + 1);
      for (let i = 1; i <= hangerCount; i++) {
        const z = -pylonZDist + hangerStep * i;
        const mainY = hMin + a * (Math.cosh(z / a) - 1);
        
        const hangerLen = Math.abs(mainY - height);
        const hangerGeo = new THREE.CylinderGeometry(0.015, 0.015, hangerLen, 6);
        const hanger = new THREE.Mesh(hangerGeo, neonMat);
        hanger.position.set(0, (mainY + height) / 2, z);
        hanger.name = "cable-wire";
        bridgeGroup.add(hanger);
      }
    }
    else if (predefinedType === 'TRUSS') {
      // 상판 좌우 측면 트러스 격자 프레임 생성
      const sideOffset = width / 2;
      const trussHeight = 2.5;
      const trussSpan = length / 8;

      for (let side = -1; side <= 1; side += 2) {
        const zSide = side * sideOffset;
        
        // 상하부 끈 빔
        const chordBotGeo = new THREE.BoxGeometry(0.12, 0.12, length);
        const chordBot = new THREE.Mesh(chordBotGeo, metalMat);
        chordBot.position.set(zSide, height + 0.2, 0);
        bridgeGroup.add(chordBot);

        const chordTop = chordBot.clone();
        chordTop.position.y = height + trussHeight;
        bridgeGroup.add(chordTop);

        // 프레임 대각 부재 패턴 (Truss Members)
        for (let i = 0; i < 8; i++) {
          const zStart = -length / 2 + trussSpan * i;
          const zEnd = zStart + trussSpan;

          // 대각선 1 (/)
          const sPt = new THREE.Vector3(zSide, height + 0.2, zStart);
          const ePt = new THREE.Vector3(zSide, height + trussHeight, zEnd);
          const dir1 = new THREE.Vector3().subVectors(ePt, sPt);
          const wireGeo1 = new THREE.CylinderGeometry(0.04, 0.04, dir1.length(), 6);
          const member1 = new THREE.Mesh(wireGeo1, metalMat);
          member1.position.copy(sPt).addScaledVector(dir1, 0.5);
          member1.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir1.clone().normalize());
          bridgeGroup.add(member1);

        }
      }
    }
    else if (predefinedType === 'VIADOTTO_ACERNO') {
      // 이탈리아 아체르노 고가교 고정밀 CAD 수학 모델링
      const curvePoints = [];
      const segments = Math.max(48, Math.floor(length / 5)); // 5미터 당 1보간 세그먼트로 극대화
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const z = -length / 2 + t * length;
        // 도로 곡선 궤적: 곡률 반경 비율을 길이에 맞춤 (기존 95m 대비 -160 계수 비율 유지)
        const x = (z * z) / (-length * 1.68);
        // 종단 선형(Vertical Alignment): 중간 부분이 살짝 높은 완만한 포물선 종단 곡선
        const y = height + Math.sin(t * Math.PI) * 1.5;
        curvePoints.push(new THREE.Vector3(x, y, z));
      }
      const alignmentCurve = new THREE.CatmullRomCurve3(curvePoints);

      // 1. 상판 슬래브 세그먼트 스윕 (IfcSlab / Deck)
      const deckSegments = Math.max(40, Math.floor(length / 6)); // 6미터 당 1세그먼트로 조밀 스윕
      const stepT = 1.0 / deckSegments;
      for (let i = 0; i < deckSegments; i++) {
        const t1 = i * stepT;
        const t2 = (i + 1) * stepT;
        const p1 = alignmentCurve.getPointAt(t1);
        const p2 = alignmentCurve.getPointAt(t2);

        const segmentCenter = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
        const segmentDir = new THREE.Vector3().subVectors(p2, p1);
        const segmentLen = segmentDir.length();

        // 상판 조각 생성 (틈새 방지를 위한 0.05m 오버랩)
        const sliceGeo = new THREE.BoxGeometry(width, 0.4, segmentLen + 0.05);
        const slice = new THREE.Mesh(sliceGeo, concreteMat);
        slice.position.copy(segmentCenter);
        slice.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), segmentDir.clone().normalize());
        slice.castShadow = true;
        slice.receiveShadow = true;
        bridgeGroup.add(slice);

        // 차선 마킹 (중앙 황색선 2줄, 외곽 백색선)
        const markerMat = new THREE.MeshBasicMaterial({ color: 0xFFD700 });
        const whiteMarkerMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const markGeo = new THREE.BoxGeometry(0.06, 0.01, segmentLen + 0.05);
        
        const lineY1 = new THREE.Mesh(markGeo, markerMat);
        lineY1.position.set(-0.06, 0.21, 0);
        slice.add(lineY1);

        const lineY2 = new THREE.Mesh(markGeo, markerMat);
        lineY2.position.set(0.06, 0.21, 0);
        slice.add(lineY2);

        const lineW1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.01, segmentLen + 0.05), whiteMarkerMat);
        lineW1.position.set(-width / 2 + 0.5, 0.21, 0);
        slice.add(lineW1);

        const lineW2 = lineW1.clone();
        lineW2.position.x = width / 2 - 0.5;
        slice.add(lineW2);

        // 2. 하부 거더 빔 (IfcBeam / Girder)
        const girderGeo = new THREE.BoxGeometry(0.3, 0.8, segmentLen + 0.05);
        const girderL = new THREE.Mesh(girderGeo, metalMat);
        girderL.position.set(-width * 0.3, -0.4, 0);
        girderL.castShadow = true;
        slice.add(girderL);

        const girderR = girderL.clone();
        girderR.position.x = width * 0.3;
        slice.add(girderR);

        // 거더 측면 SF 네온 튜브 라인 (아체르노 광속 튜브)
        const neonTubeGeo = new THREE.CylinderGeometry(0.04, 0.04, segmentLen + 0.05, 6);
        const neonTubeL = new THREE.Mesh(neonTubeGeo, neonMat);
        neonTubeL.rotation.x = Math.PI / 2;
        neonTubeL.position.set(-width * 0.3 - 0.2, -0.4, 0);
        neonTubeL.name = "neon-tube";
        slice.add(neonTubeL);

        const neonTubeR = neonTubeL.clone();
        neonTubeR.position.x = width * 0.3 + 0.2;
        slice.add(neonTubeR);

        // 3. 곡선 가드레일 난간 및 기둥 (Guardrail & Posts)
        if (i % 2 === 0) {
          const postGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.2, 8);
          const postL = new THREE.Mesh(postGeo, metalMat);
          postL.position.set(-width / 2 + 0.1, 0.6, 0);
          postL.castShadow = true;
          slice.add(postL);

          const postR = postL.clone();
          postR.position.x = width / 2 - 0.1;
          slice.add(postR);

          const capGeo = new THREE.BoxGeometry(0.12, 0.1, 0.12);
          const capL = new THREE.Mesh(capGeo, concreteMat);
          capL.position.y = -0.55;
          postL.add(capL);

          const capR = capL.clone();
          postR.add(capR);
        }

        const guardRailBarGeo = new THREE.BoxGeometry(0.06, 0.15, segmentLen + 0.05);
        const guardL = new THREE.Mesh(guardRailBarGeo, neonMat);
        guardL.position.set(-width / 2 + 0.1, 0.9, 0);
        guardL.name = "truss-neon";
        slice.add(guardL);

        const guardR = guardL.clone();
        guardR.position.x = width / 2 - 0.1;
        slice.add(guardR);
      }

      // 4. 높은 교각 및 지하 수직 말뚝 기초 (Column, Footing, Pile)
      const pierStep = 1.0 / (spanCount + 1);
      for (let i = 1; i <= spanCount; i++) {
        const t = i * pierStep;
        const pos = alignmentCurve.getPointAt(t);
        const tangent = alignmentCurve.getTangentAt(t);

        const pierH = pos.y;
        const pierGeo = new THREE.CylinderGeometry(pierRadius * 0.8, pierRadius, pierH, 16);
        const pier = new THREE.Mesh(pierGeo, concreteMat);
        pier.position.set(pos.x, pierH / 2, pos.z);
        pier.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent.clone().setY(0).normalize());
        pier.castShadow = true;
        pier.receiveShadow = true;
        bridgeGroup.add(pier);

        // 교각 상단 콘크리트 헤드 캡
        const capGeo = new THREE.BoxGeometry(width * 0.7, 0.6, pierRadius * 3);
        const cap = new THREE.Mesh(capGeo, concreteMat);
        cap.position.set(0, pierH / 2 - 0.3, 0);
        cap.castShadow = true;
        pier.add(cap);

        // 교각 하부 지면 기초판 (IfcFooting)
        const footingGeo = new THREE.BoxGeometry(pierRadius * 5, 0.4, pierRadius * 5);
        const footing = new THREE.Mesh(footingGeo, concreteMat);
        footing.position.set(0, -pierH / 2 + 0.2, 0);
        footing.castShadow = true;
        footing.receiveShadow = true;
        pier.add(footing);

        // 지하 16개(4x4) 수직 말뚝 기초 다발 (IfcPile) 완벽 재현
        const pileSpacing = pierRadius * 1.3;
        for (let px = -1.5; px <= 1.5; px += 1.0) {
          for (let pz = -1.5; pz <= 1.5; pz += 1.0) {
            const pileGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.5, 8);
            const pile = new THREE.Mesh(pileGeo, concreteMat);
            pile.position.set(px * pileSpacing, -1.45, pz * pileSpacing);
            pile.castShadow = true;
            pile.receiveShadow = true;
            footing.add(pile);
          }
        }
      }
    }

    // 그룹을 씬의 바닥에 위치하도록 중심 조율
    bridgeGroup.position.set(0, -height, 0);
    
    // 전체 3D 가속 월드 씬에 추가
    this.renderer.worldGroup.add(bridgeGroup);
    this.renderer.interactiveObjects.push(bridgeGroup);

    return bridgeGroup;
  }

  // 2. [IfcRoad] 파라메트릭 도로 및 선형 스윕 설계
  createParametricRoad(predefinedType, dims, color, neonStyle, emissiveColor) {
    const roadGroup = new THREE.Group();
    const mainColor = new THREE.Color(color);
    const emColor = new THREE.Color(emissiveColor);

    const length = dims.length || 30;
    const width = dims.width || 6;
    const lanes = dims.lanes || 2;

    const asphaltMat = new THREE.MeshStandardMaterial({ color: mainColor, roughness: 0.95, metalness: 0.05 });
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xFFD700 }); // 중앙 황색 차선
    const laneMat = new THREE.MeshBasicMaterial({ color: 0xffffff }); // 일반 차선 백색
    const neonMat = new THREE.MeshStandardMaterial({
      color: emColor,
      emissive: emColor,
      emissiveIntensity: 1.2,
      transparent: true,
      opacity: 0.8
    });
    const blockMat = new THREE.MeshStandardMaterial({ color: 0x555560, roughness: 0.8 });

    // IFC 4.3 선형 설계: 도로 3D 완곡선 궤적 (평면선형 S자 + 종단선형 오르막/내리막)
    const curvePoints = [];
    const segments = Math.max(40, Math.floor(length / 8));
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const z = -length / 2 + t * length;
      // 평면선형 (Horizontal Alignment) - 완만한 S자 곡선
      const x = Math.sin(t * Math.PI * 2) * 15.0;
      // 종단선형 (Vertical Alignment) - 완만한 오르막 내리막 파형
      const y = Math.cos(t * Math.PI) * 4.0;
      curvePoints.push(new THREE.Vector3(x, y, z));
    }
    const alignmentCurve = new THREE.CatmullRomCurve3(curvePoints);

    // 슬라이스 단위 3D 선형 스윕 (Linear Sweep Along Alignment)
    const stepT = 1.0 / segments;
    for (let i = 0; i < segments; i++) {
      const t1 = i * stepT;
      const t2 = (i + 1) * stepT;
      const p1 = alignmentCurve.getPointAt(t1);
      const p2 = alignmentCurve.getPointAt(t2);

      const segmentCenter = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      const segmentDir = new THREE.Vector3().subVectors(p2, p1);
      const segmentLen = segmentDir.length();

      // 슬라이스 세그먼트 생성 (0.05m 오버랩)
      const sliceGeo = new THREE.BoxGeometry(width, 0.1, segmentLen + 0.05);
      const slice = new THREE.Mesh(sliceGeo, asphaltMat);
      slice.position.copy(segmentCenter);
      slice.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), segmentDir.clone().normalize());
      slice.receiveShadow = true;
      roadGroup.add(slice);

      // 2-2. 차선 도색 마크 (TrafficLane)
      const centerLine = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.01, segmentLen + 0.05), lineMat);
      centerLine.position.set(0, 0.06, 0);
      slice.add(centerLine);

      // 백색 점선 일반 차선
      const laneWidth = width / lanes;
      for (let l = 1; l < lanes; l++) {
        const xOffset = -width / 2 + laneWidth * l;
        if (Math.abs(xOffset) > 0.1) {
          const dash = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.01, (segmentLen + 0.05) * 0.4), laneMat);
          dash.position.set(xOffset, 0.06, 0);
          slice.add(dash);
        }
      }

      // 2-3. 도로 양쪽 인도 (Sidewalk - IfcRoadPart)
      const sidewalkWidth = 1.0;
      const sideH = 0.25;
      const sidewalkGeo = new THREE.BoxGeometry(sidewalkWidth, sideH, segmentLen + 0.05);
      
      const sidewalkL = new THREE.Mesh(sidewalkGeo, blockMat);
      sidewalkL.position.set(-width / 2 - sidewalkWidth / 2, sideH / 2, 0);
      sidewalkL.castShadow = true;
      sidewalkL.receiveShadow = true;
      slice.add(sidewalkL);

      const sidewalkR = sidewalkL.clone();
      sidewalkR.position.x = width / 2 + sidewalkWidth / 2;
      slice.add(sidewalkR);

      // 2-4. SF 네온 에너지 충전 레일
      const railGeo = new THREE.CylinderGeometry(0.04, 0.04, segmentLen + 0.05, 6);
      const railL = new THREE.Mesh(railGeo, neonMat);
      railL.rotation.x = Math.PI / 2;
      railL.position.set(-width / 2, sideH + 0.05, 0);
      railL.name = "neon-rail";
      slice.add(railL);

      const railR = railL.clone();
      railR.position.x = width / 2;
      slice.add(railR);

      // 인도 가로등 배치 (4개 슬라이스마다 배치)
      if (dims.hasLights !== false && i % 4 === 0) {
        const lightPole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, 3, 8), blockMat);
        lightPole.position.set(-width / 2 - sidewalkWidth / 2, 1.5, 0);
        lightPole.castShadow = true;

        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), neonMat);
        bulb.position.set(0, 1.6, 0);
        bulb.name = "road-bulb";
        lightPole.add(bulb);
        slice.add(lightPole);
      }
    }

    this.renderer.worldGroup.add(roadGroup);
    this.renderer.interactiveObjects.push(roadGroup);

    return roadGroup;
  }

  // 3. [IfcTunnel] 파라메트릭 터널 및 세그먼트 라이닝 설계
  createParametricTunnel(predefinedType, dims, color, neonStyle, emissiveColor) {
    const tunnelGroup = new THREE.Group();
    const mainColor = new THREE.Color(color);
    const emColor = new THREE.Color(emissiveColor);

    const length = dims.length || 25;
    const radius = dims.radius || 4;
    const thickness = dims.liningThickness || 0.3;
    const rings = dims.rings || 6;

    const liningMat = new THREE.MeshStandardMaterial({
      color: mainColor,
      roughness: 0.9,
      metalness: 0.1,
      side: THREE.DoubleSide
    });
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1f1f2e, roughness: 0.4, metalness: 0.9 });
    const neonMat = new THREE.MeshStandardMaterial({
      color: emColor,
      emissive: emColor,
      emissiveIntensity: 1.4,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide
    });

    // IFC 4.3 터널 선형 설계: 3D 우곡선 하향 선형 (평면 우회전 곡선 + 종단 지하 침하 경사)
    const curvePoints = [];
    const segments = Math.max(40, Math.floor(length / 6));
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const z = -length / 2 + t * length;
      // 평면선형 (Horizontal Alignment) - 우회전 곡선
      const x = Math.sin(t * Math.PI) * 10.0;
      // 종단선형 (Vertical Alignment) - 지하 하향 경사
      const y = -10.0 - t * 8.0;
      curvePoints.push(new THREE.Vector3(x, y, z));
    }
    const alignmentCurve = new THREE.CatmullRomCurve3(curvePoints);

    // 슬라이스 단위 3D 터널 세그먼트 선형 스윕
    const stepT = 1.0 / segments;
    for (let i = 0; i < segments; i++) {
      const t1 = i * stepT;
      const t2 = (i + 1) * stepT;
      const p1 = alignmentCurve.getPointAt(t1);
      const p2 = alignmentCurve.getPointAt(t2);

      const segmentCenter = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      const segmentDir = new THREE.Vector3().subVectors(p2, p1);
      const segmentLen = segmentDir.length();

      // 슬라이스 그룹 및 3D 회전 벡터 정렬
      const slice = new THREE.Group();
      slice.position.copy(segmentCenter);
      slice.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), segmentDir.clone().normalize());
      tunnelGroup.add(slice);

      // 3-1. 터널 외각 실린더 스킨 (Lining - 반원 아치 튜브)
      const outerGeo = new THREE.CylinderGeometry(radius, radius, segmentLen + 0.05, 24, 1, true, 0, Math.PI);
      const outerlining = new THREE.Mesh(outerGeo, liningMat);
      outerlining.rotation.x = Math.PI / 2;
      outerlining.rotation.z = Math.PI; // 반원 아치를 위로
      outerlining.receiveShadow = true;
      slice.add(outerlining);

      // 바닥 아스팔트 평면
      const roadGeo = new THREE.BoxGeometry(radius * 2, 0.15, segmentLen + 0.05);
      const road = new THREE.Mesh(roadGeo, new THREE.MeshStandardMaterial({ color: 0x18181f, roughness: 0.95 }));
      road.position.y = 0.075;
      road.receiveShadow = true;
      slice.add(road);

      // 3-2. 세그먼트 보강 링 (3개 슬라이스마다 배치)
      if (i % 3 === 0) {
        const ringGeo = new THREE.TorusGeometry(radius - 0.05, 0.08, 8, 24, Math.PI);
        const ring = new THREE.Mesh(ringGeo, frameMat);
        ring.castShadow = true;
        slice.add(ring);

        // 미래지향적 네온 플라즈마 링 밴드
        const neonBandGeo = new THREE.TorusGeometry(radius - 0.02, 0.03, 6, 24, Math.PI);
        const neonBand = new THREE.Mesh(neonBandGeo, neonMat);
        neonBand.name = "neon-ring";
        slice.add(neonBand);
      }

      // 3-3. 천장 환기식 팬 (6개 슬라이스마다 배치)
      if (i % 6 === 3) {
        const fanGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.8, 12);
        const fan = new THREE.Mesh(fanGeo, frameMat);
        fan.rotation.x = Math.PI / 2;
        fan.position.set(0, radius - 0.6, 0);
        fan.castShadow = true;

        const bladeGeo = new THREE.BoxGeometry(0.04, 0.5, 0.1);
        const blade = new THREE.Mesh(bladeGeo, neonMat);
        blade.name = "fan-blade";
        blade.position.set(0, 0, 0.42);
        fan.add(blade);
        slice.add(fan);
      }

      // 3-4. 터널 벽면 비상 유도 표시등 및 신호
      if (i % 2 === 0) {
        const signGeo = new THREE.BoxGeometry(0.06, 0.15, 0.03);
        const signMat = new THREE.MeshBasicMaterial({ color: 0x00FF99 });
        const angle = Math.PI * 0.15;

        const signL = new THREE.Mesh(signGeo, signMat);
        signL.position.set(-radius * Math.cos(angle) + 0.05, radius * Math.sin(angle), 0);
        signL.rotation.y = Math.PI / 2;
        signL.rotation.x = -angle;
        signL.name = "neon-ring";
        slice.add(signL);

        const signR = new THREE.Mesh(signGeo, signMat);
        signR.position.set(radius * Math.cos(angle) - 0.05, radius * Math.sin(angle), 0);
        signR.rotation.y = -Math.PI / 2;
        signR.rotation.x = angle;
        signR.name = "neon-ring";
        slice.add(signR);
      }
    }

    this.renderer.worldGroup.add(tunnelGroup);

    this.renderer.interactiveObjects.push(tunnelGroup);

    return tunnelGroup;
  }

  // 4. [IfcFacility] 미래형 복합 기하 발전돔/우주항/송전시설
  createParametricFacility(predefinedType, dims, color, neonStyle, emissiveColor) {
    const facilityGroup = new THREE.Group();
    const mainColor = new THREE.Color(color);
    const emColor = new THREE.Color(emissiveColor);

    const height = dims.height || 12;
    const radius = dims.radius || 5;
    const modules = dims.modules || 4;

    const structuralMat = new THREE.MeshStandardMaterial({ color: mainColor, roughness: 0.6, metalness: 0.5 });
    const coreMat = new THREE.MeshStandardMaterial({ color: 0x1a1a2e, metalness: 0.9, roughness: 0.1 });
    const neonMat = new THREE.MeshStandardMaterial({
      color: emColor,
      emissive: emColor,
      emissiveIntensity: 1.6,
      transparent: true,
      opacity: 0.85
    });

    if (predefinedType === 'POWER_STATION') {
      // 4-1. 원형 쌍곡선 냉각탑 (Hyperbolic Cooling Tower - CSG 구조)
      const towerGroup = new THREE.Group();

      const towerPoints = [];
      const segments = 20;
      for (let i = 0; i <= segments; i++) {
        const y = (i / segments) * height;
        const normalizedY = (i / segments) * 2 - 1; // -1 ~ 1
        // 쌍곡선 반지름 공식: R(y) = radius * (1.0 - 0.25 * cos(normalizedY * PI/2))
        const r = radius * (1.0 - 0.3 * Math.cos(normalizedY * Math.PI / 2.2));
        towerPoints.push(new THREE.Vector2(r, y));
      }
      
      const towerGeo = new THREE.LatheGeometry(towerPoints, 24);
      const towerMesh = new THREE.Mesh(towerGeo, structuralMat);
      towerMesh.castShadow = true;
      towerMesh.receiveShadow = true;
      towerGroup.add(towerMesh);

      // 탑 하부 냉각 기둥 (Multi-column Support)
      const colSpacing = (Math.PI * 2) / modules;
      for (let i = 0; i < modules; i++) {
        const angle = colSpacing * i;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;

        const supportCol = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.2, 8), structuralMat);
        supportCol.position.set(x, -0.6, z);
        supportCol.rotation.z = -angle * 0.1;
        supportCol.castShadow = true;
        towerGroup.add(supportCol);
      }

      // 탑 상단 발광 네온 에너지 코일 (Tesla Coil 링)
      const coilGeo = new THREE.TorusGeometry(radius * 0.72, 0.12, 8, 24);
      const coil = new THREE.Mesh(coilGeo, neonMat);
      coil.rotation.x = Math.PI / 2;
      coil.position.y = height;
      coil.name = "energy-coil";
      towerGroup.add(coil);

      facilityGroup.add(towerGroup);
    }
    else if (predefinedType === 'BIOSPHERE') {
      // 4-2. 반구형 지오데식 바이오돔 (Geodesic Biosphere Dome)
      const domeGroup = new THREE.Group();

      // 지오데식 구조용 스페리컬 프레임
      const frameGeo = new THREE.SphereGeometry(radius, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2);
      const frameMat = new THREE.MeshStandardMaterial({
        color: mainColor,
        wireframe: true,
        wireframeLinewidth: 2
      });
      const domeFrame = new THREE.Mesh(frameGeo, frameMat);
      domeFrame.castShadow = true;
      domeGroup.add(domeFrame);

      // 지오데식 네온 와이어 접합부 포인트들 (SF 노드들)
      const dotGeo = new THREE.SphereGeometry(0.1, 8, 8);
      const positions = frameGeo.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        const y = positions.getY(i);
        if (y > 0.05) {
          const dot = new THREE.Mesh(dotGeo, neonMat);
          dot.position.set(positions.getX(i), y, positions.getZ(i));
          dot.name = "dome-node";
          domeGroup.add(dot);
        }
      }

      // 덮개 스킨 (반투명 네온)
      const glassMat = new THREE.MeshStandardMaterial({
        color: emColor,
        emissive: emColor,
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide
      });
      const glassDome = new THREE.Mesh(frameGeo, glassMat);
      glassDome.receiveShadow = true;
      domeGroup.add(glassDome);

      facilityGroup.add(domeGroup);
    }
    else if (predefinedType === 'SPACE_PORT') {
      // 4-3. 우주선 활주/에너지 포트 (Space Port Center)
      const portGroup = new THREE.Group();

      // 다엽식 원형 패드 (Octagonal Base)
      const padGeo = new THREE.CylinderGeometry(radius, radius * 1.1, 0.4, 8);
      const pad = new THREE.Mesh(padGeo, coreMat);
      pad.position.y = 0.2;
      pad.castShadow = true;
      pad.receiveShadow = true;
      portGroup.add(pad);

      // 패드 중심에 떠 있는 구형 플라즈마 에너지 핵
      const coreGeo = new THREE.SphereGeometry(0.8, 16, 16);
      const core = new THREE.Mesh(coreGeo, neonMat);
      core.position.y = 2.0;
      core.name = "energy-core";
      portGroup.add(core);

      // 주변을 감싸며 부유하는 가속 링 (Accelerator float Ring)
      const ringGeo = new THREE.TorusGeometry(radius * 0.8, 0.08, 8, 24);
      const accelRing = new THREE.Mesh(ringGeo, structuralMat);
      accelRing.rotation.x = Math.PI / 2;
      accelRing.position.y = 2.0;
      accelRing.name = "float-ring";
      portGroup.add(accelRing);

      // 4사분면 에너지 집속 빔 타워들
      for (let i = 0; i < 4; i++) {
        const angle = (Math.PI / 2) * i;
        const x = Math.sin(angle) * (radius - 0.5);
        const z = Math.cos(angle) * (radius - 0.5);

        const beamPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.15, 1.8, 8), structuralMat);
        beamPillar.position.set(x, 0.9, z);
        beamPillar.castShadow = true;

        const subBulb = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), neonMat);
        subBulb.position.y = 0.95;
        beamPillar.add(subBulb);
        portGroup.add(beamPillar);
      }

      facilityGroup.add(portGroup);
    }

    this.renderer.worldGroup.add(facilityGroup);
    this.renderer.interactiveObjects.push(facilityGroup);

    return facilityGroup;
  }

  // ==========================================================================
  // 3D 표준 모듈러 블록(BIM Blocks - Legacy) 설계 라이브러리
  // ==========================================================================

  // 1. [block-pillar] 고풍스러운 기둥 조립 모듈
  createBlockPillar(colorHex) {
    const pillarGroup = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.6, metalness: 0.4 });

    const base = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.15, 0.4), material);
    base.position.y = 0.075;
    base.castShadow = true;
    base.receiveShadow = true;
    pillarGroup.add(base);

    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 2.0, 12), material);
    body.position.y = 1.15;
    body.castShadow = true;
    body.receiveShadow = true;
    pillarGroup.add(body);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.15, 0.35), material);
    head.position.y = 2.225;
    head.castShadow = true;
    head.receiveShadow = true;
    pillarGroup.add(head);

    return pillarGroup;
  }

  // 2. [block-window] 격자 살 및 프레임 창문 조립 모듈
  createBlockWindow(colorHex) {
    const windowGroup = new THREE.Group();
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x22222b, roughness: 0.5 });
    const glassMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      emissive: colorHex,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.4
    });

    const fLeft = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.8, 0.12), frameMat);
    fLeft.position.set(-0.86, 0.9, 0);
    windowGroup.add(fLeft);

    const fRight = fLeft.clone();
    fRight.position.x = 0.86;
    windowGroup.add(fRight);

    const fTop = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.08, 0.12), frameMat);
    fTop.position.set(0, 1.76, 0);
    windowGroup.add(fTop);

    const fBottom = fTop.clone();
    fBottom.position.y = 0.04;
    windowGroup.add(fBottom);

    const gridV = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.64, 0.06), frameMat);
    gridV.position.set(0, 0.9, 0);
    windowGroup.add(gridV);

    const gridH = new THREE.Mesh(new THREE.BoxGeometry(1.64, 0.04, 0.06), frameMat);
    gridH.position.set(0, 0.9, 0);
    windowGroup.add(gridH);

    const glass = new THREE.Mesh(new THREE.PlaneGeometry(1.64, 1.64), glassMat);
    glass.position.set(0, 0.9, 0);
    glass.name = "window-glass";
    windowGroup.add(glass);

    return windowGroup;
  }

  // 3. [block-bench] 공학적 안착 벤치 조립 모듈
  createBlockBench(colorHex) {
    const benchGroup = new THREE.Group();
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1a1a24, metalness: 0.8, roughness: 0.2 });
    const woodMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.7 });

    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.6, 0.8), frameMat);
    legL.position.set(-0.7, 0.3, 0);
    legL.castShadow = true;
    benchGroup.add(legL);

    const legR = legL.clone();
    legR.position.x = 0.7;
    benchGroup.add(legR);

    const seat = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.06, 0.7), woodMat);
    seat.position.set(0, 0.6, 0.05);
    seat.castShadow = true;
    benchGroup.add(seat);

    const backrest = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.4, 0.06), woodMat);
    backrest.position.set(0, 1.0, -0.32);
    backrest.rotation.x = -0.15;
    backrest.castShadow = true;
    benchGroup.add(backrest);

    return benchGroup;
  }

  // 4. [block-workstation] 첨단 PC 워크스테이션 조립 모듈
  createBlockWorkstation(colorHex) {
    const wsGroup = new THREE.Group();
    const legMat = new THREE.MeshStandardMaterial({ color: 0x111115, metalness: 0.9, roughness: 0.1 });
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x4a2e1b, roughness: 0.6 });
    const plasticMat = new THREE.MeshStandardMaterial({ color: 0x222, roughness: 0.4 });
    const screenMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      emissive: colorHex,
      emissiveIntensity: 0.9,
      roughness: 0.1
    });

    const tableTop = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.08, 1.2), woodMat);
    tableTop.position.y = 0.8;
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    wsGroup.add(tableTop);

    const positions = [
      [-0.9, 0.4, -0.5], [0.9, 0.4, -0.5],
      [-0.9, 0.4, 0.5], [0.9, 0.4, 0.5]
    ];
    positions.forEach(pos => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8, 8), legMat);
      leg.position.set(pos[0], pos[1], pos[2]);
      leg.castShadow = true;
      wsGroup.add(leg);
    });

    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.35, 8), legMat);
    stand.position.set(0, 0.975, -0.4);
    wsGroup.add(stand);

    const monitorL = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.42, 0.05), plasticMat);
    monitorL.position.set(-0.36, 1.2, -0.35);
    monitorL.rotation.y = 0.25;
    monitorL.castShadow = true;
    wsGroup.add(monitorL);

    const screenL = new THREE.Mesh(new THREE.PlaneGeometry(0.66, 0.38), screenMat);
    screenL.position.set(0, 0, 0.03);
    screenL.name = "screen";
    monitorL.add(screenL);

    const monitorR = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.42, 0.05), plasticMat);
    monitorR.position.set(0.36, 1.2, -0.35);
    monitorR.rotation.y = -0.25;
    monitorR.castShadow = true;
    wsGroup.add(monitorR);

    const screenR = new THREE.Mesh(new THREE.PlaneGeometry(0.66, 0.38), screenMat);
    screenR.position.set(0, 0, 0.03);
    screenR.name = "screen";
    monitorR.add(screenR);

    return wsGroup;
  }

  // 5. [block-gate] 정교한 아치 게이트 및 개폐형 문 조립 모듈
  createBlockGate(colorHex) {
    const gateGroup = new THREE.Group();
    const frameMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.5 });
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x422f1d, roughness: 0.8 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0xFFD700, metalness: 0.9, roughness: 0.1 });

    const pillarL = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2.5, 12), frameMat);
    pillarL.position.set(-0.9, 1.25, 0);
    pillarL.castShadow = true;
    gateGroup.add(pillarL);

    const pillarR = pillarL.clone();
    pillarR.position.x = 0.9;
    gateGroup.add(pillarR);

    const arch = new THREE.Mesh(
      new THREE.TorusGeometry(0.9, 0.1, 8, 24, Math.PI),
      frameMat
    );
    arch.position.set(0, 2.5, 0);
    gateGroup.add(arch);

    const doorHinge = new THREE.Group();
    doorHinge.position.set(-0.8, 1.25, 0);
    gateGroup.add(doorHinge);

    const doorBody = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.4, 0.06), doorMat);
    doorBody.position.set(0.8, 0, 0);
    doorBody.castShadow = true;
    doorHinge.add(doorBody);

    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), metalMat);
    knob.position.set(1.4, 0, 0.05);
    doorBody.add(knob);

    doorHinge.name = "interactive-door";
    doorHinge.userData = { type: 'door', isOpen: false };

    return gateGroup;
  }

  // [block-door-wood] 사각형 목재 방문 및 틀 조립 모듈 (방문은 나무, 틀과 사각문 정합)
  createBlockDoorWood(colorHex) {
    const doorGroup = new THREE.Group();
    const frameMat = new THREE.MeshStandardMaterial({ color: '#8d6e63', roughness: 0.8 }); // 목재 틀
    const panelMat = new THREE.MeshStandardMaterial({ color: '#d7ccc8', roughness: 0.9 }); // 사각 나무문판
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xFFD700, metalness: 0.9, roughness: 0.1 }); // 금색 레버 손잡이

    // 1. 사각 문틀 (왼쪽, 오른쪽, 상부)
    const postL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.1, 0.12), frameMat);
    postL.position.set(-0.47, 1.05, 0);
    postL.castShadow = true;
    postL.receiveShadow = true;

    const postR = postL.clone();
    postR.position.x = 0.47;

    const header = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.06, 0.12), frameMat);
    header.position.set(0, 2.07, 0);
    header.castShadow = true;
    header.receiveShadow = true;

    doorGroup.add(postL, postR, header);

    // 2. 개폐형 사각 나무 문판
    const doorHinge = new THREE.Group();
    doorHinge.position.set(-0.44, 1.05, 0);
    doorGroup.add(doorHinge);

    const doorBody = new THREE.Mesh(new THREE.BoxGeometry(0.88, 1.98, 0.04), panelMat);
    doorBody.position.set(0.44, 0, 0);
    doorBody.castShadow = true;
    doorHinge.add(doorBody);

    // 문 손잡이
    const handleBar = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.12, 8), goldMat);
    handleBar.rotation.z = Math.PI / 2;
    handleBar.position.set(0.36, 0, 0.03);
    doorBody.add(handleBar);

    doorHinge.name = "interactive-door";
    doorHinge.userData = { type: 'door', isOpen: false, doorType: 'wood' };

    return doorGroup;
  }

  // [block-door-steel] 사각형 철제 현관문 및 틀 조립 모듈 (현관문은 철제, 틀과 사각문 정합)
  createBlockDoorSteel(colorHex) {
    const doorGroup = new THREE.Group();
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x33333f, metalness: 0.8, roughness: 0.2 }); // 철제 문틀
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x455a64, metalness: 0.6, roughness: 0.4 }); // 철제 패널
    const lockMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.1 }); // 디지털 도어락 패드

    // 1. 철제 사각 문틀 (왼쪽, 오른쪽, 상부)
    const postL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.1, 0.16), frameMat);
    postL.position.set(-0.46, 1.05, 0);
    postL.castShadow = true;

    const postR = postL.clone();
    postR.position.x = 0.46;

    const header = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.08, 0.16), frameMat);
    header.position.set(0, 2.06, 0);
    header.castShadow = true;

    doorGroup.add(postL, postR, header);

    // 2. 개폐형 사각 철제 문판
    const doorHinge = new THREE.Group();
    doorHinge.position.set(-0.42, 1.05, 0);
    doorGroup.add(doorHinge);

    const doorBody = new THREE.Mesh(new THREE.BoxGeometry(0.84, 1.96, 0.06), panelMat);
    doorBody.position.set(0.42, 0, 0);
    doorBody.castShadow = true;
    doorHinge.add(doorBody);

    // 디지털 도어락 및 손잡이
    const lockPad = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.25, 0.02), lockMat);
    lockPad.position.set(0.32, 0.1, 0.04);
    doorBody.add(lockPad);

    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.12, 0.04), frameMat);
    handle.position.set(0.32, 0, 0.06);
    doorBody.add(handle);

    doorHinge.name = "interactive-door";
    doorHinge.userData = { type: 'door', isOpen: false, doorType: 'steel' };

    return doorGroup;
  }

  // [block-door-glass] 베란다/발코니 전용 대형 슬라이딩 유리문 및 프레임 조립 모듈
  createBlockDoorGlass(colorHex) {
    const doorGroup = new THREE.Group();
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x22222b, roughness: 0.3 }); // 알루미늄 검은색 프레임
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x00ddff,
      emissive: 0x00ddff,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.25,
      roughness: 0.1,
      metalness: 0.9
    });

    // 1. 사각 프레임 (틀 - 왼쪽, 오른쪽, 상부, 하부)
    const postL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.1, 0.12), frameMat);
    postL.position.set(-0.47, 1.05, 0);
    postL.castShadow = true;

    const postR = postL.clone();
    postR.position.x = 0.47;

    const header = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.06, 0.12), frameMat);
    header.position.set(0, 2.07, 0);
    header.castShadow = true;

    const footer = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.06, 0.12), frameMat);
    footer.position.set(0, 0.03, 0);
    footer.castShadow = true;

    doorGroup.add(postL, postR, header, footer);

    // 2. 대형 투명 유리문 (Glass Sliders - 2짝 슬라이딩 구조)
    const glassL = new THREE.Mesh(new THREE.BoxGeometry(0.46, 1.96, 0.02), glassMat);
    glassL.position.set(-0.22, 1.03, -0.02);
    glassL.name = "window-glass";

    const frameL = new THREE.Mesh(new THREE.BoxGeometry(0.48, 1.98, 0.03), frameMat);
    frameL.position.set(-0.22, 1.03, -0.02);
    
    const glassR = new THREE.Mesh(new THREE.BoxGeometry(0.46, 1.96, 0.02), glassMat);
    glassR.position.set(0.22, 1.03, 0.02);
    glassR.name = "window-glass";

    const frameR = new THREE.Mesh(new THREE.BoxGeometry(0.48, 1.98, 0.03), frameMat);
    frameR.position.set(0.22, 1.03, 0.02);

    doorGroup.add(glassL, frameL, glassR, frameR);

    return doorGroup;
  }

  // 5. [IfcRailway] 파라메트릭 철도 및 복선 궤도 설계
  createParametricRailway(predefinedType, dims, color, neonStyle, emissiveColor) {
    const railGroup = new THREE.Group();
    const mainColor = new THREE.Color(color);
    const emColor = new THREE.Color(emissiveColor);

    const length = dims.length || 1800;
    const width = dims.width || 4.5;
    const gauge = dims.gauge || 1.435; // 표준궤 간격 1.435m

    const ballastMat = new THREE.MeshStandardMaterial({ color: 0x3a3a42, roughness: 0.95 });
    const sleeperMat = new THREE.MeshStandardMaterial({ color: 0x422a1b, roughness: 0.8 }); // 콘크리트/목재 침목
    const steelMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.1 }); // 복선 강철 레일
    const neonMat = new THREE.MeshStandardMaterial({
      color: emColor,
      emissive: emColor,
      emissiveIntensity: 1.4,
      transparent: true,
      opacity: 0.85
    });

    // 3D 철도 선형 (평면 S자 곡선 + 종단 높낮이 오르막)
    const curvePoints = [];
    const segments = Math.max(48, Math.floor(length / 6));
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const z = -length / 2 + t * length;
      // 평면선형 (Horizontal): 도로와 반대로 서서히 굽어 들어가는 S자
      const x = Math.sin(t * Math.PI * 2) * -12.0;
      // 종단선형 (Vertical): 살짝 낮게 내려갔다 올라오는 포물선 종단
      const y = Math.cos(t * Math.PI) * -3.0 + 1.0;
      curvePoints.push(new THREE.Vector3(x, y, z));
    }
    const alignmentCurve = new THREE.CatmullRomCurve3(curvePoints);

    // 슬라이스 단위 3D 선형 스윕 (도상, 침목, 레일, 전차선 지지대)
    const stepT = 1.0 / segments;
    for (let i = 0; i < segments; i++) {
      const t1 = i * stepT;
      const t2 = (i + 1) * stepT;
      const p1 = alignmentCurve.getPointAt(t1);
      const p2 = alignmentCurve.getPointAt(t2);

      const segmentCenter = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      const segmentDir = new THREE.Vector3().subVectors(p2, p1);
      const segmentLen = segmentDir.length();

      // 슬라이스 피벗 그룹
      const slice = new THREE.Group();
      slice.position.copy(segmentCenter);
      slice.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), segmentDir.clone().normalize());
      railGroup.add(slice);

      // A. 사다리꼴 자갈 도상 (Ballast Bed) - 0.05m 오버랩
      const ballastGeo = new THREE.BoxGeometry(width, 0.35, segmentLen + 0.05);
      const ballast = new THREE.Mesh(ballastGeo, ballastMat);
      ballast.position.y = 0.175;
      ballast.receiveShadow = true;
      slice.add(ballast);

      // B. 침목 (Sleeper - IfcTrackElement) - 슬라이스 당 4개 배치
      const sleeperSpacing = segmentLen / 4;
      for (let j = 0; j < 4; j++) {
        const sleeperZ = -segmentLen / 2 + sleeperSpacing * (j + 0.5);
        const sleeperGeo = new THREE.BoxGeometry(2.4, 0.14, 0.22);
        const sleeper = new THREE.Mesh(sleeperGeo, sleeperMat);
        sleeper.position.set(0, 0.42, sleeperZ);
        sleeper.castShadow = true;
        sleeper.receiveShadow = true;
        slice.add(sleeper);
      }

      // C. 복선 강철 레일 2줄 (Dual Rails)
      const railGeo = new THREE.BoxGeometry(0.08, 0.18, segmentLen + 0.05);
      
      const railL = new THREE.Mesh(railGeo, steelMat);
      railL.position.set(-gauge / 2, 0.58, 0);
      railL.castShadow = true;
      slice.add(railL);

      const railR = railL.clone();
      railR.position.x = gauge / 2;
      slice.add(railR);

      // D. SF 네온 광선 전원 공급 가이드 레일 (중앙 배치)
      const guideGeo = new THREE.CylinderGeometry(0.03, 0.03, segmentLen + 0.05, 6);
      const guide = new THREE.Mesh(guideGeo, neonMat);
      guide.rotation.x = Math.PI / 2;
      guide.position.set(0, 0.51, 0);
      guide.name = "neon-rail";
      slice.add(guide);

      // E. 전차선 지지대 및 Catenary Poles (12개 슬라이스마다 대칭 기둥)
      if (i % 12 === 4) {
        const poleGroup = new THREE.Group();
        poleGroup.position.set(-width / 2 - 0.2, 0, 0);

        const verticalPole = new THREE.Mesh(
          new THREE.CylinderGeometry(0.08, 0.12, 5.5, 8),
          ballastMat
        );
        verticalPole.position.y = 2.75;
        verticalPole.castShadow = true;
        poleGroup.add(verticalPole);

        const horizontalArm = new THREE.Mesh(
          new THREE.BoxGeometry(width / 2 + 0.5, 0.08, 0.08),
          ballastMat
        );
        horizontalArm.position.set(width / 4, 5.2, 0);
        poleGroup.add(horizontalArm);

        // 가선 네온 다발
        const wireGeo = new THREE.CylinderGeometry(0.015, 0.015, segmentLen + 0.05, 4);
        const wire = new THREE.Mesh(wireGeo, neonMat);
        wire.rotation.x = Math.PI / 2;
        wire.position.set(0, 5.0, 0);
        wire.name = "cable-wire";
        slice.add(wire);

        slice.add(poleGroup);
      }
    }

    this.renderer.worldGroup.add(railGroup);
    this.renderer.interactiveObjects.push(railGroup);

    return railGroup;
  }

  // 6. [IfcMarineFacility] 파라메트릭 해양 항만 및 SF 등대 비콘 설계
  createParametricMarineFacility(predefinedType, dims, color, neonStyle, emissiveColor) {
    const portGroup = new THREE.Group();
    const mainColor = new THREE.Color(color);
    const emColor = new THREE.Color(emissiveColor);

    const length = dims.length || 40;
    const width = dims.width || 25;
    const height = dims.height || 4;

    const concreteMat = new THREE.MeshStandardMaterial({ color: mainColor, roughness: 0.85, metalness: 0.15 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x22222b, roughness: 0.4, metalness: 0.8 });
    const neonMat = new THREE.MeshStandardMaterial({
      color: emColor,
      emissive: emColor,
      emissiveIntensity: 1.8,
      transparent: true,
      opacity: 0.85
    });

    // 6-1. 콘크리트 해안 옹벽 & 덱 (Seawall & Deck - IfcSlab)
    const deckGeo = new THREE.BoxGeometry(width, height, length);
    const deck = new THREE.Mesh(deckGeo, concreteMat);
    deck.position.y = -height / 2 + 0.1;
    deck.receiveShadow = true;
    deck.castShadow = true;
    portGroup.add(deck);

    // 6-2. 소형선 선착용 부유 하역 도크 2개 (Floating Landing Docks)
    for (let d = -1; d <= 1; d += 2) {
      const dockGeo = new THREE.BoxGeometry(6, 0.6, 12);
      const dock = new THREE.Mesh(dockGeo, concreteMat);
      dock.position.set(width / 2 + 3.0, -0.2, d * 10);
      dock.castShadow = true;
      portGroup.add(dock);

      // 도크 도킹 가이드 레일 (Neon)
      const guideGeo = new THREE.BoxGeometry(0.1, 0.15, 12);
      const guideL = new THREE.Mesh(guideGeo, neonMat);
      guideL.position.set(-2.9, 0.35, 0);
      guideL.name = "neon-rail";
      dock.add(guideL);

      const guideR = guideL.clone();
      guideR.position.x = 2.9;
      dock.add(guideR);
    }

    // 6-3. 화물 하역용 크레인 (Terminal Cargo Crane - IfcEquipment)
    const craneGroup = new THREE.Group();
    craneGroup.position.set(-width / 4, 0.1, 0);

    const base = new THREE.Mesh(new THREE.BoxGeometry(3, 4, 3), metalMat);
    base.position.y = 2.0;
    base.castShadow = true;
    craneGroup.add(base);

    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 8), metalMat);
    arm.position.set(0, 4.25, 2.5);
    arm.rotation.x = -0.15; // 빔 각도 틸팅
    arm.castShadow = true;
    craneGroup.add(arm);

    // 크레인 케이블 & 와이어 (Neon)
    const wireGeo = new THREE.CylinderGeometry(0.04, 0.04, 4, 6);
    const wire = new THREE.Mesh(wireGeo, neonMat);
    wire.position.set(0, 2.0, 6.0);
    wire.name = "cable-wire";
    craneGroup.add(wire);

    portGroup.add(craneGroup);

    // 6-4. 초거대 스마트 등대 주탑 (Lighthouse & Neon Rotating Beacon)
    const lighthouseGroup = new THREE.Group();
    lighthouseGroup.position.set(width / 4, 0.1, -length / 3);

    const towerGeo = new THREE.CylinderGeometry(1.2, 1.8, 10, 16);
    const tower = new THREE.Mesh(towerGeo, concreteMat);
    tower.position.y = 5.0;
    tower.castShadow = true;
    tower.receiveShadow = true;
    lighthouseGroup.add(tower);

    // 등대 상단 캡 돔 (Cap Dome)
    const capGeo = new THREE.SphereGeometry(1.3, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const cap = new THREE.Mesh(capGeo, metalMat);
    cap.position.y = 10.65;
    lighthouseGroup.add(cap);

    // 등대 서치라이트 및 360도 회전식 에너지 빔 (Rotating Beacon Beam)
    const bulbGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const bulb = new THREE.Mesh(bulbGeo, neonMat);
    bulb.position.y = 10.0;
    bulb.name = "energy-core";
    lighthouseGroup.add(bulb);

    // 3D 원뿔형 빛 서치라이트 빔 메쉬 (Y축 회전용 피벗)
    const beamPivot = new THREE.Group();
    beamPivot.position.y = 10.0;
    beamPivot.name = "beacon-beam-pivot";

    const beamGeo = new THREE.ConeGeometry(3.0, 30.0, 16, 1, true); // 밑면 열린 원뿔
    const beamMat = new THREE.MeshBasicMaterial({
      color: emColor,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.rotation.x = Math.PI / 2; // 가로로 빔 정렬
    beam.position.z = -15.0; // 등대 바깥으로 투사 오프셋
    beam.name = "beacon-beam";
    beamPivot.add(beam);
    lighthouseGroup.add(beamPivot);

    portGroup.add(lighthouseGroup);

    this.renderer.worldGroup.add(portGroup);
    this.renderer.interactiveObjects.push(portGroup);

    return portGroup;
  }

  // 7. [IfcRoadPart] 파라메트릭 스마트 톨게이트 및 3색 블링킹 신호기
  createParametricRoadPart(predefinedType, dims, color, neonStyle, emissiveColor) {
    const roadPartGroup = new THREE.Group();
    const mainColor = new THREE.Color(color);
    const emColor = new THREE.Color(emissiveColor);

    const width = dims.width || 6.5;

    const structureMat = new THREE.MeshStandardMaterial({ color: mainColor, roughness: 0.6, metalness: 0.4 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x111115, metalness: 0.8, roughness: 0.2 });
    const neonMat = new THREE.MeshStandardMaterial({
      color: emColor,
      emissive: emColor,
      emissiveIntensity: 1.4,
      transparent: true,
      opacity: 0.9
    });

    // 7-1. 요금 요금소 부스 (Toll Gate Booth Structure)
    const boothGeo = new THREE.BoxGeometry(1.2, 2.5, 2.0);
    const booth = new THREE.Mesh(boothGeo, structureMat);
    booth.position.set(-width / 2 - 0.7, 1.25, 0);
    booth.castShadow = true;
    roadPartGroup.add(booth);

    // 요금소 부스 유리창 및 지붕
    const windowGeo = new THREE.BoxGeometry(1.22, 0.8, 1.6);
    const windowMat = new THREE.MeshStandardMaterial({ color: 0x00F0FF, emissive: 0x00F0FF, emissiveIntensity: 0.5, transparent: true, opacity: 0.4 });
    const boothWin = new THREE.Mesh(windowGeo, windowMat);
    boothWin.position.set(0, 0.4, 0);
    booth.add(boothWin);

    const roofGeo = new THREE.BoxGeometry(2.2, 0.2, 3.2);
    const roof = new THREE.Mesh(roofGeo, structureMat);
    roof.position.set(-width / 4, 3.0, 0);
    roof.castShadow = true;
    roadPartGroup.add(roof);

    // 요금소 우측 대칭 지지 기둥
    const pillarGeo = new THREE.CylinderGeometry(0.12, 0.12, 3.0, 8);
    const pillar = new THREE.Mesh(pillarGeo, structureMat);
    pillar.position.set(width / 2 + 0.5, 1.5, 0);
    pillar.castShadow = true;
    roadPartGroup.add(pillar);

    // 7-2. 지갑 잔고 검증 개폐식 차단기 암 (Interactive Toll Gate Arm)
    const gatePivot = new THREE.Group();
    gatePivot.position.set(-width / 2 - 0.1, 1.0, 0);
    gatePivot.name = "toll-gate-pivot";
    gatePivot.userData = { isOpen: false, currentAngle: 0 }; // 메쉬 애니메이션용
    roadPartGroup.add(gatePivot);

    const armGeo = new THREE.BoxGeometry(width + 0.4, 0.1, 0.1);
    const gateArm = new THREE.Mesh(armGeo, new THREE.MeshStandardMaterial({ color: 0xff3300 }));
    gateArm.position.x = (width + 0.4) / 2;
    gateArm.name = "gate-arm";
    gateArm.castShadow = true;
    gatePivot.add(gateArm);

    // 게이트 암 네온 띠 표시선
    const stripeGeo = new THREE.BoxGeometry(width, 0.04, 0.12);
    const stripe = new THREE.Mesh(stripeGeo, neonMat);
    stripe.position.set(width / 2, 0, 0);
    stripe.name = "neon-rail";
    gatePivot.add(stripe);

    // 7-3. 3색 블링킹 교통 신호기 (Traffic Light & Blinking Signals)
    const signalFrame = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.2, 0.4), metalMat);
    signalFrame.position.set(-width / 2 - 0.7, 3.8, 0);
    signalFrame.castShadow = true;
    roadPartGroup.add(signalFrame);

    // 신호기 전구 3개 배치 (적 - 황 - 녹)
    const colors = [0xff0000, 0xffaa00, 0x00ff00];
    const lightPositions = [0.35, 0, -0.35];
    const lightNames = ['red-bulb', 'yellow-bulb', 'green-bulb'];

    for (let c = 0; c < 3; c++) {
      const bulbGeo = new THREE.SphereGeometry(0.12, 12, 12);
      const bulbMat = new THREE.MeshStandardMaterial({
        color: colors[c],
        emissive: colors[c],
        emissiveIntensity: c === 0 ? 1.6 : 0.05 // 적색 초기 켜짐
      });
      const bulb = new THREE.Mesh(bulbGeo, bulbMat);
      bulb.position.set(0, lightPositions[c], 0.21);
      bulb.name = lightNames[c];
      signalFrame.add(bulb);
    }

    // 7-4. 도로 가이드 전광 경고판 (IfcSign)
    const signGroup = new THREE.Group();
    signGroup.position.set(width / 2 + 1.2, 0, 0);

    const signPole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.5, 8), metalMat);
    signPole.position.y = 1.25;
    signPole.castShadow = true;
    signGroup.add(signPole);

    const board = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.8, 0.1), structureMat);
    board.position.y = 2.55;
    board.castShadow = true;
    signGroup.add(board);

    // 전광판 네온 텍스트/표시 기호 영역
    const displayGeo = new THREE.BoxGeometry(1.5, 0.7, 0.02);
    const displayMat = new THREE.MeshStandardMaterial({
      color: 0x000000,
      emissive: emColor,
      emissiveIntensity: 1.5
    });
    const display = new THREE.Mesh(displayGeo, displayMat);
    display.position.set(0, 2.55, 0.061);
    display.name = "neon-ring";
    signGroup.add(display);

    roadPartGroup.add(signGroup);

    this.renderer.worldGroup.add(roadPartGroup);
    this.renderer.interactiveObjects.push(roadPartGroup);

    return roadPartGroup;
  }

  // ─────────────────────────────────────────────────
  // IfcGeotechnicalElement — TIN 절차적 지형 레이어
  // buildingSMART Terrain-models (ACCA/Trimble/12d) 기반
  // TIN = Triangulated Irregular Network — IFC IfcTriangulatedFaceSet 패턴
  // ─────────────────────────────────────────────────
  createParametricTerrain(predefinedType = 'TIN', dims = {}, color = '#4a5a38', neonStyle = 'wireframe', emissiveColor = '#88FF44') {
    const terrainGroup = new THREE.Group();
    terrainGroup.name = 'IfcGeotechnicalElement';
    terrainGroup.userData.ifcType = 'IfcGeotechnicalElement';

    const W = dims.width  || 600;
    const D = dims.depth  || 1800;
    const COLS = dims.cols || 60;
    const ROWS = dims.rows || 180;
    const maxH = dims.maxHeight || 14;

    // — TIN 메쉬 생성 (PlaneGeometry + 노이즈 변위)
    const geo = new THREE.PlaneGeometry(W, D, COLS, ROWS);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    const freq1 = 0.008, freq2 = 0.025, freq3 = 0.06;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      // 다중 주파수 노이즈 (Simplex 근사)
      const h = Math.sin(x * freq1) * Math.cos(z * freq1) * maxH * 0.6
              + Math.sin(x * freq2 + 1.3) * Math.cos(z * freq2 - 0.7) * maxH * 0.25
              + Math.sin(x * freq3 + 2.1) * Math.cos(z * freq3 + 1.4) * maxH * 0.15;
      // 강 계곡 지형 — x=0 근방 오목
      const riverDip = Math.exp(-x * x / 5000) * 6;
      pos.setY(i, h - riverDip - 3.5);
    }
    geo.computeVertexNormals();

    // 지형 색상 버텍스 — 높이에 따라 초록→갈색→회색
    const colors = [];
    for (let i = 0; i < pos.count; i++) {
      const h = pos.getY(i);
      const t = Math.max(0, Math.min(1, (h + 10) / 24));
      const r = 0.18 + t * 0.32;
      const g = 0.28 + t * 0.18;
      const b = 0.10 + t * 0.10;
      colors.push(r, g, b);
    }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const mat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.95,
      metalness: 0.0,
      side: THREE.DoubleSide,
    });
    const terrainMesh = new THREE.Mesh(geo, mat);
    terrainMesh.name = 'tin-surface';
    terrainMesh.receiveShadow = true;
    terrainGroup.add(terrainMesh);

    // — 와이어프레임 오버레이 (TIN 삼각망 시각화 IFC style)
    const wireMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(emissiveColor),
      wireframe: true,
      transparent: true,
      opacity: 0.07,
    });
    const wireMesh = new THREE.Mesh(geo.clone(), wireMat);
    wireMesh.name = 'tin-wireframe';
    wireMesh.position.y += 0.05;
    terrainGroup.add(wireMesh);

    // — 등고선 평면 파티클 (건설현장 측량 포인트 클라우드 느낌)
    const ptGeo = new THREE.BufferGeometry();
    const ptCount = 800;
    const ptPos = new Float32Array(ptCount * 3);
    for (let i = 0; i < ptCount; i++) {
      const px = (Math.random() - 0.5) * W;
      const pz = (Math.random() - 0.5) * D;
      const ph = Math.sin(px * freq1) * Math.cos(pz * freq1) * maxH * 0.6
               + Math.sin(px * freq2) * Math.cos(pz * freq2) * maxH * 0.25
               - Math.exp(-px * px / 5000) * 6 - 3.0;
      ptPos[i * 3]     = px;
      ptPos[i * 3 + 1] = ph + 0.2;
      ptPos[i * 3 + 2] = pz;
    }
    ptGeo.setAttribute('position', new THREE.BufferAttribute(ptPos, 3));
    const ptMat = new THREE.PointsMaterial({ color: emissiveColor, size: 1.2, transparent: true, opacity: 0.6 });
    const ptCloud = new THREE.Points(ptGeo, ptMat);
    ptCloud.name = 'survey-points';
    terrainGroup.add(ptCloud);

    this.renderer.worldGroup.add(terrainGroup);
    this.renderer.interactiveObjects.push(terrainGroup);
    return terrainGroup;
  }

  // ─────────────────────────────────────────────────
  // IfcSignal — RFI 철도 신호기
  // buildingSMART ACCA-RFI Signalling 도메인 기반
  // IfcSignal predefinedType: STOP / SPEED / RAILWAY 등
  // ─────────────────────────────────────────────────
  createParametricSignal(predefinedType = 'RAILWAY', dims = {}, color = '#222230', neonStyle = 'blink', emissiveColor = '#FF3300') {
    const signalGroup = new THREE.Group();
    signalGroup.name = 'IfcSignal';
    signalGroup.userData.ifcType = 'IfcSignal';

    const h = dims.height || 5.2;
    const matSteel = new THREE.MeshStandardMaterial({ color: '#1a1a22', roughness: 0.7, metalness: 0.85 });

    // — 주 마스트 (원형 파이프)
    const mastGeo = new THREE.CylinderGeometry(0.08, 0.10, h, 12);
    const mast = new THREE.Mesh(mastGeo, matSteel);
    mast.name = 'signal-mast';
    mast.position.y = h / 2;
    signalGroup.add(mast);

    // — 베이스 플레이트
    const baseMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.35, 0.12, 16),
      matSteel
    );
    baseMesh.position.y = 0.06;
    signalGroup.add(baseMesh);

    // — 신호 헤드 케이싱 (직사각 박스)
    const headGroup = new THREE.Group();
    headGroup.name = 'signal-head';
    headGroup.position.y = h + 0.35;

    const casingGeo = new THREE.BoxGeometry(0.36, 0.85, 0.18);
    const casingMesh = new THREE.Mesh(casingGeo,
      new THREE.MeshStandardMaterial({ color: '#111118', roughness: 0.6, metalness: 0.9 })
    );
    headGroup.add(casingMesh);

    // — 3색 신호 렌즈 (상=적, 중=황, 하=녹)
    const bulbGeo = new THREE.SphereGeometry(0.085, 12, 8);
    const offsets = [0.26, 0, -0.26];
    const bulbColors  = ['#FF2200', '#FFBB00', '#00FF44'];
    const bulbEmits   = [new THREE.Color('#FF2200'), new THREE.Color('#FFBB00'), new THREE.Color('#00FF44')];
    const bulbNames   = ['signal-red', 'signal-yellow', 'signal-green'];
    bulbNames.forEach((name, idx) => {
      const bMat = new THREE.MeshStandardMaterial({
        color: bulbColors[idx],
        emissive: bulbEmits[idx],
        emissiveIntensity: idx === 0 ? 2.0 : 0.05,
        roughness: 0.15,
        metalness: 0.0,
        transparent: true,
        opacity: 0.92,
      });
      const bulb = new THREE.Mesh(bulbGeo, bMat);
      bulb.name = name;
      bulb.position.set(0, offsets[idx], 0.12);
      headGroup.add(bulb);
    });

    signalGroup.add(headGroup);

    // — 화살 방향판 (L자형 암)
    const armGeo = new THREE.BoxGeometry(0.6, 0.06, 0.06);
    const arm = new THREE.Mesh(armGeo,
      new THREE.MeshStandardMaterial({ color: '#222228', metalness: 0.9, roughness: 0.5 })
    );
    arm.position.set(0.25, h - 0.3, 0);
    signalGroup.add(arm);

    const arrowGeo = new THREE.BoxGeometry(0.22, 0.22, 0.04);
    const arrowMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(emissiveColor),
      emissive: new THREE.Color(emissiveColor),
      emissiveIntensity: 1.5,
    });
    const arrow = new THREE.Mesh(arrowGeo, arrowMat);
    arrow.name = 'signal-arrow';
    arrow.position.set(0.55, h - 0.3, 0);
    signalGroup.add(arrow);

    // — 마스트 반사 테이프 (안전 반사판)
    const tapeMat = new THREE.MeshStandardMaterial({ color: '#FFEE00', emissive: new THREE.Color('#FFEE00'), emissiveIntensity: 0.8 });
    [0.8, 1.6, 2.4].forEach(ty => {
      const tape = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.10, 0.05, 12), tapeMat);
      tape.position.y = ty;
      signalGroup.add(tape);
    });

    this.renderer.worldGroup.add(signalGroup);
    this.renderer.interactiveObjects.push(signalGroup);
    return signalGroup;
  }

  // ─────────────────────────────────────────────────
  // IfcDistributionElement — RFI 에너지 급전 지지주 (Energy Mast)
  // buildingSMART ACCA-RFI Energy 도메인 기반
  // H형강 지지주 + 전차선 크로스암 + 코로나링 + 절연체 디스크
  // ─────────────────────────────────────────────────
  createParametricEnergyMast(predefinedType = 'ENERGY_MAST', dims = {}, color = '#3a3a4a', neonStyle = 'corona', emissiveColor = '#FFD700') {
    const mastGroup = new THREE.Group();
    mastGroup.name = 'IfcDistributionElement';
    mastGroup.userData.ifcType = 'IfcDistributionElement';

    const h = dims.height || 8.5;
    const matSteel = new THREE.MeshStandardMaterial({ color: '#2a2a3a', roughness: 0.5, metalness: 0.92 });

    // — H형강 주기둥 (웹 + 2개 플랜지)
    const webGeo = new THREE.BoxGeometry(0.10, h, 0.02);
    const web = new THREE.Mesh(webGeo, matSteel);
    web.position.y = h / 2;
    web.name = 'mast-web';
    mastGroup.add(web);

    ['left', 'right'].forEach((side, idx) => {
      const flange = new THREE.Mesh(
        new THREE.BoxGeometry(0.02, h, 0.22),
        matSteel
      );
      flange.position.set(0, h / 2, (idx === 0 ? -1 : 1) * 0.11);
      flange.name = `mast-flange-${side}`;
      mastGroup.add(flange);
    });

    // — 베이스 앵커 플레이트
    const anchorMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.12, 0.5),
      new THREE.MeshStandardMaterial({ color: '#181820', metalness: 0.95, roughness: 0.4 })
    );
    anchorMesh.position.y = 0.06;
    mastGroup.add(anchorMesh);

    // — 크로스암 2단 (전차선 지지)
    [h * 0.72, h * 0.90].forEach((armY, armIdx) => {
      const crossArm = new THREE.Mesh(
        new THREE.BoxGeometry(2.6, 0.08, 0.08),
        matSteel
      );
      crossArm.position.y = armY;
      crossArm.name = `cross-arm-${armIdx}`;
      mastGroup.add(crossArm);

      // 크로스암 끝 절연체 디스크 스택 (좌/우)
      [-1, 1].forEach(side => {
        const discGroup = new THREE.Group();
        discGroup.name = 'insulator-disc';
        discGroup.position.set(side * 1.2, armY - 0.4, 0);

        for (let d = 0; d < 5; d++) {
          const disc = new THREE.Mesh(
            new THREE.CylinderGeometry(0.14 - d * 0.01, 0.12 - d * 0.01, 0.06, 16),
            new THREE.MeshStandardMaterial({
              color: '#d0c090',
              emissive: new THREE.Color(emissiveColor),
              emissiveIntensity: 0.3,
              roughness: 0.6,
              metalness: 0.05,
            })
          );
          disc.position.y = -d * 0.09;
          discGroup.add(disc);
        }
        mastGroup.add(discGroup);
      });
    });

    // — 전차선 캐티너리 와이어 3줄 (스윕 근사 — thin cylinder)
    [h * 0.91, h * 0.79, h * 0.67].forEach((wireY, wi) => {
      const wire = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.012, 2.8, 8),
        new THREE.MeshStandardMaterial({
          color: '#b08020',
          emissive: new THREE.Color(emissiveColor),
          emissiveIntensity: 0.8,
          metalness: 0.95,
          roughness: 0.2,
        })
      );
      wire.name = 'catenary-wire';
      wire.rotation.z = Math.PI / 2;
      wire.position.y = wireY;
      mastGroup.add(wire);
    });

    // — 코로나 방전 링 (상단, Y축 회전 물리)
    const coronaGroup = new THREE.Group();
    coronaGroup.name = 'corona-ring';
    coronaGroup.position.y = h + 0.15;

    const coronaGeo = new THREE.TorusGeometry(0.32, 0.025, 10, 48);
    const coronaMat = new THREE.MeshStandardMaterial({
      color: '#b0e0ff',
      emissive: new THREE.Color('#b0e0ff'),
      emissiveIntensity: 2.2,
      transparent: true,
      opacity: 0.88,
    });
    const corona = new THREE.Mesh(coronaGeo, coronaMat);
    corona.rotation.x = Math.PI / 2;
    corona.name = 'corona-torus';
    coronaGroup.add(corona);

    // 코로나 글로우 파티클 (방전 느낌)
    const glowGeo = new THREE.BufferGeometry();
    const glowPos = [];
    for (let i = 0; i < 32; i++) {
      const angle = (i / 32) * Math.PI * 2;
      const r = 0.32 + (Math.random() - 0.5) * 0.12;
      glowPos.push(Math.cos(angle) * r, (Math.random() - 0.5) * 0.15, Math.sin(angle) * r);
    }
    glowGeo.setAttribute('position', new THREE.Float32BufferAttribute(glowPos, 3));
    const glowPts = new THREE.Points(glowGeo,
      new THREE.PointsMaterial({ color: '#b0e0ff', size: 0.06, transparent: true, opacity: 0.75 })
    );
    glowPts.name = 'corona-glow';
    coronaGroup.add(glowPts);

    mastGroup.add(coronaGroup);

    this.renderer.worldGroup.add(mastGroup);
    this.renderer.interactiveObjects.push(mastGroup);
    return mastGroup;
  }

  // ─────────────────────────────────────────────────
  // IfcConstructionEquipment — 건설기계 (Excavator, Tower Crane, Crawler Crane)
  // CALSPIA STP 모델 분석 기반 (KATO/LIEBHERR/Manitowac)
  // ─────────────────────────────────────────────────
  createParametricConstructionEquipment(predefinedType = 'EXCAVATOR', dims = {}, color = '#e6a100', neonStyle = 'work', emissiveColor = '#FFCC00') {
    const equipGroup = new THREE.Group();
    equipGroup.name = 'IfcConstructionEquipment';
    equipGroup.userData.ifcType = 'IfcConstructionEquipment';
    equipGroup.userData.predefinedType = predefinedType;

    const matBody = new THREE.MeshStandardMaterial({ color: color, roughness: 0.25, metalness: 0.65 });
    const matDark = new THREE.MeshStandardMaterial({ color: '#1a1a20', roughness: 0.5, metalness: 0.8 });
    const matSilver = new THREE.MeshStandardMaterial({ color: '#cccccc', roughness: 0.15, metalness: 0.95 });
    const matGlass = new THREE.MeshStandardMaterial({ color: '#003366', roughness: 0.1, metalness: 0.9, transparent: true, opacity: 0.65 });
    const matNeon = new THREE.MeshStandardMaterial({
      color: new THREE.Color(emissiveColor),
      emissive: new THREE.Color(emissiveColor),
      emissiveIntensity: 1.8,
    });

    if (predefinedType === 'EXCAVATOR') {
      // 1. Excavator (굴착기)
      // 하부 크롤러 트랙
      const tracksGroup = new THREE.Group();
      tracksGroup.name = 'excavator-tracks';
      
      const trackL = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.7, 0.6), matDark);
      trackL.position.set(0, 0.35, -1.2);
      const trackR = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.7, 0.6), matDark);
      trackR.position.set(0, 0.35, 1.2);
      tracksGroup.add(trackL, trackR);

      // 하부 베이스 프레임
      const baseFrame = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.5, 2.0), matSilver);
      baseFrame.position.set(0, 0.45, 0);
      tracksGroup.add(baseFrame);
      equipGroup.add(tracksGroup);

      // 상부 회전 바디 (Cabin + Engine)
      const cabinGroup = new THREE.Group();
      cabinGroup.name = 'excavator-cabin-group';
      cabinGroup.position.set(0, 0.7, 0);

      // 메인 엔진 룸 박스
      const engineMesh = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.2, 2.2), matBody);
      engineMesh.position.set(-0.3, 0.6, 0);
      cabinGroup.add(engineMesh);

      // 조종석 캡
      const cabMesh = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.4, 1.0), matGlass);
      cabMesh.position.set(0.6, 0.7, 0.7);
      cabinGroup.add(cabMesh);

      // 헤드라이트 (네온 이미시브)
      const lightMesh = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.15), matNeon);
      lightMesh.position.set(0.6, 1.1, 0.1);
      cabinGroup.add(lightMesh);

      // 붐 (1단 암)
      const boomGroup = new THREE.Group();
      boomGroup.name = 'excavator-boom';
      boomGroup.position.set(0.6, 0.6, -0.3); // 붐 힌지축 위치

      const boomMesh = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.35, 0.35), matBody);
      boomMesh.position.set(1.3, 0.8, 0);
      boomMesh.rotation.z = Math.PI / 5; // 기본 위로 꺾인 각도
      boomGroup.add(boomMesh);

      // 유압 실린더 피스톤 (붐 밑)
      const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.8), matSilver);
      cylinder.position.set(0.6, 0.1, 0);
      cylinder.rotation.z = Math.PI / 3;
      boomGroup.add(cylinder);

      // 암 (2단 암)
      const armGroup = new THREE.Group();
      armGroup.name = 'excavator-arm';
      armGroup.position.set(2.4, 1.8, 0); // 붐 끝단 힌지축

      const armMesh = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.25, 0.25), matBody);
      armMesh.position.set(0.8, -0.6, 0);
      armMesh.rotation.z = -Math.PI / 4;
      armGroup.add(armMesh);

      // 버킷 (끝 단)
      const bucketGroup = new THREE.Group();
      bucketGroup.name = 'excavator-bucket';
      bucketGroup.position.set(1.5, -1.3, 0); // 암 끝단 힌지축

      // 숟가락 모양 U자형 버킷 생성
      const bucketBase = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), matDark);
      bucketBase.position.set(0.2, -0.2, 0);
      bucketGroup.add(bucketBase);

      // 버킷 이빨 (Teeth)
      const teethGeo = new THREE.BoxGeometry(0.15, 0.05, 0.1);
      for (let s = -2; s <= 2; s++) {
        const tooth = new THREE.Mesh(teethGeo, matSilver);
        tooth.position.set(0.6, -0.55, s * 0.15);
        bucketGroup.add(tooth);
      }

      // 파티클 방출을 위한 더미 그룹 (먼지 방출 원점)
      const dustEmitter = new THREE.Group();
      dustEmitter.name = 'excavator-emitter';
      dustEmitter.position.set(0.5, -0.6, 0);
      bucketGroup.add(dustEmitter);

      // 계층 조립
      armGroup.add(bucketGroup);
      boomGroup.add(armGroup);
      cabinGroup.add(boomGroup);
      equipGroup.add(cabinGroup);

    } else if (predefinedType === 'TOWER_CRANE') {
      // 2. Tower Crane (타워크레인)
      // 기초 콘크리트 패드
      const foundation = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.8, 3.5), new THREE.MeshStandardMaterial({ color: '#77777a', roughness: 0.9 }));
      foundation.position.set(0, 0.4, 0);
      equipGroup.add(foundation);

      // 수직 마스트 (h = 24m) - lattice 프레임
      const mastHeight = 24;
      const mastGroup = new THREE.Group();
      mastGroup.name = 'tower-mast';

      const mastColumn = new THREE.Mesh(new THREE.BoxGeometry(1.2, mastHeight, 1.2), new THREE.MeshStandardMaterial({
        color: color, roughness: 0.4, metalness: 0.5, wireframe: false
      }));
      mastColumn.position.set(0, mastHeight / 2 + 0.8, 0);
      mastGroup.add(mastColumn);

      // 내부 X 트러스 무늬 (격자 느낌)
      const trussGeo = new THREE.BoxGeometry(0.08, 3.2, 0.08);
      for (let y = 2; y < mastHeight; y += 3) {
        const tr1 = new THREE.Mesh(trussGeo, matSilver);
        tr1.position.set(0.55, y, 0);
        tr1.rotation.z = Math.PI / 4;
        const tr2 = new THREE.Mesh(trussGeo, matSilver);
        tr2.position.set(0.55, y, 0);
        tr2.rotation.z = -Math.PI / 4;

        const tr3 = new THREE.Mesh(trussGeo, matSilver);
        tr3.position.set(-0.55, y, 0);
        tr3.rotation.z = Math.PI / 4;
        const tr4 = new THREE.Mesh(trussGeo, matSilver);
        tr4.position.set(-0.55, y, 0);
        tr4.rotation.z = -Math.PI / 4;

        mastGroup.add(tr1, tr2, tr3, tr4);
      }
      equipGroup.add(mastGroup);

      // 상부 회전 지브 그룹 (Slewing Group)
      const slewingGroup = new THREE.Group();
      slewingGroup.name = 'crane-slewing-group';
      slewingGroup.position.set(0, mastHeight + 0.8, 0);

      // 캐빈 및 캣헤드 (조종석 탑)
      const cathead = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.8, 2.5, 4), matBody);
      cathead.position.set(0, 1.25, 0);
      slewingGroup.add(cathead);

      const craneCabin = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.0, 1.0), matGlass);
      craneCabin.position.set(0.8, 0.5, 0.5);
      slewingGroup.add(craneCabin);

      // 메인 지브 (길이 28m) - 앞쪽 트러스 붐
      const jibLength = 28;
      const jibMesh = new THREE.Mesh(new THREE.BoxGeometry(jibLength, 0.4, 0.4), matBody);
      jibMesh.position.set(jibLength / 2 - 0.5, 0.2, 0);
      slewingGroup.add(jibMesh);

      // 메인 지브 상단 장력 케이블 (철사)
      const cableGeo = new THREE.CylinderGeometry(0.015, 0.015, jibLength, 8);
      const cable = new THREE.Mesh(cableGeo, matSilver);
      cable.rotation.z = -Math.PI / 2 + 0.1;
      cable.position.set(jibLength / 2 - 0.5, 1.5, 0);
      slewingGroup.add(cable);

      // 카운터 지브 (길이 8m) - 뒤쪽 붐 + 카운터웨이트
      const counterJib = new THREE.Mesh(new THREE.BoxGeometry(8, 0.4, 0.4), matBody);
      counterJib.position.set(-4.0 - 0.5, 0.2, 0);
      slewingGroup.add(counterJib);

      // 카운터웨이트 블록 3개
      for (let w = 0; w < 3; w++) {
        const weight = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.2, 1.6), new THREE.MeshStandardMaterial({ color: '#55555d', roughness: 0.9 }));
        weight.position.set(-7.0 + w * 1.1, 0.8, 0);
        slewingGroup.add(weight);
      }

      // 지브 끝단 비콘등
      const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), matNeon);
      beacon.position.set(jibLength - 0.6, 0.4, 0);
      slewingGroup.add(beacon);

      // 트롤리 (Jib 밑을 이동)
      const trolleyGroup = new THREE.Group();
      trolleyGroup.name = 'crane-trolley';
      trolleyGroup.position.set(12.0, -0.3, 0);

      const trolleyMesh = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.3, 0.8), matDark);
      trolleyGroup.add(trolleyMesh);

      // 호이스트 와이어
      const wireMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 1.0), matDark);
      wireMesh.name = 'crane-wire';
      wireMesh.position.set(0, -5.0, 0);
      wireMesh.scale.y = 10;
      trolleyGroup.add(wireMesh);

      // 훅 블록
      const hookGroup = new THREE.Group();
      hookGroup.name = 'crane-hook';
      hookGroup.position.set(0, -10.0, 0);

      const hookBlock = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.3), matSilver);
      const hookShank = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.04, 8, 24), matDark);
      hookShank.position.set(0, -0.38, 0);
      hookShank.rotation.x = Math.PI / 2;

      hookGroup.add(hookBlock, hookShank);
      trolleyGroup.add(hookGroup);
      slewingGroup.add(trolleyGroup);

      equipGroup.add(slewingGroup);

    } else if (predefinedType === 'CRAWLER_CRANE') {
      // 3. Crawler Crane (이동식/크롤러 크레인)
      const chassis = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.8, 2.6), matDark);
      chassis.position.set(0, 0.4, 0);
      equipGroup.add(chassis);

      const trackL = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.7, 0.5), matSilver);
      trackL.position.set(0, 0.35, -1.55);
      const trackR = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.7, 0.5), matSilver);
      trackR.position.set(0, 0.35, 1.55);
      equipGroup.add(trackL, trackR);

      // 아웃리거
      const outriggerGroup = new THREE.Group();
      outriggerGroup.name = 'crane-outriggers';
      const opCoords = [
        [2.2, -1.8], [2.2, 1.8], [-2.2, -1.8], [-2.2, 1.8]
      ];
      opCoords.forEach((coord, index) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.2), matSilver);
        leg.position.set(coord[0], 0.3, coord[1] / 1.5);
        leg.rotation.z = coord[0] > 0 ? -Math.PI / 6 : Math.PI / 6;

        const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.1, 12), matNeon);
        pad.position.set(coord[0] * 1.2, -0.35, coord[1]);
        outriggerGroup.add(leg, pad);
      });
      equipGroup.add(outriggerGroup);

      // 상부 본체
      const slewingBody = new THREE.Group();
      slewingBody.name = 'crane-slewing-body';
      slewingBody.position.set(0, 0.8, 0);

      const cabin = new THREE.Mesh(new THREE.BoxGeometry(3.0, 1.2, 2.2), matBody);
      cabin.position.set(-0.4, 0.6, 0);
      slewingBody.add(cabin);

      const driverCab = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.3, 0.8), matGlass);
      driverCab.position.set(0.9, 0.75, 0.7);
      slewingBody.add(driverCab);

      const cweight = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.6, 2.0), new THREE.MeshStandardMaterial({ color: '#333339', roughness: 0.9 }));
      cweight.position.set(-1.4, 0.8, 0);
      slewingBody.add(cweight);

      // lattice 붐
      const boomLength = 16.0;
      const luffingGroup = new THREE.Group();
      luffingGroup.name = 'crane-luffing-boom';
      luffingGroup.position.set(0.6, 0.8, 0);

      const latticeBoom = new THREE.Mesh(new THREE.BoxGeometry(boomLength, 0.35, 0.35), matBody);
      latticeBoom.position.set(boomLength / 2, 0, 0);
      latticeBoom.rotation.z = Math.PI / 4;
      luffingGroup.add(latticeBoom);

      const boomHeadLight = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), matNeon);
      boomHeadLight.position.set(boomLength, 0, 0);
      luffingGroup.add(boomHeadLight);

      // 와이어 & 훅
      const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 1.0), matDark);
      wire.name = 'crawler-wire';
      wire.position.set(boomLength - 0.5, -4.0, 0);
      wire.scale.y = 8;
      luffingGroup.add(wire);

      const hook = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.045, 8, 20), matSilver);
      hook.name = 'crawler-hook';
      hook.position.set(boomLength - 0.5, -8.0, 0);
      luffingGroup.add(hook);

      slewingBody.add(luffingGroup);
      equipGroup.add(slewingBody);
    }

    this.renderer.worldGroup.add(equipGroup);
    this.renderer.interactiveObjects.push(equipGroup);
    return equipGroup;
  }

  // 12. [IfcSpace] 파라메트릭 방 — 벽 4개 + 문 1개
  createParametricRoom(predefinedType, dims, color, neonStyle, emissiveColor) {
    const roomGroup = new THREE.Group();
    const mainColor = new THREE.Color(color);
    const emColor = new THREE.Color(emissiveColor);

    const w  = dims.width         || 6;
    const d  = dims.depth         || 6;
    const h  = dims.wallHeight    || 3;
    const t  = dims.wallThickness || 0.2;
    const dW = dims.doorWidth     || 1.0;
    const dH = dims.doorHeight    || 2.1;

    const wallMat = new THREE.MeshStandardMaterial({ color: mainColor, roughness: 0.8, metalness: 0.15, side: THREE.DoubleSide });
    const floorMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(color).multiplyScalar(0.6), roughness: 0.9, metalness: 0.0 });
    const doorMat = new THREE.MeshStandardMaterial({ color: emColor, emissive: emColor, emissiveIntensity: 0.4, roughness: 0.3, metalness: 0.7 });
    const neonMat = new THREE.MeshStandardMaterial({ color: emColor, emissive: emColor, emissiveIntensity: 1.6, transparent: true, opacity: 0.9 });

    const addWall = (sx, sy, sz, px, py, pz) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), wallMat);
      m.position.set(px, py, pz);
      m.castShadow = true;
      m.receiveShadow = true;
      roomGroup.add(m);
    };

    // 바닥
    const floor = new THREE.Mesh(new THREE.BoxGeometry(w, 0.05, d), floorMat);
    floor.position.set(0, 0, 0);
    floor.receiveShadow = true;
    roomGroup.add(floor);

    // 북쪽 벽 (z = -d/2) — 통벽
    addWall(w, h, t, 0, h / 2, -d / 2);
    // 동쪽 벽 (x = +w/2) — 통벽
    addWall(t, h, d, w / 2, h / 2, 0);
    // 서쪽 벽 (x = -w/2) — 통벽
    addWall(t, h, d, -w / 2, h / 2, 0);

    // 남쪽 벽 (z = +d/2) — 문 개구부
    const sideW = (w - dW) / 2;
    if (sideW > 0.01) {
      addWall(sideW, h, t, -(dW / 2 + sideW / 2), h / 2, d / 2);  // 왼쪽
      addWall(sideW, h, t,  (dW / 2 + sideW / 2), h / 2, d / 2);  // 오른쪽
    }
    const headerH = h - dH;
    if (headerH > 0.01) {
      addWall(dW, headerH, t, 0, dH + headerH / 2, d / 2);          // 인방
    }

    // 문짝
    const door = new THREE.Mesh(new THREE.BoxGeometry(dW - 0.06, dH - 0.04, t * 0.35), doorMat);
    door.position.set(0, dH / 2, d / 2);
    door.name = 'door-panel';
    roomGroup.add(door);

    // 네온 상단 엣지 (4방향)
    const nr = 0.04;
    const edges = [
      { len: w, rot: [0, 0, Math.PI / 2], pos: [0, h, -d / 2], name: 'neon-n' },
      { len: w, rot: [0, 0, Math.PI / 2], pos: [0, h,  d / 2], name: 'neon-s' },
      { len: d, rot: [Math.PI / 2, 0, 0], pos: [ w / 2, h, 0], name: 'neon-e' },
      { len: d, rot: [Math.PI / 2, 0, 0], pos: [-w / 2, h, 0], name: 'neon-w' },
    ];
    edges.forEach(({ len, rot, pos, name }) => {
      const geo = new THREE.CylinderGeometry(nr, nr, len, 6);
      geo.applyMatrix4(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(...rot)));
      const m = new THREE.Mesh(geo, neonMat);
      m.position.set(...pos);
      m.name = name;
      roomGroup.add(m);
    });

    roomGroup.userData = {
      interactive: true,
      type: 'IfcSpace',
      ifcType: 'IfcSpace',
      predefinedType,
      state: '공간 활성화',
    };

    this.renderer.worldGroup.add(roomGroup);
    this.renderer.interactiveObjects.push(roomGroup);
    return roomGroup;
  }

  // 13. [IfcWall] 파라메트릭 벽체
  createParametricWall(predefinedType, dims, color, neonStyle, emissiveColor) {
    const wallGroup = new THREE.Group();
    const mainColor = new THREE.Color(color);
    const emColor = new THREE.Color(emissiveColor);

    const length = dims.length || 8;
    const height = dims.height || 3.5;
    const thickness = dims.thickness || 0.25;

    const wallMat = new THREE.MeshStandardMaterial({ color: mainColor, roughness: 0.7, metalness: 0.2 });
    const wallMesh = new THREE.Mesh(new THREE.BoxGeometry(length, height, thickness), wallMat);
    wallMesh.position.set(0, height / 2, 0);
    wallMesh.castShadow = true;
    wallMesh.receiveShadow = true;
    wallGroup.add(wallMesh);

    // Sci-fi neon lines running horizontally across the wall
    const pipeGeo = new THREE.CylinderGeometry(0.04, 0.04, length, 8);
    pipeGeo.rotateZ(Math.PI / 2);
    const neonMat = new THREE.MeshStandardMaterial({
      color: emColor,
      emissive: emColor,
      emissiveIntensity: 1.5,
      transparent: true,
      opacity: 0.95
    });

    const neonPipe1 = new THREE.Mesh(pipeGeo, neonMat);
    neonPipe1.position.set(0, height * 0.3, thickness / 2 + 0.02);
    neonPipe1.name = 'wall-neon-1';
    wallGroup.add(neonPipe1);

    const neonPipe2 = new THREE.Mesh(pipeGeo, neonMat);
    neonPipe2.position.set(0, height * 0.7, thickness / 2 + 0.02);
    neonPipe2.name = 'wall-neon-2';
    wallGroup.add(neonPipe2);

    wallGroup.userData = {
      interactive: true,
      type: 'IfcWall',
      ifcType: 'IfcWall',
      predefinedType,
      state: '벽체 설계 활성'
    };

    this.renderer.worldGroup.add(wallGroup);
    this.renderer.interactiveObjects.push(wallGroup);
    return wallGroup;
  }

  // 14. [IfcColumn] 파라메트릭 기둥
  createParametricColumn(predefinedType, dims, color, neonStyle, emissiveColor) {
    const colGroup = new THREE.Group();
    const mainColor = new THREE.Color(color);
    const emColor = new THREE.Color(emissiveColor);

    const height = dims.height || 4.5;
    const radius = dims.radius || 0.4;

    const colMat = new THREE.MeshStandardMaterial({ color: mainColor, roughness: 0.5, metalness: 0.4 });
    const pillarGeo = new THREE.CylinderGeometry(radius, radius, height, 16);
    const pillar = new THREE.Mesh(pillarGeo, colMat);
    pillar.position.set(0, height / 2, 0);
    pillar.castShadow = true;
    pillar.receiveShadow = true;
    colGroup.add(pillar);

    // Top/Bottom rings
    const ringGeo = new THREE.TorusGeometry(radius + 0.05, 0.05, 8, 24);
    ringGeo.rotateX(Math.PI / 2);
    
    const ringMat = new THREE.MeshStandardMaterial({
      color: emColor,
      emissive: emColor,
      emissiveIntensity: 1.8
    });

    const ringTop = new THREE.Mesh(ringGeo, ringMat);
    ringTop.position.set(0, height - 0.1, 0);
    ringTop.name = 'col-ring-top';
    colGroup.add(ringTop);

    const ringBottom = new THREE.Mesh(ringGeo, ringMat);
    ringBottom.position.set(0, 0.1, 0);
    ringBottom.name = 'col-ring-bottom';
    colGroup.add(ringBottom);

    colGroup.userData = {
      interactive: true,
      type: 'IfcColumn',
      ifcType: 'IfcColumn',
      predefinedType,
      state: '기둥 지지 설계 활성'
    };

    this.renderer.worldGroup.add(colGroup);
    this.renderer.interactiveObjects.push(colGroup);
    return colGroup;
  }

  // 15. [IfcSlab] 파라메트릭 슬래브
  createParametricSlab(predefinedType, dims, color, neonStyle, emissiveColor) {
    const slabGroup = new THREE.Group();
    const mainColor = new THREE.Color(color);
    const emColor = new THREE.Color(emissiveColor);

    const width = dims.width || 8;
    const depth = dims.depth || 8;
    const thickness = dims.thickness || 0.3;

    const slabMat = new THREE.MeshStandardMaterial({ color: mainColor, roughness: 0.8, metalness: 0.1 });
    const slab = new THREE.Mesh(new THREE.BoxGeometry(width, thickness, depth), slabMat);
    slab.position.set(0, thickness / 2, 0);
    slab.receiveShadow = true;
    slab.castShadow = true;
    slabGroup.add(slab);

    // Glowing neon grid borders
    const neonMat = new THREE.MeshStandardMaterial({
      color: emColor,
      emissive: emColor,
      emissiveIntensity: 1.5,
      transparent: true,
      opacity: 0.9
    });

    const borderGeoX = new THREE.CylinderGeometry(0.03, 0.03, width, 6);
    borderGeoX.rotateZ(Math.PI / 2);
    const borderGeoZ = new THREE.CylinderGeometry(0.03, 0.03, depth, 6);
    borderGeoZ.rotateX(Math.PI / 2);

    const b1 = new THREE.Mesh(borderGeoX, neonMat);
    b1.position.set(0, thickness + 0.01, depth / 2);
    b1.name = 'slab-border-1';
    
    const b2 = new THREE.Mesh(borderGeoX, neonMat);
    b2.position.set(0, thickness + 0.01, -depth / 2);
    b2.name = 'slab-border-2';

    const b3 = new THREE.Mesh(borderGeoZ, neonMat);
    b3.position.set(width / 2, thickness + 0.01, 0);
    b3.name = 'slab-border-3';

    const b4 = new THREE.Mesh(borderGeoZ, neonMat);
    b4.position.set(-width / 2, thickness + 0.01, 0);
    b4.name = 'slab-border-4';

    slabGroup.add(b1, b2, b3, b4);

    slabGroup.userData = {
      interactive: true,
      type: 'IfcSlab',
      ifcType: 'IfcSlab',
      predefinedType,
      state: '슬래브 고정 완료'
    };

    this.renderer.worldGroup.add(slabGroup);
    this.renderer.interactiveObjects.push(slabGroup);
    return slabGroup;
  }

  // 16. [IfcRoof] 파라메트릭 지붕
  createParametricRoof(predefinedType, dims, color, neonStyle, emissiveColor) {
    const roofGroup = new THREE.Group();
    const mainColor = new THREE.Color(color);
    const emColor = new THREE.Color(emissiveColor);

    const width = dims.width || 8;
    const depth = dims.depth || 8;
    const height = dims.height || 2.5;

    // Create custom triangular prism roof geometry
    const geom = new THREE.BufferGeometry();
    const w2 = width / 2;
    const d2 = depth / 2;
    
    const vertices = new Float32Array([
      // Front Triangle Face
      -w2, 0, d2,    w2, 0, d2,     0, height, d2,
      // Back Triangle Face
      -w2, 0, -d2,   0, height, -d2, w2, 0, -d2,
      // Left Sloped Face
      -w2, 0, -d2,  -w2, 0, d2,     0, height, d2,
      -w2, 0, -d2,   0, height, d2, 0, height, -d2,
      // Right Sloped Face
       w2, 0, d2,    w2, 0, -d2,    0, height, -d2,
       w2, 0, d2,    0, height, -d2, 0, height, d2
    ]);

    geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geom.computeVertexNormals();

    const roofMat = new THREE.MeshStandardMaterial({ color: mainColor, roughness: 0.6, metalness: 0.25, side: THREE.DoubleSide });
    const roofMesh = new THREE.Mesh(geom, roofMat);
    roofMesh.position.set(0, 0, 0);
    roofMesh.castShadow = true;
    roofMesh.receiveShadow = true;
    roofGroup.add(roofMesh);

    // Glowing Neon Ridge cap line (apex of the roof)
    const neonMat = new THREE.MeshStandardMaterial({
      color: emColor,
      emissive: emColor,
      emissiveIntensity: 1.7
    });

    const ridgeCapGeo = new THREE.CylinderGeometry(0.05, 0.05, depth, 6);
    ridgeCapGeo.rotateX(Math.PI / 2);

    const ridge = new THREE.Mesh(ridgeCapGeo, neonMat);
    ridge.position.set(0, height + 0.02, 0);
    ridge.name = 'roof-ridge-cap';
    roofGroup.add(ridge);

    roofGroup.userData = {
      interactive: true,
      type: 'IfcRoof',
      ifcType: 'IfcRoof',
      predefinedType,
      state: '지붕 시공 배치 완료'
    };

    this.renderer.worldGroup.add(roofGroup);
    this.renderer.interactiveObjects.push(roofGroup);
    return roofGroup;
  }

  // 17. [IfcFooting] 파라메트릭 기반 기초
  createParametricFooting(predefinedType, dims, color, neonStyle, emissiveColor) {
    const footingGroup = new THREE.Group();
    const mainColor = new THREE.Color(color);
    const emColor = new THREE.Color(emissiveColor);

    const w = dims.width || 3.0;
    const d = dims.depth || 3.0;
    const h = dims.height || 0.8;

    const footingMat = new THREE.MeshStandardMaterial({ color: mainColor, roughness: 0.9, metalness: 0.1 });
    const footing = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), footingMat);
    footing.position.set(0, h / 2, 0);
    footing.castShadow = true;
    footing.receiveShadow = true;
    footingGroup.add(footing);

    const boltMat = new THREE.MeshStandardMaterial({ color: emColor, emissive: emColor, emissiveIntensity: 1.5 });
    const bx = w / 2 - 0.4;
    const bz = d / 2 - 0.4;
    const bp = [[bx, bz], [-bx, bz], [bx, -bz], [-bx, -bz]];
    bp.forEach(([x, z], i) => {
      const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.3, 6), boltMat);
      bolt.position.set(x, h + 0.15, z);
      bolt.name = `footing-bolt-${i}`;
      footingGroup.add(bolt);
    });

    footingGroup.userData = {
      interactive: true,
      type: 'IfcFooting',
      ifcType: 'IfcFooting',
      predefinedType,
      state: '기반 기초 지지 안착 완료'
    };

    this.renderer.worldGroup.add(footingGroup);
    this.renderer.interactiveObjects.push(footingGroup);
    return footingGroup;
  }

  // 18. [IfcBeam] 파라메트릭 구조 보
  createParametricBeam(predefinedType, dims, color, neonStyle, emissiveColor) {
    const beamGroup = new THREE.Group();
    const mainColor = new THREE.Color(color);
    const emColor = new THREE.Color(emissiveColor);

    const length = dims.length || 8.0;
    const height = dims.height || 0.4;
    const width = dims.width || 0.3;

    const beamMat = new THREE.MeshStandardMaterial({ color: mainColor, roughness: 0.5, metalness: 0.8 });
    const beam = new THREE.Mesh(new THREE.BoxGeometry(length, height, width), beamMat);
    beam.position.set(0, height / 2, 0);
    beam.castShadow = true;
    beam.receiveShadow = true;
    beamGroup.add(beam);

    const neonMat = new THREE.MeshStandardMaterial({ color: emColor, emissive: emColor, emissiveIntensity: 1.6 });
    const neonLineL = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, length - 0.2, 8), neonMat);
    neonLineL.rotateZ(Math.PI / 2);
    neonLineL.position.set(0, height / 2, width / 2 + 0.02);
    neonLineL.name = 'beam-neon-line-l';

    const neonLineR = neonLineL.clone();
    neonLineR.position.z = -width / 2 - 0.02;
    neonLineR.name = 'beam-neon-line-r';

    beamGroup.add(neonLineL, neonLineR);

    beamGroup.userData = {
      interactive: true,
      type: 'IfcBeam',
      ifcType: 'IfcBeam',
      predefinedType,
      state: '보 수평 프레임 시공 완료'
    };

    this.renderer.worldGroup.add(beamGroup);
    this.renderer.interactiveObjects.push(beamGroup);
    return beamGroup;
  }

  // 19. [IfcDiscreteAccessory] 파라메트릭 연결 철물
  createParametricDiscreteAccessory(predefinedType, dims, color, neonStyle, emissiveColor) {
    const accGroup = new THREE.Group();
    const mainColor = new THREE.Color(color);
    const emColor = new THREE.Color(emissiveColor);

    const plate = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.15, 0.8),
      new THREE.MeshStandardMaterial({ color: mainColor, roughness: 0.3, metalness: 0.9 })
    );
    plate.position.y = 0.075;
    plate.castShadow = true;
    plate.receiveShadow = true;
    accGroup.add(plate);

    const clampL = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.6, 0.8),
      new THREE.MeshStandardMaterial({ color: mainColor.clone().multiplyScalar(0.8), roughness: 0.3, metalness: 0.9 })
    );
    clampL.position.set(-0.36, 0.3, 0);
    const clampR = clampL.clone();
    clampR.position.x = 0.36;
    accGroup.add(clampL, clampR);

    const pin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.9, 8),
      new THREE.MeshStandardMaterial({ color: emColor, emissive: emColor, emissiveIntensity: 1.5 })
    );
    pin.rotation.z = Math.PI / 2;
    pin.position.set(0, 0.3, 0);
    pin.name = 'accessory-pin';
    accGroup.add(pin);

    accGroup.userData = {
      interactive: true,
      type: 'IfcDiscreteAccessory',
      ifcType: 'IfcDiscreteAccessory',
      predefinedType,
      state: '철물 접합 완비'
    };

    this.renderer.worldGroup.add(accGroup);
    this.renderer.interactiveObjects.push(accGroup);
    return accGroup;
  }

  // 20. [IfcBuildingElementProxy] 파라메트릭 위치 참조 프록시
  createParametricBuildingElementProxy(predefinedType, dims, color, neonStyle, emissiveColor) {
    const proxyGroup = new THREE.Group();
    const emColor = new THREE.Color(emissiveColor);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.0, 0.05, 8, 32),
      new THREE.MeshStandardMaterial({ color: emColor, emissive: emColor, emissiveIntensity: 1.2 })
    );
    ring.rotation.x = Math.PI / 2;
    ring.name = 'proxy-ring';

    const axisX = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 2.5, 8),
      new THREE.MeshStandardMaterial({ color: 0xff3333, emissive: 0xff3333, emissiveIntensity: 1.5 })
    );
    axisX.rotation.z = Math.PI / 2;
    axisX.name = 'axis-x';

    const axisY = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 2.5, 8),
      new THREE.MeshStandardMaterial({ color: 0x33ff33, emissive: 0x33ff33, emissiveIntensity: 1.5 })
    );
    axisY.name = 'axis-y';

    const axisZ = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 2.5, 8),
      new THREE.MeshStandardMaterial({ color: 0x3333ff, emissive: 0x3333ff, emissiveIntensity: 1.5 })
    );
    axisZ.rotation.x = Math.PI / 2;
    axisZ.name = 'axis-z';

    proxyGroup.add(ring, axisX, axisY, axisZ);

    proxyGroup.userData = {
      interactive: true,
      type: 'IfcBuildingElementProxy',
      ifcType: 'IfcBuildingElementProxy',
      predefinedType,
      state: '위치 기준 좌표 활성'
    };

    this.renderer.worldGroup.add(proxyGroup);
    this.renderer.interactiveObjects.push(proxyGroup);
    return proxyGroup;
  }
}


