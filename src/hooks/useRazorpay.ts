import { useState } from 'react'
import { toast } from 'sonner'

interface RazorpayOptions {
    key: string
    amount: number
    currency: string
    name: string
    description: string
    image?: string
    handler: (response: any) => void
    prefill?: {
        name?: string
        email?: string
        contact?: string
    }
    theme?: {
        color: string
    }
}

export const useRazorpay = () => {
    const [loading, setLoading] = useState(false)

    const initializePayment = async (options: RazorpayOptions) => {
        setLoading(true)
        try {
            const Razorpay = (window as any).Razorpay
            if (!Razorpay) {
                throw new Error('Razorpay SDK not loaded')
            }

            const rzp = new Razorpay(options)
            rzp.open()

            rzp.on('payment.failed', function (response: any) {
                toast.error(`Payment Failed: ${response.error.description}`)
                setLoading(false)
            })
        } catch (error: any) {
            toast.error(error.message || 'Payment initialization failed')
            setLoading(false)
        }
    }

    return { initializePayment, loading }
}
