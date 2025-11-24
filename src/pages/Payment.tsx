import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CreditCard, QrCode, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import emailjs from 'emailjs-com'

export default function Payment() {
    const { total, clearCart } = useCart()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const handlePayment = async () => {
        setLoading(true)

        // EmailJS Configuration
        // REPLACE THESE WITH YOUR ACTUAL KEYS FROM EMAILJS DASHBOARD
        const SERVICE_ID = 'service_gmail' // Example: service_x9...
        const TEMPLATE_ID = 'template_order_confirm' // Example: template_y8...
        const PUBLIC_KEY = 'YOUR_PUBLIC_KEY' // Example: user_z7...

        const orderDetails = {
            to_name: "Customer", // You would typically get this from user input
            order_total: total,
            message: "Your order has been successfully placed!",
            reply_to: "support@krkjewellers.com"
        }

        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000))

            // Send Email
            // Note: This will fail without valid keys, so we wrap in try/catch to not block the flow
            try {
                await emailjs.send(SERVICE_ID, TEMPLATE_ID, orderDetails, PUBLIC_KEY)
                toast.success('Order confirmation email sent!')
            } catch (emailError) {
                console.error('Email failed to send:', emailError)
                // We don't block the success flow if email fails, just log it
                // In production, you might want to handle this differently
            }

            toast.success('Payment successful! Order placed.')
            clearCart()
            navigate('/')
        } catch (error) {
            toast.error('Payment failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (total === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Your cart is empty.</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen py-12 px-4 bg-background">
            <div className="container mx-auto max-w-2xl">
                <h1 className="text-4xl font-playfair font-bold mb-8 text-gradient-gold text-center">Secure Checkout</h1>

                <Card className="border-gold/20 shadow-elegant">
                    <CardHeader>
                        <CardTitle className="text-2xl font-playfair text-center">
                            Total Amount: <span className="text-primary">₹{total.toLocaleString()}</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <Tabs defaultValue="card" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-8">
                                <TabsTrigger value="card">
                                    <CreditCard className="w-4 h-4 mr-2" /> Card
                                </TabsTrigger>
                                <TabsTrigger value="upi">
                                    <QrCode className="w-4 h-4 mr-2" /> UPI
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="card" className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Card Number</label>
                                    <Input placeholder="0000 0000 0000 0000" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Expiry Date</label>
                                        <Input placeholder="MM/YY" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">CVV</label>
                                        <Input placeholder="123" type="password" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Cardholder Name</label>
                                    <Input placeholder="John Doe" />
                                </div>
                                <Button
                                    className="w-full bg-gradient-gold text-black hover:opacity-90 mt-4"
                                    onClick={handlePayment}
                                    disabled={loading}
                                >
                                    {loading ? 'Processing...' : `Pay ₹${total.toLocaleString()}`}
                                </Button>
                            </TabsContent>

                            <TabsContent value="upi" className="space-y-6 text-center">
                                <div className="bg-white p-4 inline-block rounded-lg border border-border">
                                    {/* QR Code with updated UPI ID */}
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`upi://pay?pa=9603299936@ybl&pn=KRK Jewellers&am=${total}&cu=INR`)}`}
                                        alt="UPI QR Code"
                                        className="w-48 h-48"
                                    />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">Scan with any UPI App</p>
                                    <p className="font-mono bg-muted p-2 rounded inline-block">9603299936@ybl</p>
                                </div>
                                <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                                    <CheckCircle className="w-4 h-4" /> Secure Payment
                                </div>
                                <Button
                                    className="w-full bg-gradient-gold text-black hover:opacity-90"
                                    onClick={handlePayment}
                                    disabled={loading}
                                >
                                    {loading ? 'Verifying...' : 'I have paid'}
                                </Button>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
