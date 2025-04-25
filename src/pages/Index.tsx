import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Editor from '../components/Editor';
import AiPanel from '../components/AiPanel';
import StatusBar from '../components/StatusBar';
import Tab from '../components/Tab';
import { mockFiles, FileItem, OpenFile } from '../utils/mockData';

const Index: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>(mockFiles);
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [showAiPanel, setShowAiPanel] = useState(true);

  const handleFileSelect = (file: FileItem) => {
    if (file.type === 'file') {
      // Check if file is already open
      const isOpen = openFiles.some(f => f.id === file.id);
      
      if (!isOpen && file.content) {
        // Add to open files
        setOpenFiles([
          ...openFiles.map(f => ({ ...f, isActive: false })),
          { 
            id: file.id, 
            name: file.name, 
            content: file.content,
            extension: file.extension || '',
            isActive: true 
          }
        ]);
      }
      
      // Set as active
      setActiveFileId(file.id);
      setOpenFiles(prev => prev.map(f => ({
        ...f,
        isActive: f.id === file.id
      })));
    }
  };
  
  const handleTabSelect = (id: string) => {
    setActiveFileId(id);
    setOpenFiles(prev => prev.map(f => ({
      ...f,
      isActive: f.id === id
    })));
  };
  
  const handleTabClose = (id: string) => {
    const newOpenFiles = openFiles.filter(f => f.id !== id);
    setOpenFiles(newOpenFiles);
    
    // Set new active tab if the closed one was active
    if (activeFileId === id && newOpenFiles.length > 0) {
      const newActiveId = newOpenFiles[newOpenFiles.length - 1].id;
      setActiveFileId(newActiveId);
      setOpenFiles(prev => prev.map(f => ({
        ...f,
        isActive: f.id === newActiveId
      })));
    } else if (newOpenFiles.length === 0) {
      setActiveFileId(null);
    }
  };
  
  const activeFile = openFiles.find(f => f.isActive);
  
  useEffect(() => {
    if (openFiles.length === 0) {
      const readmeFile = findFileById(files, '9');
      if (readmeFile && readmeFile.type === 'file' && readmeFile.content) {
        handleFileSelect(readmeFile);
      }
    }
  }, []);
  
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar files={files} onFileSelect={handleFileSelect} />
        
        {/* Main editor area */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Tabs */}
          <div className="flex h-9 bg-sidebar overflow-x-auto scrollbar-hide">
            {openFiles.map(file => (
              <Tab 
                key={file.id}
                id={file.id}
                name={file.name}
                isActive={file.isActive || false}
                onSelect={handleTabSelect}
                onClose={handleTabClose}
              />
            ))}
          </div>
          
          {/* Editor */}
          <Editor file={activeFile} />
        </div>
        
        {/* AI Assistant Panel */}
        {showAiPanel && <AiPanel onClose={() => setShowAiPanel(false)} />}
      </div>
      
      {/* Status Bar */}
      <StatusBar currentFile={activeFile} />
    </div>
  );
};

const findFileById = (files: FileItem[], id: string): FileItem | null => {
  for (const file of files) {
    if (file.id === id) return file;
    
    if (file.children) {
      const found = findFileById(file.children, id);
      if (found) return found;
    }
  }
  
  return null;
};

export default Index;
