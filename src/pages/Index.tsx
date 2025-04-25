import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Editor from '../components/Editor';
import AiPanel from '../components/AiPanel';
import StatusBar from '../components/StatusBar';
import MenuBar from '../components/MenuBar';
import Tab from '../components/Tab';
import { mockFiles, FileItem, OpenFile } from '../utils/mockData';

const Index: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>(mockFiles);
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [showAiPanel, setShowAiPanel] = useState(true);
  const [showTerminal, setShowTerminal] = useState(false);
  const [layout, setLayout] = useState<'default' | 'split'>('default');

  const handleFileSelect = (file: FileItem) => {
    if (file.type === 'file') {
      const isOpen = openFiles.some(f => f.id === file.id);
      
      if (!isOpen && file.content) {
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
  
  const handleNewFile = () => {
    const newFile: FileItem = {
      id: Date.now().toString(),
      name: 'untitled.txt',
      type: 'file',
      content: '',
      extension: 'txt'
    };
    setFiles(prev => [...prev, newFile]);
    handleFileSelect(newFile);
  };

  const handleDelete = () => {
    if (!activeFileId) return;
    
    setFiles(prev => {
      const deleteFileFromTree = (items: FileItem[]): FileItem[] => {
        return items.filter(item => {
          if (item.id === activeFileId) return false;
          if (item.children) {
            item.children = deleteFileFromTree(item.children);
          }
          return true;
        });
      };
      
      return deleteFileFromTree(prev);
    });
    
    handleTabClose(activeFileId);
  };

  const handleRename = () => {
    if (!activeFileId) return;
    const newName = window.prompt('Enter new name:', activeFile?.name);
    if (!newName) return;

    setFiles(prev => {
      const renameInTree = (items: FileItem[]): FileItem[] => {
        return items.map(item => {
          if (item.id === activeFileId) {
            return { ...item, name: newName };
          }
          if (item.children) {
            item.children = renameInTree(item.children);
          }
          return item;
        });
      };
      
      return renameInTree(prev);
    });

    setOpenFiles(prev => 
      prev.map(f => 
        f.id === activeFileId ? { ...f, name: newName } : f
      )
    );
  };

  const activeFile = files.find(f => f.id === activeFileId) || null;

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
      <MenuBar
        onNewFile={handleNewFile}
        onDelete={handleDelete}
        onRename={handleRename}
        onCopy={() => console.log('Copy')}
        onPaste={() => console.log('Paste')}
        onToggleTerminal={() => setShowTerminal(prev => !prev)}
        onToggleLayout={() => setLayout(prev => prev === 'default' ? 'split' : 'default')}
        activeFile={activeFile}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar files={files} onFileSelect={handleFileSelect} />
        
        <div className="flex flex-col flex-1 overflow-hidden">
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
          
          <div className={`flex flex-1 ${layout === 'split' ? 'flex-row' : ''}`}>
            <Editor file={activeFile} />
            {layout === 'split' && <Editor file={activeFile} />}
          </div>
          
          {showTerminal && (
            <div className="h-48 border-t border-border bg-sidebar p-2">
              <div className="font-mono text-sm">Terminal (Coming soon...)</div>
            </div>
          )}
        </div>
        
        {showAiPanel && <AiPanel onClose={() => setShowAiPanel(false)} />}
      </div>
      
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
