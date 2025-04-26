import * as monaco from 'monaco-editor';
import { EditorEngine } from './EditorEngine';

export interface Diagnostic {
  message: string;
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
  severity: 'error' | 'warning' | 'info' | 'hint';
  source?: string;
  code?: string;
}

export class EditorDiagnostics {
  private static instance: EditorDiagnostics;
  private editorEngine: EditorEngine;
  private diagnostics: Map<string, monaco.editor.IMarkerData[]> = new Map();

  private constructor() {
    this.editorEngine = EditorEngine.getInstance();
  }

  static getInstance(): EditorDiagnostics {
    if (!EditorDiagnostics.instance) {
      EditorDiagnostics.instance = new EditorDiagnostics();
    }
    return EditorDiagnostics.instance;
  }

  public setDiagnostics(uri: string, diagnostics: Diagnostic[]) {
    const markerData = diagnostics.map(diagnostic => this.convertToMarkerData(diagnostic));
    this.diagnostics.set(uri, markerData);
    this.editorEngine.setDiagnostics(uri, markerData);
  }

  public clearDiagnostics(uri: string) {
    this.diagnostics.delete(uri);
    this.editorEngine.clearDiagnostics(uri);
  }

  public getDiagnostics(uri: string): monaco.editor.IMarkerData[] {
    return this.diagnostics.get(uri) || [];
  }

  public getAllDiagnostics(): Map<string, monaco.editor.IMarkerData[]> {
    return new Map(this.diagnostics);
  }

  private convertToMarkerData(diagnostic: Diagnostic): monaco.editor.IMarkerData {
    const severityMap: Record<string, monaco.MarkerSeverity> = {
      'error': monaco.MarkerSeverity.Error,
      'warning': monaco.MarkerSeverity.Warning,
      'info': monaco.MarkerSeverity.Info,
      'hint': monaco.MarkerSeverity.Hint
    };

    return {
      message: diagnostic.message,
      severity: severityMap[diagnostic.severity],
      startLineNumber: diagnostic.startLineNumber,
      startColumn: diagnostic.startColumn,
      endLineNumber: diagnostic.endLineNumber,
      endColumn: diagnostic.endColumn,
      source: diagnostic.source,
      code: diagnostic.code
    };
  }

  // Utility methods for common diagnostics

  public addErrorDiagnostic(uri: string, message: string, line: number, column: number, endColumn: number) {
    const diagnostic: Diagnostic = {
      message,
      startLineNumber: line,
      startColumn: column,
      endLineNumber: line,
      endColumn: endColumn,
      severity: 'error'
    };

    const existingDiagnostics = this.getDiagnostics(uri);
    this.setDiagnostics(uri, [...existingDiagnostics, this.convertToMarkerData(diagnostic)]);
  }

  public addWarningDiagnostic(uri: string, message: string, line: number, column: number, endColumn: number) {
    const diagnostic: Diagnostic = {
      message,
      startLineNumber: line,
      startColumn: column,
      endLineNumber: line,
      endColumn: endColumn,
      severity: 'warning'
    };

    const existingDiagnostics = this.getDiagnostics(uri);
    this.setDiagnostics(uri, [...existingDiagnostics, this.convertToMarkerData(diagnostic)]);
  }

  public addInfoDiagnostic(uri: string, message: string, line: number, column: number, endColumn: number) {
    const diagnostic: Diagnostic = {
      message,
      startLineNumber: line,
      startColumn: column,
      endLineNumber: line,
      endColumn: endColumn,
      severity: 'info'
    };

    const existingDiagnostics = this.getDiagnostics(uri);
    this.setDiagnostics(uri, [...existingDiagnostics, this.convertToMarkerData(diagnostic)]);
  }
}