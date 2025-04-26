import { EditorView } from '@codemirror/view';
import { Extension as CMExtension } from '@codemirror/state';

export interface Extension {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  enabled: boolean;
  icon?: string;
  main?: string;
  editorExtensions?: CMExtension[];
  commands?: Command[];
  activate?: (api: ExtensionAPI) => void;
  deactivate?: () => void;
}

export interface ExtensionManifest {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  icon?: string;
  main?: string;
}

export interface Command {
  id: string;
  label: string;
  run?: () => void;
  keybinding?: string;
  execute?: () => void;
}




export interface ExtensionAPI {
  registerCommand: (command: Command) => void;
  unregisterCommand: (commandId: string) => void;
  registerEditorExtension: (extension: CMExtension) => void;
  unregisterEditorExtension: (extension: CMExtension) => void;
  getEditor: () => EditorView | null;
}