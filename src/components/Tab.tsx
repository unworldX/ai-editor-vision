
import React from 'react';
import { X } from 'lucide-react';

interface TabProps {
  id: string;
  name: string;
  isActive: boolean;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
}

const Tab: React.FC<TabProps> = ({ id, name, isActive, onSelect, onClose }) => {
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose(id);
  };

  return (
    <div
      className={`flex items-center h-9 px-3 border-r border-border cursor-pointer select-none group ${
        isActive ? 'bg-background' : 'bg-secondary/50 hover:bg-secondary'
      }`}
      onClick={() => onSelect(id)}
    >
      <span className={`text-sm truncate max-w-32 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
        {name}
      </span>
      <button
        className="ml-2 p-0.5 rounded-sm opacity-0 group-hover:opacity-100 hover:bg-background"
        onClick={handleClose}
      >
        <X className="w-3.5 h-3.5 text-muted-foreground" />
      </button>
    </div>
  );
};

export default Tab;
