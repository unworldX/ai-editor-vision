
import React from 'react';
import EditorComponent from './editor/EditorComponent';
import { FileExplorer } from './components/FileExplorer';
import { CommandPalette } from './components/CommandPalette';
import { StatusBar } from './components/StatusBar';
import { Terminal } from './components/Terminal';
import { ActivityBar } from './components/ActivityBar';
import { TitleBar } from './components/TitleBar';
import { Splitter } from './components/Splitter';
import { useExtensionStore } from './store/extensionStore';
import { AISidebar } from './components/AISidebar';
import { MonacoService } from './services/MonacoService';
import { EditorService } from './services/EditorService';
import { EditorEngine } from './editor/EditorEngine';
import { Extension } from './types/extension';

const demoExtension: Extension = {
  id: 'demo-extension',
  name: 'Code Formatter',
  description: 'Format your code with custom keybindings and commands',
  version: '1.0.0',
  author: 'Demo Author',
  enabled: false,
  commands: [
    {
      id: 'format.document',
      label: 'Format Document',
      keybinding: 'Ctrl-Shift-F',
      execute: () => {
        console.log('Formatting document...');
        return true;
      },
    },
  ],
  activate: (api) => {
    console.log('Demo extension activated');
    api.registerCommand({
      id: 'format.selection',
      label: 'Format Selection', 
      keybinding: 'Ctrl-K Ctrl-F',
      execute: () => { 
        console.log('Formatting selection...');
        return true;
      },
    });
  },
  deactivate: () => {
    console.log('Demo extension deactivated');
  },
};

const App: React.FC = () => {
  const { addExtension } = useExtensionStore();

  React.useEffect(() => {
    // Initialize services
    MonacoService.getInstance();
    EditorService.getInstance();
    EditorEngine.getInstance();
    
    // Add extension
    addExtension(demoExtension);
  }, [addExtension]);

  return (
    <div className="h-screen flex flex-col">
      <TitleBar />
      <div className="flex-1 flex overflow-hidden">
        <Splitter direction="vertical" defaultSize={240} minSize={160} maxSize={600}>
          <div className="h-full flex flex-col border-r border-[#2d2d2d]">
            <ActivityBar />
            <div className="flex-1 overflow-auto">
              <FileExplorer />
            </div>
          </div>
          <div className="h-full flex flex-col">
            <div className="flex-1 flex">
              <div className="flex-1 flex flex-col">
                <EditorComponent />
                <Terminal />
              </div>
              <AISidebar />
            </div>
          </div>
        </Splitter>
      </div>
      <StatusBar />
      <CommandPalette />
    </div>
  );
};

export default App;
