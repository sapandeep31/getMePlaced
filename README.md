# getMePlaced 🚀

An **AI-powered interview preparation platform** that uses Google's Gemini Multimodal Live API to conduct realistic, real-time mock interviews with candidates. Practice your interview skills, receive instant feedback, and build confidence before the real thing.

## Features ✨

- **Live Interview Practice**: Conduct real-time mock interviews powered by Gemini AI with audio and video support
- **Resume Upload**: Upload your resume and let the AI tailor interview questions based on your background
- **DSA Practice Companion**: Practice Data Structures & Algorithms problems with an AI mentor providing hints and explanations
- **Real-time Audio/Video Streaming**: Bi-directional audio and video streaming for immersive interview experience
- **Live Logging & Monitoring**: Debug console to monitor API interactions and application state
- **Dark Mode UI**: Modern, distraction-free interface built with React + Tailwind CSS
- **Multi-route Navigation**: Separate routes for resume upload, interviews, and DSA practice

## Tech Stack 🛠️

- **Frontend**: React 18 + TypeScript + Tailwind CSS + Sass
- **API**: Google Gemini Multimodal Live API (WebSocket)
- **Audio Processing**: Web Audio API with custom AudioWorklets
- **State Management**: Zustand
- **Build**: React Scripts with TypeScript support
- **Routing**: React Router v7
- **Visualization**: Vega & Vega-Lite (for future analytics)

## Getting Started 🎯

### Prerequisites

- Node.js 16+ and npm/yarn
- A Google AI API key for the Gemini API (get one free at [Google AI Studio](https://aistudio.google.com))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/getMePlaced.git
   cd getMePlaced
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```
   REACT_APP_GEMINI_API_KEY=your_api_key_here
   ```

4. **Start the development server**

   ```bash
   npm start
   ```

   The app will open at `http://localhost:3000` (or `https://localhost:3000` with HTTPS)

5. **Build for production**
   ```bash
   npm run build
   ```

## How to Use 📖

### Resume Upload (Home Page `/`)

1. Upload your resume in PDF or text format
2. The AI will analyze your background and experience

### Interview Practice (`/interview`)

1. Click "Start Interview" to begin a mock interview
2. Allow camera (optional) and microphone access
3. The AI will conduct a realistic interview based on your resume
4. Answer questions and get real-time feedback
5. Use Ctrl+Shift+C to toggle the debug console

### DSA Practice (`/dsa`)

1. Select a problem difficulty level
2. Practice coding problems with an AI mentor
3. Get hints, explanations, and feedback on your solutions

## Project Structure 📁

```
src/
├── components/           # React components
│   ├── interview/       # Interview practice component
│   ├── resume-upload/   # Resume upload component
│   ├── dsacompanion/    # DSA practice component
│   ├── control-tray/    # Audio/video control interface
│   ├── side-panel/      # Debug console
│   └── ...
├── contexts/            # React Context (LiveAPI, Settings)
├── hooks/               # Custom React hooks
│   ├── use-live-api.ts      # Main API connection hook
│   ├── use-webcam.ts        # Webcam stream management
│   ├── use-screen-capture.ts# Screen capture utility
│   └── use-media-stream-mux.ts
├── lib/                 # Utility libraries
│   ├── multimodal-live-client.ts  # API client
│   ├── audio-recorder.ts
│   ├── audio-streamer.ts
│   └── worklets/        # AudioWorklet processors
└── App.tsx              # Main app component
```

## Contributing 🤝

We **love contributions**! Whether you're fixing bugs, adding features, or improving documentation, your help is welcome.

### How to Contribute

1. **Fork the repository**
   - Click the "Fork" button on GitHub
   - Clone your fork locally: `git clone https://github.com/YOUR_USERNAME/getMePlaced.git`

2. **Create a feature branch**

   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Keep commits atomic and descriptive
   - Follow the existing code style
   - Add tests for new features if applicable

4. **Push to your fork**

   ```bash
   git push origin feature/amazing-feature
   ```

5. **Open a Pull Request**
   - Provide a clear description of your changes
   - Reference any related issues
   - Include before/after screenshots if UI changes
   - Be responsive to feedback during review

### Contribution Guidelines

- **Code Style**: Follow the existing TypeScript/React conventions
- **Commits**: Use clear, descriptive commit messages
- **Issues**: Check existing issues before creating new ones
- **Testing**: Test your changes locally before submitting
- **Documentation**: Update README or docs if adding new features
- **No breaking changes**: Maintain backward compatibility when possible

### Areas for Contribution 🎯

- 🐛 **Bug Fixes**: Find and fix bugs, report issues you discover
- ✨ **New Features**: Interview types, DSA categories, new practice modes
- 📚 **Documentation**: Improve README, add API docs, create tutorials
- 🎨 **UI/UX**: Design improvements, accessibility enhancements
- 🧪 **Testing**: Add unit and integration tests
- ♻️ **Refactoring**: Improve code quality and performance
- 🌍 **Internationalization**: Add language support

## API Configuration 🔑

This project uses the Google Gemini Multimodal Live API:

```typescript
// The API endpoint
const uri =
  "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent";

// Model used
model: "models/gemini-2.5-flash-native-audio-latest";
```

Get your free API key: https://aistudio.google.com

## Configuration 🔧

### Environment Variables

- `REACT_APP_GEMINI_API_KEY`: Your Google Gemini API key
- `HTTPS=true`: For running with HTTPS locally (`npm run start-https`)

### Settings

Access the Settings modal (gear icon) to:

- Update your API key
- Adjust audio/video settings
- Configure interview parameters

## Deployment 🚀

### To Google App Engine

1. Install Google Cloud SDK
2. Update `app.yaml` if needed
3. Deploy:
   ```bash
   gcloud app deploy
   ```

### To Other Platforms

The `build/` directory contains a production build ready for:

- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

## Troubleshooting 🔍

**Issue**: "API key not provided"

- Ensure `REACT_APP_GEMINI_API_KEY` is set in `.env.local`
- Restart the dev server after setting env variables

**Issue**: "Permission denied for camera/microphone"

- Check browser permissions settings
- Allow local host access in your browser security settings

**Issue**: "WebSocket connection failed"

- Verify your API key is valid
- Check your internet connection
- Ensure HTTPS is being used (or localhost)

## Roadmap 🗺️

- [ ] Support for multiple interview scenarios (behavioral, technical, etc.)
- [ ] Interview recording and playback
- [ ] Performance analytics and metrics
- [ ] Integration with LeetCode/HackerRank for DSA problems
- [ ] Team/group interview practice
- [ ] Mobile app version
- [ ] Multilingual support

## License 📄

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

Built with ❤️ using Google's Gemini API

## Support 💬

- **Issues**: Report bugs and request features on GitHub Issues
- **Discussions**: Join discussions for questions and ideas
- **Documentation**: Check the wiki for detailed guides

---

**⭐ If you find this project helpful, please consider giving it a star! 🌟**

Happy interviewing! 🎉
