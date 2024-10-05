// src/components/GeometryGroup.js
import React, { useContext, useEffect } from 'react';
import * as THREE from 'three';
import { MaterialContext } from '../contexts/MaterialContext';
import { ClippingContext } from '../contexts/ClippingContext';

/**
 * GeometryGroup component renders a group of geometries with specified materials and shading.
 * @param {Object[]} geometries - Array of geometry objects to render.
 * @param {boolean} showWireframe - Flag to show wireframe.
 * @param {string} shading - Type of shading to apply.
 */
function GeometryGroup({ geometries, showWireframe, shading }) {
  const { materials } = useContext(MaterialContext);
  const { setBoundingBoxAndUpdateClippingPlanes, getClippingPlanes } = useContext(ClippingContext);

  useEffect(() => {
    if (geometries.length > 0) {
      const boundingBox = new THREE.Box3();

      // Calculate bounding box for visible geometries
      geometries.forEach(({ geometry, materialIndex }) => {
        const materialInfo = materials.find(([index]) => index === materialIndex);
        if (materialInfo && materialInfo[1].visible) {
          geometry.computeBoundingBox();
          boundingBox.union(geometry.boundingBox);
        }
      });

      if (!boundingBox.isEmpty()) {
        setBoundingBoxAndUpdateClippingPlanes(boundingBox.expandByScalar(0.1));
      }
    }
  }, [geometries, materials, setBoundingBoxAndUpdateClippingPlanes]);

  /**
   * Renders a mesh with optional wireframe.
   */
  const renderMesh = (geometry, materialInfo, idx, material) => (
    <>
      <mesh key={`${idx}-solid`} geometry={geometry} visible={materialInfo[1].visible} renderOrder={1}>
        {material}
      </mesh>
      {showWireframe && (
        <mesh key={`${idx}-wireframe`} geometry={geometry} visible={materialInfo[1].visible} renderOrder={2}>
          <meshPhongMaterial color="black" wireframe clippingPlanes={getClippingPlanes()} />
        </mesh>
      )}
    </>
  );

  return (
    <>
      {geometries.map(({ geometry, materialIndex }, idx) => {
        const materialInfo = materials.find(([index]) => index === materialIndex);
        if (!materialInfo) return null;

        const materialProps = {
          color: materialInfo[1].color,
          side: THREE.FrontSide,
          clippingPlanes: getClippingPlanes(),
          clipShadows: true,
        };

        /**
         * Creates material based on shading type.
         */
        const buildMaterial = () => {
          switch (shading) {
            case 'phong':
              return <meshPhongMaterial {...materialProps} />;
            case 'envmap':
              return (
                <meshPhysicalMaterial
                  {...materialProps}
                  metalness={0.8}
                  roughness={0.3}
                  envMapIntensity={1}
                />
              );
            default:
              console.warn(`Unsupported shading type: ${shading}`);
              return null;
          }
        };

        const material = buildMaterial();
        if (!material) return null;

        return renderMesh(geometry, materialInfo, idx, material);
      })}
    </>
  );
}

export default GeometryGroup;