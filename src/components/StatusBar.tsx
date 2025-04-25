
import React from 'react';

interface StatusBarProps {
  currentFile?: {
    name: string;
    extension: string;
  };
}

const StatusBar: React.FC<StatusBarProps> = ({ currentFile }) => {
  return (
    <div className="h-6 bg-sidebar border-t border-border flex items-center px-4 text-xs text-muted-foreground justify-between">
      <div className="flex items-center space-x-4">
        <span>
          {currentFile 
            ? `${currentFile.name} - ${getLanguage(currentFile.extension)}` 
            : 'No file selected'}
        </span>
        <span>•</span>
        <span>UTF-8</span>
      </div>
      <div className="flex items-center space-x-4">
        <span>Ln 1, Col 1</span>
        <span>•</span>
        <span>Spaces: 2</span>
        <span>•</span>
        <span>AI: Ready</span>
      </div>
    </div>
  );
};

const getLanguage = (extension: string): string => {
  const languages: Record<string, string> = {
    'js': 'JavaScript',
    'jsx': 'React JSX',
    'ts': 'TypeScript',
    'tsx': 'React TSX',
    'json': 'JSON',
    'md': 'Markdown',
    'html': 'HTML',
    'css': 'CSS'
  };
  
  return languages[extension] || extension.toUpperCase();
};

export default StatusBar;
