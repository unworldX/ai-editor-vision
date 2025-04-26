
import React from 'react';
import { useAIStore } from '../services/AIService';

export const AISidebar: React.FC = () => {
  const { features, responses } = useAIStore();

  return (
    <div className="w-64 h-full bg-[#2d2d2d] border-l border-[#3d3d3d] flex flex-col">
      <div className="p-4 border-b border-[#3d3d3d]">
        <h2 className="text-white text-sm font-medium">AI Features</h2>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="mb-4 p-3 rounded bg-[#3d3d3d] text-white"
          >
            <h3 className="text-sm font-medium">{feature.name}</h3>
            <p className="text-xs text-gray-400 mt-1">{feature.description}</p>
            {feature.shortcut && (
              <span className="text-xs bg-[#4d4d4d] px-2 py-1 rounded mt-2 inline-block">
                {feature.shortcut}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-[#3d3d3d]">
        <h3 className="text-white text-sm font-medium mb-2">Recent Responses</h3>
        {responses.map((response, index) => (
          <div key={index} className="text-sm text-gray-400 mb-2">
            <div className="text-xs text-gray-500">
              {new Date(response.timestamp).toLocaleTimeString()}
            </div>
            <div className="text-white">{response.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
