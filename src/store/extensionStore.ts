import { create } from 'zustand';
import { Extension, ExtensionAPI } from '../types/extension';
import { useEditorStore } from './editorStore';

interface ExtensionState {
  extensions: Extension[];
  addExtension: (extension: Extension) => void;
  removeExtension: (id: string) => void;
  toggleExtension: (id: string) => void;
  getExtension: (id: string) => Extension | undefined;
}

export const useExtensionStore = create<ExtensionState>((set, get) => ({
  extensions: [],
  
  addExtension: (extension: Extension) => {
    set((state) => ({
      extensions: [...state.extensions, extension],
    }));
  },

  removeExtension: (id: string) => {
    const extension = get().getExtension(id);
    if (extension?.deactivate) {
      extension.deactivate();
    }
    set((state) => ({
      extensions: state.extensions.filter((ext) => ext.id !== id),
    }));
  },

  toggleExtension: (id: string) => {
    const editorStore = useEditorStore.getState();
    
    set((state) => ({
      extensions: state.extensions.map((ext) => {
        if (ext.id === id) {
          const api: ExtensionAPI = {
            registerCommand: editorStore.registerCommand,
            unregisterCommand: editorStore.unregisterCommand,
            registerEditorExtension: editorStore.registerEditorExtension,
            unregisterEditorExtension: editorStore.unregisterEditorExtension,
            getEditor: () => editorStore.editor,
          };

          if (!ext.enabled && ext.activate) {
            ext.activate(api);
            
            // Register editor extensions
            ext.editorExtensions?.forEach((extension) => {
              editorStore.registerEditorExtension(extension);
            });

            // Register commands
            ext.commands?.forEach((command) => {
              editorStore.registerCommand(command);
            });
          } else if (ext.enabled && ext.deactivate) {
            ext.deactivate();
            
            // Unregister editor extensions
            ext.editorExtensions?.forEach((extension) => {
              editorStore.unregisterEditorExtension(extension);
            });

            // Unregister commands
            ext.commands?.forEach((command) => {
              editorStore.unregisterCommand(command.id);
            });
          }
          
          return { ...ext, enabled: !ext.enabled };
        }
        return ext;
      }),
    }));
  },

  getExtension: (id: string) => {
    return get().extensions.find((ext) => ext.id === id);
  },
}));