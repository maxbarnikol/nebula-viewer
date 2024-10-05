import * as THREE from 'three';

const specialMaterials = {
  '-122': { name: 'Ideal mirror', color: '#9adabe' },
  '-123': { name: 'Vacuum', color: '#6b7ecd' },
  '-124': { name: 'BSE detector', color: '#c772a6' },
  '-125': { name: 'SE detector', color: '#d39f3f' },
  '-126': { name: 'Detector', color: '#c7633e' },
  '-127': { name: 'Terminator', color: '#cd4666' },
  '-128': { name: 'Does nothing', color: '#444444' },
  '1': { name: 'Material 1', color: '#72b543' },
  '2': { name: 'Material 2', color: '#b355bf' },
  '3': { name: 'Material 3', color: '#8e873b' },
  '4': { name: 'Material 4', color: '#FFFFFF' },
};

const baseColors = [
    '#9e0142',
    '#d53e4f',
    '#f46d43',
    '#fdae61',
    '#fee08b',
    '#ffffbf',
    '#e6f598',
    '#abdda4',
    '#66c2a5',
    '#3288bd',
    '#5e4fa2',
];

export const getMaterialColor = (index) => {
  if (specialMaterials[index]) {
    return new THREE.Color(specialMaterials[index].color);
  }
  const colorIndex = Math.abs(index) % baseColors.length;
  return new THREE.Color(baseColors[colorIndex]);
};

export const getMaterialName = (index) => {
  return specialMaterials[index] ? specialMaterials[index].name : `Material ${index}`;
};