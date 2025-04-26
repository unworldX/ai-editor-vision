
import * as monaco from 'monaco-editor';
import { defineMonacoThemes, configureLanguages, setupMonacoWorkers } from './EditorConfiguration';

/**
 * Sets up the Monaco environment for web workers and configures Monaco editor
 */
export const setupMonacoEnvironment = (): void => {
  // Set up web workers
  setupMonacoWorkers();
  
  // Define custom themes
  defineMonacoThemes(monaco);
  
  // Configure languages
  configureLanguages(monaco);
  
  // Set the default theme
  monaco.editor.setTheme('custom-dark');
};

// Initialize Monaco environment
setupMonacoEnvironment();
