
import { create } from 'zustand';
import type * as Monaco from 'monaco-editor';

interface EditorState {
  editor: Monaco.editor.IStandaloneCodeEditor | null;
  setEditor: (editor: Monaco.editor.IStandaloneCodeEditor | null) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  editor: null,
  setEditor: (editor) => set({ editor }),
}));
