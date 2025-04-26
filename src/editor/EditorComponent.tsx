
import React, { useEffect, useState } from 'react';
import { useEditorStore } from '../store/editorStore';
import { useFileStore } from '../store/fileStore';
import EditorBase from './EditorBase';
import { getLanguageFromFilename } from './EditorLanguages';
import { configureMonaco } from './monaco.config';

interface EditorComponentProps {
  isSplit?: boolean;
}

const EditorComponent: React.FC<EditorComponentProps> = ({ isSplit = false }) => {
  const { setEditor } = useEditorStore();
  const { currentFile, getFileContent, updateFileContent } = useFileStore();
  const [secondEditor, setSecondEditor] = useState<any>(null);

  useEffect(() => {
    configureMonaco();
  }, []);

  const handlePrimaryEditorMount = (editor: any, monaco: any) => {
    setEditor(editor);
  };

  const handleSecondaryEditorMount = (editor: any, monaco: any) => {
    setSecondEditor(editor);
  };

  const handleEditorChange = (value: string | undefined, isPrimary: boolean = true) => {
    if (currentFile && value !== undefined) {
      updateFileContent(currentFile, value);
    }
  };

  return (
    <div className="h-full w-full flex overflow-hidden">
      <div className={`${isSplit ? 'w-1/2' : 'w-full'} h-full`}>
        <EditorBase
          currentFile={currentFile}
          content={currentFile ? getFileContent(currentFile) : ''}
          language={getLanguageFromFilename(currentFile || '')}
          isPrimary={true}
          onMount={handlePrimaryEditorMount}
          onChange={(value) => handleEditorChange(value, true)}
        />
      </div>

      {isSplit && (
        <div className="w-1/2 h-full border-l border-[#3d3d3d]">
          <EditorBase
            currentFile={currentFile}
            content={currentFile ? getFileContent(currentFile) : ''}
            language={getLanguageFromFilename(currentFile || '')}
            isPrimary={false}
            onMount={handleSecondaryEditorMount}
            onChange={(value) => handleEditorChange(value, false)}
          />
        </div>
      )}
    </div>
  );
};

export default EditorComponent;
