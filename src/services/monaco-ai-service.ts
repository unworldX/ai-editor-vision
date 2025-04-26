
import * as monaco from 'monaco-editor';
import { AIService } from './AIService';

export class MonacoAIService {
  private static instance: MonacoAIService;
  private aiService: AIService;

  private constructor() {
    this.aiService = AIService.getInstance();
    this.registerMonacoIntegrations();
  }

  public static getInstance(): MonacoAIService {
    if (!MonacoAIService.instance) {
      MonacoAIService.instance = new MonacoAIService();
    }
    return MonacoAIService.instance;
  }

  private registerMonacoIntegrations() {
    // Register AI context menu actions
    monaco.editor.addEditorAction({
      id: 'ai.explain',
      label: 'AI: Explain Code',
      contextMenuGroupId: 'ai',
      contextMenuOrder: 1,
      run: async (editor) => {
        const selection = editor.getSelection();
        if (!selection) return;
        
        const model = editor.getModel();
        if (!model) return;
        
        const selectedText = model.getValueInRange(selection);
        const language = model.getLanguageId();
        
        const context = {
          selection: selectedText,
          language,
          file: model.uri.toString(),
          cursor: {
            line: selection.startLineNumber,
            column: selection.startColumn
          }
        };
        
        try {
          const response = await this.aiService.explainCode(context);
          console.log('AI explanation:', response.text);
          
          // Display the response (in a real implementation, this would be shown in a UI component)
          // For now, we'll just log it
        } catch (error) {
          console.error('Error getting AI explanation:', error);
        }
      }
    });

    monaco.editor.addEditorAction({
      id: 'ai.refactor',
      label: 'AI: Refactor Code',
      contextMenuGroupId: 'ai',
      contextMenuOrder: 2,
      run: async (editor) => {
        const selection = editor.getSelection();
        if (!selection) return;
        
        const model = editor.getModel();
        if (!model) return;
        
        const selectedText = model.getValueInRange(selection);
        const language = model.getLanguageId();
        
        const context = {
          selection: selectedText,
          language,
          file: model.uri.toString(),
          cursor: {
            line: selection.startLineNumber,
            column: selection.startColumn
          }
        };
        
        try {
          const response = await this.aiService.suggestRefactor(context);
          console.log('AI refactoring suggestion:', response.text);
        } catch (error) {
          console.error('Error getting AI refactoring suggestion:', error);
        }
      }
    });

    monaco.editor.addEditorAction({
      id: 'ai.generateTests',
      label: 'AI: Generate Tests',
      contextMenuGroupId: 'ai',
      contextMenuOrder: 3,
      run: async (editor) => {
        const selection = editor.getSelection();
        if (!selection) return;
        
        const model = editor.getModel();
        if (!model) return;
        
        const selectedText = model.getValueInRange(selection);
        const language = model.getLanguageId();
        
        const context = {
          selection: selectedText,
          language,
          file: model.uri.toString(),
          cursor: {
            line: selection.startLineNumber,
            column: selection.startColumn
          }
        };
        
        try {
          const response = await this.aiService.generateTests(context);
          console.log('AI generated tests:', response.text);
        } catch (error) {
          console.error('Error generating tests:', error);
        }
      }
    });
  }
}
