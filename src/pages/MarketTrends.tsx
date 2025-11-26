import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MarketService, HistoricalData, MarketRate } from '@/services/MarketService'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts'
import { TrendingUp, Info, Wallet, TrendingDown, Activity } from 'lucide-react'
import { useRazorpay } from '@/hooks/useRazorpay'
import { useAuth } from '@/hooks/useAuth'
import { useWallet } from '@/contexts/WalletContext'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { PaymentMethodModal } from '@/components/PaymentMethodModal'
import { WalletPinModal } from '@/components/WalletPinModal'
import { SuccessAnimation } from '@/components/SuccessAnimation'

interface Investment {
    metal: 'gold' | 'silver'
    amount: number
    weight: number
    investedPrice: number
    investedDate: Date
}

interface ProfitPoint {
    time: string
    profit: number
}

export default function MarketTrends() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const { addToWallet, deductFromWallet, balance } = useWallet()
    const { initializePayment, loading } = useRazorpay()
    const [historicalData, setHistoricalData] = useState<HistoricalData[]>([])
    const [predictionData, setPredictionData] = useState<HistoricalData[]>([])
    const [activeMetal, setActiveMetal] = useState<'gold' | 'silver'>('gold')
    const [liveRates, setLiveRates] = useState<MarketRate[]>([])
    const [profitHistory, setProfitHistory] = useState<ProfitPoint[]>([])

    // Modals state
    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const [showPinModal, setShowPinModal] = useState(false)
    const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)
    const [pendingInvestment, setPendingInvestment] = useState<{ metal: 'gold' | 'silver', amount: number } | null>(null)
    const [pendingSaleIndex, setPendingSaleIndex] = useState<number | null>(null)

    // Investment state
    const [goldInvestment, setGoldInvestment] = useState<number>(0)
    const [silverInvestment, setSilverInvestment] = useState<number>(0)
    const [investments, setInvestments] = useState<Investment[]>(() => {
        const saved = localStorage.getItem('investments')
        if (saved) {
            try {
                return JSON.parse(saved).map((inv: any) => ({
                    ...inv,
                    investedDate: new Date(inv.investedDate)
                }))
            } catch (e) {
                console.error("Failed to parse investments", e)
                return []
            }
        }
        return []
    })

    useEffect(() => {
        localStorage.setItem('investments', JSON.stringify(investments))
    }, [investments])

    useEffect(() => {
        setHistoricalData(MarketService.getHistoricalData())
        setPredictionData(MarketService.getPredictions())

        // Fetch live rates
        MarketService.getLiveRates().then(setLiveRates)

        // Update live rates every second
        const interval = setInterval(() => {
            MarketService.getLiveRates().then(setLiveRates)
        }, 5000)

        return () => clearInterval(interval)
    }, [])

    const getCurrentPrice = (metal: 'gold' | 'silver'): number => {
        if (metal === 'gold') {
            const goldRate = liveRates.find(r => r.metal === 'Gold' && r.purity === '24K')
            return goldRate?.price || 12678
        } else {
            const silverRate = liveRates.find(r => r.metal === 'Silver')
            return silverRate?.price || 157950
        }
    }

    // Track live profit history
    useEffect(() => {
        if (investments.length === 0) return

        const totalProfit = investments.reduce((sum, inv) => {
            const currentPrice = getCurrentPrice(inv.metal)
            const currentValue = inv.weight * currentPrice
            return sum + (currentValue - inv.amount)
        }, 0)

        setProfitHistory(prev => {
            const newPoint = {
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                profit: totalProfit
            }
            // Keep last 30 data points (30 seconds history)
            const newHistory = [...prev, newPoint]
            if (newHistory.length > 30) newHistory.shift()
            return newHistory
        })
    }, [liveRates, investments])

    const combinedData = [...historicalData, ...predictionData]

    const handleInvestClick = (metal: 'gold' | 'silver') => {
        if (!user) {
            toast.error("Please sign in to invest")
            navigate('/auth')
            return
        }

        const amount = metal === 'gold' ? goldInvestment : silverInvestment
        if (amount <= 0) {
            toast.error("Please enter a valid amount")
            return
        }

        setPendingInvestment({ metal, amount })
        setShowPaymentModal(true)
    }

    const handlePaymentMethodSelect = (method: 'razorpay' | 'wallet') => {
        setShowPaymentModal(false)
        if (method === 'razorpay') {
            proceedWithRazorpay()
        } else {
            setShowPinModal(true)
        }
    }

    const proceedWithRazorpay = () => {
        if (!pendingInvestment) return

        const { metal, amount } = pendingInvestment
        const currentPrice = getCurrentPrice(metal)
        const weight = metal === 'gold'
            ? amount / currentPrice
            : amount / currentPrice

        initializePayment({
            key: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
            amount: amount * 100,
            currency: 'INR',
            name: 'KRK Jewellers',
            description: `Investment in ${metal === 'gold' ? '24K Gold' : '999 Silver'}`,
            image: '/favicon.ico',
            prefill: {
                name: user?.display_name || '',
                email: user?.email || '',
                contact: user?.phone_number || ''
            },
            theme: {
                color: '#D4AF37'
            },
            handler: (response) => {
                console.log("Payment successful", response)
                completeInvestment(metal, amount, weight, currentPrice)
            }
        })
    }

    const handlePinSuccess = () => {
        if (pendingInvestment) {
            handleWalletPaymentSuccess()
        } else if (pendingSaleIndex !== null) {
            completeSale()
        }
    }

    const handleWalletPaymentSuccess = () => {
        if (!pendingInvestment) return

        const { metal, amount } = pendingInvestment
        const currentPrice = getCurrentPrice(metal)
        const weight = metal === 'gold'
            ? amount / currentPrice
            : amount / currentPrice

        if (deductFromWallet(amount, `Investment in ${metal}`)) {
            completeInvestment(metal, amount, weight, currentPrice)
        }
    }

    const completeInvestment = (metal: 'gold' | 'silver', amount: number, weight: number, price: number) => {
        const newInvestment: Investment = {
            metal,
            amount,
            weight,
            investedPrice: price,
            investedDate: new Date()
        }

        setInvestments(prev => [...prev, newInvestment])

        // Reset input
        if (metal === 'gold') {
            setGoldInvestment(0)
        } else {
            setSilverInvestment(0)
        }

        setShowSuccessAnimation(true)
        setPendingInvestment(null)
    }

    const handleSellClick = (index: number) => {
        setPendingSaleIndex(index)
        setShowPinModal(true)
    }

    const completeSale = () => {
        if (pendingSaleIndex === null) return
        const index = pendingSaleIndex
        const investment = investments[index]
        const currentPrice = getCurrentPrice(investment.metal)
        const currentValue = investment.weight * currentPrice
        const profit = currentValue - investment.amount

        addToWallet(currentValue, `Selling ${investment.weight.toFixed(3)}${investment.metal === 'gold' ? 'g' : 'kg'} ${investment.metal}`)

        const newInvestments = investments.filter((_, i) => i !== index)
        setInvestments(newInvestments)

        toast.success(`Successfully sold ${investment.metal} investment!`, {
            description: `Credited ₹${currentValue.toLocaleString()} to wallet (Profit: ₹${profit.toLocaleString()})`
        })
        setPendingSaleIndex(null)
    }

    const calculateProfit = (investment: Investment): { currentValue: number; profit: number; profitPercent: number } => {
        const currentPrice = getCurrentPrice(investment.metal)
        const currentValue = investment.weight * currentPrice
        const profit = currentValue - investment.amount
        const profitPercent = (profit / investment.amount) * 100

        return { currentValue, profit, profitPercent }
    }

    const getTotalInvestment = (metal: 'gold' | 'silver') => {
        return investments
            .filter(inv => inv.metal === metal)
            .reduce((sum, inv) => sum + inv.amount, 0)
    }

    const getTotalCurrentValue = (metal: 'gold' | 'silver') => {
        return investments
            .filter(inv => inv.metal === metal)
            .reduce((sum, inv) => {
                const { currentValue } = calculateProfit(inv)
                return sum + currentValue
            }, 0)
    }

    const getTotalProfit = (metal: 'gold' | 'silver') => {
        return getTotalCurrentValue(metal) - getTotalInvestment(metal)
    }

    return (
        <div className="min-h-screen py-12 px-4 bg-background">
            <div className="container mx-auto max-w-6xl">
                <h1 className="text-4xl font-playfair font-bold mb-4 text-gradient-gold text-center">Invest</h1>
                <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                    Analyze market trends and invest in 24K Gold and 999 Silver with real-time profit tracking.
                </p>

                {/* Investment Calculator Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {/* Gold Investment */}
                    <Card className="border-gold/20 shadow-elegant">
                        <CardHeader>
                            <CardTitle className="font-playfair flex items-center gap-2">
                                <Wallet className="w-5 h-5 text-gold" />
                                Invest in 24K Gold
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-2 block">Current Price</label>
                                <p className="text-2xl font-bold text-gold">₹{getCurrentPrice('gold').toLocaleString()}/g</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-2 block">Investment Amount (₹)</label>
                                <Input
                                    type="number"
                                    value={goldInvestment || ''}
                                    onChange={(e) => setGoldInvestment(Number(e.target.value))}
                                    placeholder="Enter amount"
                                    className="mb-2"
                                />
                                {goldInvestment > 0 && (
                                    <p className="text-sm text-muted-foreground">
                                        You will get: <span className="font-semibold text-gold">{(goldInvestment / getCurrentPrice('gold')).toFixed(3)}g</span>
                                    </p>
                                )}
                            </div>
                            <Button
                                onClick={() => handleInvestClick('gold')}
                                className="w-full bg-gradient-gold text-black hover:opacity-90"
                                disabled={goldInvestment <= 0 || loading}
                            >
                                {loading ? 'Processing...' : 'Invest in Gold'}
                            </Button>

                            {getTotalInvestment('gold') > 0 && (
                                <div className="bg-muted/50 p-4 rounded-lg space-y-2 mt-4">
                                    <div className="flex justify-between text-sm">
                                        <span>Total Invested:</span>
                                        <span className="font-semibold">₹{getTotalInvestment('gold').toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Current Value:</span>
                                        <span className="font-semibold">₹{getTotalCurrentValue('gold').toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Profit/Loss:</span>
                                        <span className={`font-semibold ${getTotalProfit('gold') >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {getTotalProfit('gold') >= 0 ? '+' : ''}₹{getTotalProfit('gold').toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Silver Investment */}
                    <Card className="border-gold/20 shadow-elegant">
                        <CardHeader>
                            <CardTitle className="font-playfair flex items-center gap-2">
                                <Wallet className="w-5 h-5 text-gray-400" />
                                Invest in 999 Silver
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-2 block">Current Price</label>
                                <p className="text-2xl font-bold text-gray-400">₹{getCurrentPrice('silver').toLocaleString()}/kg</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-2 block">Investment Amount (₹)</label>
                                <Input
                                    type="number"
                                    value={silverInvestment || ''}
                                    onChange={(e) => setSilverInvestment(Number(e.target.value))}
                                    placeholder="Enter amount"
                                    className="mb-2"
                                />
                                {silverInvestment > 0 && (
                                    <p className="text-sm text-muted-foreground">
                                        You will get: <span className="font-semibold text-gray-400">{(silverInvestment / getCurrentPrice('silver')).toFixed(3)}kg</span>
                                    </p>
                                )}
                            </div>
                            <Button
                                onClick={() => handleInvestClick('silver')}
                                className="w-full bg-gray-400 text-black hover:opacity-90"
                                disabled={silverInvestment <= 0 || loading}
                            >
                                {loading ? 'Processing...' : 'Invest in Silver'}
                            </Button>

                            {getTotalInvestment('silver') > 0 && (
                                <div className="bg-muted/50 p-4 rounded-lg space-y-2 mt-4">
                                    <div className="flex justify-between text-sm">
                                        <span>Total Invested:</span>
                                        <span className="font-semibold">₹{getTotalInvestment('silver').toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Current Value:</span>
                                        <span className="font-semibold">₹{getTotalCurrentValue('silver').toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Profit/Loss:</span>
                                        <span className={`font-semibold ${getTotalProfit('silver') >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {getTotalProfit('silver') >= 0 ? '+' : ''}₹{getTotalProfit('silver').toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Live Profit/Loss Graph */}
                {investments.length > 0 && (
                    <Card className="border-gold/20 shadow-elegant mb-12">
                        <CardHeader>
                            <CardTitle className="font-playfair flex items-center gap-2">
                                <Activity className="w-5 h-5 text-primary" />
                                Live Portfolio Performance (Profit/Loss)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={profitHistory}>
                                    <defs>
                                        <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.1} />
                                    <XAxis
                                        dataKey="time"
                                        stroke="#888"
                                        fontSize={12}
                                        tickMargin={10}
                                    />
                                    <YAxis
                                        stroke="#888"
                                        fontSize={12}
                                        tickFormatter={(value) => `₹${value}`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                        formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Profit/Loss']}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="profit"
                                        stroke="#D4AF37"
                                        fillOpacity={1}
                                        fill="url(#colorProfit)"
                                        isAnimationActive={false}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                )}

                {/* Investment History */}
                {investments.length > 0 && (
                    <Card className="border-gold/20 shadow-elegant mb-12">
                        <CardHeader>
                            <CardTitle className="font-playfair">Your Investments</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {investments.map((inv, idx) => {
                                    const { currentValue, profit, profitPercent } = calculateProfit(inv)
                                    return (
                                        <div key={idx} className="bg-muted/30 p-4 rounded-lg">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <p className="font-semibold capitalize">{inv.metal} Investment</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {inv.investedDate.toLocaleString()} at ₹{inv.investedPrice.toLocaleString()}/{inv.metal === 'gold' ? 'g' : 'kg'}
                                                    </p>
                                                </div>
                                                <div className={`flex items-center gap-1 ${profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                    {profit >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                                    <span className="font-semibold">{profitPercent >= 0 ? '+' : ''}{profitPercent.toFixed(2)}%</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-4 gap-4 text-sm">
                                                <div>
                                                    <p className="text-muted-foreground">Weight</p>
                                                    <p className="font-semibold">{inv.weight.toFixed(3)}{inv.metal === 'gold' ? 'g' : 'kg'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">Invested</p>
                                                    <p className="font-semibold">₹{inv.amount.toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">Current Value</p>
                                                    <p className="font-semibold">₹{currentValue.toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">Profit/Loss</p>
                                                    <p className={`font-semibold ${getTotalProfit('gold') >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                        {profit >= 0 ? '+' : ''}₹{profit.toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-4 flex justify-end">
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleSellClick(idx)}
                                                    className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20"
                                                >
                                                    Sell & Withdraw
                                                </Button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                )}

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

            {/* Modals */}
            <PaymentMethodModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                onSelectMethod={handlePaymentMethodSelect}
                amount={pendingInvestment?.amount || 0}
                walletBalance={balance}
            />

            <WalletPinModal
                isOpen={showPinModal}
                onClose={() => {
                    setShowPinModal(false)
                    setPendingSaleIndex(null)
                    setPendingInvestment(null)
                }}
                onSuccess={handlePinSuccess}
            />

            <SuccessAnimation
                isOpen={showSuccessAnimation}
                onClose={() => setShowSuccessAnimation(false)}
            />
        </div>
    )
}
