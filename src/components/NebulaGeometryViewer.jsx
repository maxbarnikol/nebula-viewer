import React, { useState, useCallback } from 'react';
import {
  Box,
  FormControlLabel,
  Switch,
  Divider,
  Typography,
  Paper,
  Select,
  MenuItem,
  useMediaQuery,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import SceneRenderer from './SceneRenderer';
import FileUploader from './FileUploader';
import MaterialList from './MaterialList';
import ClippingControls from './ClippingControls';
import { useDropzone } from 'react-dropzone';

/**
 * NebulaGeometryViewer is the main component for the 3D geometry viewer application.
 * It manages the overall layout, state, and user interactions for the viewer.
 */
function NebulaGeometryViewer() {
  // State management for various UI controls and file handling
  const [file, setFile] = useState(null);
  const [showWireframe, setShowWireframe] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [shading, setShading] = useState('phong');
  const [sidebarView, setSidebarView] = useState('visibility');

  const isTallScreen = useMediaQuery('(min-height:600px)');

  const toggleWireframe = () => setShowWireframe((prev) => !prev);
  const toggleGrid = () => setShowGrid((prev) => !prev);
  const handleSidebarViewChange = (_, newView) => {
    if (newView !== null) {
      setSidebarView(newView);
    }
  };

  // File drop handler for drag-and-drop functionality
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.tri',
    noClick: true,
    noKeyboard: true,
  });

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Main content area */}
      <Box
        {...getRootProps()}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <input {...getInputProps()} />
        {/* Drag-and-drop overlay */}
        {isDragActive && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
          >
            <Typography variant="h4" color="white">
              Drop file here to load
            </Typography>
          </Box>
        )}
        {/* Control panel */}
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <FileUploader setFile={setFile} />
            <FormControlLabel
              control={<Switch checked={showWireframe} onChange={toggleWireframe} />}
              label="Show Wireframe"
            />
            <FormControlLabel
              control={<Switch checked={showGrid} onChange={toggleGrid} />}
              label="Show Grid"
            />
            <Select
              value={shading}
              onChange={(e) => setShading(e.target.value)}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="phong">Phong Shading</MenuItem>
              <MenuItem value="envmap">Environment Map Shading</MenuItem>
            </Select>
          </Box>
        </Box>
        {/* 3D scene renderer */}
        <SceneRenderer
          file={file}
          showWireframe={showWireframe}
          showGrid={showGrid}
          shading={shading}
        />
      </Box>
      {/* Sidebar */}
      <Paper sx={{ width: '25%', minWidth: 300, p: 4, overflow: 'auto', maxHeight: '100%' }}>
        {/* Toggle buttons for sidebar view on smaller screens */}
        {!isTallScreen && (
          <ToggleButtonGroup
            value={sidebarView}
            exclusive
            onChange={handleSidebarViewChange}
            aria-label="sidebar view"
            sx={{ mb: 2, width: '100%' }}
          >
            <ToggleButton value="visibility" aria-label="visibility">
              Visibility
            </ToggleButton>
            <ToggleButton value="clipping" aria-label="clipping">
              Clipping
            </ToggleButton>
          </ToggleButtonGroup>
        )}
        <Box sx={{ mt: 2 }}>
          {/* Material visibility controls */}
          {(isTallScreen || sidebarView === 'visibility') && (
            <>
              <Typography variant="h6" gutterBottom>
                Material Visibility
              </Typography>
              <MaterialList />
            </>
          )}
          {isTallScreen && (
            <Box sx={{ my: 2 }}>
              <Divider />
            </Box>
          )}
          {isTallScreen && <Box sx={{ my: 2 }} />}
          {/* Clipping plane controls */}
          {(isTallScreen || sidebarView === 'clipping') && (
            <>
              <Typography variant="h6" gutterBottom>
                Clipping Planes
              </Typography>
              <ClippingControls />
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default NebulaGeometryViewer;