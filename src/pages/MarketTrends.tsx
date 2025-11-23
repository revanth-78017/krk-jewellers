import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MarketService, HistoricalData } from '@/services/MarketService'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { TrendingUp, Info } from 'lucide-react'

export default function MarketTrends() {
    const [historicalData, setHistoricalData] = useState<HistoricalData[]>([])
    const [predictionData, setPredictionData] = useState<HistoricalData[]>([])
    const [activeMetal, setActiveMetal] = useState<'gold' | 'silver'>('gold')

    useEffect(() => {
        setHistoricalData(MarketService.getHistoricalData())
        setPredictionData(MarketService.getPredictions())
    }, [])

    const combinedData = [...historicalData, ...predictionData]

    return (
        <div className="min-h-screen py-12 px-4 bg-background">
            <div className="container mx-auto max-w-6xl">
                <h1 className="text-4xl font-playfair font-bold mb-4 text-gradient-gold text-center">Market Trends & Predictions</h1>
                <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                    Analyze historical performance and AI-driven future price predictions for Gold and Silver to make informed investment decisions.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Control Panel */}
                    <Card className="lg:col-span-1 border-gold/20 shadow-elegant h-fit">
                        <CardHeader>
                            <CardTitle className="font-playfair">Market Analysis</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <label className="text-sm font-medium mb-2 block">Select Metal</label>
                                <div className="flex gap-2">
                                    <Button
                                        variant={activeMetal === 'gold' ? 'default' : 'outline'}
                                        className={activeMetal === 'gold' ? 'bg-gradient-gold text-black' : ''}
                                        onClick={() => setActiveMetal('gold')}
                                    >
                                        Gold (24K)
                                    </Button>
                                    <Button
                                        variant={activeMetal === 'silver' ? 'default' : 'outline'}
                                        className={activeMetal === 'silver' ? 'bg-gradient-gold text-black' : ''}
                                        onClick={() => setActiveMetal('silver')}
                                    >
                                        Silver
                                    </Button>
                                </div>
                            </div>

                            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                                <div className="flex items-center gap-2 text-primary font-semibold">
                                    <TrendingUp className="w-4 h-4" /> Bullish Trend
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Our AI models predict a steady increase in {activeMetal} prices over the next week due to global market factors.
                                </p>
                            </div>

                            <div className="bg-blue-500/10 p-4 rounded-lg space-y-2 border border-blue-500/20">
                                <div className="flex items-center gap-2 text-blue-500 font-semibold">
                                    <Info className="w-4 h-4" /> Prediction Confidence
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    87% accuracy based on historical volatility and current economic indicators.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Chart */}
                    <Card className="lg:col-span-2 border-gold/20 shadow-elegant">
                        <CardHeader>
                            <CardTitle className="font-playfair flex justify-between items-center">
                                <span>Price History & Forecast (₹)</span>
                                <span className="text-sm font-sans font-normal text-muted-foreground">Last 30 Days + 7 Day Forecast</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={combinedData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.1} />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#888"
                                        fontSize={12}
                                        tickMargin={10}
                                        interval={4}
                                    />
                                    <YAxis
                                        stroke="#888"
                                        fontSize={12}
                                        domain={['auto', 'auto']}
                                        tickFormatter={(value) => `₹${value.toLocaleString()}`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                        formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Price']}
                                    />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey={activeMetal}
                                        stroke={activeMetal === 'gold' ? '#FFD700' : '#C0C0C0'}
                                        strokeWidth={2}
                                        dot={false}
                                        name={activeMetal === 'gold' ? 'Gold Price' : 'Silver Price'}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
