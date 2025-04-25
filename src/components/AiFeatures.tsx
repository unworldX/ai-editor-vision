
import React from 'react';
import { File, FilePlus, Trash2, Edit } from 'lucide-react';
import { Button } from './ui/button';

interface AiFeaturesProps {
  onNewFile: () => void;
  onDelete: () => void;
  onRename: () => void;
  activeFile: { name: string; extension: string; } | null;
}

const AiFeatures: React.FC<AiFeaturesProps> = ({
  onNewFile,
  onDelete,
  onRename,
  activeFile
}) => {
  return (
    <div className="p-4 border-l border-border bg-sidebar">
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground mb-4">AI Features</h3>
        
        <div className="flex flex-col gap-2">
          <Button 
            variant="ghost" 
            className="justify-start"
            onClick={onNewFile}
          >
            <FilePlus className="w-4 h-4 mr-2" />
            New File
          </Button>

          <Button 
            variant="ghost" 
            className="justify-start"
            onClick={onDelete}
            disabled={!activeFile}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete File
          </Button>

          <Button 
            variant="ghost" 
            className="justify-start"
            onClick={onRename}
            disabled={!activeFile}
          >
            <Edit className="w-4 h-4 mr-2" />
            Rename File
          </Button>
        </div>

        {activeFile && (
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">Current File</p>
            <div className="flex items-center">
              <File className="w-4 h-4 mr-2 text-muted-foreground" />
              <span className="text-sm">{activeFile.name}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiFeatures;
