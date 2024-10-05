// src/utils/gridUtils.js
export function calculateGridParams(boundingBox) {
    if (!boundingBox) return null;
  
    const sectionSize = 100;
    const cellSize = 10;
  
    // Calculate the number of sections needed in each direction
    const sectionsX = Math.ceil((boundingBox.max.x - boundingBox.min.x) / sectionSize) * 2;
    const sectionsY = Math.ceil((boundingBox.max.y - boundingBox.min.y) / sectionSize) * 2;
  
    // Calculate grid size
    const gridSizeX = sectionsX * sectionSize;
    const gridSizeY = sectionsY * sectionSize;
  
    // Calculate the offset to position the grid
    const offsetX =
      Math.floor(boundingBox.min.x / sectionSize + sectionsX / 4) * sectionSize;
    const offsetY =
      Math.floor(boundingBox.min.y / sectionSize + sectionsY / 4) * sectionSize;
  
    // Calculate fade distance
    const fadeDistance = Math.sqrt(gridSizeX ** 2 + gridSizeY ** 2) * 0.5;
  
    return {
      position: [offsetX, offsetY, 0],
      args: [gridSizeX, gridSizeY, 1],
      cellSize,
      sectionSize,
      fadeDistance,
    };
  }