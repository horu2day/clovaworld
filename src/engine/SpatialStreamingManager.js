import * as THREE from 'three';

export class SpatialStreamingManager {
  constructor(rendererInstance) {
    this.renderer = rendererInstance;
    this.scene = rendererInstance.scene;
    this.worldGroup = rendererInstance.worldGroup;

    this.CHUNK_SIZE = 200;
    this.NUM_CHUNKS = 9;
    this.MIN_Z = -900;
    this.MAX_Z = 900;

    // Array of THREE.Groups for each chunk (0 to 8)
    this.chunks = [];
    for (let i = 0; i < this.NUM_CHUNKS; i++) {
      const g = new THREE.Group();
      g.name = `chunk-group-${i}`;
      this.chunks.push({
        group: g,
        objects: [], // raw interactive/physics objects in this chunk
        active: false
      });
    }

    this.currentChunkIdx = -1;
    this.activeChunkIndices = new Set();
  }

  // Register an object (or group of objects) to a chunk based on its Z position
  registerObject(obj, zPos) {
    const chunkIdx = Math.max(0, Math.min(this.NUM_CHUNKS - 1, Math.floor((zPos - this.MIN_Z) / this.CHUNK_SIZE)));
    this.chunks[chunkIdx].group.add(obj);
    this.chunks[chunkIdx].objects.push(obj);
  }

  // Clear all registered chunks and free memory
  clear() {
    this.chunks.forEach(c => {
      // Remove chunk groups from the scene graph
      this.worldGroup.remove(c.group);
      
      // Dispose meshes recursively inside chunk groups to prevent VRAM leak
      c.group.traverse(child => {
        if (child.isMesh || child.isPoints || child.isInstancedMesh) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(m => m.dispose());
            } else {
              child.material.dispose();
            }
          }
        }
      });

      // Clear children
      while (c.group.children.length > 0) {
        c.group.remove(c.group.children[0]);
      }
      
      c.objects = [];
      c.active = false;
    });

    this.currentChunkIdx = -1;
    this.activeChunkIndices.clear();
  }

  // Core update cycle: Track camera Z and manage chunk visibility
  update(cameraZ) {
    const newChunkIdx = Math.max(0, Math.min(this.NUM_CHUNKS - 1, Math.floor((cameraZ - this.MIN_Z) / this.CHUNK_SIZE)));
    
    if (newChunkIdx === this.currentChunkIdx) {
      return false; // No chunk transition
    }

    const prevChunkIdx = this.currentChunkIdx;
    this.currentChunkIdx = newChunkIdx;
    
    // Determine active chunks: Current +/- 1 chunk (3 active chunks to cover 600m window)
    const nextActive = new Set();
    const minActive = Math.max(0, this.currentChunkIdx - 1);
    const maxActive = Math.min(this.NUM_CHUNKS - 1, this.currentChunkIdx + 1);
    
    for (let i = minActive; i <= maxActive; i++) {
      nextActive.add(i);
    }

    let changed = false;

    // Load active chunks, unload inactive chunks
    for (let i = 0; i < this.NUM_CHUNKS; i++) {
      const chunk = this.chunks[i];
      const shouldBeActive = nextActive.has(i);

      if (shouldBeActive && !chunk.active) {
        // Load chunk group to world group
        this.worldGroup.add(chunk.group);
        chunk.active = true;
        changed = true;
      } else if (!shouldBeActive && chunk.active) {
        // Unload chunk group from world group
        this.worldGroup.remove(chunk.group);
        chunk.active = false;
        changed = true;
      }
    }

    this.activeChunkIndices = nextActive;
    return changed;
  }

  // Get list of active interactive objects across all active chunks
  getActiveObjects() {
    const activeObjs = [];
    this.activeChunkIndices.forEach(idx => {
      activeObjs.push(...this.chunks[idx].objects);
    });
    return activeObjs;
  }
}
