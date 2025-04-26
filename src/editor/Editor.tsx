import React from 'react';
import EditorComponent from './EditorComponent';

// This is a wrapper component to maintain backward compatibility
// It simply re-exports the EditorComponent from the editor directory
const Editor: React.FC = () => {
  return <EditorComponent />;
};

export default Editor;
