import * as monaco from 'monaco-editor';
import { EditorService } from '../services/EditorService';
import { create } from 'zustand';

interface EditorState {
  isEditorReady: boolean;
  currentFile: string | null;
  language: string;
  theme: 'custom-dark' | 'custom-light';
  fontSize: number;
  wordWrap: boolean;
  minimap: boolean;
  lineNumbers: boolean;
  setEditorReady: (ready: boolean) => void;
  setCurrentFile: (file: string | null) => void;
  setLanguage: (language: string) => void;
  setTheme: (theme: 'custom-dark' | 'custom-light') => void;
  setFontSize: (size: number) => void;
  setWordWrap: (enabled: boolean) => void;
  setMinimap: (enabled: boolean) => void;
  setLineNumbers: (enabled: boolean) => void;
}

const useEditorStore = create<EditorState>((set) => ({
  isEditorReady: false,
  currentFile: null,
  language: 'typescript',
  theme: 'custom-dark',
  fontSize: 14,
  wordWrap: true,
  minimap: true,
  lineNumbers: true,
  setEditorReady: (ready) => set({ isEditorReady: ready }),
  setCurrentFile: (file) => set({ currentFile: file }),
  setLanguage: (language) => set({ language }),
  setTheme: (theme) => set({ theme }),
  setFontSize: (size) => set({ fontSize: size }),
  setWordWrap: (enabled) => set({ wordWrap: enabled }),
  setMinimap: (enabled) => set({ minimap: enabled }),
  setLineNumbers: (enabled) => set({ lineNumbers: enabled }),
}));

/**
 * EditorEngine provides high-level functionality for the editor
 * It uses EditorService for most of its operations
 */
export class EditorEngine {
  private static instance: EditorEngine;
  private editorService: EditorService;
  private listeners: Map<string, Function[]> = new Map();
  private state: EditorState;
  private lastSaveTime: number = 0;
  private autoSaveInterval: number | null = null;
  private pendingChanges: boolean = false;

  private constructor() {
    this.editorService = EditorService.getInstance();
    this.state = useEditorStore.getState();
    this.setupListeners();
    this.setupAutoSave();
  }

  public static getInstance(): EditorEngine {
    if (!EditorEngine.instance) {
      EditorEngine.instance = new EditorEngine();
    }
    return EditorEngine.instance;
  }

  private setupListeners(): void {
    // Listen for editor ready state
    this.editorService.on('editor-ready', () => {
      this.state.setEditorReady(true);
      this.emit('editor-ready');
    });

    // Listen for content changes
    this.editorService.on('contentChanged', () => {
      this.pendingChanges = true;
      this.emit('contentChanged');
    });

    // Listen for cursor position changes
    this.editorService.on('cursorPositionChanged', (e: monaco.editor.ICursorPositionChangedEvent) => {
      this.emit('cursorPositionChanged', e);
    });

    // Listen for selection changes
    this.editorService.on('selectionChanged', (e: monaco.editor.ICursorSelectionChangedEvent) => {
      this.emit('selectionChanged', e);
    });

    // Listen for focus changes
    this.editorService.on('focus', () => {
      this.emit('focus');
    });

    this.editorService.on('blur', () => {
      this.emit('blur');
    });
  }

  private setupAutoSave(): void {
    // Auto-save every 30 seconds if there are pending changes
    this.autoSaveInterval = window.setInterval(() => {
      if (this.pendingChanges) {
        this.save();
      }
    }, 30000);
  }

  public setEditor(editor: monaco.editor.IStandaloneCodeEditor): void {
    this.editorService.setEditor(editor);
  }

  public getEditor(): monaco.editor.IStandaloneCodeEditor | null {
    return this.editorService.getEditor();
  }

  public createModel(content: string, language: string, uri: string): monaco.editor.ITextModel {
    return this.editorService.createModel(content, language, uri);
  }

  public getOrCreateModel(content: string, language: string, uri: string): monaco.editor.ITextModel {
    return this.editorService.getOrCreateModel(content, language, uri);
  }

  public formatDocument(): void {
    this.editorService.formatDocument();
  }

  public findReferences(): void {
    this.editorService.findReferences();
  }

  public goToDefinition(): void {
    this.editorService.goToDefinition();
  }

  public toggleComment(): void {
    this.editorService.toggleComment();
  }

  public foldAll(): void {
    this.editorService.foldAll();
  }

  public unfoldAll(): void {
    this.editorService.unfoldAll();
  }

  public executeCommand(commandId: string): void {
    this.editorService.executeCommand(commandId);
  }

  public addCursor(lineNumber: number, column: number): void {
    this.editorService.addCursor(lineNumber, column);
  }

  public save(): void {
    if (!this.state.currentFile) return;

    const editor = this.getEditor();
    if (!editor) return;

    const content = editor.getValue();
    // Here you would typically save the content to a file or storage
    this.lastSaveTime = Date.now();
    this.pendingChanges = false;
    this.emit('save', this.state.currentFile, content);
  }

  public setTheme(theme: 'custom-dark' | 'custom-light'): void {
    this.state.setTheme(theme);
    const editor = this.getEditor();
    if (editor) {
      editor.updateOptions({ theme });
    }
  }

  public setFontSize(size: number): void {
    this.state.setFontSize(size);
    const editor = this.getEditor();
    if (editor) {
      editor.updateOptions({ fontSize: size });
    }
  }

  public setWordWrap(enabled: boolean): void {
    this.state.setWordWrap(enabled);
    const editor = this.getEditor();
    if (editor) {
      editor.updateOptions({ wordWrap: enabled ? 'on' : 'off' });
    }
  }

  public setMinimap(enabled: boolean): void {
    this.state.setMinimap(enabled);
    const editor = this.getEditor();
    if (editor) {
      editor.updateOptions({ minimap: { enabled } });
    }
  }

  public setLineNumbers(enabled: boolean): void {
    this.state.setLineNumbers(enabled);
    const editor = this.getEditor();
    if (editor) {
      editor.updateOptions({ lineNumbers: enabled ? 'on' : 'off' });
    }
  }

  public on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  public off(event: string, callback: Function): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(event: string, ...args: any[]): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(...args));
    }
  }

  public dispose(): void {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
    this.listeners.clear();
    this.editorService.dispose();
  }
}