
import * as monaco from 'monaco-editor';

export const configureMonaco = () => {
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ESNext,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.CommonJS,
    noEmit: true,
    typeRoots: ['node_modules/@types']
  });

  // Define dark theme
  monaco.editor.defineTheme('custom-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#1e1e1e',
      'editor.foreground': '#d4d4d4',
      'editor.lineHighlightBackground': '#2a2a2a',
      'editor.selectionBackground': '#264f78'
    }
  });

  // Set as default theme
  monaco.editor.setTheme('custom-dark');
};

export const defaultEditorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
  fontSize: 14,
  fontFamily: 'Menlo, Monaco, "Courier New", monospace',
  lineNumbers: 'on',
  minimap: { enabled: true },
  scrollBeyondLastLine: false,
  automaticLayout: true,
  tabSize: 2,
  wordWrap: 'on'
};
