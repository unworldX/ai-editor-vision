import React from 'react';
import { Play, StopCircle, RefreshCw, Bug, Split } from 'lucide-react';

export const RunControls: React.FC = () => {
  return (
    <div className="flex items-center justify-between px-4 h-9 bg-[#252526] border-b border-[#2d2d2d]">
      <div className="flex items-center gap-2">
        <button
          className="p-1 hover:bg-[#2d2d2d] rounded text-[#cccccc] hover:text-white"
          title="Run (F5)"
        >
          <Play className="w-4 h-4" />
        </button>
        <button
          className="p-1 hover:bg-[#2d2d2d] rounded text-[#cccccc] hover:text-white"
          title="Stop (Shift+F5)"
        >
          <StopCircle className="w-4 h-4" />
        </button>
        <button
          className="p-1 hover:bg-[#2d2d2d] rounded text-[#cccccc] hover:text-white"
          title="Restart"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
        <button
          className="p-1 hover:bg-[#2d2d2d] rounded text-[#cccccc] hover:text-white"
          title="Start Debugging"
        >
          <Bug className="w-4 h-4" />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="p-1 hover:bg-[#2d2d2d] rounded text-[#cccccc] hover:text-white"
          title="Split Editor"
        >
          <Split className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};