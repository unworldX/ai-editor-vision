import React, { useState } from 'react';
import { X, LayoutGrid, ChevronRight } from 'lucide-react';
import { useFileStore } from '../store/fileStore';

const EditorToolbar: React.FC = () => {
  const { currentFile, closeFile } = useFileStore();
  const [isSplit, setIsSplit] = useState(false);

  if (!currentFile) return null;

  const pathParts = currentFile.split('/');
  const fileName = pathParts[pathParts.length - 1];

  return (
    <div className="flex flex-col">
      {/* Tabs */}
      <div className="flex items-center h-9 bg-[#2d2d2d] border-b border-[#3d3d3d]">
        <div className="flex items-center h-full">
          <div className="flex items-center h-full px-3 bg-[#1e1e1e] border-r border-[#3d3d3d] group">
            <span className="text-xs text-white">{fileName}</span>
            <button
              className="opacity-0 group-hover:opacity-100 ml-2 p-0.5 hover:bg-[#4d4d4d] rounded"
              onClick={() => closeFile(currentFile)}
              title="Close"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Breadcrumb */}
      <div className="flex items-center h-6 px-2 bg-[#2d2d2d] border-b border-[#3d3d3d]">
        <div className="flex items-center text-xs text-[#cccccc]">
          {pathParts.map((part, index) => (
            <React.Fragment key={index}>
              {index > 0 && <ChevronRight className="w-3 h-3 mx-1" />}
              <span className={index === pathParts.length - 1 ? 'text-white' : ''}>
                {part}
              </span>
            </React.Fragment>
          ))}
        </div>
        <div className="flex-1" />
        <div className="flex items-center space-x-2">
          <button
            className="p-1 hover:bg-[#3d3d3d] rounded text-[#cccccc]"
            onClick={() => setIsSplit(!isSplit)}
            title={isSplit ? "Join Views" : "Split View"}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditorToolbar; 