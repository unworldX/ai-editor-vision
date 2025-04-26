
import { create } from 'zustand';
import { AIContext, AIFeature, AIProvider, AIResponse } from '../types/ai';

interface AIState {
  features: AIFeature[];
  provider: AIProvider | null;
  responses: AIResponse[];
  setProvider: (provider: AIProvider) => void;
  toggleFeature: (featureId: string) => void;
  addResponse: (response: AIResponse) => void;
}

export const useAIStore = create<AIState>((set) => ({
  features: [
    {
      id: 'explain-code',
      name: 'Explain Code',
      description: 'Get detailed explanations of selected code',
      trigger: 'contextMenu',
      shortcut: 'Ctrl+Alt+E',
      icon: 'brain',
      enabled: true,
    },
    {
      id: 'refactor',
      name: 'Refactor Code',
      description: 'Get suggestions for code improvements and optimizations',
      trigger: 'contextMenu',
      shortcut: 'Ctrl+Alt+R',
      icon: 'wand',
      enabled: true,
    },
    {
      id: 'generate-tests',
      name: 'Generate Tests',
      description: 'Auto-generate unit tests for selected code',
      trigger: 'contextMenu',
      shortcut: 'Ctrl+Alt+T',
      icon: 'code',
      enabled: true,
    },
    {
      id: 'complete-code',
      name: 'Complete Code',
      description: 'Get intelligent code completion suggestions',
      trigger: 'inline',
      icon: 'sparkles',
      enabled: true,
    }
  ],
  provider: null,
  responses: [],
  setProvider: (provider) => set({ provider }),
  toggleFeature: (featureId) => 
    set((state) => ({
      features: state.features.map((f) =>
        f.id === featureId ? { ...f, enabled: !f.enabled } : f
      ),
    })),
  addResponse: (response) =>
    set((state) => ({
      responses: [...state.responses.slice(-4), response],
    })),
}));

export class AIService {
  private static instance: AIService;
  private store = useAIStore;

  private constructor() {}

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  public async explainCode(context: AIContext): Promise<AIResponse> {
    const response: AIResponse = {
      text: "This code implements... (explanation will be integrated with AI provider)",
      tokens: 0,
      model: "demo",
      timestamp: Date.now()
    };
    this.store.getState().addResponse(response);
    return response;
  }

  public async suggestRefactor(context: AIContext): Promise<AIResponse> {
    const response: AIResponse = {
      text: "Consider refactoring... (suggestions will be integrated with AI provider)",
      tokens: 0,
      model: "demo",
      timestamp: Date.now()
    };
    this.store.getState().addResponse(response);
    return response;
  }

  public async generateTests(context: AIContext): Promise<AIResponse> {
    const response: AIResponse = {
      text: "describe('Component', () => {...}) (tests will be integrated with AI provider)",
      tokens: 0,
      model: "demo",
      timestamp: Date.now()
    };
    this.store.getState().addResponse(response);
    return response;
  }
}
