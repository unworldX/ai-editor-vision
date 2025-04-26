
export interface AIProvider {
  id: string;
  name: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

export interface AIFeature {
  id: string;
  name: string;
  description: string;
  trigger: 'contextMenu' | 'shortcut' | 'sidebar' | 'inline' | 'button';
  shortcut?: string;
  icon?: string;
  enabled: boolean;
}

export interface AIResponse {
  text: string;
  tokens: number;
  model: string;
  timestamp: number;
}

export interface AIContext {
  selection?: string;
  file?: string;
  language?: string;
  cursor?: {
    line: number;
    column: number;
  };
}
