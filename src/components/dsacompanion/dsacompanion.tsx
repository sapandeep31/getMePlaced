import { useEffect, useState, memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";

function DSAPracticeCompanionComponent() {
  const navigate = useNavigate();
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const { client, setConfig, disconnect } = useLiveAPIContext();

  const dsaResources = [
    {
      title: "Blind 75 LeetCode Questions",
      description:
        "Must-do list of coding interview questions covering various DSA topics",
      url: "https://leetcode.com/discuss/general-discussion/460599/blind-75-leetcode-questions",
    },
    {
      title: "LeetCode Top 150",
      description:
        "Essential interview preparation questions curated by LeetCode",
      url: "https://leetcode.com/studyplan/top-interview-150/",
    },
    {
      title: "Love Babbar DSA Sheet",
      description: "Comprehensive DSA problems from GeeksforGeeks",
      url: "https://www.geeksforgeeks.org/dsa-sheet-by-love-babbar/",
    },
  ];

  const handleDisconnect = useCallback(() => {
    setIsDisconnecting(true);
    disconnect();
    setTimeout(() => {
      setIsDisconnecting(false);
    }, 2000);
  }, [disconnect]);

  useEffect(() => {
    setConfig({
      model: "models/gemini-2.5-flash-native-audio-latest",
      generationConfig: {
        responseModalities: "audio",
      },
      systemInstruction: {
        parts: [
          {
            text: `You are an expert DSA mentor helping users solve coding problems. Your role is to guide them through problem-solving while promoting learning and understanding, not just providing solutions Ask the user to share their screen and help them solve questions.

MENTORING APPROACH:
1. Problem Analysis (2-3 minutes)
   - Help break down the problem statement
   - Guide in identifying constraints and edge cases
   - Assist with developing test cases
   - Encourage users to think about input/output examples

2. Solution Development (5-10 minutes)
   - Start with brute force approach discussion
   - Guide towards optimization through leading questions
   - Help identify relevant data structures and algorithms
   - Discuss time and space complexity trade-offs
   - Encourage pattern recognition with similar problems

3. Implementation Support
   - Provide syntax guidance when needed
   - Help with debugging
   - Suggest coding best practices
   - Point out common pitfalls to avoid
   - Review and optimize code

4. Learning Reinforcement
   - Explain core concepts and principles
   - Connect current problem to similar patterns
   - Suggest related problems for practice
   - Share helpful resources and tips
   - Encourage good problem-solving habits

Remember to:
- Ask clarifying questions
- Give hints instead of direct solutions
- Be patient and supportive
- Focus on understanding over memorization
- Maintain an encouraging tone throughout`,
          },
        ],
      },
    });
  }, [setConfig]);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-600/5 pointer-events-none" />
        
        <div className="relative p-5 sm:p-8 md:p-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-2.5 sm:p-3 shadow-[0_0_20px_rgba(59,130,246,0.3)] flex-shrink-0">
                <svg className="w-full h-full text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  DSA Practice Companion
                </h2>
                <p className="text-gray-400 mt-1 text-sm sm:text-base">Your AI-powered mentor for algorithmic problem solving</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {isSessionActive && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Session Active
                </span>
              )}
            </div>
          </div>

          <div className="bg-black/20 border border-white/5 rounded-2xl p-4 sm:p-6 md:p-8">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">How it works</h3>
            <ol className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {[
                "Open a DSA problem in a new tab from the resources below",
                "Share your screen with the problem visible",
                "Say 'start session' to begin getting help",
                "Discuss your approach and ask questions",
                "Say 'end session' when you're finished"
              ].map((step, idx) => (
                <li key={idx} className="flex items-start gap-3 bg-white/5 p-3 sm:p-4 rounded-xl border border-white/5">
                  <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs sm:text-sm font-bold border border-blue-500/30">
                    {idx + 1}
                  </span>
                  <span className="text-gray-300 text-xs sm:text-sm">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {isDisconnecting && (
            <div className="relative mt-4 sm:mt-6 bg-blue-500/10 border border-blue-500/20 text-blue-400 p-4 rounded-xl flex items-center gap-3">
               <svg className="w-5 h-5 animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Ending practice session...
            </div>
          )}
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden relative">
        <div className="relative p-5 sm:p-8 md:p-10">
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.3)] flex-shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Popular Problem Sets
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {dsaResources.map((resource, idx) => (
              <a
                key={idx}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col p-4 sm:p-6 bg-black/20 border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(59,130,246,0.15)] hover:border-blue-500/30"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-600/0 group-hover:from-blue-500/10 group-hover:to-purple-600/10 rounded-2xl transition-colors duration-300" />
                <div className="relative">
                  <div className="flex justify-between items-start mb-3 sm:mb-4">
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-blue-400 transition-colors pr-2">
                      {resource.title}
                    </h3>
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-gray-500 group-hover:text-blue-400 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-all"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                    {resource.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-6 sm:mt-8 text-center pb-8">
        <button
          onClick={handleDisconnect}
          className="px-5 sm:px-6 py-2.5 sm:py-3 bg-white/5 border border-white/10 text-gray-300 rounded-xl hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] font-medium text-sm sm:text-base"
        >
          End Session / Disconnect
        </button>
      </div>
    </div>
  );
}

export const DSAPracticeCompanion = memo(DSAPracticeCompanionComponent);
