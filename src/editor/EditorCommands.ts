import * as monaco from 'monaco-editor';
import { EditorEngine } from './EditorEngine';

/**
 * Registers commands for the editor
 */
export class EditorCommands {
  private static instance: EditorCommands;
  private editorEngine: EditorEngine;

  private constructor() {
    this.editorEngine = EditorEngine.getInstance();
  }

  static getInstance(): EditorCommands {
    if (!EditorCommands.instance) {
      EditorCommands.instance = new EditorCommands();
    }
    return EditorCommands.instance;
  }

  /**
   * Registers all commands for the editor
   */
  public registerCommands(editor: monaco.editor.IStandaloneCodeEditor, monacoInstance: any) {
    this.registerFileCommands(editor, monacoInstance);
    this.registerEditCommands(editor, monacoInstance);
    this.registerViewCommands(editor, monacoInstance);
    this.registerNavigationCommands(editor, monacoInstance);
  }

  /**
   * Registers file-related commands
   */
  private registerFileCommands(editor: monaco.editor.IStandaloneCodeEditor, monaco: any) {
    // Save file
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      const model = editor.getModel();
      if (model) {
        const uri = model.uri.toString();
        const content = editor.getValue();
        // Dispatch save event
        this.dispatchEvent('save', { uri, content });
      }
    });

    // Save all files
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.KeyS, () => {
      this.dispatchEvent('saveAll');
    });

    // New file
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyN, () => {
      this.dispatchEvent('newFile');
    });
  }

  /**
   * Registers edit-related commands
   */
  private registerEditCommands(editor: monaco.editor.IStandaloneCodeEditor, monaco: any) {
    // Format document
    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, () => {
      this.editorEngine.formatDocument();
    });

    // Toggle comment
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Slash, () => {
      this.editorEngine.toggleComment();
    });

    // Find
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF, () => {
      editor.getAction('actions.find')?.run();
    });

    // Replace
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyH, () => {
      editor.getAction('editor.action.startFindReplaceAction')?.run();
    });

    // Multi-cursor - add cursor below
    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.DownArrow, () => {
      editor.getAction('editor.action.insertCursorBelow')?.run();
    });

    // Multi-cursor - add cursor above
    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.UpArrow, () => {
      editor.getAction('editor.action.insertCursorAbove')?.run();
    });

    // Multi-cursor - add selection to next find match
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyD, () => {
      editor.getAction('editor.action.addSelectionToNextFindMatch')?.run();
    });
  }

  /**
   * Registers view-related commands
   */
  private registerViewCommands(editor: monaco.editor.IStandaloneCodeEditor, monaco: any) {
    // Toggle minimap
    editor.addAction({
      id: 'toggle-minimap',
      label: 'Toggle Minimap',
      keybindings: [monaco.KeyMod.Alt | monaco.KeyCode.KeyM],
      run: (ed) => {
        const currentMinimapState = ed.getOption(monaco.editor.EditorOption.minimap).enabled;
        ed.updateOptions({ minimap: { enabled: !currentMinimapState } });
      }
    });

    // Zoom in
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Equal, () => {
      const fontSize = editor.getOption(monaco.editor.EditorOption.fontSize);
      editor.updateOptions({ fontSize: fontSize + 1 });
    });

    // Zoom out
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Minus, () => {
      const fontSize = editor.getOption(monaco.editor.EditorOption.fontSize);
      editor.updateOptions({ fontSize: Math.max(8, fontSize - 1) });
    });

    // Reset zoom
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Digit0, () => {
      editor.updateOptions({ fontSize: 14 });
    });

    // Fold all
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.BracketLeft, () => {
      this.editorEngine.foldAll();
    });

    // Unfold all
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.BracketRight, () => {
      this.editorEngine.unfoldAll();
    });
  }

  /**
   * Registers navigation-related commands
   */
  private registerNavigationCommands(editor: monaco.editor.IStandaloneCodeEditor, monaco: any) {
    // Go to definition
    editor.addCommand(monaco.KeyCode.F12, () => {
      this.editorEngine.goToDefinition();
    });

    // Find references
    editor.addCommand(monaco.KeyMod.Shift | monaco.KeyCode.F12, () => {
      this.editorEngine.findReferences();
    });

    // Go to line
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyG, () => {
      editor.getAction('editor.action.gotoLine')?.run();
    });

    // Show command palette
    editor.addAction({
      id: 'show-commands',
      label: 'Show All Commands',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyP],
      run: () => {
        this.dispatchEvent('showCommandPalette');
      }
    });
  }

  /**
   * Helper method to dispatch events through the editor engine
   */
  private dispatchEvent(event: string, ...args: any[]) {
    this.editorEngine.emit(event, ...args);
  }
}