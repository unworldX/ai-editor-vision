
export interface Command {
  id: string;
  label: string;
  keybinding?: string;
  execute?: () => boolean | void;
  run?: (...args: any[]) => void;
}

export interface Extension {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  enabled: boolean;
  commands: Command[];
  activate: (api: ExtensionAPI) => void;
  deactivate: () => void;
}

export interface ExtensionAPI {
  registerCommand: (command: Command) => void;
  unregisterCommand?: (id: string) => void;
  executeCommand?: (id: string, ...args: any[]) => void;
  [key: string]: any;
}
