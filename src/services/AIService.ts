
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
      id: 'explain',
      name: 'Explain Code',
      description: 'Explain selected code',
      trigger: 'contextMenu',
      shortcut: 'Ctrl+Shift+E',
      icon: 'info',
      enabled: true,
    },
    {
      id: 'refactor',
      name: 'Refactor Code',
      description: 'Clean up / optimize code',
      trigger: 'contextMenu',
      shortcut: 'Ctrl+Shift+R',
      icon: 'wand',
      enabled: true,
    },
    {
      id: 'tests',
      name: 'Generate Tests',
      description: 'Auto-generate unit tests',
      trigger: 'sidebar',
      icon: 'code',
      enabled: true,
    },
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
      responses: [...state.responses, response],
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
    // Implementation will be added when connected to an AI provider
    const response: AIResponse = {
      text: "Code explanation will be implemented when connected to an AI provider",
      tokens: 0,
      model: "none",
      timestamp: Date.now()
    };
    this.store.getState().addResponse(response);
    return response;
  }

  public async refactorCode(context: AIContext): Promise<AIResponse> {
    // Implementation will be added when connected to an AI provider
    const response: AIResponse = {
      text: "Code refactoring will be implemented when connected to an AI provider",
      tokens: 0,
      model: "none",
      timestamp: Date.now()
    };
    this.store.getState().addResponse(response);
    return response;
  }

  public async generateTests(context: AIContext): Promise<AIResponse> {
    // Implementation will be added when connected to an AI provider
    const response: AIResponse = {
      text: "Test generation will be implemented when connected to an AI provider",
      tokens: 0,
      model: "none",
      timestamp: Date.now()
    };
    this.store.getState().addResponse(response);
    return response;
  }
}
