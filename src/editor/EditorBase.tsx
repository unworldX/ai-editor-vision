
import React from 'react';
import Editor from '@monaco-editor/react';
import { defaultEditorOptions } from './monaco.config';

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
  onMount,
  onChange,
}) => {
  if (!currentFile) {
    return (
      <div className="h-full w-full flex items-center justify-center text-[#858585]">
        <p className="text-lg">No file selected</p>
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
      options={defaultEditorOptions}
      theme="custom-dark"
    />
  );
};

export default EditorBase;
