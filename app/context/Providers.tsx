'use client';

import { ReactNode } from 'react';
import { SandboxProvider } from './SandboxContext';
import { ConversationProvider } from './ConversationContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SandboxProvider>
      <ConversationProvider>
        {children}
      </ConversationProvider>
    </SandboxProvider>
  );
}
