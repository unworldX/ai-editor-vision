import * as monaco from 'monaco-editor';
import { MonacoService } from './MonacoService';
import { languages } from 'monaco-editor';

/**
 * Service responsible for editor functionality and features
 * Acts as a facade for Monaco-specific functionality
 */
export class EditorService {
  private static instance: EditorService;
  private editor: monaco.editor.IStandaloneCodeEditor | null = null;
  private monacoService: MonacoService;
  private listeners: Map<string, Function[]> = new Map();
  private completionProviders: Map<string, monaco.IDisposable> = new Map();
  private languageFeatures: Map<string, monaco.IDisposable[]> = new Map();
  private modelCache: Map<string, monaco.editor.ITextModel> = new Map();
  private lastCursorPosition: monaco.Position | null = null;
  private lastSelection: monaco.Selection | null = null;
  private debounceTimers: Map<string, ReturnType<typeof setTimeout>> = new Map();

  private constructor() {
    this.monacoService = MonacoService.getInstance();
    this.registerLanguageProviders();
    this.setupEventListeners();
  }

  public static getInstance(): EditorService {
    if (!EditorService.instance) {
      EditorService.instance = new EditorService();
    }
    return EditorService.instance;
  }

  private setupEventListeners(): void {
    // Listen for theme changes
    this.monacoService.onThemeChange(() => {
      this.emit('themeChanged');
    });
  }

  private registerLanguageProviders(): void {
    // Register TypeScript/JavaScript providers
    this.registerTypeScriptProviders();
    
    // Register other language providers
    this.registerLanguageProvider('html', {
      completion: true,
      hover: true,
      diagnostics: true,
      formatting: true
    });
    
    this.registerLanguageProvider('css', {
      completion: true,
      hover: true,
      diagnostics: true,
      formatting: true
    });
    
    this.registerLanguageProvider('json', {
      completion: true,
      hover: true,
      diagnostics: true,
      formatting: true
    });
  }

  private registerTypeScriptProviders(): void {
    const disposables: monaco.IDisposable[] = [];
    
    // Register completion provider
    disposables.push(
      monaco.languages.registerCompletionItemProvider('typescript', {
        provideCompletionItems: (model, position) => {
          return {
            suggestions: []
          };
        }
      })
    );
    
    // Register hover provider
    disposables.push(
      monaco.languages.registerHoverProvider('typescript', {
        provideHover: (model, position) => {
          return {
            contents: []
          };
        }
      })
    );
    
    // Register code action provider
    disposables.push(
      monaco.languages.registerCodeActionProvider('typescript', {
        provideCodeActions: (model, range) => {
          return {
            actions: [],
            dispose: () => {}
          };
        }
      })
    );
    
    this.languageFeatures.set('typescript', disposables);
  }

  private registerLanguageProvider(
    language: string,
    features: {
      completion?: boolean;
      hover?: boolean;
      diagnostics?: boolean;
      formatting?: boolean;
    }
  ): void {
    const disposables: monaco.IDisposable[] = [];
    
    if (features.completion) {
      disposables.push(
        monaco.languages.registerCompletionItemProvider(language, {
          provideCompletionItems: (model, position) => {
            return {
              suggestions: []
            };
          }
        })
      );
    }
    
    if (features.hover) {
      disposables.push(
        monaco.languages.registerHoverProvider(language, {
          provideHover: (model, position) => {
            return {
              contents: []
            };
          }
        })
      );
    }
    
    if (features.diagnostics) {
      disposables.push(
        monaco.languages.registerCodeActionProvider(language, {
          provideCodeActions: (model: monaco.editor.ITextModel) => {
            return {
              actions: [],
              dispose: () => {}
            };
          }
        })
      );
    }
    
    if (features.formatting) {
      disposables.push(
        monaco.languages.registerDocumentFormattingEditProvider(language, {
          provideDocumentFormattingEdits: (model) => {
            return [];
          }
        })
      );
    }
    
    this.languageFeatures.set(language, disposables);
  }

  public setEditor(editor: monaco.editor.IStandaloneCodeEditor): void {
    this.editor = editor;
    this.monacoService.registerEditor(editor);
    this.setupEditorListeners();
  }

  private setupEditorListeners(): void {
    if (!this.editor) return;

    // Track cursor position
    this.editor.onDidChangeCursorPosition((e) => {
      this.lastCursorPosition = e.position;
      this.emit('cursorPositionChanged', e);
    });

    // Track selection
    this.editor.onDidChangeCursorSelection((e) => {
      this.lastSelection = e.selection;
      this.emit('selectionChanged', e);
    });

    // Track content changes
    this.editor.onDidChangeModelContent((e) => {
      this.emit('contentChanged', e);
    });

    // Track focus
    this.editor.onDidFocusEditorText(() => {
      this.emit('focus');
    });

    this.editor.onDidBlurEditorText(() => {
      this.emit('blur');
    });
  }

  public getEditor(): monaco.editor.IStandaloneCodeEditor | null {
    return this.editor;
  }

  public createModel(content: string, language: string, uri: string): monaco.editor.ITextModel {
    const model = this.monacoService.createModel(content, language, uri);
    this.modelCache.set(uri, model);
    return model;
  }

  public getOrCreateModel(content: string, language: string, uri: string): monaco.editor.ITextModel {
    const cachedModel = this.modelCache.get(uri);
    if (cachedModel) {
      return cachedModel;
    }
    return this.createModel(content, language, uri);
  }

  public formatDocument(): void {
    if (!this.editor) return;
    
    this.editor.getAction('editor.action.formatDocument')?.run();
  }

  public findReferences(): void {
    if (!this.editor) return;
    
    this.editor.getAction('editor.action.referenceSearch.trigger')?.run();
  }

  public goToDefinition(): void {
    if (!this.editor) return;
    
    this.editor.getAction('editor.action.revealDefinition')?.run();
  }

  public toggleComment(): void {
    if (!this.editor) return;
    
    this.editor.getAction('editor.action.commentLine')?.run();
  }

  public foldAll(): void {
    if (!this.editor) return;
    
    this.editor.getAction('editor.foldAll')?.run();
  }

  public unfoldAll(): void {
    if (!this.editor) return;
    
    this.editor.getAction('editor.unfoldAll')?.run();
  }

  public executeCommand(commandId: string): void {
    if (!this.editor) return;
    
    this.editor.getAction(commandId)?.run();
  }

  public addCursor(lineNumber: number, column: number): void {
    if (!this.editor) return;
    
    const position = new monaco.Position(lineNumber, column);
    this.editor.setPosition(position);
    this.editor.getAction('editor.action.insertCursorBelow')?.run();
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
    // Clear model cache
    this.modelCache.forEach(model => model.dispose());
    this.modelCache.clear();
    
    // Clear language features
    this.languageFeatures.forEach(disposables => {
      disposables.forEach(disposable => disposable.dispose());
    });
    this.languageFeatures.clear();
    
    // Clear completion providers
    this.completionProviders.forEach(provider => provider.dispose());
    this.completionProviders.clear();
    
    // Clear event listeners
    this.listeners.clear();
    
    // Clear debounce timers
    this.debounceTimers.forEach(timer => clearTimeout(timer));
    this.debounceTimers.clear();
    
    // Dispose editor
    if (this.editor) {
      this.monacoService.unregisterEditor(this.editor);
      this.editor.dispose();
      this.editor = null;
    }
  }
} 