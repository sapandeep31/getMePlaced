import { type FunctionDeclaration, SchemaType } from "@google/generative-ai";
import { useEffect, useState, memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import { useSettings } from "../../contexts/SettingsContext";
import { ToolCall } from "../../multimodal-live-types";

interface FeedbackType {
  text: string;
  score: number;
  strengths: string[];
  improvements: string[];
  resumeSuggestions: string[];
  careerDevelopment: {
    projectIdeas: string[];
    techStack: string[];
    learningPath: string[];
  };
}

const declaration: FunctionDeclaration = {
  name: "generate_feedback",
  description: "Displays interview feedback with detailed analysis",
  parameters: {
    type: SchemaType.OBJECT,
    required: ["text", "score", "strengths", "improvements", "resumeSuggestions", "careerDevelopment"],
    properties: {
      text: {
        type: SchemaType.STRING,
        description: "Detailed interview feedback",
      },
      score: {
        type: SchemaType.NUMBER,
        description: "Interview performance score (0-100)",
      },
      strengths: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING },
        description: "Key strengths demonstrated",
      },
      improvements: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING },
        description: "Areas for improvement",
      },
      resumeSuggestions: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING },
        description: "Suggestions to improve resume",
      },
      careerDevelopment: {
        type: SchemaType.OBJECT,
        properties: {
          projectIdeas: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: "Suggested projects to build",
          },
          techStack: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: "Recommended technologies to learn",
          },
          learningPath: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: "Step-by-step learning path",
          },
        },
        required: ["projectIdeas", "techStack", "learningPath"],
      },
    },
  },
};

function InterviewAssistantComponent() {
  const navigate = useNavigate();
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackType | null>(null);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasManuallyDisconnected, setHasManuallyDisconnected] = useState(false);
  const { client, setConfig, disconnect, connect, connected } = useLiveAPIContext();
  const { model } = useSettings();

  const handleDisconnect = useCallback(() => {
    setHasManuallyDisconnected(true);
    setIsDisconnecting(true);
    setIsInterviewActive(false);
    disconnect();
    setTimeout(() => {
      setIsDisconnecting(false);
    }, 2000);
  }, [disconnect]);

  const handleReconnect = useCallback(() => {
    setHasManuallyDisconnected(false);
    setFeedback(null);
  }, []);

  useEffect(() => {
    const resumeText = localStorage.getItem("candidateResume");
    if (!resumeText) {
      navigate("/");
      return;
    }

    // Recover any feedback from a previous session that may have been
    // interrupted by a server disconnect before React could render it
    const savedFeedback = localStorage.getItem("gmp_last_feedback");
    if (savedFeedback) {
      try {
        setFeedback(JSON.parse(savedFeedback));
        setIsInterviewActive(false);
      } catch {
        localStorage.removeItem("gmp_last_feedback");
      }
    }
    setConfig({
      model: model,
      generationConfig: {
        responseModalities: "audio",
      },
      systemInstruction: {
        parts: [
          {
            text: `You are Miya, a seasoned and cool technical interviewer evaluating candidates for a software engineering position. Your goal is to create an engaging, insightful, and professional interview experience, assessing candidates' technical skills, problem-solving abilities, and their overall potential as team contributors. Balance rigor with encouragement to help the candidate perform at their best.

INTERVIEW STRUCTURE:
1. Introduction (2-3 minutes)
   - Welcome the candidate warmly and set a positive tone.
   - Briefly review their background, referencing their resume.
   - Start with a relaxed, non-technical question to ease them in.

2. Technical Assessment (15-20 minutes)
   - Begin with foundational technical concepts or basic Data Structures and Algorithms (DSA) questions.
   - Gradually progress to medium or advanced levels based on their responses, tailoring questions to their skill level but keeping it appropriate for freshers.
   - Explore areas like:
     - Data Structures & Algorithms
     - Programming Languages
     - Operating Systems
     - Databases
     - Computer Networks (focus on skills and topics highlighted in their resume).
   - Include coding problems, design scenarios, and logical problem-solving tasks.

3. Project Deep Dive (5-10 minutes)
   - Discuss specific projects they've listed in their resume.
   - Ask about technical decisions, challenges faced, and solutions implemented.
   - Probe to understand the candidate's depth of knowledge and personal contribution to these projects.

4. Extracurriculars and HR Perspective (5-10 minutes)
   - Inquire about extracurricular activities, hobbies, or experiences in college clubs.
   - Pose simple workplace scenarios, puzzles, or behavioral questions to evaluate their mindset, values, and interpersonal skills.
   - Keep the tone light, friendly, and conversational to build rapport.

CANDIDATE RESUME DETAILS:
${resumeText}

WHENEVER the candidate says "finish interview", "done", "end interview", "that's all", etc.:
- Call the generate_feedback function IMMEDIATELY and show the feedback, you can use INSUFFICIENT DATA to fill areas in the feedback if the interview was ended prematurely or you dont have enough data.

SCORING GUIDE for generate_feedback:
1. Technical knowledge (30%)
2. Problem-solving skills (20%)
3. Project understanding (15%)
4. Personal values and mindset (10%)
5. Communication skills (10%)
6. Resume quality (15%)

Resume feedback: structure, content improvements, keywords.
Career development: relevant projects, tech stack to learn, learning path.

CRITICAL: Call generate_feedback silently and directly. No preamble. No narration during the call.`,
          },
        ],
      },
      tools: [{ functionDeclarations: [declaration] }],
    });
    setHasStarted(true);
  }, [setConfig, navigate]);

  // Connect ONCE when the interview page is ready — never auto-reconnect on drops.
  // If the AI ends the session (e.g. after generating feedback) this will NOT fire again
  // because hasStarted stays `true` and the effect only re-runs when it *changes*.
  // Manual reconnects go through the ControlTray, which calls connect() directly.
  useEffect(() => {
    if (hasStarted) {
      connect().then(() => setIsInterviewActive(true)).catch(console.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasStarted]); // intentionally omit `connect` — fire exactly once

  // When ControlTray reconnects manually, restore the interview-active UI state
  useEffect(() => {
    if (connected && hasManuallyDisconnected) {
      setHasManuallyDisconnected(false);
      setIsInterviewActive(true);
    }
  }, [connected, hasManuallyDisconnected]);

  useEffect(() => {
    const onToolCall = (toolCall: ToolCall) => {
      console.log(`got toolcall`, toolCall);
      const fc = toolCall.functionCalls.find(
        (fc) => fc.name === declaration.name
      );

      // Send tool response synchronously (no setTimeout) to avoid the 200ms
      // window where audio chunks could conflict with server processing
      if (toolCall.functionCalls.length) {
        try {
          client.sendToolResponse({
            functionResponses: toolCall.functionCalls.map((fc) => ({
              response: { output: { success: true } },
              id: fc.id,
            })),
          });
        } catch (e) {
          console.warn("sendToolResponse failed:", e);
        }
      }

      if (fc) {
        const args = fc.args as FeedbackType;
        // Persist immediately so it survives an unexpected server disconnect
        try { localStorage.setItem("gmp_last_feedback", JSON.stringify(args)); } catch {}
        setFeedback(args);
        setIsInterviewActive(false);
      }
    };
    client.on("toolcall", onToolCall);
    return () => {
      client.off("toolcall", onToolCall);
    };
  }, [client]);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-4 sm:p-6 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-600/5 pointer-events-none" />
        
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Technical Interview Assistant
            </h2>
            <p className="text-gray-400 mt-1 text-sm sm:text-base">
              Say <span className="text-white font-medium bg-white/10 px-2 py-0.5 rounded-md">start interview</span> to begin and <span className="text-white font-medium bg-white/10 px-2 py-0.5 rounded-md">finish interview and generate feedback</span> when you're done.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {isInterviewActive && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Interview in Progress
              </span>
            )}
          </div>
        </div>

        {isDisconnecting && (
          <div className="relative mt-4 bg-blue-500/10 border border-blue-500/20 text-blue-400 p-4 rounded-xl flex items-center gap-3">
            <svg className="w-5 h-5 animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Disconnecting from the interview session...
          </div>
        )}

        {hasManuallyDisconnected && !isDisconnecting && (
          <div className="relative mt-4 bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-3 text-gray-400 text-sm">
            <svg className="w-4 h-4 flex-shrink-0 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Session ended. Use the microphone button below to reconnect.
          </div>
        )}
      </div>

      {feedback && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-4 sm:p-6 md:p-8 animate-in zoom-in-95 duration-500">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-white flex items-center gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-1 sm:p-1.5 flex-shrink-0">
              <svg className="w-full h-full text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            Comprehensive Feedback
          </h2>
          
          {/* Score Section */}
          <div className="mb-6 sm:mb-10 bg-black/20 p-4 sm:p-6 rounded-xl border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-300 font-medium text-base sm:text-lg">Overall Score</span>
              <span className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                {feedback.score}/100
              </span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden shadow-inner relative">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                style={{ width: `${feedback.score}%` }}
              >
                <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" style={{ backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)', transform: 'translateX(-100%)' }} />
              </div>
            </div>
          </div>

          <div className="space-y-6 sm:space-y-10">
            {/* Interview Feedback */}
            <section>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">Interview Performance</h3>
              <p className="text-gray-300 bg-white/5 p-4 sm:p-5 rounded-xl border border-white/5 leading-relaxed text-sm sm:text-base">
                {feedback.text}
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <section className="bg-emerald-500/5 border border-emerald-500/10 p-4 sm:p-5 rounded-xl">
                <h4 className="text-base sm:text-lg font-semibold text-emerald-400 mb-3 sm:mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Key Strengths
                </h4>
                <ul className="space-y-2 sm:space-y-3">
                  {(feedback.strengths || []).map((strength, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-300 text-sm sm:text-base">
                      <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="bg-rose-500/5 border border-rose-500/10 p-4 sm:p-5 rounded-xl">
                <h4 className="text-base sm:text-lg font-semibold text-rose-400 mb-3 sm:mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  Areas for Improvement
                </h4>
                <ul className="space-y-2 sm:space-y-3">
                  {(feedback.improvements || []).map((improvement, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-300 text-sm sm:text-base">
                      <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-rose-400" />
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Resume Optimization */}
            <section className="bg-white/5 border border-white/5 p-4 sm:p-6 rounded-xl">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-5 text-indigo-400 flex items-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                Resume Optimization
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {(feedback.resumeSuggestions || []).map((suggestion, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-300 bg-black/20 p-3 rounded-lg">
                    <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    <span className="text-xs sm:text-sm">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Career Development */}
            <section>
              <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-white border-b border-white/10 pb-3 sm:pb-4">Career Development Plan</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-blue-500/5 border border-blue-500/10 p-4 sm:p-5 rounded-xl">
                  <h4 className="text-base sm:text-lg font-medium text-blue-400 mb-3 sm:mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                    Recommended Projects
                  </h4>
                  <ul className="space-y-2 sm:space-y-3">
                    {feedback.careerDevelopment && (feedback.careerDevelopment.projectIdeas || []).map((project, idx) => (
                      <li key={idx} className="text-xs sm:text-sm text-gray-300 flex items-start gap-2">
                        <span className="mt-1.5 flex-shrink-0 w-1 h-1 rounded-full bg-blue-400/50" />
                        {project}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-purple-500/5 border border-purple-500/10 p-4 sm:p-5 rounded-xl">
                  <h4 className="text-base sm:text-lg font-medium text-purple-400 mb-3 sm:mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                    Tech Stack to Learn
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {feedback.careerDevelopment && (feedback.careerDevelopment.techStack || []).map((tech, idx) => (
                      <span key={idx} className="px-2 sm:px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs sm:text-sm rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-500/5 border border-amber-500/10 p-4 sm:p-5 rounded-xl">
                  <h4 className="text-base sm:text-lg font-medium text-amber-400 mb-3 sm:mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                    Learning Path
                  </h4>
                  <ul className="space-y-3 sm:space-y-4">
                    {feedback.careerDevelopment && (feedback.careerDevelopment.learningPath || []).map((step, idx) => (
                      <li key={idx} className="relative flex items-start gap-3">
                        <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xs font-bold">
                          {idx + 1}
                        </div>
                        <span className="text-xs sm:text-sm text-gray-300 pt-0.5">{step}</span>
                        {idx !== (feedback.careerDevelopment.learningPath || []).length - 1 && (
                          <div className="absolute left-2.5 sm:left-3 top-5 sm:top-6 w-px h-full -ml-px bg-amber-500/20" />
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}

      <div className="mt-6 sm:mt-8 text-center pb-40">
        <button
          onClick={handleDisconnect}
          className="px-5 sm:px-6 py-2.5 sm:py-3 bg-white/5 border border-white/10 text-gray-300 rounded-xl hover:bg-white/10 hover:text-white transition-all shadow-lg hover:shadow-xl active:scale-[0.98] font-medium text-sm sm:text-base"
        >
          End Session / Disconnect
        </button>
      </div>
    </div>
  );
}

export const InterviewAssistant = memo(InterviewAssistantComponent);  