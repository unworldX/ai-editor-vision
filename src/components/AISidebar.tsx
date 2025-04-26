
import React from 'react';
import { useAIStore } from '../services/AIService';
import { Bot, Brain, Code, Sparkles, Wand } from 'lucide-react';
import { Button } from '../components/ui/button';

const iconMap: Record<string, React.ReactNode> = {
  'brain': <Brain className="w-4 h-4" />,
  'wand': <Wand className="w-4 h-4" />,
  'code': <Code className="w-4 h-4" />,
  'sparkles': <Sparkles className="w-4 h-4" />,
  'bot': <Bot className="w-4 h-4" />
};

export const AISidebar: React.FC = () => {
  const { features, responses, toggleFeature } = useAIStore();

  return (
    <div className="w-64 h-full bg-[#2d2d2d] border-l border-[#3d3d3d] flex flex-col">
      <div className="p-4 border-b border-[#3d3d3d] flex items-center gap-2">
        <Bot className="w-5 h-5 text-blue-400" />
        <h2 className="text-white text-sm font-medium">AI Assistant</h2>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          <h3 className="text-white text-sm font-medium mb-3">Features</h3>
          <div className="space-y-3">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="p-3 rounded bg-[#3d3d3d] text-white hover:bg-[#4d4d4d] transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {iconMap[feature.icon || 'bot']}
                    <h4 className="text-sm font-medium">{feature.name}</h4>
                  </div>
                  <button
                    className={`px-2 py-1 text-xs rounded bg-[#2d2d2d] hover:bg-[#3a3a3a] ${
                      feature.enabled ? 'text-green-400' : 'text-gray-400'
                    }`}
                    onClick={() => toggleFeature(feature.id)}
                  >
                    {feature.enabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
                <p className="text-xs text-gray-400">{feature.description}</p>
                {feature.shortcut && (
                  <span className="text-xs bg-[#2d2d2d] px-2 py-1 rounded mt-2 inline-block">
                    {feature.shortcut}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-[#3d3d3d] bg-[#262626]">
        <h3 className="text-white text-sm font-medium mb-2">Recent Responses</h3>
        <div className="space-y-3">
          {responses.map((response, index) => (
            <div 
              key={response.timestamp} 
              className="text-sm bg-[#3d3d3d] rounded p-3"
            >
              <div className="text-xs text-gray-400 mb-1">
                {new Date(response.timestamp).toLocaleTimeString()}
              </div>
              <div className="text-white">{response.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
