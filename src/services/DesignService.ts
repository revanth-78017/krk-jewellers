export interface DesignParams {
    type: string
    material: string
    gemstone: string
    prompt: string
}

export const DesignService = {
    generateDesign: async (params: DesignParams, seed?: number): Promise<{ url: string, seed: number }> => {
        // Construct a detailed prompt for better results
        const fullPrompt = `luxury ${params.type} jewelry, made of ${params.material}, featuring ${params.gemstone}, ${params.prompt}, photorealistic, 8k, white background, cinematic lighting, high quality, product photography, intricate details, sharp focus`;

        // Encode the prompt for the URL
        const encodedPrompt = encodeURIComponent(fullPrompt);

        // Use provided seed or generate a random one
        const usedSeed = seed ?? Math.floor(Math.random() * 1000000);

        // Pollinations.ai URL with Flux model
        const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?seed=${usedSeed}&width=1024&height=1024&nologo=true&model=flux`;

        // Pre-load the image to ensure it exists before returning
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve({ url, seed: usedSeed });
            img.onerror = () => reject(new Error('Failed to generate image'));
            img.src = url;
        });
    }
}
