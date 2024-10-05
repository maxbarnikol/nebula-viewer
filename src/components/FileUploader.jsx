import React from 'react';
import { Button } from '@mui/material';

/**
 * FileUploader component allows users to select and upload a .tri file.
 * It uses a hidden input element wrapped in a Material-UI Button for better styling.
 * 
 * @param {function} setFile - Function to update the selected file in the parent component.
 */
function FileUploader({ setFile }) {
  // Handle file selection and update the parent component
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) setFile(file);
  };

  return (
    <Button variant="contained" component="label">
      Load file
      <input
        type="file"
        accept=".tri"
        hidden
        onChange={handleFileChange}
      />
    </Button>
  );
};

export default FileUploader;