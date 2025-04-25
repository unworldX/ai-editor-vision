
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Editor from '../components/Editor';
import AiPanel from '../components/AiPanel';
import AiFeatures from '../components/AiFeatures';
import StatusBar from '../components/StatusBar';
import MenuBar from '../components/MenuBar';
import Tab from '../components/Tab';
import ActivityBar from '../components/ActivityBar';
import { mockFiles, FileItem, OpenFile } from '../utils/mockData';
import { SidebarProvider } from '@/components/ui/sidebar';

const Index: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>(mockFiles);
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [showAiPanel, setShowAiPanel] = useState(true);
  const [showTerminal, setShowTerminal] = useState(false);
  const [layout, setLayout] = useState<'default' | 'split'>('default');
  const [activeSection, setActiveSection] = useState('explorer');

  const handleFileSelect = (file: FileItem) => {
    if (file.type === 'file') {
      const isOpen = openFiles.some(f => f.id === file.id);
      
      if (!isOpen && file.content !== undefined) {
        const newOpenFile: OpenFile = {
          id: file.id,
          name: file.name,
          content: file.content,
          extension: file.extension || '',
          isActive: true
        };
        
        setOpenFiles(prev => [
          ...prev.map(f => ({ ...f, isActive: false })),
          newOpenFile
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
    
    const newOpenFile: OpenFile = {
      id: newFile.id,
      name: newFile.name,
      content: newFile.content || '',
      extension: newFile.extension || '',
      isActive: true
    };
    
    setOpenFiles(prev => 
      [...prev.map(f => ({ ...f, isActive: false })), newOpenFile]
    );
    setActiveFileId(newFile.id);
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
    const activeFile = findFileById(files, activeFileId);
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

  // Create a properly typed active file for the AI Features component
  const getActiveFileInfo = (): { id: string; name: string; extension: string; type: string } | null => {
    if (!activeFileId) return null;
    
    const activeFile = findFileById(files, activeFileId);
    if (!activeFile) return null;
    
    return {
      id: activeFile.id,
      name: activeFile.name,
      extension: activeFile.extension || '',
      type: activeFile.type
    };
  };

  const activeFileInfo = getActiveFileInfo();

  useEffect(() => {
    if (openFiles.length === 0) {
      const readmeFile = findFileById(files, '9');
      if (readmeFile && readmeFile.type === 'file') {
        if (readmeFile.content !== undefined) {
          handleFileSelect(readmeFile);
        }
      }
    }
  }, []);

  // Find the active file as an OpenFile type for the Editor
  const findOpenFileById = (id: string | null): OpenFile | undefined => {
    if (!id) return undefined;
    return openFiles.find(file => file.id === id);
  };

  const activeOpenFile = findOpenFileById(activeFileId);
  
  // Get active file for StatusBar
  const getActiveFileForStatusBar = () => {
    if (!activeFileId) return null;
    return findFileById(files, activeFileId);
  };

  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen bg-background text-foreground">
        <MenuBar
          onNewFile={handleNewFile}
          onDelete={handleDelete}
          onRename={handleRename}
          onCopy={() => console.log('Copy')}
          onPaste={() => console.log('Paste')}
          onToggleTerminal={() => setShowTerminal(prev => !prev)}
          onToggleLayout={() => setLayout(prev => prev === 'default' ? 'split' : 'default')}
          activeFile={activeFileInfo}
        />
        
        <div className="flex flex-1 overflow-hidden">
          <ActivityBar 
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
          {activeSection === 'explorer' && (
            <Sidebar files={files} onFileSelect={handleFileSelect} />
          )}
          
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
              <Editor file={activeOpenFile} />
              {layout === 'split' && <Editor file={activeOpenFile} />}
            </div>
            
            {showTerminal && (
              <div className="h-48 border-t border-border bg-sidebar p-2">
                <div className="font-mono text-sm">Terminal (Coming soon...)</div>
              </div>
            )}
          </div>
          
          {showAiPanel && (
            <AiFeatures
              onNewFile={handleNewFile}
              onDelete={handleDelete}
              onRename={handleRename}
              activeFile={activeFileInfo ? {name: activeFileInfo.name, extension: activeFileInfo.extension} : null}
            />
          )}
        </div>
        
        <StatusBar currentFile={getActiveFileForStatusBar()} />
      </div>
    </SidebarProvider>
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
