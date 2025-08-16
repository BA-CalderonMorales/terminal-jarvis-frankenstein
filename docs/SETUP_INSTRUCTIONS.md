# Environment Setup Instructions

## Required API Keys

This application requires several API keys to function properly. A `.env.local` file should be created with the following structure:

### Required Services:

1. **E2B (Code Execution Sandboxes)** - Required
   - Visit https://e2b.dev
   - Sign up for an account
   - Get your API key
   - Add `E2B_API_KEY=your_actual_key` to `.env.local`

2. **Firecrawl (Web Scraping)** - Required
   - Visit https://firecrawl.dev
   - Sign up for an account
   - Get your API key
   - Add `FIRECRAWL_API_KEY=your_actual_key` to `.env.local`

### Optional AI Providers (at least one required):

3. **Anthropic (Claude)**
   - Visit https://console.anthropic.com
   - Add `ANTHROPIC_API_KEY=your_actual_key` to `.env.local`

4. **OpenAI (GPT)**
   - Visit https://platform.openai.com
   - Add `OPENAI_API_KEY=your_actual_key` to `.env.local`

5. **Google Gemini**
   - Visit https://aistudio.google.com/app/apikey
   - Add `GEMINI_API_KEY=your_actual_key` to `.env.local`

6. **Groq (Fast Inference)** - Recommended
   - Visit https://console.groq.com
   - Add `GROQ_API_KEY=your_actual_key` to `.env.local`

## Development Setup

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Create `.env.local` file with your API keys (see above)

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000

## Recent Technical Fixes Applied

### Tailwind CSS Issues Resolved
- **Problem**: Tailwind CSS v4 `lightningcss` binary compatibility issues on Linux x64
- **Solution**: Downgraded to Tailwind CSS v3 for better stability
- **Changes Made**:
  - Updated `package.json` dependencies: `tailwindcss: ^3.4.0`, added `postcss: ^8.4.31`
  - Removed `@tailwindcss/postcss: ^4.1.11` 
  - Updated `postcss.config.mjs` to use `tailwindcss: {}` instead of `@tailwindcss/postcss: {}`
  - Converted `app/globals.css` from v4 syntax to v3 syntax:
    - Changed `@import "tailwindcss"` to standard `@tailwind` directives
    - Converted `@theme {}` block to `:root {}` with proper CSS custom properties
    - Fixed CSS variable naming from `--color-*` to `--*` format

### Environment Configuration
- **Problem**: Missing API key configuration causing 401 errors
- **Solution**: Added comprehensive environment setup
- **Changes Made**:
  - Created `.env.local` template with all required API keys
  - Added API key validation in `app/api/create-ai-sandbox/route.ts`
  - Improved error messages for missing API keys in `app/page.tsx`
  - Added specific E2B API key error detection and user guidance

### Error Handling Improvements
- Enhanced frontend error handling to detect 401 API key errors
- Added backend validation for missing/invalid API keys
- Improved user feedback with actionable error messages

## Known Issues

### Hydration Warnings (Cosmetic Only)
- **Issue**: React hydration mismatch warnings due to browser extensions adding `fdprocessedid` attributes
- **Impact**: Cosmetic only - does not affect functionality
- **Cause**: Form autofill/password manager browser extensions
- **Status**: Safe to ignore, application works correctly
