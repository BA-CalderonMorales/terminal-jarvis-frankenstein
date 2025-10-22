# PR Preview with OpenCode Integration Guide

## Overview

This repository now has **automated PR preview deployments** integrated with **OpenCode AI assistance** using the **free Sonic model** (no API keys required)!

## Features

### ✅ Automatic PR Preview Deployment
- **Trigger**: Automatically runs on PRs to `main`, `develop`, `codex/*`, or `claude/*` branches
- **Build**: Compiles and exports Next.js static site
- **Deploy**: Publishes to GitHub Pages with unique preview URL
- **Comment**: Posts preview URL directly on the PR

### 🤖 OpenCode AI Assistance (FREE)
- **Model**: Sonic (xAI Grok Code Fast)
- **Cost**: 100% FREE during testing period
- **API Keys**: ZERO - no configuration needed
- **Context**: 256k token window
- **Speed**: 3x faster than Claude Code/Sonnet

---

## How to Use

### 1. Create a Pull Request

When you create a PR to any of these branches:
- `main`
- `develop`
- `codex/*`
- `claude/*`

The workflow automatically:
1. ✅ Builds your code
2. ✅ Deploys preview to GitHub Pages
3. ✅ Posts preview URL in PR comments

**Example PR Comment:**
```
🎉 Preview Deployed Successfully!

📱 Preview URL: https://ba-calderonmorales.github.io/terminal-jarvis-frankenstein/

---

🤖 OpenCode Integration Available

This PR supports OpenCode AI assistance using the free Sonic model (no API keys required)!
```

---

### 2. Get AI Code Review (OpenCode Commands)

Comment on your PR with any of these commands:

#### Code Review Commands
```bash
# Full PR review
/opencode review this PR

# Short version
/oc review this PR
```

#### Explanation Commands
```bash
# Explain changes
/opencode explain the changes

# Explain specific file
/oc explain app/page.tsx
```

#### Improvement Suggestions
```bash
# General improvements
/opencode suggest improvements

# Security check
/oc check for security issues

# Performance analysis
/opencode analyze performance
```

#### Bug Detection
```bash
# Check for bugs
/oc check for bugs

# Check type safety
/opencode verify types
```

#### Custom Prompts
```bash
# Any custom question
/opencode how can I optimize this component?

# Architecture questions
/oc does this follow best practices?
```

---

## OpenCode Response Flow

1. **You comment:** `/opencode review this PR`
2. **GitHub Actions:**
   - ✅ Checks out PR code
   - ✅ Installs OpenCode CLI
   - ✅ Runs analysis with Sonic model (FREE)
   - ✅ Posts response as PR comment
   - 🚀 Adds rocket reaction to your comment

3. **You receive:** Detailed AI analysis in PR comments

---

## Why Sonic Model?

### ✨ Key Benefits

| Feature | Sonic | Claude Sonnet | GPT-4 |
|---------|-------|---------------|-------|
| **Cost** | 🆓 FREE | 💰 Paid | 💰 Paid |
| **API Key** | ❌ None needed | ✅ Required | ✅ Required |
| **Speed** | ⚡️ 3x faster | ⚡️ Fast | ⚡️ Standard |
| **Context** | 256k tokens | 200k tokens | 128k tokens |
| **Setup** | Zero config | API key setup | API key setup |

### 🎯 Perfect For
- ✅ Open source projects (no API key exposure)
- ✅ Quick code reviews
- ✅ CI/CD integration
- ✅ Team collaboration
- ✅ Learning and experimentation

---

## Local Development with OpenCode

Want to use OpenCode locally? Here's how:

### Installation

```bash
# Install OpenCode CLI globally
npm install -g opencode-ai

# Verify installation
opencode --version
```

### Usage

```bash
# Navigate to your project
cd terminal-jarvis-frankenstein

# Launch OpenCode
opencode

# Select "Sonic" model from dropdown
# (It's FREE and requires NO API key!)
```

### Terminal Jarvis Integration

Since Terminal Jarvis already supports OpenCode:

```bash
# Install via Terminal Jarvis
terminal-jarvis install opencode

# Run via Terminal Jarvis
terminal-jarvis run opencode
```

---

## Workflow Configuration

### File Location
`.github/workflows/pr-preview-opencode.yml`

### Workflow Jobs

#### 1. `build`
- Runs on PR creation/update
- Installs dependencies
- Builds Next.js app
- Exports static site
- Uploads artifact
- Posts build status comment

#### 2. `deploy`
- Deploys to GitHub Pages
- Generates preview URL
- Posts preview link with OpenCode instructions

#### 3. `opencode-assist`
- Triggered by `/opencode` or `/oc` comments
- Checks out PR code
- Installs OpenCode CLI
- Runs AI analysis with Sonic model
- Posts response as comment
- Adds rocket reaction

### Permissions Required

```yaml
permissions:
  contents: read       # Read repository
  pages: write         # Deploy to Pages
  id-token: write      # GitHub Pages authentication
  pull-requests: write # Comment on PRs
  issues: write        # React to comments
```

---

## Security & Privacy

### ✅ Zero API Keys Exposed
- **Sonic model** requires NO API keys
- **No secrets** stored in repository
- **No credentials** in workflow files

### ✅ Safe for Public Repos
- Free tier model (no cost)
- No sensitive data exposure
- OpenCode runs in isolated GitHub Actions runner

### ✅ Data Usage
- Sonic is in testing period
- Usage data may be shared with xAI to improve model
- Code stays within GitHub Actions environment
- No persistent storage of analysis

---

## Troubleshooting

### Preview Build Fails

**Check:**
1. Build logs in GitHub Actions
2. Next.js configuration (`next.config.ts`)
3. Dependencies in `package.json`

**Common Issues:**
- Missing environment variables (should use defaults)
- Font loading failures (acceptable in CI)
- TypeScript errors

### OpenCode Command Not Working

**Check:**
1. Comment format: `/opencode <command>` or `/oc <command>`
2. Comment is on a Pull Request (not a regular issue)
3. Workflow permissions are set correctly

**Example:**
```bash
# ✅ Correct
/opencode review this code

# ❌ Incorrect (missing space)
/opencodereview this code

# ❌ Incorrect (not in PR)
# (commenting on regular issue)
```

### No Preview URL Posted

**Check:**
1. GitHub Pages is enabled in repository settings
2. Workflow completed successfully
3. `pages: write` permission granted

---

## Example Workflow

### Scenario: You Made Changes to Refactoring

1. **Create PR:**
   ```bash
   git checkout -b feature/new-components
   git add .
   git commit -m "refactor: extract chat components"
   git push origin feature/new-components
   ```

2. **Open PR on GitHub** targeting `develop` branch

3. **Wait for Automation:**
   - ⏱️ Build runs (~2-3 minutes)
   - 🚀 Deploy runs (~1 minute)
   - 💬 Preview URL posted

4. **Request AI Review:**
   Comment on PR:
   ```
   /opencode review this refactoring and suggest improvements
   ```

5. **Receive Analysis:**
   - ⏱️ OpenCode runs (~1-2 minutes)
   - 💬 AI response posted
   - 🚀 Rocket reaction added

6. **Iterate:**
   - Make suggested changes
   - Push updates
   - Preview auto-updates

---

## Advanced Usage

### Custom OpenCode Prompts

```bash
# Architecture review
/opencode does this follow React best practices?

# Performance analysis
/oc analyze bundle size impact of these changes

# Testing suggestions
/opencode what tests should I write for this?

# Documentation help
/oc generate JSDoc comments for these components

# Refactoring ideas
/opencode how can I reduce complexity here?

# Security audit
/oc check for XSS vulnerabilities
```

### Combining with Terminal Jarvis

Since you're integrating with Terminal Jarvis:

```bash
# In your terminal-jarvis config
tools:
  opencode:
    enabled: true
    model: sonic  # Free model
    auto_review: true  # Auto-review on commits
```

Then use via Terminal Jarvis UI:
```bash
terminal-jarvis
# Select: opencode
# Model: sonic (pre-selected)
# Review PR directly from terminal
```

---

## Future Enhancements

### Planned Features
- [ ] Automated test generation suggestions
- [ ] Bundle size analysis
- [ ] Accessibility audits
- [ ] Performance profiling
- [ ] Security scanning
- [ ] Dependency updates recommendations

### Integration Ideas
- [ ] Slack notifications for preview deploys
- [ ] Discord webhook for AI reviews
- [ ] Notion page updates
- [ ] JIRA ticket linking

---

## FAQ

### Q: Is Sonic really free?
**A:** Yes! During the testing period, Sonic is 100% free with no API key required. xAI is testing the model and offering it free to gather feedback.

### Q: Will it stay free?
**A:** Sonic is free during the testing period. Check [OpenCode docs](https://opencode.ai/docs) for updates on model availability.

### Q: Can I use other models?
**A:** Yes! OpenCode supports 75+ models. However, most require API keys. Sonic is unique in being free with no setup.

### Q: Does this work on private repos?
**A:** Yes! The workflow works on both public and private repositories. No API keys are exposed.

### Q: How fast is the preview deployment?
**A:** Typically 3-5 minutes from PR creation to preview URL.

### Q: Can I disable OpenCode but keep preview?
**A:** Yes! The `build` and `deploy` jobs run independently. OpenCode only runs when you comment `/opencode`.

### Q: What if I want to use Claude instead?
**A:** You can modify the workflow to use Claude, but you'll need to add `ANTHROPIC_API_KEY` to GitHub Secrets and update the OpenCode model configuration.

---

## Support

### Resources
- [OpenCode Docs](https://opencode.ai/docs)
- [SST OpenCode GitHub](https://github.com/sst/opencode)
- [Terminal Jarvis Docs](../../README.md)
- [GitHub Actions Docs](https://docs.github.com/actions)

### Community
- [OpenCode Discord](https://discord.gg/opencode)
- [Terminal Jarvis Discord](https://discord.gg/zNuyC5uG)

---

## Contributing

Found a bug? Have an improvement idea?

1. Open an issue describing the problem/idea
2. Create a PR with the fix
3. Use `/opencode review this fix` to get AI feedback!

---

**Happy Coding with Free AI Assistance! 🚀🤖**
