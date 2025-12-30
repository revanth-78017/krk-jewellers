const API_KEY = import.meta.env.VITE_POLLINATIONS_PUBLISHABLE_KEY;
const POLLINATIONS_TEXT_URL = "https://text.pollinations.ai/";

export const PollinationsService = {
    generateResponse: async (history: { role: string, parts: string }[], message: string) => {
        try {
            const messages = [
                {
                    role: "system",
                    content: "You are a friendly jewelry assistant for 'GOLD CRAFT'. Use simple, clear language that anyone can understand. Keep your responses short and conversational (2-3 sentences max). Always try to end with a helpful question to keep the chat going. Be professional but very easy to talk to."
                },
                ...history.map(h => ({
                    role: h.role === 'assistant' ? 'assistant' : 'user',
                    content: h.parts
                })),
                { role: "user", content: message }
            ];

            const response = await fetch(POLLINATIONS_TEXT_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(API_KEY && { "Authorization": `Bearer ${API_KEY}` })
                },
                body: JSON.stringify({
                    messages,
                    model: "openai", // Pollinations supports multiple models, 'openai' is a good default
                    jsonMode: false
                })
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Pollinations API Error: ${response.status} - ${errorData}`);
            }

            return await response.text();
        } catch (error: any) {
            console.error("Pollinations Chat Error:", error);
            return `I'm having trouble connecting to my AI brain. Error: ${error.message || 'Unknown error'}.`;
        }
    },

    analyzeDesign: async (prompt: string): Promise<{ range: string, analysis: string[] }> => {
        try {
            const promptText = `
            Analyze the following jewelry design prompt and estimate the gold weight (22k) in grams. 
            Consider the item type (Ring/Necklace/etc), target audience (Mens/Ladies), style (heavy/minimal), and complexity.
            
            Design: "${prompt}"
            
            Return ONLY a JSON object with this format (no markdown, just raw JSON):
            {
                "min": number,
                "max": number,
                "reasoning": ["short reason 1", "short reason 2", "short reason 3"]
            }
            `;

            const response = await fetch(POLLINATIONS_TEXT_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(API_KEY && { "Authorization": `Bearer ${API_KEY}` })
                },
                body: JSON.stringify({
                    messages: [{ role: "user", content: promptText }],
                    model: "openai",
                    jsonMode: true
                })
            });

            if (!response.ok) {
                throw new Error(`Pollinations Analysis Error: ${response.status}`);
            }

            const text = await response.text();
            // Pollinations text endpoint with jsonMode=true should return raw JSON
            const resultData = JSON.parse(text);

            return {
                range: `${resultData.min}g - ${resultData.max}g`,
                analysis: resultData.reasoning.slice(0, 3)
            };

        } catch (error: any) {
            console.error("Pollinations Analysis Error:", error);
            return {
                range: "Estimation Error",
                analysis: [`AI Analysis failed: ${error.message || 'Unknown'}`]
            };
        }
    }
}