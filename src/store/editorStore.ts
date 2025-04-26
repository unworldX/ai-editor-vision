import { create } from 'zustand';
import type * as Monaco from 'monaco-editor';
import { Command } from '../types/extension';

interface EditorState {
  editor: Monaco.editor.IStandaloneCodeEditor | null;
  commands: Command[];
  editorExtensions: any[];
  setEditor: (editor: Monaco.editor.IStandaloneCodeEditor | null) => void;
  registerCommand: (command: Command) => void;
  unregisterCommand: (commandId: string) => void;
  registerEditorExtension: (extension: any) => void;
  unregisterEditorExtension: (extension: any) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  editor: null,
  commands: [],
  editorExtensions: [],

  setEditor: (editor) => {
    set({ editor });
    console.log('Editor instance set:', editor);
  },

  registerCommand: (command) => {
    set((state) => ({ commands: [...state.commands, command] }));
    const editor = get().editor;
    if (editor && command.run) {
      try {
        editor.addCommand(0, command.run);
        console.log('Command registered:', command);
      } catch (error) {
        console.error('Error registering command:', error);
      }
    } else {
      console.warn('Cannot register command, editor instance is null');
    }
  },

  unregisterCommand: (commandId) => {
    set((state) => ({
      commands: state.commands.filter((cmd) => cmd.id !== commandId),
    }));
    console.log('Command unregistered:', commandId);
  },

  registerEditorExtension: (extension) => {
    set((state) => ({
      editorExtensions: [...state.editorExtensions, extension],
    }));
    console.log('Editor extension registered:', extension);
  },

  unregisterEditorExtension: (extension) => {
    set((state) => ({
      editorExtensions: state.editorExtensions.filter((ext) => ext !== extension),
    }));
    console.log('Editor extension unregistered:', extension);
  },
}));
