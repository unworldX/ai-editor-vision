import React from 'react';
import { ExtensionCard } from './ExtensionCard';
import { useExtensionStore } from '../store/extensionStore';

export const ExtensionList: React.FC = () => {
  const { extensions, toggleExtension, removeExtension } = useExtensionStore();

  return (
    <div className="space-y-4">
      {extensions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No extensions installed
        </div>
      ) : (
        extensions.map((extension) => (
          <ExtensionCard
            key={extension.id}
            extension={extension}
            onToggle={toggleExtension}
            onRemove={removeExtension}
          />
        ))
      )}
    </div>
  );
};