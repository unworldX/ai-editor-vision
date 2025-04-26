import React, { useEffect, useRef, useState } from 'react';
import { useEditorStore } from '../store/editorStore';
import { useFileStore } from '../store/fileStore';
import * as monaco from 'monaco-editor';
import { EditorEngine } from './EditorEngine';
import { EditorService } from '../services/EditorService';
import { EditorCommands } from './EditorCommands';
import EditorToolbar from '../components/EditorToolbar';
import EditorBase from './EditorBase';
import { EditorProviders } from './EditorProviders';
import './MonacoEnvironment';

const getLanguage = (filename: string): string => {
  const extensionMap: Record<string, string> = {
    js: 'javascript', jsx: 'javascript',
    ts: 'typescript', tsx: 'typescript',
    json: 'json', html: 'html', css: 'css',
    scss: 'scss', less: 'less',
    php: 'php', py: 'python', rb: 'ruby',
    java: 'java', c: 'c', cpp: 'cpp', cs: 'csharp',
    go: 'go', rs: 'rust', swift: 'swift',
    sh: 'shell', sql: 'sql', yaml: 'yaml', toml: 'toml',
    xml: 'xml', md: 'markdown', dockerfile: 'dockerfile',
    makefile: 'makefile', ini: 'ini', bat: 'bat'
  };
  return extensionMap[filename?.split('.').pop()?.toLowerCase() || ''] || 'plaintext';
};

const EditorComponent: React.FC = () => {
  const { setEditor } = useEditorStore();
  const { currentFile, getFileContent, updateFileContent } = useFileStore();
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [isSplit, setIsSplit] = useState(false);
  const [activeEditor, setActiveEditor] = useState<'primary' | 'secondary'>('primary');
  const editorEngine = EditorEngine.getInstance();
  const editorCommands = EditorCommands.getInstance();

  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor, monaco: monaco.Monaco) => {
    editorRef.current = editor;
    setEditor(editor);
    editorEngine.setEditor(editor);
    editorCommands.registerCommands(editor, monaco);
    EditorProviders.setupProviders(editor, monaco);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (currentFile && value !== undefined) {
      updateFileContent(currentFile, value);
    }
  };

  useEffect(() => {
    if (!currentFile) return;
    
    const cleanup = EditorProviders.setupEventListeners(editorRef.current!);
    return cleanup;
  }, [currentFile]);

  return (
    <div className="h-full w-full flex flex-col">
      <EditorToolbar />
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
                language={getLanguage(currentFile || '')}
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
                language={getLanguage(currentFile || '')}
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
              language={getLanguage(currentFile || '')}
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
