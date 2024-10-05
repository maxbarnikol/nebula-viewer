// src/utils/parseGeometry.js
import * as THREE from 'three';

export const parseGeometry = (text) => {
  const lines = text.split('\n');
  const materialsMap = new Map();
  const geometriesMap = new Map();

  for (const line of lines) {
    const parts = line.trim().split(/\s+/);
    if (parts.length === 11) {
      const [matIn, matOut, x1, y1, z1, x2, y2, z2, x3, y3, z3] = parts.map(Number);

      // Handle Materials
      [matIn, matOut].forEach((mat) => {
        if (!materialsMap.has(mat)) {
          materialsMap.set(mat, {
            color: new THREE.Color().setHSL(Math.random(), 1, 0.5),
            visible: true,
          });
        }
      });

      // Create Geometry Data
      const addTriangle = (materialIndex, vertices, isOutside) => {
        if (!geometriesMap.has(materialIndex)) {
          geometriesMap.set(materialIndex, {
            positions: [],
            normals: [],
          });
        }
        const geometryData = geometriesMap.get(materialIndex);

        let [v0, v1, v2] = vertices.map((v) => new THREE.Vector3(...v));

        const edge1 = new THREE.Vector3().subVectors(v1, v0);
        const edge2 = new THREE.Vector3().subVectors(v2, v0);
        const normal = new THREE.Vector3().crossVectors(edge1, edge2).normalize();

        if (!isOutside) {
          // Reverse order to flip normal for inside face
          [v1, v2] = [v2, v1];
          normal.negate();
        }

        // Add positions
        geometryData.positions.push(...v0.toArray(), ...v1.toArray(), ...v2.toArray());

        // Add normals
        for (let i = 0; i < 3; i++) {
          geometryData.normals.push(normal.x, normal.y, normal.z);
        }
      };

      const vertices = [
        [x1, y1, z1],
        [x2, y2, z2],
        [x3, y3, z3],
      ];

      // Add triangles for matOut (outside face) and matIn (inside face)
      addTriangle(matOut, vertices, true);
      addTriangle(matIn, vertices, false);
    }
  }

  // Create geometries
  const geometries = [];
  geometriesMap.forEach((geometryData, materialIndex) => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(geometryData.positions, 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(geometryData.normals, 3));
    geometries.push({ geometry, materialIndex });
  });

  return {
    geometries,
    materials: Array.from(materialsMap.entries()),
  };
};