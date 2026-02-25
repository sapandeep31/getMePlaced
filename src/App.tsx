import { useRef, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from "react-router-dom";
import "./App.scss";
import { LiveAPIProvider } from "./contexts/LiveAPIContext";
import { SettingsProvider, useSettings } from "./contexts/SettingsContext";
import SidePanel from "./components/side-panel/SidePanel";
import { InterviewAssistant } from "./components/interview/Interview";
import ResumeUpload from "./components/resume-upload/ResumeUpload";
import { DSAPracticeCompanion } from "./components/dsacompanion/dsacompanion";
import ControlTray from "./components/control-tray/ControlTray";
import TopNav from "./components/top-nav/TopNav";
import SettingsModal from "./components/settings/SettingsModal";
import cn from "classnames";

const host = "generativelanguage.googleapis.com";
const uri = `wss://${host}/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent`;

const AppContent = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const location = useLocation();
  const { apiKey } = useSettings();

  const isResumeUpload = location.pathname === "/" || location.pathname === "";

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        setIsConsoleOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="App dark bg-neutral-950 h-screen overflow-hidden text-gray-100 font-sans selection:bg-blue-500/30">
      <LiveAPIProvider url={uri} apiKey={apiKey}>
        <TopNav />
        <SettingsModal />
        <div className="streaming-console mt-20">
          {isConsoleOpen && <SidePanel />}
          <main className={cn("flex-grow transition-all duration-300", {
            "ml-0": !isConsoleOpen,
            "w-full": true
          })}>
            <div className="main-app-area w-full h-full overflow-y-auto pb-36">
              <Routes>
                <Route path="/" element={<ResumeUpload />} />
                <Route path="/interview" element={<InterviewAssistant />} />
                <Route path="/dsa" element={<DSAPracticeCompanion />} />
              </Routes>
              <video
                className={cn("stream", {
                  hidden: !videoRef.current || !videoStream,
                })}
                ref={videoRef}
                autoPlay
                playsInline
              />
            </div>

            <div className={cn("w-full", { "hidden": isResumeUpload })}>
              <ControlTray
                videoRef={videoRef}
                supportsVideo={true}
                onVideoStreamChange={setVideoStream}
              >
                {/* put your own buttons here */}
              </ControlTray>
            </div>
          </main>
        </div>
      </LiveAPIProvider>
    </div>
  );
};

function App() {
  return (
    <Router>
      <SettingsProvider>
        <AppContent />
      </SettingsProvider>
    </Router>
  );
}

export default App;
