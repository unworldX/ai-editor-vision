import React from 'react';
import { Folder, File, ChevronRight, ChevronDown, Plus, FilePlus, FolderPlus } from 'lucide-react';
import { useFileStore } from '../store/fileStore';
import { useEditorStore } from '../store/editorStore';

interface FileTreeItemProps {
  name: string;
  isFolder?: boolean;
  level?: number;
  children?: FileTreeItemProps[];
  path: string;
}

const FileTreeItem: React.FC<FileTreeItemProps> = ({
  name,
  isFolder = false,
  level = 0,
  children = [],
  path,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { openFile, currentFile, moveItem } = useFileStore();
  const isActive = currentFile === path;
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    e.dataTransfer.setData('text/plain', path);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFolder) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const sourcePath = e.dataTransfer.getData('text/plain');
    if (sourcePath !== path) {
      const targetPath = isFolder ? `${path}/${sourcePath.split('/').pop()}` : path;
      moveItem(sourcePath, targetPath);
    }
  };

  // Sort children: folders first, then files, both alphabetically
  const sortedChildren = React.useMemo(() => {
    return [...children].sort((a, b) => {
      if (a.isFolder && !b.isFolder) return -1;
      if (!a.isFolder && b.isFolder) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [children]);

  return (
    <div>
      <div
        className={`flex items-center gap-1 px-2 py-1 hover:bg-[#37373d] cursor-pointer text-sm
          ${isActive ? 'bg-[#37373d]' : ''}
          ${isDragging ? 'bg-[#2d4c70]' : ''}
        `}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => {
          if (isFolder) {
            setIsOpen(!isOpen);
          } else {
            openFile(path);
          }
        }}
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isFolder ? (
          isOpen ? (
            <ChevronDown className="w-4 h-4 text-[#858585]" />
          ) : (
            <ChevronRight className="w-4 h-4 text-[#858585]" />
          )
        ) : null}
        {isFolder ? (
          <Folder className="w-4 h-4 text-[#4d9cf0]" />
        ) : (
          <File className="w-4 h-4 text-[#858585]" />
        )}
        <span className="text-[#cccccc]">{name}</span>
      </div>
      {isFolder && isOpen && (
        <div>
          {sortedChildren.map((item, index) => (
            <FileTreeItem
              key={index}
              {...item}
              level={level + 1}
              path={`${path}/${item.name}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const FileExplorer: React.FC = () => {
  const { files, addFile, addFolder } = useFileStore();
  const projectName = "My Project";

  const handleCreateFile = () => {
    const fileName = prompt('Enter file name:');
    if (fileName) {
      addFile(fileName);
    }
  };

  const handleCreateFolder = () => {
    const folderName = prompt('Enter folder name:');
    if (folderName) {
      addFolder(folderName);
    }
  };

  return (
    <div className="h-full bg-[#252526] text-[#cccccc]">
      <div className="p-2 text-xs uppercase tracking-wider text-[#858585] flex items-center justify-between">
        <span>Explorer</span>
      </div>
      <div className="px-2 py-1 flex items-center justify-between">
        <span className="truncate text-sm" title={projectName}>
          {projectName.length > 8 ? `${projectName.slice(0, 8)}..` : projectName}
        </span>
        <div className="flex items-center gap-1">
          <button 
            className="hover:bg-[#3d3d3d] p-1 rounded transition-colors"
            onClick={handleCreateFile}
            title="New File"
          >
            <FilePlus className="w-3 h-3" />
          </button>
          <button 
            className="hover:bg-[#3d3d3d] p-1 rounded transition-colors"
            onClick={handleCreateFolder}
            title="New Folder"
          >
            <FolderPlus className="w-3 h-3" />
          </button>
        </div>
      </div>
      <div className="overflow-auto">
        {files.map((item, index) => (
          <FileTreeItem
            key={index}
            {...item}
            path={item.name}
          />
        ))}
      </div>
    </div>
  );
};