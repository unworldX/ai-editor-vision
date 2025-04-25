
import React, { useState } from 'react';
import { FileItem } from '../utils/mockData';
import { ChevronDown, ChevronRight, File, Folder } from 'lucide-react';

interface SidebarProps {
  files: FileItem[];
  onFileSelect: (file: FileItem) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ files, onFileSelect }) => {
  const renderFileItem = (file: FileItem, depth = 0) => {
    const [isExpanded, setIsExpanded] = useState(!!file.expanded);

    const toggleExpand = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsExpanded(!isExpanded);
    };

    const handleFileSelect = () => {
      if (file.type === 'file') {
        onFileSelect(file);
      }
    };

    return (
      <div key={file.id} className="select-none">
        <div
          className={`flex items-center py-1 px-2 cursor-pointer hover:bg-secondary/50 ${
            depth > 0 ? 'pl-' + (depth * 4) : ''
          }`}
          onClick={file.type === 'folder' ? toggleExpand : handleFileSelect}
        >
          <span className="mr-1">
            {file.type === 'folder' ? (
              isExpanded ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )
            ) : (
              <File className="w-4 h-4 text-muted-foreground" />
            )}
          </span>
          {file.type === 'folder' ? (
            <Folder className="w-4 h-4 text-muted-foreground mr-1" />
          ) : null}
          <span className="text-sm truncate">{file.name}</span>
        </div>

        {file.type === 'folder' && isExpanded && file.children && (
          <div className="ml-2">
            {file.children.map((child) => renderFileItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 h-full bg-sidebar overflow-y-auto border-r border-border">
      <div className="p-2 border-b border-border">
        <h3 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">Explorer</h3>
      </div>
      <div className="py-1">{files.map((file) => renderFileItem(file))}</div>
    </div>
  );
};

export default Sidebar;
