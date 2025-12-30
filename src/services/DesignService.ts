import { InferenceClient } from "@huggingface/inference";

export interface DesignParams {
    type: string
    material: string
    gemstone: string
    prompt: string
}

const HF_API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY;
const hf = new InferenceClient(HF_API_KEY);

// Cache for object URLs to prevent memory leaks
const urlCache = new Set<string>();

const clearOldUrls = () => {
    urlCache.forEach(url => URL.revokeObjectURL(url));
    urlCache.clear();
};

export const DesignService = {
    generateDesign: async (params: DesignParams, seed?: number): Promise<{ url: string, seed: number }> => {
        // Construct a detailed prompt for better results
        const fullPrompt = `luxury ${params.type} jewelry, made of ${params.material}, featuring ${params.gemstone}, ${params.prompt}, photorealistic, 8k, white background, cinematic lighting, high quality, product photography, intricate details, sharp focus`;

        // Use provided seed or generate a random one
        const usedSeed = seed ?? Math.floor(Math.random() * 1000000);

        try {
            const blob = await hf.textToImage({
                provider: "nscale",
                model: "stabilityai/stable-diffusion-xl-base-1.0",
                inputs: fullPrompt,
                parameters: {
                    num_inference_steps: 25, // Increased for better quality than the 5 in example
                    seed: usedSeed
                },
            });

            // Clean up old URLs if we have many (simple heuristic)
            if (urlCache.size > 10) clearOldUrls();

            const imageUrl = URL.createObjectURL(blob as any);
            urlCache.add(imageUrl);

            return { url: imageUrl, seed: usedSeed };
        } catch (error) {
            console.error("Hugging Face Generation Error:", error);
            throw error;
        }
    },

    generate360Views: async (params: DesignParams, seed: number): Promise<string[]> => {
        const angles = [
            'front view',
            'front-right side view',
            'right profile view',
            'back-right side view',
            'back view',
            'back-left side view',
            'left profile view',
            'front-left side view'
        ];

        const urls: string[] = [];

        for (const angle of angles) {
            const prompt = `luxury ${params.type} jewelry, made of ${params.material}, featuring ${params.gemstone}, ${params.prompt}, ${angle}, photorealistic, 8k, continuous white background, cinematic lighting, high quality, product photography, intricate details, sharp focus, isolated on white`;

            try {
                const blob = await hf.textToImage({
                    provider: "nscale",
                    model: "stabilityai/stable-diffusion-xl-base-1.0",
                    inputs: prompt,
                    parameters: {
                        num_inference_steps: 20,
                        seed: seed
                    },
                });
                const url = URL.createObjectURL(blob as any);
                urlCache.add(url);
                urls.push(url);
            } catch (error) {
                console.error(`Error generating angle ${angle}:`, error);
                // Fallback or skip
            }
        }

        return urls;
    },

    revokeUrls: () => {
        clearOldUrls();
    }
}
