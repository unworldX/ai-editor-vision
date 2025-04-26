import React from 'react';
import { ExtensionList } from './ExtensionList';
import { Package } from 'lucide-react';

export const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-gray-800 text-white h-full flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Package className="w-6 h-6" />
          <h2 className="text-lg font-semibold">Extensions</h2>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <ExtensionList />
      </div>
    </div>
  );
};