'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { SandboxData } from '@/app/types';

interface SandboxContextType {
  sandboxData: SandboxData | null;
  setSandboxData: (data: SandboxData | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  status: { text: string; active: boolean };
  setStatus: (status: { text: string; active: boolean }) => void;
  sandboxFiles: Record<string, string>;
  setSandboxFiles: (files: Record<string, string>) => void;
  fileStructure: string;
  setFileStructure: (structure: string) => void;
  createSandbox: () => Promise<void>;
  killSandbox: () => Promise<void>;
  updateStatus: (text: string, active: boolean) => void;
}

const SandboxContext = createContext<SandboxContextType | undefined>(undefined);

export function SandboxProvider({ children }: { children: ReactNode }) {
  const [sandboxData, setSandboxData] = useState<SandboxData | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ text: 'Not connected', active: false });
  const [sandboxFiles, setSandboxFiles] = useState<Record<string, string>>({});
  const [fileStructure, setFileStructure] = useState<string>('');

  const updateStatus = useCallback((text: string, active: boolean) => {
    setStatus({ text, active });
  }, []);

  const createSandbox = useCallback(async () => {
    setLoading(true);
    updateStatus('Creating sandbox...', true);

    try {
      const response = await fetch('/api/create-ai-sandbox', {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create sandbox');
      }

      const data = await response.json();
      setSandboxData(data);
      updateStatus('Sandbox created successfully', true);

      return data;
    } catch (error) {
      console.error('Failed to create sandbox:', error);
      updateStatus('Failed to create sandbox', false);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [updateStatus]);

  const killSandbox = useCallback(async () => {
    if (!sandboxData) return;

    try {
      await fetch('/api/kill-sandbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sandboxId: sandboxData.sandboxId }),
      });

      setSandboxData(null);
      setSandboxFiles({});
      setFileStructure('');
      updateStatus('Sandbox terminated', false);
    } catch (error) {
      console.error('Failed to kill sandbox:', error);
      throw error;
    }
  }, [sandboxData, updateStatus]);

  return (
    <SandboxContext.Provider
      value={{
        sandboxData,
        setSandboxData,
        loading,
        setLoading,
        status,
        setStatus,
        sandboxFiles,
        setSandboxFiles,
        fileStructure,
        setFileStructure,
        createSandbox,
        killSandbox,
        updateStatus,
      }}
    >
      {children}
    </SandboxContext.Provider>
  );
}

export function useSandbox() {
  const context = useContext(SandboxContext);
  if (!context) {
    throw new Error('useSandbox must be used within SandboxProvider');
  }
  return context;
}
