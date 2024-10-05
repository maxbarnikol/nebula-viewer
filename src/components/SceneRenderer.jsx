// src/components/SceneRenderer.js
import React, { useRef, useEffect, useContext, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Box, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import {
  OrbitControls,
  Environment,
  GizmoHelper,
  GizmoViewport,
  Grid,
  PerspectiveCamera,
} from '@react-three/drei';
import * as THREE from 'three';
import { ClippingContext } from '../contexts/ClippingContext';
import { calculateGridParams } from '../utils/gridUtils';
import SceneContent from './SceneContent';

/**
 * SceneRenderer component for rendering 3D scenes with various controls and helpers.
 * It manages camera positioning, lighting, and grid display based on the loaded geometry.
 * 
 * @param {Object} props - The component props
 * @param {File} props.file - The loaded .tri file
 * @param {boolean} props.showWireframe - Whether to display wireframe
 * @param {boolean} props.showGrid - Whether to display the grid
 * @param {string} props.shading - The shading mode ('phong' or 'envmap')
 */
function SceneRenderer({ file, showWireframe, showGrid, shading }) {
  const controlsRef = useRef();
  const cameraRef = useRef();
  const { boundingBox } = useContext(ClippingContext);

  // Reset camera view to fit the entire scene
  const resetView = useCallback(() => {
    if (!controlsRef.current || !boundingBox || !cameraRef.current) return;

    const camera = cameraRef.current;
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    boundingBox.getCenter(center);
    boundingBox.getSize(size);

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = (camera.fov * Math.PI) / 180;
    let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));

    camera.position.set(center.x, center.y, center.z + cameraZ);
    camera.near = cameraZ / 100;
    camera.far = cameraZ * 100;
    camera.updateProjectionMatrix();

    controlsRef.current.target.copy(center);
    controlsRef.current.update();
  }, [boundingBox]);

  // Reset view when bounding box changes
  useEffect(() => {
    if (boundingBox) {
      resetView();
    }
  }, [boundingBox, resetView]);

  const gridParams = calculateGridParams(boundingBox);

  return (
    <>
      <Box
        sx={{
          position: 'absolute',
          top: 100,
          right: 10,
          zIndex: 1000,
        }}
      >
        <IconButton size="large" onClick={resetView} aria-label="Reset View">
          <HomeIcon />
        </IconButton>
      </Box>
      <Canvas gl={{ localClippingEnabled: true }} style={{ flexGrow: 1 }}>
        {/* Scene lighting */}
        <ambientLight intensity={0.3} />
        <Environment preset="city" />

        {/* Main scene content */}
        <SceneContent
          file={file}
          showWireframe={showWireframe}
          shading={shading}
        />

        {/* Camera setup */}
        <PerspectiveCamera ref={cameraRef} dampingFactor={0.3} makeDefault>
          <directionalLight position={[5, 5, 5]} intensity={0.5} />
          <directionalLight position={[-5, -5, 5]} intensity={0.5} />
        </PerspectiveCamera>
        
        {/* Camera controls */}
        <OrbitControls camera={cameraRef.current} ref={controlsRef} dampingFactor={0.3} makeDefault />

        {/* Orientation helper */}
        <GizmoHelper
          alignment="top-right"
          margin={[80, 80]}
          onTarget={() =>
            boundingBox
              ? boundingBox.getCenter(new THREE.Vector3())
              : new THREE.Vector3()
          }
        >
          <GizmoViewport
            axisColors={['#9d4b4b', '#2f7f4f', '#3b5b9d']}
            labelColor="white"
          />
        </GizmoHelper>

        {/* Grid and axes helpers */}
        {showGrid && <axesHelper args={[100]} />}
        {boundingBox && gridParams && showGrid && (
          <Grid
            position={gridParams.position}
            args={gridParams.args}
            rotation={[Math.PI / 2, 0, 0]}
            cellSize={gridParams.cellSize}
            sectionSize={gridParams.sectionSize}
            fadeDistance={gridParams.fadeDistance}
          />
        )}
      </Canvas>
    </>
  );
};

export default SceneRenderer;