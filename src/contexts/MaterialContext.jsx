// src/contexts/MaterialContext.js
import React, { createContext, useState, useCallback } from 'react';
import { getMaterialColor, getMaterialName } from '../utils/materialColors';

export const MaterialContext = createContext();

export const MaterialProvider = ({ children }) => {
  const [materials, setMaterials] = useState([]);

  const toggleMaterialVisibility = useCallback((materialIndex) => {
    setMaterials((prevMaterials) =>
      prevMaterials.map(([index, material]) =>
        index === materialIndex
          ? [
              index,
              { ...material, visible: !material.visible },
            ]
          : [index, material]
      )
    );
  }, []);

  const updateMaterials = useCallback((newMaterials) => {
    const updatedMaterials = newMaterials.map(([index, material]) => [
      index,
      {
        ...material,
        color: getMaterialColor(index),
        name: getMaterialName(index),
      },
    ]);
    setMaterials(updatedMaterials);
  }, []);

  return (
    <MaterialContext.Provider value={{ materials, updateMaterials, toggleMaterialVisibility }}>
      {children}
    </MaterialContext.Provider>
  );
};