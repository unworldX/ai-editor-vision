import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

interface AIModel {
  id: string;
  name: string;
  type: 'local' | 'cloud';
  provider: string;
  endpoint: string;
  apiKey?: string;
}

interface AIContext {
  id: string;
  type: 'file' | 'symbol' | 'selection';
  content: string;
  metadata: Record<string, any>;
}

interface AIState {
  models: AIModel[];
  activeModel: AIModel | null;
  contexts: Map<string, AIContext>;
  setActiveModel: (model: AIModel) => void;
  addContext: (context: Omit<AIContext, 'id'>) => void;
  removeContext: (id: string) => void;
  clearContexts: () => void;
}

const useAIStore = create<AIState>((set) => ({
  models: [],
  activeModel: null,
  contexts: new Map(),
  setActiveModel: (model) => set({ activeModel: model }),
  addContext: (context) => set((state) => {
    const id = uuidv4();
    const contexts = new Map(state.contexts);
    contexts.set(id, { ...context, id });
    return { contexts };
  }),
  removeContext: (id) => set((state) => {
    const contexts = new Map(state.contexts);
    contexts.delete(id);
    return { contexts };
  }),
  clearContexts: () => set({ contexts: new Map() }),
}));

export class AIService {
  private static instance: AIService;
  private state: AIState;
  private modelProviders: Map<string, (prompt: string, context: AIContext[]) => Promise<string>>;

  private constructor() {
    this.state = useAIStore.getState();
    this.modelProviders = new Map();
    this.initializeProviders();
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  private initializeProviders(): void {
    // Register OpenAI provider
    this.registerProvider('openai', async (prompt, context) => {
      // TODO: Implement OpenAI API calls
      return '';
    });

    // Register Anthropic provider
    this.registerProvider('anthropic', async (prompt, context) => {
      // TODO: Implement Anthropic API calls
      return '';
    });

    // Register Ollama provider
    this.registerProvider('ollama', async (prompt, context) => {
      // TODO: Implement Ollama API calls
      return '';
    });
  }

  public registerProvider(
    name: string,
    provider: (prompt: string, context: AIContext[]) => Promise<string>
  ): void {
    this.modelProviders.set(name, provider);
  }

  public async getCompletion(
    prompt: string,
    contextIds: string[] = []
  ): Promise<string> {
    if (!this.state.activeModel) {
      throw new Error('No active AI model selected');
    }

    const contexts = contextIds
      .map(id => this.state.contexts.get(id))
      .filter((context): context is AIContext => context !== undefined);

    const provider = this.modelProviders.get(this.state.activeModel.provider);
    if (!provider) {
      throw new Error(`No provider found for ${this.state.activeModel.provider}`);
    }

    return provider(prompt, contexts);
  }

  public async getCodeExplanation(
    code: string,
    language: string
  ): Promise<string> {
    const prompt = `Explain the following ${language} code:\n\n${code}`;
    return this.getCompletion(prompt);
  }

  public async getCodeRefactoring(
    code: string,
    language: string,
    refactoringType: string
  ): Promise<string> {
    const prompt = `Refactor the following ${language} code using ${refactoringType}:\n\n${code}`;
    return this.getCompletion(prompt);
  }

  public async getCodeGeneration(
    prompt: string,
    language: string,
    contextIds: string[] = []
  ): Promise<string> {
    const fullPrompt = `Generate ${language} code for: ${prompt}`;
    return this.getCompletion(fullPrompt, contextIds);
  }

  public async getSymbolContext(
    symbol: string,
    filePath: string
  ): Promise<AIContext> {
    // TODO: Implement symbol context extraction
    return {
      id: uuidv4(),
      type: 'symbol',
      content: '',
      metadata: { symbol, filePath }
    };
  }

  public async getFileContext(
    filePath: string
  ): Promise<AIContext> {
    // TODO: Implement file context extraction
    return {
      id: uuidv4(),
      type: 'file',
      content: '',
      metadata: { filePath }
    };
  }

  public async getSelectionContext(
    content: string,
    filePath: string
  ): Promise<AIContext> {
    return {
      id: uuidv4(),
      type: 'selection',
      content,
      metadata: { filePath }
    };
  }

  public dispose(): void {
    this.modelProviders.clear();
  }
} 