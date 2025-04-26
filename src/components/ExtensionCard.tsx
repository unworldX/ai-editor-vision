import React from 'react';
import { Extension } from '../types/extension';
import { Package, ToggleLeft } from 'lucide-react';

interface ExtensionCardProps {
  extension: Extension;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

export const ExtensionCard: React.FC<ExtensionCardProps> = ({
  extension,
  onToggle,
  onRemove,
}) => {
  return (
    <div className="bg-gray-700 rounded-lg p-3 mb-3">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {extension.icon ? (
            <img
              src={extension.icon}
              alt={extension.name}
              className="w-8 h-8 rounded"
            />
          ) : (
            <Package className="w-8 h-8 text-gray-400" />
          )}
        </div>
        <div className="flex-grow min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold truncate">{extension.name}</h3>
            <div className="flex items-center gap-2 ml-2 flex-shrink-0">
              <button
                onClick={() => onToggle(extension.id)}
                className={`p-1 rounded transition-colors ${
                  extension.enabled ? 'text-green-400' : 'text-gray-400'
                }`}
              >
                <ToggleLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => onRemove(extension.id)}
                className="p-1 text-red-400 hover:text-red-300 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-1 line-clamp-2">
            {extension.description}
          </p>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
            <span>v{extension.version}</span>
            <span>{extension.author}</span>
          </div>
        </div>
      </div>
    </div>
  );
};