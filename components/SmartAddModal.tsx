import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { FaMagic, FaTimes, FaSpinner, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';
import { Priority, Tag, AppSettings } from '../types';
import { PROVIDERS } from '../constants';

interface GeneratedTask {
  title: string;
  description: string;
  priority: Priority;
  tag: Tag;
}

interface SmartAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCards: (cards: GeneratedTask[]) => void;
  settings: AppSettings;
}

const SmartAddModal: React.FC<SmartAddModalProps> = ({ isOpen, onClose, onAddCards, settings }) => {
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const activeProvider = PROVIDERS.find(p => p.id === settings.provider) || PROVIDERS[0];
  const activeSettings = settings.providerSettings?.[settings.provider] || { apiKey: '', model: '' };
  const activeModel = activeSettings.model || activeProvider.defaultModel;

  const handleGenerate = async () => {
    if (!text.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      let generatedData: GeneratedTask[] = [];

      if (settings.provider === 'gemini') {
        const apiKey = activeSettings.apiKey || process.env.API_KEY;

        // Use custom endpoint if provided, otherwise use default
        const customEndpoint = activeSettings.endpoint || activeProvider.endpoint;
        const aiConfig: { apiKey: string | undefined; httpOptions?: { baseUrl: string } } = {
          apiKey: apiKey
        };

        if (customEndpoint) {
          aiConfig.httpOptions = { baseUrl: customEndpoint };
        }

        const ai = new GoogleGenAI(aiConfig);

        const response = await ai.models.generateContent({
          model: activeModel,
          contents: text,
          config: {
            systemInstruction: `You are a helpful project manager assistant.
            Extract a list of tasks from the user's input.
            For each task, provide:
            - title: A concise summary of the task.
            - description: A brief explanation (optional, empty string if none).
            - priority: One of 'None', 'Low', 'Medium', 'High', 'Urgent' (infer from context, default to 'Medium').
            - tag: One of 'Bug', 'Feature', 'Enhancement', 'Learning', 'Idea' (infer from context, default to 'Feature').

            Strictly adhere to the JSON schema.`,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  priority: { type: Type.STRING, enum: ['None', 'Low', 'Medium', 'High', 'Urgent'] },
                  tag: { type: Type.STRING, enum: ['Bug', 'Feature', 'Enhancement', 'Learning', 'Idea'] },
                },
                required: ['title', 'priority', 'tag'],
              },
            },
          },
        });
        generatedData = JSON.parse(response.text || '[]');

      } else {
        // Handle Zhipu AI (GLM) - OpenAI compatible endpoint
        if (!activeSettings.apiKey) {
          throw new Error(`API Key is required for ${activeProvider.name}. Please configure it in Settings.`);
        }

        // Sanitize API Key to prevent header errors (remove non-ASCII characters)
        // This prevents "String contains non ISO-8859-1 code point" errors
        const sanitizedApiKey = activeSettings.apiKey.trim().replace(/[^\x00-\x7F]/g, "");

        if (sanitizedApiKey !== activeSettings.apiKey.trim()) {
          console.warn("API Key contained invalid characters and was sanitized.");
        }

        if (!sanitizedApiKey) {
          throw new Error("Invalid API Key format. Please check your settings.");
        }

        const systemPrompt = `You are a specialized JSON generator. You extract tasks from text.

        RULES:
        1. Output ONLY a valid JSON array. No text before or after.
        2. No markdown formatting (no \`\`\`json).
        3. Extract tasks with these specific fields:
           - "title": (string) Summary of the task
           - "description": (string) Details, or empty string
           - "priority": (enum) "None", "Low", "Medium", "High", "Urgent". Default "Medium".
           - "tag": (enum) "Bug", "Feature", "Enhancement", "Learning", "Idea". Default "Feature".

        Example Output:
        [{"title": "Fix login", "description": "Login button broken", "priority": "High", "tag": "Bug"}]
        `;

        const zhipuModel = activeModel.trim().toLowerCase();

        // Use custom endpoint if provided, otherwise use default from provider config
        const zhipuEndpoint = activeSettings.endpoint || activeProvider.endpoint;

        console.log('Zhipu API Request:', {
          endpoint: zhipuEndpoint,
          model: zhipuModel,
          hasApiKey: !!sanitizedApiKey,
          apiKeyPrefix: sanitizedApiKey ? sanitizedApiKey.substring(0, 8) + '...' : 'none'
        });

        const response = await fetch(zhipuEndpoint!, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${sanitizedApiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            model: zhipuModel,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: text }
            ],
            temperature: 0.1,
            stream: false,
          })
        });

        if (!response.ok) {
          let errorText = '';
          try {
            errorText = await response.text();
          } catch (e) {
            errorText = 'Could not read error response';
          }

          console.error('Zhipu API Error:', {
            status: response.status,
            statusText: response.statusText,
            errorText: errorText,
            endpoint: activeProvider.endpoint,
            model: activeModel
          });

          try {
            const errData = JSON.parse(errorText);

            // Handle specific error messages
            let errorMessage = `API Error: ${response.status} ${response.statusText}`;

            if (errData.error) {
              const errorCode = errData.error.code;
              const errorMessageText = errData.error.message || '';
              if (errorMessageText) {
                errorMessage = errorMessageText;
              }
              if (errorCode === '1211' || errorCode === 1211 || errorMessageText.toLowerCase().includes('unknown model')) {
                errorMessage = 'Unknown model. Please select glm-4-7 in Settings.';
              }
              // Handle authentication errors specifically
              if (errData.error.type === 'invalid_api_key' ||
                errorMessageText.toLowerCase().includes('invalid') ||
                errorMessageText.toLowerCase().includes('expired') ||
                errorMessageText.toLowerCase().includes('unauthorized')) {
                errorMessage = 'API Token expired or incorrect. Please update your API Key in Settings.';
              }
            }

            throw new Error(errorMessage);
          } catch (parseError) {
            throw new Error(`API Error: ${response.status} ${response.statusText}. Response: ${errorText}`);
          }
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '[]';

        // Cleanup potential markdown fences if the model ignores the "no markdown" instruction
        const jsonStr = content.replace(/```json\n?|```/g, '').trim();

        try {
          generatedData = JSON.parse(jsonStr);
        } catch (parseError) {
          console.error("JSON Parse Error", parseError, content);
          throw new Error("Failed to parse AI response. The model might be busy or returned invalid JSON.");
        }
      }

      if (Array.isArray(generatedData) && generatedData.length > 0) {
        onAddCards(generatedData as GeneratedTask[]);
        setText('');
        onClose();
      } else {
        setError("Could not extract any tasks. Please try being more specific.");
      }
    } catch (err: any) {
      console.error(err);
      let errorMessage = err.message || "Failed to generate tasks. Please check your settings and try again.";
      const normalizedMessage = errorMessage.toLowerCase();

      // Improve error message for common API key issues
      if (normalizedMessage.includes('api key not valid') || normalizedMessage.includes('api_key_invalid')) {
        errorMessage = "Invalid API Key. Please update it in Settings.";
      } else if (normalizedMessage.includes('token expired') || normalizedMessage.includes('token incorrect')) {
        errorMessage = "API Token expired or incorrect. Please update your API Key in Settings.";
      } else if (errorMessage.includes('unknown model')) {
        errorMessage = "Unknown model. Please select glm-4-7 in Settings.";
      } else if (errorMessage.includes('{')) {
        try {
          // Attempt to extract cleaner message from JSON error strings
          const jsonMatch = errorMessage.match(/\{.*\}/);
          if (jsonMatch) {
            const errorObj = JSON.parse(jsonMatch[0]);
            if (errorObj.error?.message) {
              errorMessage = errorObj.error.message;
            }
          }
        } catch (e) {
          // If parsing fails, stick to the original message
        }
      }

      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] transform transition-all scale-100">
        <div className="flex justify-between items-center p-5 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
          <div className="flex items-center space-x-2.5 text-black dark:text-white">
            <div className="p-2 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-sm">
              <span className="text-purple-600 dark:text-purple-400"><FaMagic size={16} /></span>
            </div>
            <h2 className="text-xl font-bold">Smart Add</h2>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
            <span><FaTimes /></span>
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
          <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4 leading-relaxed">
            Paste your meeting notes, brainstorming list, or email content below.
            AI will automatically extract tasks and organize them for you.
          </p>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-40 px-4 py-3 border border-neutral-200 dark:border-neutral-800 rounded-xl dark:bg-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent resize-none placeholder:text-neutral-400 transition-shadow shadow-sm mb-4"
            placeholder="e.g., We need to fix the login bug on the homepage (High Priority). Also, let's brainstorm new color schemes for the dashboard..."
          />

          <div className="flex items-start p-3 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs text-neutral-500 dark:text-neutral-400">
            <span className="mr-2 mt-0.5 flex-shrink-0"><FaInfoCircle size={14} /></span>
            <p>
              Currently using <strong>{activeProvider.name}</strong> ({activeModel}).
              You can change the AI provider and model in the app Settings.
            </p>
          </div>

          {error && (
            <div className="mt-4 flex items-center text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
              <span className="mr-2.5 flex-shrink-0"><FaExclamationCircle size={16} /></span>
              {error}
            </div>
          )}
        </div>

        <div className="p-5 border-t border-neutral-200 dark:border-neutral-800 flex justify-end space-x-3 bg-neutral-50 dark:bg-neutral-900">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 hover:text-black dark:bg-black dark:text-neutral-300 dark:border-neutral-800 dark:hover:bg-neutral-900 dark:hover:text-white transition-colors"
            disabled={isGenerating}
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={!text.trim() || isGenerating}
            className={`flex items-center px-5 py-2.5 text-sm font-bold text-white bg-black dark:bg-white dark:text-black rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
          >
            {isGenerating ? (
              <>
                <span className="animate-spin mr-2"><FaSpinner size={16} /></span>
                Processing...
              </>
            ) : (
              <>
                <span className="mr-2"><FaMagic size={16} /></span>
                Generate Tasks
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartAddModal;
