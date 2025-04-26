import React, { useEffect, useRef, useState } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { useEditorStore } from '../store/editorStore';
import { useFileStore } from '../store/fileStore';
import * as monaco from 'monaco-editor';
import { EditorEngine } from './EditorEngine';
import { EditorService } from '../services/EditorService';
import { EditorCommands } from './EditorCommands';
import EditorToolbar from '../components/EditorToolbar';
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
  const editorService = EditorService.getInstance();
  const editorCommands = EditorCommands.getInstance();

  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor;
    setEditor(editor);
    editorEngine.setEditor(editor);
    
    editor.updateOptions({
      lineNumbers: 'on',
      folding: true,
      foldingHighlight: true,
      showFoldingControls: 'always',
      minimap: {
        enabled: true,
        showSlider: 'always',
        renderCharacters: false,
        maxColumn: 120,
        scale: 1
      },
      glyphMargin: true,
      lineDecorationsWidth: 10,
      lineNumbersMinChars: 3,
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      wrappingIndent: 'indent',
      bracketPairColorization: {
        enabled: true,
      },
      guides: {
        bracketPairs: true,
        indentation: true,
        highlightActiveIndentation: true,
        bracketPairsHorizontal: true
      },
      renderWhitespace: 'selection',
      scrollbar: {
        vertical: 'visible',
        horizontal: 'visible',
        verticalScrollbarSize: 12,
        horizontalScrollbarSize: 12,
        useShadows: true
      },
      inlineSuggest: {
        enabled: true
      },
      occurrencesHighlight: true,
      renderLineHighlight: 'all',
      suggestOnTriggerCharacters: true,
      codeLens: true,
      inlayHints: {
        enabled: true
      },
      padding: {
        top: 5,
        bottom: 5
      }
    });

    editorCommands.registerCommands(editor, monaco);

    monaco.languages.registerHoverProvider('*', {
      provideHover: (model, position) => {
        return {
          contents: [
            { value: '**Hover Info**' },
            { value: 'This is a sample hover provider. Replace with actual documentation.' }
          ]
        };
      }
    });
  };

  const handleEditorChange = (value: string | undefined) => {
    if (currentFile && value !== undefined) {
      updateFileContent(currentFile, value);
    }
  };

  useEffect(() => {
    if (!currentFile) return;

    const handleCursorPositionChanged = (e: any) => {
      console.log('Cursor position changed:', e.position);
    };

    const handleSelectionChanged = (e: any) => {
      console.log('Selection changed');
    };

    const handleSave = (data: any) => {
      if (currentFile && editorRef.current) {
        updateFileContent(currentFile, editorRef.current.getValue());
        console.log('File saved:', currentFile);
      }
    };

    editorEngine.on('cursorPositionChanged', handleCursorPositionChanged);
    editorEngine.on('selectionChanged', handleSelectionChanged);
    editorEngine.on('save', handleSave);

    return () => {
      editorEngine.off('cursorPositionChanged', handleCursorPositionChanged);
      editorEngine.off('selectionChanged', handleSelectionChanged);
      editorEngine.off('save', handleSave);
    };
  }, [currentFile, editorEngine, updateFileContent]);

  const renderEditor = (isPrimary: boolean) => (
    <Editor
      height="100%"
      defaultLanguage={getLanguage(currentFile || '')}
      defaultValue={currentFile ? getFileContent(currentFile) : ''}
      onMount={handleEditorDidMount}
      onChange={handleEditorChange}
      options={{
        ...editorService.getDefaultEditorOptions(),
        readOnly: !isPrimary,
        theme: 'vs-dark',
        fontFamily: "'Fira Code', 'Cascadia Code', 'Source Code Pro', monospace",
        fontLigatures: true,
        fontSize: 14,
        mouseWheelZoom: true,
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: true,
        smoothScrolling: true,
        formatOnPaste: true,
        formatOnType: true,
      }}
      theme="custom-dark"
    />
  );

  return (
    <div className="h-full w-full flex flex-col">
      <EditorToolbar />
      <div className="flex-1">
        {currentFile ? (
          isSplit ? (
            <div className="grid grid-cols-2 h-full">
              <div 
                className={`border-r border-[#3d3d3d] ${activeEditor === 'primary' ? 'bg-[#1e1e1e]' : 'bg-[#2d2d2d]'}`}
                onClick={() => setActiveEditor('primary')}
              >
                {renderEditor(true)}
              </div>
              <div 
                className={activeEditor === 'secondary' ? 'bg-[#1e1e1e]' : 'bg-[#2d2d2d]'}
                onClick={() => setActiveEditor('secondary')}
              >
                {renderEditor(false)}
              </div>
            </div>
          ) : (
            <div className="h-full bg-[#1e1e1e]">
              {renderEditor(true)}
            </div>
          )
        ) : (
          <div className="h-full w-full flex items-center justify-center text-[#858585]">
            <div className="text-center">
              <p className="text-lg">No file selected</p>
              <p className="text-sm mt-2">Select a file from the explorer to start editing</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorComponent;
