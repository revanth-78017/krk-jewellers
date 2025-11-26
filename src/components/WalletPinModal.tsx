import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useWallet } from "@/contexts/WalletContext"
import { Input } from "@/components/ui/input"

interface WalletPinModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    mode?: 'verify' | 'set' | 'change' // Default to 'verify' if not specified, but adapts based on isPinSet
}

export function WalletPinModal({ isOpen, onClose, onSuccess, mode = 'verify' }: WalletPinModalProps) {
    const { isPinSet, verifyPin, setWalletPin } = useWallet()
    const [step, setStep] = useState<'enter' | 'set' | 'confirm' | 'verify_old'>('enter')
    const [pin, setPin] = useState('')
    const [confirmPin, setConfirmPin] = useState('')

    useEffect(() => {
        if (isOpen) {
            setPin('')
            setConfirmPin('')

            if (mode === 'change') {
                setStep('verify_old')
            } else if (!isPinSet || mode === 'set') {
                setStep('set')
            } else {
                setStep('enter')
            }
        }
    }, [isOpen, isPinSet, mode])

    // Refactoring state for clarity
    const [tempNewPin, setTempNewPin] = useState('')

    const handleConfirm = () => {
        if (step === 'enter' || step === 'verify_old') {
            if (verifyPin(pin)) {
                if (step === 'verify_old') {
                    setStep('set')
                    setPin('')
                } else {
                    onSuccess()
                    onClose()
                }
            } else {
                toast.error("Incorrect PIN")
                setPin('')
            }
        } else if (step === 'set') {
            if (pin.length < 4) {
                toast.error("PIN must be 4 digits")
                return
            }
            setTempNewPin(pin)
            setPin('')
            setStep('confirm')
        } else if (step === 'confirm') {
            if (pin === tempNewPin) {
                setWalletPin(pin)
                onSuccess()
                onClose()
            } else {
                toast.error("PINs do not match")
                setPin('')
                setStep('set') // Go back to set to try again
            }
        }
    }

    const getTitle = () => {
        switch (step) {
            case 'enter': return "Enter Wallet PIN"
            case 'verify_old': return "Verify Current PIN"
            case 'set': return "Set New Wallet PIN"
            case 'confirm': return "Confirm New PIN"
        }
    }

    const getDescription = () => {
        switch (step) {
            case 'enter': return "Enter your secure PIN to authorize this transaction."
            case 'verify_old': return "Enter your current PIN to continue."
            case 'set': return "Create a secure 4-digit PIN."
            case 'confirm': return "Re-enter your new PIN to confirm."
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
                <div className="space-y-6 py-4 flex flex-col items-center">
                    <Input
                        type="password"
                        maxLength={4}
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        className="text-center text-2xl tracking-[1em] h-14 w-full max-w-[200px] border-gold/30 focus:border-gold"
                        placeholder="••••"
                    />

                    <Button
                        className="w-full bg-gradient-gold text-black hover:opacity-90"
                        onClick={handleConfirm}
                        disabled={pin.length < 4}
                    >
                        {step === 'enter' || step === 'verify_old' ? 'Verify' : step === 'set' ? 'Next' : 'Confirm'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
