import React, { useContext } from 'react';
import { Box, FormControlLabel, Switch, Slider } from '@mui/material';
import { ClippingContext } from '../contexts/ClippingContext';

/**
 * ClippingControls component provides UI for adjusting clipping planes
 * along X, Y, and Z axes.
 */
function ClippingControls() {
  const {
    handleClippingPlaneChange,
    boundingBox,
    clippingPlanesState,
  } = useContext(ClippingContext);

  const axes = ['x', 'y', 'z'];

  const sliderValueTooltipFormat = (value, axis) => `${axis} = ${value.toFixed(2)}`;

  return (
    <>
      {axes.map((axis) => (
        <Box key={axis} sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={clippingPlanesState[axis].enabled}
                onChange={(e) => handleClippingPlaneChange(axis, 'enabled', e.target.checked)}
              />
            }
            label={`${axis.toUpperCase()} Clipping Range`}
          />
          <Slider
            value={clippingPlanesState[axis].range}
            onChange={(_, value) => handleClippingPlaneChange(axis, 'range', value)}
            min={boundingBox ? boundingBox.min[axis] : -10}
            max={boundingBox ? boundingBox.max[axis] : 10}
            step={0.1}
            disabled={!clippingPlanesState[axis].enabled}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => sliderValueTooltipFormat(value, axis)}
            disableSwap
          />
        </Box>
      ))}
    </>
  );
};

export default ClippingControls;