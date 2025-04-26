import React from 'react';
import { Files, Search, GitBranch, Bug } from 'lucide-react';

const activities = [
  { icon: Files, label: 'Explorer', active: true },
  { icon: Search, label: 'Search' },
  { icon: GitBranch, label: 'Source Control' },
  { icon: Bug, label: 'Run and Debug' },
];

export const ActivityBar: React.FC = () => {
  return (
    <div className="bg-[#333333] flex flex-row items-center h-8 border-b border-[#2d2d2d]">
      {activities.map(({ icon: Icon, label, active }) => (
        <button
          key={label}
          className={`h-full px-3 flex items-center justify-center group relative ${
            active ? 'text-white' : 'text-[#858585] hover:text-white'
          }`}
          title={label}
        >
          <div
            className={`absolute top-0 h-0.5 w-full bg-white transform ${
              active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
          />
          <Icon className="w-4 h-4 mr-1" />
          <span className="text-xs"></span>
        </button>
      ))}
    </div>
  );
};