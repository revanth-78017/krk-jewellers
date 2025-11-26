import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useWallet } from '@/contexts/WalletContext'
import { useRazorpay } from '@/hooks/useRazorpay'
import { useAuth } from '@/hooks/useAuth'
import { Wallet as WalletIcon, Plus, ShieldCheck, History, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import { WalletPinModal } from '@/components/WalletPinModal'
import { toast } from 'sonner'

export default function Wallet() {
    const { balance, addToWallet } = useWallet()
    const { user } = useAuth()
    const { initializePayment, loading } = useRazorpay()
    const [amount, setAmount] = useState('')
    const [showPinModal, setShowPinModal] = useState(false)

    const handleAddMoney = () => {
        const value = parseFloat(amount)
        if (isNaN(value) || value <= 0) {
            toast.error("Please enter a valid amount")
            return
        }

        initializePayment({
            key: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
            amount: value * 100,
            currency: 'INR',
            name: 'KRK Jewellers',
            description: 'Wallet Top-up',
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
                addToWallet(value, 'Razorpay Top-up')
                setAmount('')
                toast.success(`Successfully added ₹${value} to wallet`)
            }
        })
    }

    return (
        <div className="min-h-screen py-12 px-4 bg-background">
            <div className="container mx-auto max-w-4xl">
                <h1 className="text-4xl font-playfair font-bold mb-8 text-gradient-gold text-center">My Wallet</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Balance Card */}
                    <Card className="md:col-span-2 border-gold/20 shadow-elegant bg-gradient-to-br from-background to-muted/30">
                        <CardHeader>
                            <CardTitle className="font-playfair flex items-center gap-2 text-muted-foreground">
                                <WalletIcon className="w-5 h-5" />
                                Available Balance
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-1">
                                <span className="text-5xl font-bold text-gradient-gold">₹{balance.toLocaleString()}</span>
                                <span className="text-sm text-muted-foreground">Updated just now</span>
                            </div>

                            <div className="mt-8">
                                <label className="text-sm font-medium mb-2 block">Add Money to Wallet</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                                        <Input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="Enter amount"
                                            className="pl-8 border-gold/20 focus:border-gold"
                                        />
                                    </div>
                                    <Button
                                        onClick={handleAddMoney}
                                        disabled={loading || !amount}
                                        className="bg-gradient-gold text-black hover:opacity-90 min-w-[120px]"
                                    >
                                        {loading ? 'Processing...' : <><Plus className="w-4 h-4 mr-1" /> Add Money</>}
                                    </Button>
                                </div>
                                <div className="flex gap-2 mt-2">
                                    {[500, 1000, 5000].map((val) => (
                                        <Button
                                            key={val}
                                            variant="outline"
                                            size="sm"
                                            className="text-xs border-gold/20 hover:bg-gold/10"
                                            onClick={() => setAmount(val.toString())}
                                        >
                                            + ₹{val}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Security & Actions */}
                    <div className="space-y-6">
                        <Card className="border-gold/20 shadow-elegant">
                            <CardHeader>
                                <CardTitle className="font-playfair flex items-center gap-2 text-sm">
                                    <ShieldCheck className="w-4 h-4 text-gold" />
                                    Security
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Secure your wallet with a 4-digit PIN. You'll need this for all transactions.
                                </p>
                                <Button
                                    variant="outline"
                                    className="w-full border-gold/20 hover:bg-gold/10 hover:text-gold"
                                    onClick={() => setShowPinModal(true)}
                                >
                                    Change Wallet PIN
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-gold/20 shadow-elegant opacity-80">
                            <CardHeader>
                                <CardTitle className="font-playfair flex items-center gap-2 text-sm">
                                    <History className="w-4 h-4" />
                                    Recent Activity
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Placeholder for transaction history - could be implemented later */}
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 rounded-full bg-green-500/10 text-green-500">
                                            <ArrowDownLeft className="w-3 h-3" />
                                        </div>
                                        <span>Wallet Created</span>
                                    </div>
                                    <span className="text-muted-foreground">--</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <WalletPinModal
                isOpen={showPinModal}
                onClose={() => setShowPinModal(false)}
                onSuccess={() => toast.success("PIN updated successfully")}
                mode="change"
            />
        </div>
    )
}
