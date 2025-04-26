
import * as monaco from 'monaco-editor';

// Complete standalone editor options with all available configurations
export const getEditorOptions = (isPrimary: boolean = true): monaco.editor.IStandaloneEditorConstructionOptions => ({
  lineNumbers: 'on',
  folding: true,
  foldingHighlight: true,
  showFoldingControls: 'always',
  minimap: {
    enabled: true,
    showSlider: 'always',
    renderCharacters: false,
    maxColumn: 120,
    scale: 1
  },
  glyphMargin: true,
  lineDecorationsWidth: 10,
  lineNumbersMinChars: 3,
  scrollBeyondLastLine: false,
  wordWrap: 'on',
  wrappingIndent: 'indent',
  bracketPairColorization: {
    enabled: true,
  },
  guides: {
    bracketPairs: true,
    indentation: true,
    highlightActiveIndentation: true,
    bracketPairsHorizontal: true
  },
  renderWhitespace: 'selection',
  scrollbar: {
    vertical: 'visible',
    horizontal: 'visible',
    verticalScrollbarSize: 12,
    horizontalScrollbarSize: 12,
    useShadows: true
  },
  inlineSuggest: {
    enabled: true
  },
  occurrencesHighlight: true,
  renderLineHighlight: 'all',
  suggestOnTriggerCharacters: true,
  codeLens: true,
  inlayHints: {
    enabled: true
  },
  padding: {
    top: 5,
    bottom: 5
  },
  readOnly: !isPrimary,
  theme: 'vs-dark',
  fontFamily: "'Fira Code', 'Cascadia Code', 'Source Code Pro', monospace",
  fontLigatures: true,
  fontSize: 14,
  mouseWheelZoom: true,
  cursorBlinking: 'smooth',
  cursorSmoothCaretAnimation: true,
  smoothScrolling: true,
  formatOnPaste: true,
  formatOnType: true,
  automaticLayout: true,
  tabSize: 2,
  quickSuggestions: {
    other: true,
    comments: true,
    strings: true
  },
  suggestSelection: 'first',
  acceptSuggestionOnEnter: 'on',
  accessibilitySupport: 'auto',
  autoIndent: 'advanced',
  multiCursorModifier: 'alt',
  contextmenu: true,
  cursorStyle: 'line',
  cursorWidth: 2,
});

// Define custom themes for Monaco
export const defineMonacoThemes = (monaco: typeof monaco) => {
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
};

// Language configuration for TypeScript and JavaScript
export const configureLanguages = (monaco: typeof monaco) => {
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
};

// Setup Monaco workers
export const setupMonacoWorkers = () => {
  if (typeof window !== "undefined") {
    window.MonacoEnvironment = {
      getWorker: function (moduleId, label) {
        if (label === 'typescript' || label === 'javascript') {
          return new Worker(new URL('monaco-editor/esm/vs/language/typescript/ts.worker', import.meta.url), { type: 'module' });
        }
        if (label === 'css' || label === 'scss' || label === 'less') {
          return new Worker(new URL('monaco-editor/esm/vs/language/css/css.worker', import.meta.url), { type: 'module' });
        }
        if (label === 'html' || label === 'handlebars' || label === 'razor') {
          return new Worker(new URL('monaco-editor/esm/vs/language/html/html.worker', import.meta.url), { type: 'module' });
        }
        if (label === 'json') {
          return new Worker(new URL('monaco-editor/esm/vs/language/json/json.worker', import.meta.url), { type: 'module' });
        }
        return new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker', import.meta.url), { type: 'module' });
      }
    };
  }
};
