# Development Guide

This guide will help you set up your development environment and understand how to work on getMePlaced.

## Prerequisites

- **Node.js** 16+ (we recommend 18+)
- **npm** or **yarn**
- **Git**
- A **Google Gemini API key** (free at [aistudio.google.com](https://aistudio.google.com))
- A modern browser (Chrome, Firefox, Safari, or Edge)

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/getMePlaced.git
cd getMePlaced
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Then edit `.env.local` and add your Gemini API key:

```
REACT_APP_GEMINI_API_KEY=your_actual_key_here
```

### 4. Start Development Server

```bash
npm start
```

This runs the app in development mode at `http://localhost:3000` with hot reload enabled.

## Development Workflow

### Working with HTTPS

For testing camera/microphone access locally, you may need HTTPS:

```bash
npm run start-https
```

This starts the server at `https://localhost:3000`

### Running Tests

```bash
npm test
```

Run tests in watch mode. Press `a` to run all tests or `q` to quit.

### Building for Production

```bash
npm run build
```

Creates an optimized production build in the `build/` directory.

## Project Structure Deep Dive

```
src/
├── components/
│   ├── audio-pulse/           # Visual audio indicator
│   ├── control-tray/          # Camera/microphone controls
│   ├── dsacompanion/          # DSA practice component
│   ├── interview/             # Main interview component
│   ├── logger/                # Debug console UI
│   ├── resume-upload/         # Resume upload component
│   ├── settings/              # Settings modal
│   ├── side-panel/            # Debug panel
│   └── top-nav/               # Navigation header
│
├── contexts/
│   ├── LiveAPIContext.tsx    # Manages Gemini API connection
│   └── SettingsContext.tsx   # App settings/configuration
│
├── hooks/
│   ├── use-live-api.ts        # Main API connection hook
│   ├── use-webcam.ts          # Webcam stream management
│   ├── use-screen-capture.ts  # Screen capture (unused)
│   └── use-media-stream-mux.ts# Stream multiplexing
│
├── lib/
│   ├── multimodal-live-client.ts  # Gemini API WebSocket client
│   ├── audio-recorder.ts          # Audio recording utilities
│   ├── audio-streamer.ts          # Audio streaming to API
│   ├── audioworklet-registry.ts   # Web Audio worklet setup
│   ├── store-logger.ts            # Logging utility
│   ├── utils.ts                   # General utilities
│   └── worklets/
│       ├── audio-processing.ts    # Audio worklet processor
│       └── vol-meter.ts           # Volume metering worklet
│
├── App.tsx                    # Main component + routing
├── App.scss                   # Global styles
├── index.tsx                  # React entry point
└── multimodal-live-types.ts   # TypeScript types

build/                         # Production build (don't commit)
public/                        # Static assets
```

## Key Components Explained

### LiveAPIContext

Manages the connection to Google's Gemini Multimodal Live API:

```typescript
// Use like this:
const { client, connected, connect, disconnect } = useLiveAPI({
  url: "wss://...",
  apiKey: "your-key",
});
```

### Interview Component

Main interview practice interface. Handles:

- Audio/video streaming
- Question display and responses
- Interview flow control

### DSA Companion

Practice coding problems with AI guidance. Features:

- Problem selection
- Code editor integration
- AI feedback on solutions

## Debugging

### Toggle Debug Console

In the app, press **Ctrl+Shift+C** to open the debug console which shows:

- API messages
- Connection logs
- Audio levels
- Application state

### Browser DevTools

- **Elements**: Inspect UI components
- **Console**: Check for JavaScript errors
- **Network**: Monitor WebSocket traffic to Gemini API
- **Performance**: Profile rendering performance

### Common Issues

**No camera/microphone access:**

- Check browser permissions
- Ensure using HTTPS or localhost
- Verify hardware is working

**API connection fails:**

- Check API key in .env.local
- Verify API key hasn't been revoked
- Check network connectivity

**Audio feedback/echo:**

- This is handled by the audio-processing worklet
- Check speaker/microphone settings
- Restart the browser

## Code Style Guidelines

### TypeScript

- Use explicit types, avoid `any`
- Define interfaces for component props
- Use enums for constants with multiple values

### React

- Use functional components with hooks
- Keep components focused and small
- Extract reusable logic into custom hooks
- Memoize expensive computations

### Styling

- Use SCSS modules for component styles
- Follow BEM naming convention for classes
- Use Tailwind CSS utilities in JSX
- Keep styles close to components

### Example Component

```typescript
// components/MyComponent/MyComponent.tsx
import cn from "classnames";
import styles from "./my-component.scss";

interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  onAction,
}) => {
  return (
    <div className={cn(styles.container, "p-4")}>
      <h2>{title}</h2>
      {onAction && (
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          onClick={onAction}
        >
          Action
        </button>
      )}
    </div>
  );
};
```

## Git Workflow

### Creating a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### Making Commits

```bash
git add .
git commit -m "feature: add new interview type"
```

### Pushing Changes

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

### Keeping Your Fork Updated

```bash
git remote add upstream https://github.com/original-owner/getMePlaced.git
git fetch upstream
git rebase upstream/main
```

## Performance Optimization

### Tips

- Use React DevTools Profiler to identify slow renders
- Memoize expensive components with `React.memo()`
- Use `useCallback()` for stable function references
- Avoid unnecessary re-renders with proper dependency arrays
- Lazy load components using `React.lazy()`

### Audio Performance

- The audio worklet processes audio in a separate thread
- Adjust sample rates and buffer sizes for your hardware
- Monitor volume levels in the debug console

## Testing

### Running Tests

```bash
npm test
```

### Writing Tests

Create `.test.tsx` files next to components:

```typescript
// MyComponent.test.tsx
import { render, screen } from "@testing-library/react";
import { MyComponent } from "./MyComponent";

describe("MyComponent", () => {
  it("renders with title", () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText("Test")).toBeInTheDocument();
  });
});
```

## Building and Deployment

### Local Production Build

```bash
npm run build
# Serve the build locally
npx serve -s build
```

### Deploy to Google App Engine

```bash
gcloud app deploy
```

### Deploy to Vercel

```bash
vercel
```

### Deploy to Netlify

```bash
npm run build
# Then use Netlify CLI or web UI to deploy the build/ folder
```

## Documentation

When adding features:

- Update README.md with usage examples
- Add TypeScript documentation comments
- Document complex algorithms
- Include examples in DEVELOPMENT.md

## Getting Help

- Check existing Issues and Discussions
- Review the main README
- Look at similar components for patterns
- Ask in GitHub Discussions

---

Happy coding! 🚀
