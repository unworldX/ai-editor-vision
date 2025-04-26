import * as monaco from 'monaco-editor';
import { languages } from 'monaco-editor';

/**
 * Service responsible for Monaco editor configuration and low-level functionality
 */
export class MonacoService {
  private static instance: MonacoService;
  private completionProviders: Map<string, monaco.IDisposable> = new Map();
  private diagnosticCollection: Map<string, monaco.editor.IMarkerData[]> = new Map();
  private isInitialized: boolean = false;
  private editorInstances: Set<monaco.editor.IStandaloneCodeEditor> = new Set();
  private themeChangeListeners: Set<() => void> = new Set();

  private constructor() {
    this.initializeMonaco();
  }

  public static getInstance(): MonacoService {
    if (!MonacoService.instance) {
      MonacoService.instance = new MonacoService();
    }
    return MonacoService.instance;
  }

  private initializeMonaco(): void {
    if (this.isInitialized) return;

    try {
      // Define custom themes
      this.defineThemes();
      
      // Set up language defaults
      this.setupLanguageDefaults();
      
      // Initialize worker
      this.initializeWorker();
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize Monaco:', error);
      throw error;
    }
  }

  private defineThemes(): void {
    monaco.editor.defineTheme('custom-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1e1e1e',
        'editor.foreground': '#d4d4d4',
        'editor.lineHighlightBackground': '#2a2a2a',
        'editor.selectionBackground': '#264f78',
        'editor.inactiveSelectionBackground': '#3a3d41',
        'editorCursor.foreground': '#d4d4d4',
        'editorWhitespace.foreground': '#404040',
        'editorLineNumber.foreground': '#858585',
        'editorIndentGuide.background': '#404040',
        'editorIndentGuide.activeBackground': '#707070',
      }
    });

    monaco.editor.defineTheme('custom-light', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#000000',
        'editor.lineHighlightBackground': '#f5f5f5',
        'editor.selectionBackground': '#add6ff',
        'editor.inactiveSelectionBackground': '#e5ebf1',
        'editorCursor.foreground': '#000000',
        'editorWhitespace.foreground': '#e3e3e3',
        'editorLineNumber.foreground': '#237893',
        'editorIndentGuide.background': '#d3d3d3',
        'editorIndentGuide.activeBackground': '#939393',
      }
    });
  }

  private setupLanguageDefaults(): void {
    monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
    monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: "React",
      allowJs: true,
      typeRoots: ["node_modules/@types"]
    });
  }

  private initializeWorker(): void {
    const workerUrl = new URL('monaco-editor/esm/vs/language/typescript/ts.worker', import.meta.url);
    window.MonacoEnvironment = {
      getWorkerUrl: function (moduleId, label) {
        if (label === 'typescript' || label === 'javascript') {
          return workerUrl.toString();
        }
        return './editor.worker.js';
      }
    };
  }

  public registerEditor(editor: monaco.editor.IStandaloneCodeEditor): void {
    this.editorInstances.add(editor);
    this.setupPerformanceMonitoring(editor);
  }

  private setupPerformanceMonitoring(editor: monaco.editor.IStandaloneCodeEditor): void {
    let lastRenderTime = performance.now();

    editor.onDidLayoutChange(() => {
      const currentTime = performance.now();
      const renderTime = currentTime - lastRenderTime;

      if (renderTime > 16) {
        console.warn(`Editor layout change took ${renderTime}ms`);
      }

      lastRenderTime = currentTime;
    });
  }

  public unregisterEditor(editor: monaco.editor.IStandaloneCodeEditor): void {
    this.editorInstances.delete(editor);
  }

  public setTheme(theme: 'custom-dark' | 'custom-light'): void {
    monaco.editor.setTheme(theme);
    this.themeChangeListeners.forEach(listener => listener());
  }

  public onThemeChange(listener: () => void): monaco.IDisposable {
    this.themeChangeListeners.add(listener);
    return {
      dispose: () => this.themeChangeListeners.delete(listener)
    };
  }

  public createModel(content: string, language: string, uri: string): monaco.editor.ITextModel {
    try {
      const existingModel = monaco.editor.getModel(monaco.Uri.parse(uri));
      if (existingModel) {
        existingModel.dispose();
      }
      return monaco.editor.createModel(content, language, monaco.Uri.parse(uri));
    } catch (error) {
      console.error(`Failed to create model for ${uri}:`, error);
      throw error;
    }
  }

  public getDefaultEditorOptions(): monaco.editor.IStandaloneEditorConstructionOptions {
    return {
      theme: 'custom-dark',
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      lineNumbers: 'on',
      scrollBeyondLastLine: false,
      minimap: { 
        enabled: true,
        scale: 1,
        maxColumn: 80,
        renderCharacters: true,
        showSlider: 'always'
      },
      automaticLayout: true,
      tabSize: 2,
      wordWrap: 'on',
      contextmenu: true,
      quickSuggestions: {
        other: true,
        comments: true,
        strings: true
      },
      suggestOnTriggerCharacters: true,
      acceptSuggestionOnEnter: 'on',
      renderLineHighlight: 'all',
      scrollbar: {
        verticalScrollbarSize: 12,
        horizontalScrollbarSize: 12,
        useShadows: true,
        verticalHasArrows: false,
        horizontalHasArrows: false,
        handleMouseWheel: true,
        alwaysConsumeMouseWheel: false
      },
      renderWhitespace: 'selection',
      renderControlCharacters: true,
      fontLigatures: true,
      bracketPairColorization: {
        enabled: true
      },
      guides: {
        bracketPairs: true,
        bracketPairsHorizontal: true,
        highlightActiveBracketPair: true,
        indentation: true
      },
      smoothScrolling: true,
      mouseWheelZoom: true,
      cursorSmoothCaretAnimation: 'on',
      cursorBlinking: 'smooth',
      cursorStyle: 'line',
      cursorWidth: 1,
      multiCursorModifier: 'alt',
      accessibilitySupport: 'auto',
      autoIndent: 'advanced',
      formatOnPaste: true,
      formatOnType: true,
      suggest: {
        preview: true,
        showMethods: true,
        showFunctions: true,
        showConstructors: true,
        showFields: true,
        showVariables: true,
        showClasses: true,
        showStructs: true,
        showInterfaces: true,
        showModules: true,
        showProperties: true,
        showEvents: true,
        showOperators: true,
        showUnits: true,
        showValues: true,
        showConstants: true,
        showEnums: true,
        showEnumMembers: true,
        showKeywords: true,
        showWords: true,
        showColors: true,
        showFiles: true,
        showReferences: true,
        showFolders: true,
        showTypeParameters: true,
        showSnippets: true
      }
    };
  }

  public dispose(): void {
    this.completionProviders.forEach(provider => provider.dispose());
    this.completionProviders.clear();
    this.diagnosticCollection.clear();
    this.editorInstances.forEach(editor => editor.dispose());
    this.editorInstances.clear();
    this.themeChangeListeners.clear();
  }
}