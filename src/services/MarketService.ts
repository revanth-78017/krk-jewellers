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

export const MarketService = {
    getLiveRates: (): Promise<MarketRate[]> => {
        return new Promise((resolve) => {
            // Simulate network delay
            setTimeout(() => {
                const fluctuation = () => (Math.random() - 0.5) * 10;

                const gold24k = BASE_GOLD_24K + fluctuation() * 5;
                const gold22k = gold24k * 0.916;
                const silver = BASE_SILVER + fluctuation() * 8;

                resolve([
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
                ]);
            }, 500);
        });
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
