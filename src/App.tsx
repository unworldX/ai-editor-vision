
import React from 'react';
import EditorComponent from './editor/EditorComponent';

const App: React.FC = () => {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1">
        <EditorComponent />
      </div>
    </div>
  );
};

export default App;
