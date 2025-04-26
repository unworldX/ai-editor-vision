
import { create } from 'zustand';
import type * as Monaco from 'monaco-editor';

interface Command {
  id: string;
  name: string;
  keybinding?: string;
  execute: (editor: Monaco.editor.IStandaloneCodeEditor) => void;
}

interface EditorState {
  editor: Monaco.editor.IStandaloneCodeEditor | null;
  commands: Command[];
  setEditor: (editor: Monaco.editor.IStandaloneCodeEditor | null) => void;
  addCommand: (command: Command) => void;
  registerCommand: (command: any) => void;
  unregisterCommand: (commandId: string) => void;
  registerEditorExtension: (extension: any) => void;
  unregisterEditorExtension: (extension: any) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  editor: null,
  commands: [
    {
      id: 'format.document',
      name: 'Format Document',
      keybinding: 'Alt+Shift+F',
      execute: (editor) => {
        editor.getAction('editor.action.formatDocument')?.run();
      }
    },
    {
      id: 'editor.action.toggleMinimap',
      name: 'Toggle Minimap',
      keybinding: 'Alt+M',
      execute: (editor) => {
        const editorOptions = editor.getOption(Monaco.editor.EditorOption.minimap);
        editor.updateOptions({
          minimap: { enabled: !editorOptions.enabled }
        });
      }
    },
    {
      id: 'editor.action.commentLine',
      name: 'Toggle Line Comment',
      keybinding: 'Ctrl+/',
      execute: (editor) => {
        editor.getAction('editor.action.commentLine')?.run();
      }
    }
  ],
  setEditor: (editor) => set({ editor }),
  addCommand: (command) => set((state) => ({ 
    commands: [...state.commands, command] 
  })),
  registerCommand: (command) => set((state) => ({
    commands: [...state.commands, command]
  })),
  unregisterCommand: (commandId) => set((state) => ({
    commands: state.commands.filter(cmd => cmd.id !== commandId)
  })),
  registerEditorExtension: () => {
    // This is a placeholder for extension registration logic
  },
  unregisterEditorExtension: () => {
    // This is a placeholder for extension unregistration logic
  }
}));
