import { useEffect, useState } from 'react'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Check } from "lucide-react"

interface SuccessAnimationProps {
    isOpen: boolean
    onClose: () => void
}

export function SuccessAnimation({ isOpen, onClose }: SuccessAnimationProps) {
    const [show, setShow] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setShow(true)
            const timer = setTimeout(() => {
                setShow(false)
                onClose()
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [isOpen, onClose])

    return (
        <Dialog open={isOpen} onOpenChange={() => { }}>
            <DialogContent className="sm:max-w-md bg-transparent border-none shadow-none flex flex-col items-center justify-center min-h-[400px]">
                <div className={`transform transition-all duration-1000 ${show ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
                    <div className="w-32 h-32 rounded-full bg-green-500 flex items-center justify-center animate-bounce shadow-[0_0_50px_rgba(34,197,94,0.5)]">
                        <Check className="w-16 h-16 text-white stroke-[4]" />
                    </div>
                </div>
                <h2 className={`mt-8 text-3xl font-playfair font-bold text-white text-center transform transition-all duration-1000 delay-300 ${show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    Payment Successful!
                </h2>
                <p className={`mt-2 text-white/80 text-center transform transition-all duration-1000 delay-500 ${show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    Your investment has been processed.
                </p>
            </DialogContent>
        </Dialog>
    )
}
