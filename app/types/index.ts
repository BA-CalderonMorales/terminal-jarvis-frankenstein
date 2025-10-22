/**
 * Shared TypeScript types for Terminal Jarvis Frankenstein
 * Extracted from monolithic app/page.tsx to improve maintainability
 */

export interface SandboxData {
  sandboxId: string;
  url: string;
  [key: string]: any;
}

export interface ChatMessage {
  content: string;
  type: 'user' | 'ai' | 'system' | 'file-update' | 'command' | 'error';
  timestamp: Date;
  metadata?: {
    scrapedUrl?: string;
    scrapedContent?: any;
    generatedCode?: string;
    appliedFiles?: string[];
    commandType?: 'input' | 'output' | 'error' | 'success';
  };
}

export interface ConversationContext {
  scrapedWebsites: Array<{ url: string; content: any; timestamp: Date }>;
  generatedComponents: Array<{ name: string; path: string; content: string }>;
  appliedCode: Array<{ files: string[]; timestamp: Date }>;
  currentProject: string;
  lastGeneratedCode?: string;
}

export interface GenerationProgress {
  isGenerating: boolean;
  status: string;
  components: Array<{ name: string; path: string; completed: boolean }>;
  currentComponent: number;
  streamedCode: string;
  isStreaming: boolean;
  isThinking: boolean;
  thinkingText?: string;
  thinkingDuration?: number;
  currentFile?: { path: string; content: string; type: string };
  files: Array<{ path: string; content: string; type: string; completed: boolean; edited?: boolean }>;
  lastProcessedPosition: number;
  isEdit?: boolean;
}

export interface UrlValidationState {
  isValidating: boolean;
  isValid: boolean;
  error?: string;
  suggestion?: string;
}
