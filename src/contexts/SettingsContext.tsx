import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export const DEFAULT_MODEL = "models/gemini-2.5-flash-native-audio-latest";

export const AVAILABLE_MODELS = [
  { label: "Gemini 2.5 Flash Native Audio (Latest)", value: "models/gemini-2.5-flash-native-audio-latest" },
  { label: "Gemini 2.0 Flash Live", value: "models/gemini-2.0-flash-live-001" },
  { label: "Gemini 2.0 Flash", value: "models/gemini-2.0-flash-exp" },
];

interface SettingsContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  model: string;
  setModel: (model: string) => void;
  isSettingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKeyState] = useState<string>(() => {
    return localStorage.getItem("gmp_api_key") || (process.env.REACT_APP_GEMINI_API_KEY ?? "");
  });

  const [model, setModelState] = useState<string>(() => {
    return localStorage.getItem("gmp_model") || DEFAULT_MODEL;
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const setApiKey = (key: string) => {
    localStorage.setItem("gmp_api_key", key);
    setApiKeyState(key);
  };

  const setModel = (m: string) => {
    localStorage.setItem("gmp_model", m);
    setModelState(m);
  };

  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);

  return (
    <SettingsContext.Provider value={{ apiKey, setApiKey, model, setModel, isSettingsOpen, openSettings, closeSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
}
