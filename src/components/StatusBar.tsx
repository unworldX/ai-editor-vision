import React, { useEffect, useState } from 'react';
import { useEditorStore } from '../store/editorStore';
import { useFileStore } from '../store/fileStore';
import { Circle, GitBranch, Bell, Check, X } from 'lucide-react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';


export const StatusBar: React.FC = () => {
  const { editor } = useEditorStore();
  const { currentFile } = useFileStore();
  const [position, setPosition] = useState({ line: 1, col: 1 });
  const [mode, setMode] = useState<string>('plaintext');

  useEffect(() => {
    let disposable: monaco.IDisposable | null = null;

    if (editor) {
      const updatePosition = () => {
        const pos = editor.getPosition();
        if (pos) {
          setPosition({ line: pos.lineNumber, col: pos.column });
        }
      };

      disposable = editor.onDidChangeCursorPosition(updatePosition);
      updatePosition(); // Set initial cursor position
    }

    return () => {
      disposable?.dispose();
    };
  }, [editor]);

  useEffect(() => {
    if (currentFile) {
      const extension = currentFile.split('.').pop()?.toLowerCase() || '';
      const extensionMap: Record<string, string> = {
        js: 'JavaScript', jsx: 'JavaScript',
        ts: 'TypeScript', tsx: 'TypeScript',
        json: 'JSON', html: 'HTML', css: 'CSS',
        scss: 'SCSS', less: 'LESS',
        php: 'PHP', py: 'Python', rb: 'Ruby',
        java: 'Java', c: 'C', cpp: 'C++', cs: 'C#',
        go: 'Go', rs: 'Rust', swift: 'Swift',
        sh: 'Shell', sql: 'SQL', yaml: 'YAML', toml: 'TOML',
        xml: 'XML', md: 'Markdown', dockerfile: 'Dockerfile',
        makefile: 'Makefile', ini: 'INI', bat: 'Batch'
      };

      setMode(extensionMap[extension] || 'Plaintext');
    }
  }, [currentFile]);

  return (
    <div className="h-5 bg-[#313131] text-white text-xs flex items-center px-2">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <GitBranch className="w-3.5 h-3.5" />
          <span>main</span>
        </div>
        <div className="flex items-center gap-1">
          <Circle className="w-3 h-3 text-green-400" />
          <span>0</span>
          <X className="w-3 h-3 text-red-400" />
          <span>0</span>
          <Bell className="w-3.5 h-3.5" />
          <span>0</span>
        </div>
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Check className="w-3.5 h-3.5" />
          <span>Prettier</span>
        </div>
        <span>UTF-8</span>
        <span>
          Ln {position.line}, Col {position.col}
        </span>
        <span className="capitalize">{mode}</span>
      </div>
    </div>
  );
};
