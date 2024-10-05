// src/App.js
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import NebulaGeometryViewer from './components/NebulaGeometryViewer';
import { MaterialProvider } from './contexts/MaterialContext';
import { ClippingProvider } from './contexts/ClippingContext';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MaterialProvider>
        <ClippingProvider>
            <NebulaGeometryViewer />
        </ClippingProvider>
      </MaterialProvider>
    </ThemeProvider>
  );
}

export default App;