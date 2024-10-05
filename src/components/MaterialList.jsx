// src/components/MaterialList.js
import React, { useContext } from 'react';
import { Grid, FormControlLabel, Checkbox, Box, Typography } from '@mui/material';
import { MaterialContext } from '../contexts/MaterialContext';

/**
 * MaterialList component displays a list of materials with visibility toggles.
 * It uses the MaterialContext to access and update material visibility.
 */
function MaterialList(){
  const { materials, toggleMaterialVisibility } = useContext(MaterialContext);

  return (
    <>
      {materials.length === 0 ? (
        <Typography color="text.secondary">No materials loaded</Typography>
      ) : (
        <Grid container spacing={2}>
          {materials.map(([index, material]) => (
            <Grid item xs={12} key={index}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={material.visible}
                    onChange={() => toggleMaterialVisibility(index)}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        backgroundColor: `#${material.color.getHexString()}`,
                        border: '1px solid black',
                        mr: 1,
                      }}
                    />
                    <Typography>
                      {material.name} ({index})
                    </Typography>
                  </Box>
                }
              />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};

export default MaterialList;