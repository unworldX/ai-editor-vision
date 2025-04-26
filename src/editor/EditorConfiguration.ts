
import * as monaco from 'monaco-editor';

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
});

