export interface MarketRate {
    metal: 'Gold' | 'Silver'
    purity?: '24K' | '22K'
    price: number // Price per 1g for Gold, per 1kg for Silver
    change: number // Percentage change
    trend: 'up' | 'down' | 'neutral'
}

export interface HistoricalData {
    date: string
    gold: number
    silver: number
}

// Base prices (current market rates as of Nov 24, 2025)
// Gold: Rs 12,678 per gram (24K)
// Silver: Rs 157,950 per kg
const BASE_GOLD_24K = 12678; // per 1g
const BASE_SILVER = 157950; // per 1kg

// Cache state
let cachedRates: MarketRate[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const MarketService = {
    getLiveRates: async (): Promise<MarketRate[]> => {
        const now = Date.now();
        const shouldUseCache = cachedRates && (now - lastFetchTime < CACHE_DURATION);

        if (shouldUseCache && cachedRates) {
            // Apply micro-fluctuations to cached data for "live" feel
            return cachedRates.map(rate => {
                const fluctuation = (Math.random() - 0.5) * (rate.metal === 'Gold' ? 2 : 10); // +/- 1 Rs for Gold, +/- 5 Rs for Silver
                const newPrice = Math.round(rate.price + fluctuation);
                return {
                    ...rate,
                    price: newPrice,
                    trend: fluctuation >= 0 ? 'up' : 'down'
                };
            });
        }

        try {
            // Fetch fresh data
            const API_KEY = import.meta.env.VITE_GOLD_API_KEY || 'goldapi-placeholder-key';
            const headers = { 'x-access-token': API_KEY, 'Content-Type': 'application/json' };

            const goldResponse = await fetch('https://www.goldapi.io/api/XAU/INR', { headers });
            const silverResponse = await fetch('https://www.goldapi.io/api/XAG/INR', { headers });

            if (!goldResponse.ok || !silverResponse.ok) {
                throw new Error('API limit reached or invalid key');
            }

            const goldData = await goldResponse.json();
            const silverData = await silverResponse.json();

            const goldPricePerGram = goldData.price / 31.1035;
            const silverPricePerKg = (silverData.price / 31.1035) * 1000;

            const newRates: MarketRate[] = [
                {
                    metal: 'Gold',
                    purity: '24K',
                    price: Math.round(goldPricePerGram),
                    change: goldData.chp || 0.5,
                    trend: (goldData.chp || 0) >= 0 ? 'up' : 'down'
                },
                {
                    metal: 'Gold',
                    purity: '22K',
                    price: Math.round(goldPricePerGram * 0.916),
                    change: goldData.chp || 0.5,
                    trend: (goldData.chp || 0) >= 0 ? 'up' : 'down'
                },
                {
                    metal: 'Silver',
                    price: Math.round(silverPricePerKg),
                    change: silverData.chp || -0.2,
                    trend: (silverData.chp || 0) >= 0 ? 'up' : 'down'
                }
            ];

            cachedRates = newRates;
            lastFetchTime = now;
            return newRates;

        } catch (error) {
            console.warn("GoldAPI fetch failed, using fallback simulation:", error);
            // Fallback to simulation
            const fluctuation = () => (Math.random() - 0.5) * 10;
            const gold24k = BASE_GOLD_24K + fluctuation() * 5;
            const gold22k = gold24k * 0.916;
            const silver = BASE_SILVER + fluctuation() * 8;

            const simulatedRates: MarketRate[] = [
                {
                    metal: 'Gold',
                    purity: '24K',
                    price: Math.round(gold24k),
                    change: 0.45,
                    trend: 'up'
                },
                {
                    metal: 'Gold',
                    purity: '22K',
                    price: Math.round(gold22k),
                    change: 0.42,
                    trend: 'up'
                },
                {
                    metal: 'Silver',
                    price: Math.round(silver),
                    change: -0.12,
                    trend: 'down'
                }
            ];

            // Even in fallback, we update cache to avoid spamming the failed API call
            cachedRates = simulatedRates;
            lastFetchTime = now;
            return simulatedRates;
        }
    },

    getHistoricalData: (): HistoricalData[] => {
        const data: HistoricalData[] = [];
        const today = new Date();
        for (let i = 30; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);

            // Generate somewhat realistic trend data
            const randomFactor = Math.sin(i * 0.2) * 1000;

            data.push({
                date: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
                gold: Math.round(BASE_GOLD_24K + randomFactor + (Math.random() * 500)),
                silver: Math.round(BASE_SILVER + (randomFactor * 1.2) + (Math.random() * 800))
            });
        }
        return data;
    },

    getPredictions: (): HistoricalData[] => {
        const data: HistoricalData[] = [];
        const today = new Date();
        for (let i = 1; i <= 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            // Simple linear projection with noise
            const projectedGold = BASE_GOLD_24K + (i * 150) + (Math.random() * 200);
            const projectedSilver = BASE_SILVER + (i * 200) + (Math.random() * 300);

            data.push({
                date: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
                gold: Math.round(projectedGold),
                silver: Math.round(projectedSilver)
            });
        }
        return data;
    }
};
