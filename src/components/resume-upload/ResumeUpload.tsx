import { useState } from "react";
import { useNavigate } from "react-router-dom";
import cn from "classnames";

const ResumeUpload = () => {
  const [resumeText, setResumeText] = useState("");
  const navigate = useNavigate();

  const handleStartInterview = () => {
    if (!resumeText.trim()) {
      alert("Please paste your resume first");
      return;
    }
    localStorage.setItem("candidateResume", resumeText);
    navigate("/interview");
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 pointer-events-none" />

        <div className="relative p-5 sm:p-8 border-b border-white/10">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 sm:mb-6 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Technical Interview Preparation
          </h2>
          <p className="text-gray-400 mt-2 text-base sm:text-lg font-light">
            Paste your resume below to begin the technical interview process.
            We'll analyze your background to provide a personalized experience.
          </p>
        </div>

        <div className="relative p-5 sm:p-8">
          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume text here..."
                  className="relative w-full h-48 sm:h-64 p-4 sm:p-5 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none text-white placeholder-gray-500 text-base sm:text-lg transition-all backdrop-blur-sm"
                />
              </div>

              <button
                className={`w-full py-4 px-6 rounded-xl text-white font-medium text-lg transition-all duration-300 transform shadow-lg
                  ${
                    resumeText.trim()
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 hover:-translate-y-1 hover:shadow-blue-500/25 active:scale-[0.98]"
                      : "bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed"
                  }`}
                onClick={handleStartInterview}
                disabled={!resumeText.trim()}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>Start Interview</span>
                  <svg
                    className={cn("w-5 h-5 transition-transform duration-300", {
                      "translate-x-1": resumeText.trim(),
                    })}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;
