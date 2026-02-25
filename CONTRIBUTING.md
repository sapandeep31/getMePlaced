# Contributing to getMePlaced

Thank you for your interest in contributing to getMePlaced! 🎉 We're excited to collaborate with you.

## Getting Started

### 1. Fork and Clone

First, fork the repository on GitHub, then clone your fork:

```bash
git clone https://github.com/YOUR_USERNAME/getMePlaced.git
cd getMePlaced
```

### 2. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

Use descriptive branch names:

- `feature/add-behavioral-interviews`
- `fix/audio-streaming-bug`
- `docs/improve-setup-guide`
- `refactor/optimize-api-client`

### 3. Set Up Your Development Environment

```bash
npm install
cp .env.example .env.local  # Create your local env file
npm start
```

Set your Google Gemini API key in `.env.local`:

```
REACT_APP_GEMINI_API_KEY=your_key_here
```

## Making Changes

### Code Style

- Use **TypeScript** for type safety
- Follow **React best practices** (hooks, functional components)
- Keep components small and focused
- Use SCSS modules for styling
- Follow existing code conventions

### Commit Messages

Write clear, descriptive commit messages:

```
feature: Add behavioral interview questions
fix: Resolve audio feedback loop issue
docs: Update API configuration section
style: Format code according to prettier
test: Add unit tests for audio-recorder
```

**Bad:**

```
fix stuff
update code
changes
```

### Testing

Before submitting a PR:

```bash
npm test
npm run build  # Test production build
```

## Submitting a Pull Request

1. **Push to your fork**

   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open a PR on GitHub**
   - Use a clear, descriptive title
   - Reference related issues (e.g., "Fixes #123")
   - Describe what changed and why
   - Include screenshots for UI changes

3. **Example PR Description**

   ```
   ## What does this PR do?
   Adds support for behavioral interview questions in addition to technical questions.

   ## Related Issue
   Fixes #45

   ## Changes
   - Added BehavioralInterview component
   - Extended LiveAPIContext to support question types
   - Updated /interview route to support both question types
   - Added tests for new component

   ## How to test
   1. Upload resume
   2. Go to interview page
   3. Select "Behavioral" interview type
   4. Verify questions are behavioral in nature
   ```

## Types of Contributions

### 🐛 Bug Fixes

- Report bugs clearly with reproduction steps
- Fix should include a test case
- Update documentation if behavior changes

### ✨ New Features

- Discuss major features in an issue first
- Keep features focused and not too broad
- Include tests and documentation
- Common areas:
  - New interview question types (behavioral, system design, etc.)
  - DSA problem categories
  - Performance analytics
  - UI/UX improvements

### 📚 Documentation

- README improvements
- API documentation
- Setup guides
- Troubleshooting tips
- Code comments for complex logic

### 🎨 UI/UX

- Design improvements
- Accessibility enhancements
- Better mobile responsiveness
- Visual polish

### 🧪 Tests

- Unit tests for utilities and hooks
- Integration tests for components
- E2E tests for user flows

## Review Process

1. **Code Review**: A maintainer will review your code
2. **Feedback**: We may request changes
3. **CI Check**: Tests and builds must pass
4. **Merge**: Once approved, your PR will be merged!

### What We Look For

- ✅ Clear, focused changes
- ✅ Good commit history
- ✅ Tests included
- ✅ Documentation updated
- ✅ Follows code style
- ✅ No breaking changes

## Development Tips

### Project Structure

- Components in `src/components/`
- Custom hooks in `src/hooks/`
- Utilities in `src/lib/`
- Context/State in `src/contexts/`

### Key Files

- `src/App.tsx` - Main app structure and routing
- `src/lib/multimodal-live-client.ts` - Gemini API client
- `src/contexts/LiveAPIContext.tsx` - API connection management
- `src/contexts/SettingsContext.tsx` - App settings/config

### Useful Commands

```bash
npm start              # Start dev server
npm run build          # Build for production
npm test               # Run tests
npm run start-https    # Start with HTTPS
```

### Debug Console

Press **Ctrl+Shift+C** to toggle the debug console and see:

- API messages
- Connection status
- Audio levels
- Application logs

## Community Guidelines

- Be respectful and inclusive
- Welcome diverse perspectives
- Assume good intentions
- Provide constructive feedback
- Report issues professionally

## Questions?

- 💬 Open a GitHub Discussion
- 🐛 Create an Issue for bugs
- 📧 Reach out to maintainers

---

**Thank you for contributing to getMePlaced!** 🚀

Every contribution helps make interview prep more accessible to everyone.
