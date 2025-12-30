/// <reference types="vite/client" />

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const SITE_URL = window.location.origin;
const SITE_NAME = 'GOLD CRAFT';

export const OpenRouterService = {
    generateResponse: async (history: { role: string, parts: string }[], message: string) => {
        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                    "HTTP-Referer": SITE_URL,
                    "X-Title": SITE_NAME,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "model": "google/gemini-2.0-flash-lite-preview-02-05:free",
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are a friendly jewelry assistant for 'GOLD CRAFT'. Use simple, clear language. Keep responses short (2-3 sentences). Always end with a helpful question."
                        },
                        ...history.map(h => ({
                            role: h.role === 'assistant' ? 'assistant' : 'user',
                            content: h.parts
                        })),
                        { "role": "user", "content": message }
                    ]
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || `OpenRouter Error: ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;

        } catch (error: any) {
            console.error("OpenRouter Error:", error);
            return `I'm having trouble connecting. Error: ${error.message}`;
        }
    }
};
