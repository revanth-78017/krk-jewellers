import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Wallet, CreditCard, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface PaymentMethodModalProps {
    isOpen: boolean
    onClose: () => void
    onSelectMethod: (method: 'razorpay' | 'wallet') => void
    amount: number
    walletBalance: number
}

export function PaymentMethodModal({ isOpen, onClose, onSelectMethod, amount, walletBalance }: PaymentMethodModalProps) {
    const navigate = useNavigate()
    const canAfford = walletBalance >= amount

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-background border-gold/20">
                <DialogHeader>
                    <DialogTitle className="font-playfair text-2xl text-center text-gradient-gold">Select Payment Method</DialogTitle>
                    <DialogDescription className="text-center">
                        Choose how you want to pay for your investment of ₹{amount.toLocaleString()}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Button
                        variant="outline"
                        className="h-auto p-4 flex items-center justify-between border-gold/20 hover:bg-gold/5 hover:border-gold/40 transition-all group"
                        onClick={() => onSelectMethod('razorpay')}
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-2 rounded-full bg-blue-500/10 text-blue-500 group-hover:bg-blue-500/20">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-semibold">Pay Online</h3>
                                <p className="text-sm text-muted-foreground">UPI, Cards, Netbanking</p>
                            </div>
                        </div>
                    </Button>

                    <div className="relative">
                        <Button
                            variant="outline"
                            disabled={!canAfford}
                            className={`w-full h-auto p-4 flex items-center justify-between border-gold/20 transition-all group ${canAfford ? 'hover:bg-gold/5 hover:border-gold/40' : 'opacity-70'
                                }`}
                            onClick={() => {
                                if (canAfford) onSelectMethod('wallet')
                            }}
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded-full bg-gold/10 text-gold group-hover:bg-gold/20">
                                    <Wallet className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-semibold">Wallet Balance</h3>
                                    <p className="text-sm text-muted-foreground">Available: ₹{walletBalance.toLocaleString()}</p>
                                </div>
                            </div>
                        </Button>

                        {!canAfford && (
                            <div className="absolute -bottom-8 left-0 right-0 flex items-center justify-center">
                                <Button
                                    variant="link"
                                    size="sm"
                                    className="text-red-500 hover:text-red-600 flex items-center gap-1"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        onClose()
                                        navigate('/wallet')
                                    }}
                                >
                                    <Plus className="w-3 h-3" /> Insufficient Balance. Add Funds?
                                </Button>
                            </div>
                        )}
                    </div>
                    {/* Spacer for the absolute positioned button */}
                    {!canAfford && <div className="h-6" />}
                </div>
            </DialogContent>
        </Dialog>
    )
}
