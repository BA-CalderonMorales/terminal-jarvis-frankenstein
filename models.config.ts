// Models Configuration
// Set to true to enable, false to disable models in dropdowns

export interface ModelConfig {
  enabled: boolean;
  displayName: string;
}

export interface ModelsConfig {
  models: Record<string, ModelConfig>;
}

export const modelsConfig: ModelsConfig = {
  models: {
    'openai/gpt-5': {
      enabled: false,
      displayName: 'GPT-5'
    },
    'moonshotai/kimi-k2-instruct': {
      enabled: false,
      displayName: 'Kimi K2 Instruct'
    },
    'anthropic/claude-sonnet-4-20250514': {
      enabled: false,
      displayName: 'Sonnet 4'
    },
    'google/gemini-2.5-pro': {
      enabled: true,
      displayName: 'Gemini 2.5 Pro'
    }
  }
};

// Helper function to get enabled models
export const getEnabledModels = (): string[] => {
  return Object.entries(modelsConfig.models)
    .filter(([_, config]) => config.enabled)
    .map(([modelId, _]) => modelId);
};

// Helper function to get model display name
export const getModelDisplayName = (modelId: string): string => {
  return modelsConfig.models[modelId]?.displayName || modelId;
};

// Helper function to get display names for enabled models
export const getEnabledModelDisplayNames = (): Record<string, string> => {
  const result: Record<string, string> = {};
  Object.entries(modelsConfig.models)
    .filter(([_, config]) => config.enabled)
    .forEach(([modelId, config]) => {
      result[modelId] = config.displayName;
    });
  return result;
};
