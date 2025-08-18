# Models Configuration

This document explains how to manage which AI models are available in the application dropdowns.

## Configuration File

The models are configured in `models.config.ts` in the root directory.

## Structure

```typescript
export const modelsConfig: ModelsConfig = {
  models: {
    'model-id': {
      enabled: true,    // Set to false to hide from dropdowns
      displayName: 'Human Readable Name'
    }
  }
};
```

## Adding/Removing Models

To **enable** a model in the dropdown:
```typescript
'openai/gpt-5': {
  enabled: true,
  displayName: 'GPT-5'
}
```

To **disable** a model (hide from dropdown):
```typescript
'moonshotai/kimi-k2-instruct': {
  enabled: false,
  displayName: 'Kimi K2 Instruct'
}
```

## Current Models

The following models are currently configured:

- `openai/gpt-5` - GPT-5
- `moonshotai/kimi-k2-instruct` - Kimi K2 Instruct (currently disabled)
- `anthropic/claude-sonnet-4-20250514` - Sonnet 4
- `google/gemini-2.5-pro` - Gemini 2.5 Pro

## Usage

The configuration is automatically loaded by `config/app.config.ts` and used throughout the application. After making changes to `models.config.ts`, the development server will automatically reload and apply the changes.

## Helper Functions

The configuration file exports several helper functions:

- `getEnabledModels()` - Returns array of enabled model IDs
- `getModelDisplayName(modelId)` - Gets display name for a model
- `getEnabledModelDisplayNames()` - Returns object mapping model IDs to display names for enabled models
