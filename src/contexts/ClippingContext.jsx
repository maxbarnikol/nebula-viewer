// src/contexts/ClippingContext.js
import React, { createContext, useState, useCallback} from 'react';
import * as THREE from 'three';

export const ClippingContext = createContext();

export const ClippingProvider = ({ children }) => {
  const [clippingPlanesState, setClippingPlanesState] = useState({
    x: { enabled: false, range: [0, 0] },
    y: { enabled: false, range: [0, 0] },
    z: { enabled: false, range: [0, 0] },
  });
  const [boundingBox, setBoundingBox] = useState(null);

  const setBoundingBoxAndUpdateClippingPlanes = useCallback((newBoundingBox) => {
    setBoundingBox(newBoundingBox);
    if (newBoundingBox) {
      setClippingPlanesState((prev) => ({
        x: { ...prev.x, range: prev.x.enabled ? prev.x.range : [newBoundingBox.min.x, newBoundingBox.max.x] },
        y: { ...prev.y, range: prev.y.enabled ? prev.y.range : [newBoundingBox.min.y, newBoundingBox.max.y] },
        z: { ...prev.z, range: prev.z.enabled ? prev.z.range : [newBoundingBox.min.z, newBoundingBox.max.z] },
      }));
    }
  }, []);

  const handleClippingPlaneChange = useCallback((axis, field, value) => {
    setClippingPlanesState((prev) => ({
      ...prev,
      [axis]: {
        ...prev[axis],
        [field]: value,
      },
    }));
  }, []);

  const getClippingPlanes = useCallback(() => {
    const planes = [];
    if (!boundingBox) return planes;

    const axes = ['x', 'y', 'z'];
    axes.forEach((axis) => {
      const planeState = clippingPlanesState[axis];
      if (planeState.enabled) {
        const normalMin = new THREE.Vector3();
        const normalMax = new THREE.Vector3();
        normalMin[axis] = 1;
        normalMax[axis] = -1;
        const [min, max] = planeState.range;
        planes.push(new THREE.Plane(normalMin, -min));
        planes.push(new THREE.Plane(normalMax, max));
      }
    });

    return planes;
  }, [clippingPlanesState, boundingBox]);

  return (
    <ClippingContext.Provider
      value={{
        setBoundingBoxAndUpdateClippingPlanes,
        boundingBox,
        getClippingPlanes,
        handleClippingPlaneChange,
        clippingPlanesState,
      }}
    >
      {children}
    </ClippingContext.Provider>
  );
};