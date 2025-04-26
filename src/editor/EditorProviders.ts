
import * as monaco from 'monaco-editor';
import { EditorEngine } from './EditorEngine';

export class EditorProviders {
  static setupProviders(editor: monaco.editor.IStandaloneCodeEditor, monacoInstance: typeof monaco) {
    this.setupHoverProvider(monacoInstance);
    this.setupEventListeners(editor);
  }

  private static setupHoverProvider(monaco: typeof monaco) {
    monaco.languages.registerHoverProvider('*', {
      provideHover: (model, position) => {
        return {
          contents: [
            { value: '**Hover Info**' },
            { value: 'This is a sample hover provider. Replace with actual documentation.' }
          ]
        };
      }
    });
  }

  private static setupEventListeners(editor: monaco.editor.IStandaloneCodeEditor) {
    const editorEngine = EditorEngine.getInstance();

    const handleCursorPositionChanged = (e: any) => {
      console.log('Cursor position changed:', e.position);
    };

    const handleSelectionChanged = (e: any) => {
      console.log('Selection changed');
    };

    const handleSave = (data: any) => {
      console.log('File saved:', data);
    };

    editorEngine.on('cursorPositionChanged', handleCursorPositionChanged);
    editorEngine.on('selectionChanged', handleSelectionChanged);
    editorEngine.on('save', handleSave);

    return () => {
      editorEngine.off('cursorPositionChanged', handleCursorPositionChanged);
      editorEngine.off('selectionChanged', handleSelectionChanged);
      editorEngine.off('save', handleSave);
    };
  }
}

