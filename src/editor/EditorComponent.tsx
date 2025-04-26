
import React, { useEffect } from 'react';
import { useEditorStore } from '../store/editorStore';
import { useFileStore } from '../store/fileStore';
import EditorBase from './EditorBase';
import { getLanguageFromFilename } from './EditorLanguages';
import { configureMonaco } from './monaco.config';
import * as monaco from 'monaco-editor';

const EditorComponent: React.FC = () => {
  const { setEditor } = useEditorStore();
  const { currentFile, getFileContent, updateFileContent } = useFileStore();

  useEffect(() => {
    configureMonaco();
  }, []);

  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    setEditor(editor);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (currentFile && value !== undefined) {
      updateFileContent(currentFile, value);
    }
  };

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex-1">
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
      </div>
    </div>
  );
};

export default EditorComponent;
