
import React, { useEffect, useRef, useState } from 'react';
import { useEditorStore } from '../store/editorStore';
import { useFileStore } from '../store/fileStore';
import * as monaco from 'monaco-editor';
import { EditorEngine } from './EditorEngine';
import { EditorCommands } from './EditorCommands';
import EditorToolbar from '../components/EditorToolbar';
import EditorBase from './EditorBase';
import { EditorProviders } from './EditorProviders';
import { getLanguageFromFilename } from './EditorLanguages';
import './MonacoEnvironment';

const EditorComponent: React.FC = () => {
  const { setEditor } = useEditorStore();
  const { currentFile, getFileContent, updateFileContent } = useFileStore();
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [isSplit, setIsSplit] = useState(false);
  const [activeEditor, setActiveEditor] = useState<'primary' | 'secondary'>('primary');
  const editorEngine = EditorEngine.getInstance();
  const editorCommands = EditorCommands.getInstance();

  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor, monacoInstance: typeof monaco) => {
    editorRef.current = editor;
    setEditor(editor);
    editorEngine.setEditor(editor);
    editorCommands.registerCommands(editor, monacoInstance);
    EditorProviders.setupProviders(editor, monacoInstance);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (currentFile && value !== undefined) {
      updateFileContent(currentFile, value);
    }
  };

  // Set up split view toggle
  const toggleSplitView = () => {
    setIsSplit(!isSplit);
  };

  useEffect(() => {
    if (!currentFile) return;
    
    const cleanup = EditorProviders.setupEventListeners(editorRef.current!);
    return cleanup;
  }, [currentFile]);

  return (
    <div className="h-full w-full flex flex-col">
      <EditorToolbar isSplit={isSplit} onToggleSplit={toggleSplitView} />
      <div className="flex-1">
        {isSplit ? (
          <div className="grid grid-cols-2 h-full">
            <div 
              className={`border-r border-[#3d3d3d] ${activeEditor === 'primary' ? 'bg-[#1e1e1e]' : 'bg-[#2d2d2d]'}`}
              onClick={() => setActiveEditor('primary')}
            >
              <EditorBase
                currentFile={currentFile}
                content={currentFile ? getFileContent(currentFile) : ''}
                language={getLanguageFromFilename(currentFile || '')}
                isPrimary={true}
                onMount={handleEditorDidMount}
                onChange={handleEditorChange}
              />
            </div>
            <div 
              className={activeEditor === 'secondary' ? 'bg-[#1e1e1e]' : 'bg-[#2d2d2d]'}
              onClick={() => setActiveEditor('secondary')}
            >
              <EditorBase
                currentFile={currentFile}
                content={currentFile ? getFileContent(currentFile) : ''}
                language={getLanguageFromFilename(currentFile || '')}
                isPrimary={false}
                onMount={handleEditorDidMount}
                onChange={handleEditorChange}
              />
            </div>
          </div>
        ) : (
          <div className="h-full bg-[#1e1e1e]">
            <EditorBase
              currentFile={currentFile}
              content={currentFile ? getFileContent(currentFile) : ''}
              language={getLanguageFromFilename(currentFile || '')}
              isPrimary={true}
              onMount={handleEditorDidMount}
              onChange={handleEditorChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorComponent;
