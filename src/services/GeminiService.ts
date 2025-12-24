import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize Gemini (only if key exists to avoid immediate crash)
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export const GeminiService = {
    generateResponse: async (history: { role: string, parts: string }[], message: string) => {
        if (!genAI) {
            return "I'm currently in offline mode (API Key missing). Please add VITE_GEMINI_API_KEY to your .env file to enable my full AI capabilities.";
        }

        try {
            // Updated to the correct preview identifier for Gemini 3 Flash
            const model = genAI.getGenerativeModel(
                { model: "gemini-2.5-flash" },
                { apiVersion: "v1beta" }
            );

            // Construct a chat session
            const chat = model.startChat({
                history: [
                    {
                        role: "user",
                        parts: [{ text: "You are a friendly jewelry assistant for 'GOLD CRAFT'. Use simple, clear language that anyone can understand. Keep your responses short and conversational (2-3 sentences max). Always try to end with a helpful question to keep the chat going. Be professional but very easy to talk to." }]
                    },
                    {
                        role: "model",
                        parts: [{ text: "Understood. I am ready to assist your clients with professional jewelry design advice and inquiries." }]
                    },
                    ...history.map(h => ({
                        role: h.role === 'assistant' ? 'model' : 'user',
                        parts: [{ text: h.parts }]
                    }))
                ],
                generationConfig: {
                    maxOutputTokens: 500,
                    temperature: 0.7,
                },
            });

            const result = await chat.sendMessage(message);
            const response = result.response;
            return response.text();
        } catch (error: any) {
            console.error("Gemini Chat Error:", error);
            return `I'm having trouble connecting to my AI brain. Error: ${error.message || 'Unknown error'}. Please check if your API key is valid and has sufficient quota.`;
        }
    },

    analyzeDesign: async (prompt: string): Promise<{ range: string, analysis: string[] }> => {
        if (!genAI) {
            // Fallback for no key
            return {
                range: "Analysis Offline",
                analysis: ["AI Service functionality requires API Key"]
            };
        }

        try {
            const model = genAI.getGenerativeModel(
                { model: "gemini-2.5-flash" },
                { apiVersion: "v1beta" }
            );
            const promptText = `
            Analyze the following jewelry design prompt and estimate the gold weight (22k) in grams. 
            Consider the item type (Ring/Necklace/etc), target audience (Mens/Ladies), style (heavy/minimal), and complexity.
            
            Design: "${prompt}"
            
            Return ONLY a JSON object with this format:
            {
                "min": number,
                "max": number,
                "reasoning": ["short reason 1", "short reason 2", "short reason 3"]
            }
            Do not include Markdown formatting or \`\`\`json blocks. Just the raw JSON string.
            `;

            const result = await model.generateContent(promptText);
            const response = result.response;
            const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();

            const data = JSON.parse(text);
            return {
                range: `${data.min}g - ${data.max}g`,
                analysis: data.reasoning.slice(0, 3) // Top 3 reasons
            };

        } catch (error: any) {
            console.error("Gemini Analysis Error:", error);
            return {
                range: "Estimation Error",
                analysis: [`AI Analysis failed: ${error.message || 'Unknown'}`]
            };
        }
    }
}
