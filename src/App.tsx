
import React, { useState } from 'react';
import { TitleBar } from './components/TitleBar';
import { FileExplorer } from './components/FileExplorer';
import { ActivityBar } from './components/ActivityBar';
import EditorComponent from './editor/EditorComponent';
import { StatusBar } from './components/StatusBar';
import { AISidebar } from './components/AISidebar';
import EditorToolbar from './components/EditorToolbar';
import { Sidebar } from './components/Sidebar';

const App: React.FC = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [aiSidebarVisible, setAiSidebarVisible] = useState(false);
  const [isSplit, setIsSplit] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const toggleAiSidebar = () => {
    setAiSidebarVisible(!aiSidebarVisible);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#1e1e1e]">
      <TitleBar />
      <ActivityBar />
      <div className="flex-1 flex overflow-hidden">
        {sidebarVisible && (
          <div className="w-64 border-r border-[#3d3d3d]">
            <FileExplorer />
          </div>
        )}
        <div className="flex-1 flex flex-col overflow-hidden">
          <EditorToolbar isSplit={isSplit} onToggleSplit={() => setIsSplit(!isSplit)} />
          <div className="flex-1 overflow-hidden">
            <EditorComponent isSplit={isSplit} />
          </div>
        </div>
        {aiSidebarVisible && <AISidebar />}
      </div>
      <StatusBar />
    </div>
  );
};

export default App;
