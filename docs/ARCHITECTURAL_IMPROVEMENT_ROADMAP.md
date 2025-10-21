# Architectural Improvement Roadmap

**Version:** 0.1.0
**Date:** 2025-10-21
**Status:** Strategic Planning Phase

---

## Executive Summary

This document outlines a comprehensive, incremental transformation strategy for **Terminal Jarvis Frankenstein** to evolve from its current state (v0.0.1) into a production-grade, cross-platform AI development environment. The roadmap addresses critical architectural concerns while maintaining deployment stability and enabling safe iteration.

### Critical Findings

1. **Monolithic Component Crisis**: `app/page.tsx` at 43,265 LOC is unmaintainable
2. **Global State Anti-Pattern**: Sandbox state stored in `global` object
3. **No Cross-Platform Support**: Currently web-only (Next.js)
4. **Missing Plugin System**: No extensibility mechanism for Terminal Jarvis integration
5. **Limited Deployment Options**: Static export only, no mobile/desktop builds

### Strategic Goals

1. **Salvage & Simplify**: Reduce complexity by 70% through systematic refactoring
2. **Multi-Platform**: Enable mobile, desktop, and tablet deployment
3. **Plugin Ecosystem**: Leverage MCP (Model Context Protocol) for extensibility
4. **Terminal Jarvis Integration**: Create unified command center interface
5. **Safe Sandbox Interface**: Enable third-party integrations securely

---

## Phase 1: Emergency Refactoring (Weeks 1-4)

**Goal**: Break down monolithic component and establish proper state management without breaking deployment.

### 1.1 Component Extraction Strategy

#### Step 1A: Extract Chat Interface (Week 1)
- **Target**: Reduce `app/page.tsx` from 43K → 15K LOC
- **New Structure**:
  ```
  app/components/
  ├── ChatInterface/
  │   ├── ChatContainer.tsx         # Main chat component
  │   ├── MessageList.tsx            # Message rendering
  │   ├── MessageInput.tsx           # User input
  │   ├── StreamingIndicator.tsx    # Streaming status
  │   └── ChatHeader.tsx             # Top bar with model selector
  ```
- **Migration Strategy**:
  1. Create new component files
  2. Copy existing code with minimal changes
  3. Replace inline code with component imports
  4. Test after each component extraction
  5. Commit with `refactor(ui): extract chat components from monolithic page`

#### Step 1B: Extract Sandbox Management (Week 2)
- **Target**: Create reusable sandbox hooks
- **New Structure**:
  ```
  app/hooks/
  ├── useSandbox.ts                  # Sandbox lifecycle management
  ├── useSandboxFiles.ts             # File operations
  ├── useSandboxPreview.ts           # Preview URL management
  └── useSandboxLogs.ts              # Log monitoring
  ```
- **Migration Strategy**:
  1. Create custom hooks extracting sandbox logic
  2. Replace direct API calls with hooks
  3. Maintain backward compatibility
  4. Test sandbox creation/destruction flows
  5. Commit with `refactor(sandbox): extract sandbox hooks`

#### Step 1C: Extract File Operations (Week 3)
- **Target**: Centralize file management
- **New Structure**:
  ```
  app/components/FileExplorer/
  ├── FileTree.tsx                   # Tree view
  ├── FileEditor.tsx                 # Code editor
  ├── FilePreview.tsx                # File preview
  └── FileActions.tsx                # File operations toolbar
  ```
- **Migration Strategy**:
  1. Create file explorer components
  2. Move file-related state to dedicated hooks
  3. Test file creation/editing/deletion
  4. Commit with `refactor(files): extract file explorer components`

### 1.2 State Management Overhaul

#### Replace Global State with React Context (Week 4)

**Current Anti-Pattern**:
```typescript
// ❌ BAD: Global state mutation
declare global {
  var activeSandbox: any;
  var sandboxData: any;
  var existingFiles: Set<string>;
}
```

**New Pattern**:
```typescript
// ✅ GOOD: React Context
app/context/
├── SandboxContext.tsx              # Sandbox state & actions
├── ConversationContext.tsx         # Chat history & context
├── FileSystemContext.tsx           # File tree & operations
└── AppConfigContext.tsx            # App-wide configuration
```

**Implementation**:
```typescript
// app/context/SandboxContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';
import type { Sandbox } from '@e2b/code-interpreter';

interface SandboxContextType {
  sandbox: Sandbox | null;
  sandboxId: string | null;
  url: string | null;
  createSandbox: () => Promise<void>;
  killSandbox: () => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

const SandboxContext = createContext<SandboxContextType | undefined>(undefined);

export function SandboxProvider({ children }: { children: ReactNode }) {
  const [sandbox, setSandbox] = useState<Sandbox | null>(null);
  const [sandboxId, setSandboxId] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createSandbox = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/create-ai-sandbox', { method: 'POST' });
      const data = await response.json();
      setSandbox(data.sandbox);
      setSandboxId(data.sandboxId);
      setUrl(data.url);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to create sandbox'));
    } finally {
      setIsLoading(false);
    }
  };

  const killSandbox = async () => {
    if (!sandboxId) return;
    try {
      await fetch('/api/kill-sandbox', { method: 'POST' });
      setSandbox(null);
      setSandboxId(null);
      setUrl(null);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to kill sandbox'));
    }
  };

  return (
    <SandboxContext.Provider value={{
      sandbox,
      sandboxId,
      url,
      createSandbox,
      killSandbox,
      isLoading,
      error
    }}>
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
```

**Migration Plan**:
1. Create context providers
2. Wrap app in providers (app/layout.tsx)
3. Update API routes to use session storage instead of global state
4. Replace global state access with context hooks
5. Test thoroughly
6. Commit with `refactor(state): replace global state with React Context`

### 1.3 Deployment Validation

**Test Matrix**:
- [ ] GitHub Pages deployment succeeds
- [ ] Static export generates correctly
- [ ] All API routes functional
- [ ] Sandbox creation/destruction works
- [ ] File operations work
- [ ] Chat streaming works
- [ ] Dark theme persists

---

## Phase 2: Cross-Platform Foundation (Weeks 5-10)

**Goal**: Establish multi-platform support using React Native Web + Expo + Tamagui stack.

### 2.1 Technology Stack Selection

Based on 2025 market research:

#### Recommended Stack: **Expo + Tamagui + Solito**

**Why This Stack?**
1. **Expo Router**: File-based routing for iOS, Android, Web
2. **Tamagui**: 100% component parity between React & React Native
3. **Solito**: Navigation abstraction for Next.js + React Native
4. **React Native Web**: Web rendering using same components
5. **Shared Codebase**: Write once, deploy everywhere

**Architecture Diagram**:
```
┌─────────────────────────────────────────────────────────────┐
│                    Shared Business Logic                     │
│  (API clients, state management, utilities, types)           │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │
                ┌─────────────┴─────────────┐
                │                           │
    ┌───────────▼───────────┐   ┌──────────▼──────────┐
    │   Platform: Web       │   │  Platform: Native   │
    │   Framework: Next.js  │   │  Framework: Expo    │
    └───────────┬───────────┘   └──────────┬──────────┘
                │                           │
    ┌───────────▼───────────────────────────▼──────────┐
    │         UI Layer: Tamagui Components             │
    │  (Button, Input, Text, Card, etc.)               │
    └──────────────────────────────────────────────────┘
```

### 2.2 Monorepo Setup

**Structure**:
```
terminal-jarvis-frankenstein/
├── apps/
│   ├── web/                        # Next.js web app (existing)
│   │   ├── app/
│   │   ├── public/
│   │   ├── package.json
│   │   └── next.config.ts
│   ├── mobile/                     # Expo mobile app (new)
│   │   ├── app/                    # Expo Router
│   │   ├── assets/
│   │   ├── package.json
│   │   └── app.json
│   └── desktop/                    # Electron wrapper (future)
│       ├── main/
│       ├── renderer/
│       └── package.json
├── packages/
│   ├── ui/                         # Shared Tamagui components
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── ChatMessage.tsx
│   │   │   │   └── FileTree.tsx
│   │   │   └── index.tsx
│   │   └── package.json
│   ├── core/                       # Business logic
│   │   ├── src/
│   │   │   ├── api/                # API clients
│   │   │   ├── hooks/              # Shared hooks
│   │   │   ├── utils/              # Utilities
│   │   │   └── types/              # TypeScript types
│   │   └── package.json
│   └── config/                     # Shared config
│       ├── eslint/
│       ├── typescript/
│       └── tailwind/
├── package.json                    # Root package.json
├── turbo.json                      # Turborepo config
└── pnpm-workspace.yaml             # PNPM workspaces
```

### 2.3 Migration Strategy (Incremental)

#### Week 5-6: Setup Monorepo
1. Install Turborepo: `npx create-turbo@latest`
2. Move existing code to `apps/web/`
3. Create `packages/ui/` with Tamagui
4. Create `packages/core/` for shared logic
5. Configure workspace dependencies
6. Test web build still works

#### Week 7-8: Extract Shared Components
1. Move UI components to `packages/ui/`
2. Convert to Tamagui primitives
3. Test component parity
4. Update web app imports

#### Week 9-10: Create Mobile App
1. Setup Expo in `apps/mobile/`
2. Configure Expo Router
3. Implement basic navigation
4. Connect to shared packages
5. Test on iOS/Android simulators

### 2.4 Platform-Specific Adaptations

**Web (Next.js)**:
- Server-side rendering for SEO
- Static export for GitHub Pages
- Full keyboard/mouse support
- Desktop-optimized layout

**Mobile (Expo)**:
- Touch-optimized UI
- Responsive layouts
- Native gestures
- Push notifications (future)

**Desktop (Electron - Future)**:
- Native menu bar
- System tray integration
- File system access
- Multiple windows

### 2.5 API Layer Abstraction

**Current Problem**: API routes tied to Next.js App Router

**Solution**: Platform-agnostic API client

```typescript
// packages/core/src/api/client.ts
export class SandboxClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    // Web: relative URLs (/api/...)
    // Mobile: absolute URLs (https://api.terminal-jarvis.dev/...)
    this.baseUrl = baseUrl || '';
  }

  async createSandbox(): Promise<SandboxData> {
    const response = await fetch(`${this.baseUrl}/api/create-ai-sandbox`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to create sandbox');
    return response.json();
  }

  async generateCode(prompt: string, context: ConversationContext) {
    // Streaming implementation
    const response = await fetch(`${this.baseUrl}/api/generate-ai-code-stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, context })
    });
    return response.body; // ReadableStream
  }
}
```

**Platform Usage**:
```typescript
// apps/web/app/page.tsx (Next.js)
const client = new SandboxClient(); // Uses relative URLs

// apps/mobile/app/index.tsx (Expo)
const client = new SandboxClient('https://api.terminal-jarvis.dev'); // Absolute URLs
```

### 2.6 Deployment Targets

**Web**:
- GitHub Pages (static export)
- Vercel (SSR + Edge functions)
- Cloudflare Pages

**Mobile**:
- App Store (iOS)
- Google Play (Android)
- Expo Go (development)

**Desktop**:
- Electron Builder
- DMG (macOS)
- MSI (Windows)
- AppImage (Linux)

---

## Phase 3: Plugin System & MCP Integration (Weeks 11-16)

**Goal**: Implement Model Context Protocol for extensibility and Terminal Jarvis integration.

### 3.1 MCP Architecture

**What is MCP?**
Model Context Protocol (MCP) by Anthropic standardizes communication between AI models and external systems. It's the foundation for Claude Code's plugin system.

**Key Components**:
1. **MCP Servers**: Services that expose tools/resources
2. **MCP Client**: Connects to servers and provides tools to AI
3. **Tools**: Executable functions (e.g., file operations, API calls)
4. **Resources**: Data sources (e.g., documentation, databases)
5. **Prompts**: Reusable prompt templates

### 3.2 Plugin Marketplace Integration

**Leverage Existing Marketplaces**:
1. [Claude Code Plugin Hub](https://github.com/jeremylongshore/claude-code-plugins-plus) - 227 plugins
2. [Claude MCP Community](https://www.claudemcp.com/) - Community plugins
3. Custom Terminal Jarvis marketplace

**Plugin Categories for Terminal Jarvis Frankenstein**:
- **Code Generation**: Enhanced AI models
- **Deployment**: CI/CD integrations
- **Database**: Supabase, PostgreSQL, MongoDB
- **Authentication**: Clerk, Auth0, NextAuth
- **UI Components**: Shadcn, Radix, MUI
- **Testing**: Playwright, Cypress, Vitest
- **Analytics**: PostHog, Mixpanel, GA4
- **Monitoring**: Sentry, LogRocket
- **Terminal Jarvis Tools**: Claude, Gemini, Qwen, OpenCode, etc.

### 3.3 MCP Server Implementation

**Create Terminal Jarvis MCP Server**:

```typescript
// packages/mcp-server/src/index.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { SandboxClient } from '@terminal-jarvis/core';

const server = new Server({
  name: 'terminal-jarvis-frankenstein',
  version: '0.1.0',
}, {
  capabilities: {
    tools: {},
    resources: {},
  },
});

// Tool: Create Sandbox
server.setRequestHandler('tools/list', async () => ({
  tools: [
    {
      name: 'create_sandbox',
      description: 'Create a new E2B code execution sandbox',
      inputSchema: {
        type: 'object',
        properties: {
          timeout: {
            type: 'number',
            description: 'Timeout in minutes (default: 15)'
          }
        }
      }
    },
    {
      name: 'execute_code',
      description: 'Execute code in sandbox',
      inputSchema: {
        type: 'object',
        properties: {
          code: { type: 'string', description: 'Code to execute' },
          language: { type: 'string', description: 'Language (js/ts/python)' }
        },
        required: ['code']
      }
    },
    {
      name: 'list_files',
      description: 'List files in sandbox',
      inputSchema: {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'Directory path' }
        }
      }
    }
  ]
}));

// Tool: Execute Code
server.setRequestHandler('tools/call', async (request) => {
  if (request.params.name === 'create_sandbox') {
    const client = new SandboxClient();
    const sandbox = await client.createSandbox();
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(sandbox, null, 2)
        }
      ]
    };
  }

  // ... other tool implementations
});

// Resource: Project Documentation
server.setRequestHandler('resources/list', async () => ({
  resources: [
    {
      uri: 'docs://setup',
      name: 'Setup Instructions',
      mimeType: 'text/markdown'
    },
    {
      uri: 'docs://api',
      name: 'API Reference',
      mimeType: 'text/markdown'
    }
  ]
}));

const transport = new StdioServerTransport();
await server.connect(transport);
```

**Package Configuration**:
```json
{
  "name": "@terminal-jarvis/mcp-server",
  "version": "0.1.0",
  "type": "module",
  "bin": {
    "terminal-jarvis-mcp": "./dist/index.js"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "latest",
    "@terminal-jarvis/core": "workspace:*"
  }
}
```

### 3.4 Claude Code Plugin

**Create Plugin Manifest**:
```json
// .claude-plugin/plugin.json
{
  "name": "terminal-jarvis-frankenstein",
  "version": "0.1.0",
  "description": "AI-powered React app builder with E2B sandboxes",
  "author": "BA-CalderonMorales",
  "homepage": "https://github.com/BA-CalderonMorales/terminal-jarvis-frankenstein",
  "commands": [
    {
      "name": "/sandbox",
      "description": "Create and manage E2B sandboxes",
      "handler": "commands/sandbox.ts"
    },
    {
      "name": "/build-app",
      "description": "Build a React app from description",
      "handler": "commands/build-app.ts"
    }
  ],
  "mcpServers": {
    "terminal-jarvis": {
      "command": "npx",
      "args": ["-y", "@terminal-jarvis/mcp-server"]
    }
  },
  "skills": [
    {
      "name": "react-app-builder",
      "description": "Build complete React applications from natural language",
      "trigger": "auto",
      "handler": "skills/react-builder.ts"
    }
  ]
}
```

**Publish to Marketplace**:
```bash
# Add to Terminal Jarvis marketplace
mkdir -p .claude-plugin
# Create marketplace.json for hosting
echo '{
  "plugins": [
    {
      "name": "terminal-jarvis-frankenstein",
      "source": "github:BA-CalderonMorales/terminal-jarvis-frankenstein",
      "description": "AI React app builder",
      "category": "development"
    }
  ]
}' > .claude-plugin/marketplace.json
```

### 3.5 Terminal Jarvis CLI Integration

**Current Terminal Jarvis Architecture**:
- Command center for multiple AI tools
- NPM-based tool management
- Interactive TUI interface
- Template system with GitHub repos

**Integration Strategy**:

#### Option 1: Add as Terminal Jarvis Tool
```bash
# User installs via Terminal Jarvis
terminal-jarvis install frankenstein

# Terminal Jarvis adds to tool registry
{
  "frankenstein": {
    "enabled": true,
    "command": "npx @terminal-jarvis/frankenstein",
    "description": "AI React app builder",
    "category": "web-development"
  }
}

# User runs via Terminal Jarvis
terminal-jarvis run frankenstein --build "todo app"
```

#### Option 2: Embed Terminal Jarvis in Frankenstein
```typescript
// packages/core/src/terminal-jarvis/integration.ts
import { exec } from 'child_process';

export class TerminalJarvisIntegration {
  async listTools(): Promise<Tool[]> {
    // Parse Terminal Jarvis config
    const config = await this.loadConfig();
    return config.tools.filter(t => t.enabled);
  }

  async runTool(toolName: string, args: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
      exec(`terminal-jarvis run ${toolName} ${args.join(' ')}`, (error, stdout) => {
        if (error) reject(error);
        else resolve(stdout);
      });
    });
  }

  async switchContext(tool: string) {
    // Save current sandbox state
    await this.saveSandboxState();
    // Launch Terminal Jarvis tool
    await this.runTool(tool, []);
  }
}
```

**UI Integration**:
```tsx
// packages/ui/src/components/ToolSwitcher.tsx
import { TerminalJarvisIntegration } from '@terminal-jarvis/core';

export function ToolSwitcher() {
  const [tools, setTools] = useState<Tool[]>([]);
  const integration = new TerminalJarvisIntegration();

  useEffect(() => {
    integration.listTools().then(setTools);
  }, []);

  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Switch to tool..." />
      </SelectTrigger>
      <SelectContent>
        {tools.map(tool => (
          <SelectItem key={tool.name} value={tool.name}>
            {tool.description}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

### 3.6 Skills Discovery & Installation

**Skills for Terminal Jarvis Frankenstein**:

1. **@terminal-jarvis/skill-react-components**
   - Auto-generate React components from descriptions
   - Integration: Shadcn, Radix, MUI, Chakra

2. **@terminal-jarvis/skill-api-integration**
   - Connect to REST/GraphQL APIs
   - Auto-generate client code

3. **@terminal-jarvis/skill-database-schema**
   - Design database schemas
   - Generate Prisma/Drizzle models

4. **@terminal-jarvis/skill-deployment**
   - One-click deploy to Vercel/Netlify/Cloudflare
   - CI/CD pipeline generation

5. **@terminal-jarvis/skill-testing**
   - Generate test suites (Jest/Vitest/Playwright)
   - Coverage reports

**Installation Flow**:
```bash
# Via CLI
terminal-jarvis install skill-react-components

# Via UI
# Marketplace → Browse Skills → Click Install
```

---

## Phase 4: Safe Sandbox Interface (Weeks 17-20)

**Goal**: Enable third-party integrations while maintaining security.

### 4.1 Security Architecture

**Threat Model**:
1. **Malicious Code Execution**: User generates harmful code
2. **API Key Exposure**: Credentials leaked in sandbox
3. **Resource Abuse**: Infinite loops, memory leaks
4. **Data Exfiltration**: Sandbox accesses sensitive data
5. **SSRF Attacks**: Sandbox makes unauthorized network requests

**Defense Layers**:
```
┌─────────────────────────────────────────────────────────┐
│  Layer 1: Input Validation & Sanitization               │
│  - XSS prevention, SQL injection prevention             │
└─────────────────────────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────┐
│  Layer 2: E2B Sandbox Isolation                         │
│  - VM-level isolation, network restrictions             │
└─────────────────────────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────┐
│  Layer 3: Resource Limits                               │
│  - CPU/memory limits, timeout enforcement               │
└─────────────────────────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────┐
│  Layer 4: Network Policy                                │
│  - Whitelist allowed domains, block localhost           │
└─────────────────────────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────┐
│  Layer 5: Audit Logging                                 │
│  - Log all sandbox operations, anomaly detection        │
└─────────────────────────────────────────────────────────┘
```

### 4.2 Sandbox API Interface

**Create Secure Sandbox SDK**:

```typescript
// packages/sandbox-sdk/src/index.ts

export interface SandboxConfig {
  timeout?: number;          // Max execution time (minutes)
  memory?: number;           // Max memory (MB)
  cpu?: number;              // Max CPU cores
  network?: NetworkPolicy;   // Network access rules
  filesystem?: FileSystemPolicy; // FS access rules
}

export interface NetworkPolicy {
  mode: 'allow-all' | 'deny-all' | 'whitelist';
  allowedDomains?: string[];
  blockedPorts?: number[];
}

export interface FileSystemPolicy {
  mode: 'read-only' | 'read-write' | 'restricted';
  allowedPaths?: string[];
  maxFileSize?: number; // MB
}

export class SecureSandbox {
  private config: SandboxConfig;
  private auditLog: AuditLogger;

  constructor(config: SandboxConfig) {
    this.config = this.validateConfig(config);
    this.auditLog = new AuditLogger();
  }

  async executeCode(code: string, language: string): Promise<ExecutionResult> {
    // Step 1: Validate code (static analysis)
    const validation = await this.validateCode(code, language);
    if (!validation.safe) {
      this.auditLog.log('code_rejected', { reason: validation.reason });
      throw new SecurityError(`Code rejected: ${validation.reason}`);
    }

    // Step 2: Create isolated sandbox
    const sandbox = await this.createIsolatedSandbox();

    // Step 3: Set resource limits
    await sandbox.setLimits({
      memory: this.config.memory || 512,
      cpu: this.config.cpu || 1,
      timeout: this.config.timeout || 15
    });

    // Step 4: Configure network policy
    await sandbox.setNetworkPolicy(this.config.network || { mode: 'deny-all' });

    // Step 5: Execute with monitoring
    const result = await sandbox.execute(code, language);

    // Step 6: Audit log
    this.auditLog.log('code_executed', {
      language,
      duration: result.duration,
      memoryUsed: result.memoryUsed
    });

    return result;
  }

  private async validateCode(code: string, language: string): Promise<ValidationResult> {
    // Static analysis to detect:
    // - Dangerous functions (eval, exec, child_process)
    // - Network requests to blocked domains
    // - File system access outside allowed paths
    // - Infinite loops (heuristic)
    // - Resource exhaustion patterns

    const dangerousPatterns = {
      javascript: [
        /eval\s*\(/,
        /Function\s*\(/,
        /child_process/,
        /fs\.readFileSync\(['"]\/etc\//,
        /process\.env/
      ],
      python: [
        /eval\(/,
        /exec\(/,
        /__import__\(['"]os['"]\)/,
        /subprocess/,
        /open\(['"]\/etc\//
      ]
    };

    const patterns = dangerousPatterns[language as keyof typeof dangerousPatterns] || [];

    for (const pattern of patterns) {
      if (pattern.test(code)) {
        return {
          safe: false,
          reason: `Dangerous pattern detected: ${pattern.source}`
        };
      }
    }

    return { safe: true };
  }

  private validateConfig(config: SandboxConfig): SandboxConfig {
    // Enforce maximum limits
    return {
      timeout: Math.min(config.timeout || 15, 30), // Max 30 minutes
      memory: Math.min(config.memory || 512, 2048), // Max 2GB
      cpu: Math.min(config.cpu || 1, 4), // Max 4 cores
      network: config.network || { mode: 'deny-all' },
      filesystem: config.filesystem || { mode: 'restricted' }
    };
  }
}
```

### 4.3 Third-Party Integration SDK

**Create Developer SDK for Safe Integration**:

```typescript
// packages/integration-sdk/src/index.ts

export class TerminalJarvisFrankenstein {
  private sandbox: SecureSandbox;
  private apiKey: string;

  constructor(apiKey: string, config?: SandboxConfig) {
    this.apiKey = apiKey;
    this.sandbox = new SecureSandbox(config || this.defaultConfig());
  }

  // High-level API for third-party developers
  async buildReactApp(description: string): Promise<AppBundle> {
    const prompt = `Build a React app: ${description}`;
    const code = await this.generateCode(prompt);
    const result = await this.sandbox.executeCode(code, 'javascript');
    return this.packageApp(result);
  }

  async addComponent(component: ComponentSpec): Promise<ComponentCode> {
    const prompt = this.buildComponentPrompt(component);
    const code = await this.generateCode(prompt);
    return this.parseComponent(code);
  }

  async testApp(testSpec: TestSpec): Promise<TestResults> {
    const testCode = await this.generateTests(testSpec);
    const result = await this.sandbox.executeCode(testCode, 'javascript');
    return this.parseTestResults(result);
  }

  private defaultConfig(): SandboxConfig {
    return {
      timeout: 15,
      memory: 512,
      cpu: 1,
      network: {
        mode: 'whitelist',
        allowedDomains: [
          'cdn.jsdelivr.net',
          'unpkg.com',
          'esm.sh',
          'api.npmjs.org'
        ]
      },
      filesystem: {
        mode: 'restricted',
        allowedPaths: ['/project'],
        maxFileSize: 10 // 10MB
      }
    };
  }
}
```

**Usage Example**:
```typescript
// Third-party integration
import { TerminalJarvisFrankenstein } from '@terminal-jarvis/integration-sdk';

const tjf = new TerminalJarvisFrankenstein(process.env.TJF_API_KEY);

// Build app safely
const app = await tjf.buildReactApp('Todo list with dark mode');
console.log(app.files); // { 'App.tsx': '...', 'index.tsx': '...' }

// Deploy
await tjf.deploy(app, 'vercel');
```

### 4.4 Audit & Monitoring

**Create Audit System**:

```typescript
// packages/core/src/audit/logger.ts

export class AuditLogger {
  private storage: AuditStorage;

  async log(event: string, metadata: Record<string, any>) {
    const entry: AuditEntry = {
      timestamp: Date.now(),
      event,
      metadata,
      userId: this.getCurrentUser(),
      sessionId: this.getSessionId()
    };

    await this.storage.save(entry);

    // Real-time anomaly detection
    if (this.isAnomalous(entry)) {
      await this.alertSecurityTeam(entry);
    }
  }

  private isAnomalous(entry: AuditEntry): boolean {
    // Detect suspicious patterns:
    // - Rapid sandbox creation (> 10/min)
    // - High error rate (> 50% failures)
    // - Large code submissions (> 100KB)
    // - Unusual network requests
    // - Resource limit violations

    const recentEvents = this.getRecentEvents(60 * 1000); // Last minute
    const creationEvents = recentEvents.filter(e => e.event === 'sandbox_created');

    if (creationEvents.length > 10) {
      return true; // Rate limit exceeded
    }

    return false;
  }
}
```

**Dashboard for Monitoring**:
```tsx
// packages/ui/src/components/AuditDashboard.tsx

export function AuditDashboard() {
  const [events, setEvents] = useState<AuditEntry[]>([]);
  const [stats, setStats] = useState<AuditStats | null>(null);

  return (
    <div className="grid grid-cols-3 gap-4">
      <Card>
        <CardHeader>Sandbox Creations</CardHeader>
        <CardContent>
          <Metric value={stats?.sandboxCreations} label="Last 24h" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>Code Executions</CardHeader>
        <CardContent>
          <Metric value={stats?.codeExecutions} label="Last 24h" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>Security Incidents</CardHeader>
        <CardContent>
          <Metric value={stats?.securityIncidents} label="Last 24h" trend="down" />
        </CardContent>
      </Card>

      <div className="col-span-3">
        <EventTimeline events={events} />
      </div>
    </div>
  );
}
```

---

## Phase 5: Deployment & Distribution (Weeks 21-24)

**Goal**: Ship multi-platform builds without breaking existing deployments.

### 5.1 Deployment Matrix

| Platform | Build Command | Output | Distribution |
|----------|--------------|--------|--------------|
| **Web (GitHub Pages)** | `npm run build && npm run export` | Static HTML/JS | GitHub Pages |
| **Web (Vercel)** | `vercel deploy` | SSR + Edge | Vercel CDN |
| **Mobile (iOS)** | `eas build --platform ios` | IPA | App Store |
| **Mobile (Android)** | `eas build --platform android` | APK/AAB | Google Play |
| **Desktop (macOS)** | `npm run build:electron` | DMG | GitHub Releases |
| **Desktop (Windows)** | `npm run build:electron` | MSI | GitHub Releases |
| **Desktop (Linux)** | `npm run build:electron` | AppImage | GitHub Releases |

### 5.2 CI/CD Pipeline

**Enhanced GitHub Actions**:

```yaml
# .github/workflows/release.yml
name: Release Multi-Platform

on:
  push:
    tags:
      - 'v*'

jobs:
  web-github-pages:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build:web
      - run: npm run export
      - uses: actions/upload-pages-artifact@v3
        with:
          path: out
      - uses: actions/deploy-pages@v4

  web-vercel:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'

  mobile-ios:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build:mobile
      - uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - run: eas build --platform ios --non-interactive

  mobile-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build:mobile
      - uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - run: eas build --platform android --non-interactive

  desktop:
    strategy:
      matrix:
        os: [macos-latest, ubuntu-latest, windows-latest]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build:desktop
      - uses: actions/upload-artifact@v4
        with:
          name: desktop-${{ matrix.os }}
          path: dist/
```

### 5.3 Package Distribution

**NPM Package**:
```json
{
  "name": "@terminal-jarvis/frankenstein",
  "version": "0.1.0",
  "description": "AI-powered React app builder",
  "main": "./dist/index.js",
  "bin": {
    "frankenstein": "./dist/cli.js"
  },
  "exports": {
    ".": "./dist/index.js",
    "./sdk": "./dist/sdk/index.js",
    "./mcp": "./dist/mcp/index.js"
  },
  "publishConfig": {
    "access": "public"
  }
}
```

**Homebrew Formula**:
```ruby
# Formula/terminal-jarvis-frankenstein.rb
class TerminalJarvisFrankenstein < Formula
  desc "AI-powered React app builder for Terminal Jarvis"
  homepage "https://github.com/BA-CalderonMorales/terminal-jarvis-frankenstein"
  url "https://github.com/BA-CalderonMorales/terminal-jarvis-frankenstein/archive/v0.1.0.tar.gz"
  sha256 "..."
  license "MIT"

  depends_on "node"

  def install
    system "npm", "install", *std_npm_args
    bin.install_symlink Dir["#{libexec}/bin/*"]
  end

  test do
    system "#{bin}/frankenstein", "--version"
  end
end
```

---

## Implementation Priority Matrix

### Critical Path (Must Do First)

1. **Phase 1.1**: Component Extraction (Weeks 1-3)
   - **Impact**: High (reduces complexity by 70%)
   - **Risk**: Medium (potential regressions)
   - **Dependencies**: None
   - **Blocker for**: All future work

2. **Phase 1.2**: State Management (Week 4)
   - **Impact**: High (fixes anti-pattern)
   - **Risk**: Medium (API route changes)
   - **Dependencies**: Phase 1.1
   - **Blocker for**: Multi-platform support

3. **Phase 2.2**: Monorepo Setup (Weeks 5-6)
   - **Impact**: High (enables code sharing)
   - **Risk**: Low (well-established pattern)
   - **Dependencies**: Phase 1.2
   - **Blocker for**: Mobile/desktop builds

### High Priority (Do Next)

4. **Phase 2.3-2.4**: Cross-Platform (Weeks 7-10)
   - **Impact**: High (new platforms)
   - **Risk**: High (new tech stack)
   - **Dependencies**: Phase 2.2

5. **Phase 3.3**: MCP Server (Weeks 11-13)
   - **Impact**: Medium (extensibility)
   - **Risk**: Low (standard protocol)
   - **Dependencies**: Phase 2.2

### Medium Priority (Important but Not Urgent)

6. **Phase 3.5**: Terminal Jarvis Integration (Weeks 14-16)
   - **Impact**: Medium (ecosystem integration)
   - **Risk**: Low (CLI integration)
   - **Dependencies**: Phase 3.3

7. **Phase 4.2**: Sandbox SDK (Weeks 17-19)
   - **Impact**: Medium (third-party enablement)
   - **Risk**: Medium (security complexity)
   - **Dependencies**: Phase 1.2

### Lower Priority (Nice to Have)

8. **Phase 4.4**: Audit Dashboard (Week 20)
   - **Impact**: Low (monitoring)
   - **Risk**: Low (isolated feature)
   - **Dependencies**: Phase 4.2

9. **Phase 5**: Multi-Platform Distribution (Weeks 21-24)
   - **Impact**: Medium (distribution)
   - **Risk**: Medium (CI/CD complexity)
   - **Dependencies**: Phases 2-4

---

## Success Metrics

### Phase 1 Success Criteria
- [ ] `app/page.tsx` reduced from 43,265 → < 2,000 LOC
- [ ] Global state eliminated (0 `global.` references in code)
- [ ] All existing tests pass
- [ ] GitHub Pages deployment works
- [ ] No performance regressions

### Phase 2 Success Criteria
- [ ] Mobile app builds and runs on iOS/Android
- [ ] 80%+ code sharing between web/mobile
- [ ] Shared component library with 20+ components
- [ ] API client works across all platforms

### Phase 3 Success Criteria
- [ ] MCP server published to npm
- [ ] Claude Code plugin installable via `/plugin`
- [ ] 3+ Terminal Jarvis tools integrated
- [ ] Plugin marketplace listing created

### Phase 4 Success Criteria
- [ ] SDK published with documentation
- [ ] Security audit passed (0 critical vulnerabilities)
- [ ] Audit dashboard operational
- [ ] 3+ third-party integrations using SDK

### Phase 5 Success Criteria
- [ ] CI/CD pipeline delivers all platforms
- [ ] NPM package published
- [ ] App Store & Google Play submissions
- [ ] Homebrew formula merged

---

## Risk Mitigation

### Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| **Breaking existing deployment** | High | Critical | Feature flags, incremental rollout, A/B testing |
| **Cross-platform compatibility issues** | High | High | Early testing, platform-specific modules |
| **Performance degradation** | Medium | High | Benchmarks, profiling, lazy loading |
| **Security vulnerabilities** | Medium | Critical | Security audits, penetration testing |
| **State management complexity** | Medium | Medium | Well-tested patterns (React Context) |

### Mitigation Strategies

1. **Feature Flags**:
   ```typescript
   // config/features.ts
   export const features = {
     newChatInterface: process.env.NEXT_PUBLIC_FEAT_NEW_CHAT === 'true',
     reactContext: process.env.NEXT_PUBLIC_FEAT_CONTEXT === 'true',
     mobileSupport: process.env.NEXT_PUBLIC_FEAT_MOBILE === 'true'
   };
   ```

2. **Incremental Rollout**:
   - Deploy new components behind feature flags
   - Enable for 10% of users initially
   - Monitor error rates and performance
   - Gradually increase to 100%

3. **Rollback Plan**:
   - Maintain previous version deployment
   - Use DNS switching for instant rollback
   - Keep feature flag kill switch ready

---

## Long-Term Vision (6-12 Months)

### Additional Platforms
- **Browser Extension**: Chrome/Firefox/Edge
- **VS Code Extension**: Inline app building
- **Terminal TUI**: Full-featured terminal interface
- **API**: RESTful API for programmatic access

### Advanced Features
- **Collaborative Editing**: Real-time multiplayer
- **Version Control**: Built-in Git integration
- **Deployment Automation**: One-click production deploys
- **Template Marketplace**: Community-shared templates
- **AI Model Fine-tuning**: Custom models for specific domains

### Ecosystem Integration
- **Terminal Jarvis Hub**: Central dashboard for all tools
- **Cross-Tool Context**: Share context between tools
- **Unified Authentication**: SSO across ecosystem
- **Shared Templates**: Template repo integration

---

## Conclusion

This roadmap provides a **comprehensive, incremental path** to transform Terminal Jarvis Frankenstein from a promising prototype into a production-grade, multi-platform AI development environment. By following this plan:

1. **Week 1-4**: Emergency refactoring stabilizes codebase
2. **Week 5-10**: Cross-platform foundation enables mobile/desktop
3. **Week 11-16**: Plugin system unlocks ecosystem integration
4. **Week 17-20**: Secure SDK enables third-party integrations
5. **Week 21-24**: Multi-platform distribution reaches all users

The key to success is **maintaining deployment stability** while making incremental improvements. Each phase builds on the previous, ensuring we never break what's working while progressively enhancing the platform.

**Next Steps**:
1. Review and approve this roadmap
2. Create detailed task breakdown for Phase 1
3. Set up project tracking (GitHub Projects)
4. Begin Phase 1.1 component extraction

---

**Document Version**: 0.1.0
**Last Updated**: 2025-10-21
**Status**: Awaiting approval
