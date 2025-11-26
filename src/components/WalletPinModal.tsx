import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useWallet } from "@/contexts/WalletContext"

interface WalletPinModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export function WalletPinModal({ isOpen, onClose, onSuccess }: WalletPinModalProps) {
    const { isPinSet, verifyPin, setWalletPin } = useWallet()
    const [step, setStep] = useState<'enter' | 'set' | 'confirm'>('enter')
    const [pin, setPin] = useState('')
    const [confirmPin, setConfirmPin] = useState('')

    useEffect(() => {
        if (isOpen) {
            setStep(isPinSet ? 'enter' : 'set')
            setPin('')
            setConfirmPin('')
        }
    }, [isOpen, isPinSet])

    const handleSubmit = () => {
        if (step === 'enter') {
            if (verifyPin(pin)) {
                onSuccess()
                onClose()
            } else {
                toast.error("Incorrect PIN")
                setPin('')
            }
        } else if (step === 'set') {
            if (pin.length < 4) {
                toast.error("PIN must be at least 4 digits")
                return
            }
            setStep('confirm')
        } else if (step === 'confirm') {
            if (pin === confirmPin) {
                setWalletPin(pin)
                onSuccess()
                onClose()
            } else {
                toast.error("PINs do not match")
                setConfirmPin('')
            }
        }
    }

    const getTitle = () => {
        switch (step) {
            case 'enter': return "Enter Wallet PIN"
            case 'set': return "Set New Wallet PIN"
            case 'confirm': return "Confirm Wallet PIN"
        }
    }

    const getDescription = () => {
        switch (step) {
            case 'enter': return "Enter your secure PIN to authorize this transaction."
            case 'set': return "Create a secure PIN for your wallet transactions."
            case 'confirm': return "Re-enter your PIN to confirm."
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-background border-gold/20">
                <DialogHeader>
                    <DialogTitle className="font-playfair text-2xl text-center text-gradient-gold">{getTitle()}</DialogTitle>
                    <DialogDescription className="text-center">
                        {getDescription()}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="flex justify-center">
                        <Input
                            type="password"
                            value={step === 'confirm' ? confirmPin : pin}
                            onChange={(e) => step === 'confirm' ? setConfirmPin(e.target.value) : setPin(e.target.value)}
                            className="text-center text-2xl tracking-widest w-48 h-12 border-gold/30 focus:border-gold"
                            placeholder="••••"
                            maxLength={6}
                            autoFocus
                        />
                    </div>
                    <Button
                        className="w-full bg-gradient-gold text-black hover:opacity-90"
                        onClick={handleSubmit}
                    >
                        {step === 'enter' ? 'Authorize Payment' : step === 'set' ? 'Next' : 'Confirm & Pay'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
