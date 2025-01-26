import { useEffect, useState, memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";

function ShoppingAssistantComponent() {
  const navigate = useNavigate();
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const { client, setConfig, disconnect } = useLiveAPIContext();

  const shoppingResources = [
    {
      title: "Step-by-Step Shopping Guide",
      description: "Visual guide to online shopping basics",
      url: "https://chatgpt.com/share/679623d9-d844-8011-9843-02cc98580043",
    },
    {
      title: "Safety Tips",
      description: "How to shop safely online",
      url: "https://www.pcmag.com/explainers/tips-for-safer-online-shopping",
    },
  ];

  const handleDisconnect = useCallback(() => {
    setIsDisconnecting(true);
    disconnect();
    setTimeout(() => {
      navigate("/");
    }, 2000);
  }, [disconnect, navigate]);

  useEffect(() => {
    setConfig({
      model: "models/gemini-2.0-flash-exp",
      generationConfig: {
        responseModalities: "audio",
      },
      systemInstruction: {
        parts: [
          {
            text: `You are a patient shopping assistant helping elderly users navigate online stores. Your role is to guide them through website navigation and purchases with clear, simple instructions.
FIRST ASK TO SHARE THE SCREEN SO THAT YOU CAN HELP THEM.. THEN SIMPLY IN FORM OF A EASY CONVERSATION, ASK THEM WHAT THEY WANT TO BUY, DONT ASSUME THEY KNOW ANYTHING, TALK TO THEM NICELY
ASSISTANCE APPROACH:
1. Website Orientation (3-5 minutes)
   - Explain the layout of the website
   - Guide through menu navigation
   - Demonstrate search functionality
   - Explain common icons and buttons

2. Product Search Help
   - Assist with typing/searching for items
   - Explain filter and sort options
   - Read product descriptions aloud
   - Compare similar products

3. Purchase Process Support
   - Guide through adding to cart
   - Explain checkout steps clearly
   - Assist with form filling
   - Explain payment options
   - Review order summary

4. Account Management
   - Help with login/registration
   - Explain password management
   - Guide through order tracking
   - Assist with returns/exchanges

Communication Guidelines:
- Speak slowly and clearly
- Use simple, non-technical language
- Repeat instructions patiently
- Confirm understanding frequently
- Provide positive reinforcement
- Avoid jargon and technical terms
- Use large, readable text when sharing information`,
          },
        ],
      },
    });
  }, [setConfig]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Shopping Assistant
            </h2>
            <div className="flex items-center gap-4">
              {isSessionActive && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Session Active
                </span>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-gray-600 text-lg">
              Get help with online shopping. Follow these simple steps:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 text-lg">
              <li>Open your shopping website in a new tab</li>
              <li>Click the screen share button below</li>
              <li>Say "Start help session" to begin</li>
              <li>Ask questions as you shop</li>
              <li>Say "All done" when finished</li>
            </ol>
          </div>

          {isDisconnecting && (
            <div className="bg-blue-50 text-blue-700 p-4 rounded-lg mt-4 text-lg">
              Ending shopping session...
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Helpful Resources
          </h2>
          <div className="space-y-4">
            {shoppingResources.map((resource, idx) => (
              <a
                key={idx}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 border-2 border-gray-200 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {resource.title}
                    </h3>
                    <p className="mt-1 text-gray-600">{resource.description}</p>
                  </div>
                  <svg
                    className="w-8 h-8 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export const ShoppingAssistant = memo(ShoppingAssistantComponent);