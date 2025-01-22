import { type FunctionDeclaration, SchemaType } from "@google/generative-ai";
import { useEffect, useState, memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
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
  const { client, setConfig, disconnect } = useLiveAPIContext();

  const handleDisconnect = useCallback(() => {
    setIsDisconnecting(true);
    disconnect();
    setTimeout(() => {
      navigate("/");
    }, 2000);
  }, [disconnect, navigate]);

  useEffect(() => {
    const resumeText = localStorage.getItem("candidateResume");
    if (!resumeText) {
      navigate("/");
      return;
    }

    setConfig({
      model: "models/gemini-2.0-flash-exp",
      generationConfig: {
        responseModalities: "audio",
      },
      systemInstruction: {
        parts: [
          {
            text: `You are a seasoned and cool technical interviewer evaluating candidates for a software engineering position. Your goal is to create an engaging, insightful, and professional interview experience, assessing candidates' technical skills, problem-solving abilities, and their overall potential as team contributors. Balance rigor with encouragement to help the candidate perform at their best.

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

FEEDBACK GENERATION:
Evaluate the candidate holistically across the following categories:
1. Technical knowledge (30%)
2. Problem-solving skills (20%)
3. Project understanding (15%)
4. Personal values and mindset (10%)
5. Communication skills (10%)
6. Resume quality (15%)

Also provide:
1. Resume Optimization:
   - Structure and formatting suggestions
   - Content improvements
   - Keywords and highlighting achievements
   
2. Career Development Plan:
   - Suggested projects aligned with market demands
   - Recommended tech stack based on career goals
   - Structured learning path with resources
   
   DONT SPEAK ANYTHING AFTER GENERATING FEEDBACK (no need of explaining the feedback i mean)`,
          },
        ],
      },
      tools: [{ functionDeclarations: [declaration] }],
    });
  }, [setConfig, navigate]);

  useEffect(() => {
    const onToolCall = (toolCall: ToolCall) => {
      console.log(`got toolcall`, toolCall);
      const fc = toolCall.functionCalls.find(
        (fc) => fc.name === declaration.name
      );
      if (fc) {
        const args = fc.args as FeedbackType;
        setFeedback(args);
        setIsInterviewActive(false);
      }

      if (toolCall.functionCalls.length) {
        setTimeout(
          () =>
            client.sendToolResponse({
              functionResponses: toolCall.functionCalls.map((fc) => ({
                response: { output: { success: true } },
                id: fc.id,
              })),
            }),
          200
        );
      }
    };
    client.on("toolcall", onToolCall);
    return () => {
      client.off("toolcall", onToolCall);
    };
  }, [client]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg mb-6 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Technical Interview Assistant</h2>
          <div className="flex items-center gap-4">
            {isInterviewActive && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Interview in Progress
              </span>
            )}
          </div>
        </div>
        <p className="text-gray-600 mb-4">
          Say "start interview" to begin and "finish interview" when you're
          done.
        </p>
        {isDisconnecting && (
          <div className="bg-blue-50 text-blue-700 p-4 rounded-lg mt-4">
            Disconnecting from the interview session...
          </div>
        )}
      </div>

      {feedback && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Comprehensive Feedback</h2>
          
          {/* Score Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Overall Score</span>
              <span className="text-lg font-medium">{feedback.score}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000"
                style={{ width: `${feedback.score}%` }}
              ></div>
            </div>
          </div>

          {/* Interview Feedback */}
          <div className="prose max-w-none mb-8">
            <h3 className="text-xl font-semibold mb-4">Interview Performance</h3>
            <p className="text-gray-700 mb-6">{feedback.text}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h4 className="text-lg font-medium text-green-700 mb-3">
                  Key Strengths
                </h4>
                <ul className="list-disc pl-5 space-y-2">
                  {feedback.strengths.map((strength, idx) => (
                    <li key={idx} className="text-gray-700">
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-medium text-orange-700 mb-3">
                  Areas for Improvement
                </h4>
                <ul className="list-disc pl-5 space-y-2">
                  {feedback.improvements.map((improvement, idx) => (
                    <li key={idx} className="text-gray-700">
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Resume Optimization */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Resume Optimization</h3>
              <ul className="list-disc pl-5 space-y-2">
                {feedback.resumeSuggestions.map((suggestion, idx) => (
                  <li key={idx} className="text-gray-700">
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>

            {/* Career Development */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Career Development Plan</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-lg font-medium text-blue-700 mb-3">
                    Recommended Projects
                  </h4>
                  <ul className="list-disc pl-5 space-y-2">
                    {feedback.careerDevelopment.projectIdeas.map((project, idx) => (
                      <li key={idx} className="text-gray-700">
                        {project}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-purple-700 mb-3">
                    Tech Stack to Learn
                  </h4>
                  <ul className="list-disc pl-5 space-y-2">
                    {feedback.careerDevelopment.techStack.map((tech, idx) => (
                      <li key={idx} className="text-gray-700">
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-indigo-700 mb-3">
                    Learning Path
                  </h4>
                  <ul className="list-disc pl-5 space-y-2">
                    {feedback.careerDevelopment.learningPath.map((step, idx) => (
                      <li key={idx} className="text-gray-700">
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 text-center">
        <button
          onClick={handleDisconnect}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
        >
          End Session
        </button>
      </div>
    </div>
  );
}

export const InterviewAssistant = memo(InterviewAssistantComponent);  