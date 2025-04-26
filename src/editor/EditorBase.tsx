
import React from 'react';
import Editor from '@monaco-editor/react';
import { getEditorOptions } from './EditorConfiguration';
import { EditorService } from '../services/EditorService';

interface EditorBaseProps {
  currentFile: string | null;
  content: string;
  language: string;
  isPrimary?: boolean;
  onMount: (editor: any, monaco: any) => void;
  onChange: (value: string | undefined) => void;
}

const EditorBase: React.FC<EditorBaseProps> = ({
  currentFile,
  content,
  language,
  isPrimary = true,
  onMount,
  onChange,
}) => {
  const editorService = EditorService.getInstance();

  if (!currentFile) {
    return (
      <div className="h-full w-full flex items-center justify-center text-[#858585]">
        <div className="text-center">
          <p className="text-lg">No file selected</p>
          <p className="text-sm mt-2">Select a file from the explorer to start editing</p>
        </div>
      </div>
    );
  }

  return (
    <Editor
      height="100%"
      defaultLanguage={language}
      defaultValue={content}
      onMount={onMount}
      onChange={onChange}
      options={{
        ...editorService.getDefaultEditorOptions(),
        ...getEditorOptions(isPrimary),
      }}
      theme="custom-dark"
    />
  );
};

export default EditorBase;

