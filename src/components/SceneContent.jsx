// src/components/SceneContent.js
import React, { useContext, useEffect, useState } from 'react';
import * as THREE from 'three';
import { MaterialContext } from '../contexts/MaterialContext';
import { ClippingContext } from '../contexts/ClippingContext';
import { parseGeometry } from '../utils/parseGeometry';
import GeometryGroup from './GeometryGroup';

/**
 * SceneContent component handles the loading and rendering of 3D geometries.
 * It uses contexts for material and clipping plane management.
 * 
 * @param {Object} props - The component props
 * @param {File} props.file - The loaded .tri file
 * @param {boolean} props.showWireframe - Whether to display wireframe
 * @param {string} props.shading - The shading mode ('phong' or 'envmap')
 */
function SceneContent({ file, showWireframe, shading }) {
  const { updateMaterials } = useContext(MaterialContext);
  const { setBoundingBoxAndUpdateClippingPlanes } = useContext(ClippingContext);
  const [geometries, setGeometries] = useState([]);

  useEffect(() => {
    if (!file) return;

    const loadGeometry = async () => {
      try {
        const text = await file.text();
        const { geometries, materials } = parseGeometry(text);

        setGeometries(geometries);
        updateMaterials(materials);

        if (geometries.length > 0) {
          const boundingBox = new THREE.Box3();
          geometries.forEach(({ geometry }) => {
            geometry.computeBoundingBox();
            boundingBox.union(geometry.boundingBox);
          });
          // Expand bounding box slightly to ensure all geometries are visible
          setBoundingBoxAndUpdateClippingPlanes(boundingBox.expandByScalar(0.1));
        }

        console.log('Geometry loaded successfully.');
      } catch (error) {
        console.error('Error loading geometry:', error);
      }
    };

    loadGeometry();
  }, [file, updateMaterials, setBoundingBoxAndUpdateClippingPlanes]);

  return (
    <GeometryGroup
      geometries={geometries}
      showWireframe={showWireframe}
      shading={shading}
    />
  );
}

export default SceneContent;