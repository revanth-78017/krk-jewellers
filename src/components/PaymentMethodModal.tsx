import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Wallet, CreditCard } from "lucide-react"

interface PaymentMethodModalProps {
    isOpen: boolean
    onClose: () => void
    onSelectMethod: (method: 'razorpay' | 'wallet') => void
    amount: number
    walletBalance: number
}

export function PaymentMethodModal({ isOpen, onClose, onSelectMethod, amount, walletBalance }: PaymentMethodModalProps) {
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

                    <Button
                        variant="outline"
                        disabled={!canAfford}
                        className={`h-auto p-4 flex items-center justify-between border-gold/20 transition-all group ${canAfford ? 'hover:bg-gold/5 hover:border-gold/40' : 'opacity-50 cursor-not-allowed'
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
                        {!canAfford && (
                            <span className="text-xs text-red-500 font-medium">Insufficient Balance</span>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
