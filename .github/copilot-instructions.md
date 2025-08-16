# Copilot Instructions

## CRITICAL RULES - MUST FOLLOW

### Code Generation
- **NO EMOJIS**: Do not include any emojis in generated code, comments, or documentation
- **SURGICAL EDITS**: Make only minimal, targeted changes - avoid broad rewrites unless absolutely necessary
- **PRESERVE EXISTING CODE**: When editing, include 3-5 lines of unchanged code before and after modifications for precise targeting

### Documentation Management
- **DOCS DIRECTORY ONLY**: All documentation must be placed in the `docs/` directory
- **NO ROOT DOCS**: Do not create or modify documentation files in the repository root
- **NEW DOCS APPROVAL**: If creating a new `[SUBJECT].md` file in `docs/`, explicitly inform the user before creation
- **EXISTING DOCS**: Check `docs/` directory first to see if relevant documentation already exists

### File Organization
- Keep existing project structure intact
- Use appropriate file extensions and naming conventions
- Follow established patterns in the codebase

### Error Handling
- Provide clear, actionable error messages
- Include specific file paths and line numbers when relevant
- Suggest concrete solutions rather than generic advice

### Dependencies
- Minimize new dependencies unless absolutely required
- Prefer built-in solutions over external libraries
- Document any new dependencies and their purpose

### Commit Standards
- **SEMANTIC COMMITS**: Use semantic commit message format for automation compatibility
- **PRE-COMMIT SECURITY CHECK**: CRITICAL - Before every commit, verify no private information is exposed:
  - No API keys, tokens, or credentials in code
  - No personal email addresses, names, or contact information
  - No internal URLs, server addresses, or infrastructure details
  - No debugging information that reveals system internals
  - No hardcoded passwords or secrets
  - Review `.env*` files are properly gitignored (exception: `.env.example` with placeholder values is safe to commit)
- **COMMIT TYPES**:
  - `feat:` - New features or functionality
  - `fix:` - Bug fixes and error corrections
  - `chore:` - Maintenance tasks, dependency updates, tooling
  - `security:` - Security improvements and vulnerability fixes
  - `hotfix:` - Critical production fixes
  - `pipeline:` - CI/CD, build, and deployment changes
  - `docs:` - Documentation updates
  - `style:` - Code formatting, whitespace, no logic changes
  - `refactor:` - Code restructuring without feature changes
  - `test:` - Adding or updating tests
  - `perf:` - Performance improvements
- **COMMIT FORMAT**: `type(scope): description` - keep descriptions concise and imperative
- **BREAKING CHANGES**: Use `!` after type for breaking changes (e.g., `feat!:`)
- **SCOPE OPTIONAL**: Include scope when helpful (e.g., `fix(api):`, `feat(ui):`)

## SECURITY STANDARDS - CRITICAL

### API Key & Environment Security
- **NEVER HARDCODE**: Never hardcode API keys, secrets, or credentials in source code
- **ENVIRONMENT VALIDATION**: Always validate environment variables exist before using them
- **SECURE DEFAULTS**: Use secure defaults for all configuration options
- **ERROR SANITIZATION**: Sanitize error messages to avoid leaking sensitive information
- **API KEY ROTATION**: Document API key rotation procedures in setup instructions

### Input Validation & Sanitization
- **VALIDATE ALL INPUTS**: Validate all user inputs on both client and server side
- **SANITIZE DATA**: Sanitize all data before processing, storing, or displaying
- **TYPE CHECKING**: Use TypeScript strict mode and proper type definitions
- **SQL INJECTION PREVENTION**: Use parameterized queries and ORM best practices
- **XSS PREVENTION**: Escape all user-generated content before rendering

### Authentication & Authorization
- **PRINCIPLE OF LEAST PRIVILEGE**: Grant minimum necessary permissions
- **SESSION SECURITY**: Implement secure session management practices
- **TOKEN VALIDATION**: Validate all tokens and API keys before processing requests
- **RATE LIMITING**: Implement rate limiting for API endpoints
- **ACCESS CONTROL**: Verify user permissions for all sensitive operations

### Data Protection
- **SENSITIVE DATA HANDLING**: Never log or expose sensitive user data
- **ENCRYPTION IN TRANSIT**: Use HTTPS for all data transmission
- **SECURE STORAGE**: Follow secure practices for data storage
- **DATA VALIDATION**: Validate data integrity before processing
- **PRIVACY BY DESIGN**: Consider privacy implications in all features

### Code Security
- **DEPENDENCY SCANNING**: Regularly check for vulnerable dependencies
- **SECURE CODING PRACTICES**: Follow OWASP guidelines for secure development
- **CODE INJECTION PREVENTION**: Prevent code injection through proper validation
- **PROTOTYPE POLLUTION**: Avoid prototype pollution vulnerabilities
- **REGEX SECURITY**: Avoid ReDoS (Regular Expression Denial of Service) patterns

### API Security
- **REQUEST VALIDATION**: Validate all API request parameters and headers
- **RESPONSE SANITIZATION**: Sanitize API responses to prevent data leakage
- **CORS CONFIGURATION**: Configure CORS policies appropriately
- **CONTENT TYPE VALIDATION**: Validate content types for all requests
- **API VERSIONING**: Implement proper API versioning for security updates

### Error Handling Security
- **NO STACK TRACES**: Never expose stack traces to end users
- **GENERIC ERROR MESSAGES**: Use generic error messages for security-sensitive operations
- **LOGGING SECURITY**: Log security events without exposing sensitive data
- **FAIL SECURELY**: Ensure systems fail to a secure state
- **ERROR RATE MONITORING**: Monitor error rates for potential attacks

### Frontend Security
- **CSP HEADERS**: Implement Content Security Policy headers
- **XSS PROTECTION**: Use React's built-in XSS protection properly
- **SECURE COOKIES**: Configure cookies with secure flags
- **IFRAME PROTECTION**: Prevent clickjacking with frame options
- **SENSITIVE DATA IN STATE**: Avoid storing sensitive data in client state

### Third-Party Integration Security
- **VENDOR VALIDATION**: Validate all third-party integrations for security
- **WEBHOOK VERIFICATION**: Verify webhook signatures from external services
- **API LIMITS**: Respect and enforce third-party API rate limits
- **SANDBOX ISOLATION**: Ensure proper isolation for code execution environments
- **PERMISSION SCOPING**: Use minimal permission scopes for external APIs

## Current Project Context

This is a Next.js application that allows users to chat with AI to build React apps instantly. Key components:
- E2B sandboxes for code execution
- Firecrawl for web scraping
- Multiple AI provider support (Anthropic, OpenAI, Gemini, Groq)
- Tailwind CSS for styling

## Recent Changes Made
- Resolved Tailwind CSS v4 lightningcss binary issues by downgrading to v3
- Added proper environment variable configuration with `.env.local`
- Improved error handling for missing API keys
- Enhanced user feedback for setup requirements
