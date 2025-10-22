'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { ChatMessage, ConversationContext as ConversationContextType } from '@/app/types';

interface ConversationProviderContextType {
  chatMessages: ChatMessage[];
  addChatMessage: (content: string, type: ChatMessage['type'], metadata?: ChatMessage['metadata']) => void;
  conversationContext: ConversationContextType;
  setConversationContext: (context: ConversationContextType) => void;
  clearConversation: () => Promise<void>;
}

const ConversationContext = createContext<ConversationProviderContextType | undefined>(undefined);

export function ConversationProvider({ children }: { children: ReactNode }) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      content: 'Welcome! I can help you generate code with full context of your sandbox files and structure. Just start chatting - I\'ll automatically create a sandbox for you if needed!\n\nTip: If you see package errors like "react-router-dom not found", just type "npm install" or "check packages" to automatically install missing packages.',
      type: 'system',
      timestamp: new Date()
    }
  ]);

  const [conversationContext, setConversationContext] = useState<ConversationContextType>({
    scrapedWebsites: [],
    generatedComponents: [],
    appliedCode: [],
    currentProject: '',
    lastGeneratedCode: undefined
  });

  const addChatMessage = useCallback((
    content: string,
    type: ChatMessage['type'],
    metadata?: ChatMessage['metadata']
  ) => {
    const newMessage: ChatMessage = {
      content,
      type,
      timestamp: new Date(),
      metadata
    };
    setChatMessages(prev => [...prev, newMessage]);
  }, []);

  const clearConversation = useCallback(async () => {
    try {
      const response = await fetch('/api/conversation-state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear-old' })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('[ConversationContext]', data.message || 'Conversation state cleared');
      }
    } catch (error) {
      console.error('[ConversationContext] Error clearing conversation:', error);
    }
  }, []);

  return (
    <ConversationContext.Provider
      value={{
        chatMessages,
        addChatMessage,
        conversationContext,
        setConversationContext,
        clearConversation,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversation() {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error('useConversation must be used within ConversationProvider');
  }
  return context;
}
