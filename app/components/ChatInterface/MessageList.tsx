'use client';

import { useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import type { ChatMessage as ChatMessageType, GenerationProgress } from '@/app/types';

interface MessageListProps {
  messages: ChatMessageType[];
  generationProgress?: GenerationProgress;
}

export function MessageList({ messages, generationProgress }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg, idx) => (
        <ChatMessage
          key={idx}
          message={msg}
          isLast={idx === messages.length - 1}
          generatedFiles={generationProgress?.files || []}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
