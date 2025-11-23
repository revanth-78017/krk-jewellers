import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useRazorpay } from '@/hooks/useRazorpay'
import { useAuth } from '@/hooks/useAuth'

export default function Cart() {
    const { cart, removeFromCart, applyPromoCode, total, subtotal, discountTotal } = useCart()
    const { user } = useAuth()
    const { initializePayment, loading } = useRazorpay()
    const [promoInput, setPromoInput] = useState('')
    const navigate = useNavigate()

    const handleCheckout = () => {
        if (!user) {
            navigate('/auth')
            return
        }

        initializePayment({
            key: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
            amount: total * 100, // Amount in paise
            currency: 'INR',
            name: 'KRK Jewellers',
            description: 'Purchase from KRK Jewellers',
            image: '/favicon.ico',
            handler: (response) => {
                console.log(response)
                // Handle success (e.g., save order to DB, clear cart)
                navigate('/success')
            },
            prefill: {
                name: user.display_name,
                email: user.email,
                contact: user.phone_number
            },
            theme: {
                color: '#D4AF37'
            }
        })
    }

    const handleApplyPromo = () => {
        if (!promoInput.trim()) return
        applyPromoCode(promoInput)
        setPromoInput('')
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
                <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-playfair font-bold mb-2">Your cart is empty</h2>
                <p className="text-muted-foreground mb-6">Looks like you haven't added any exquisite pieces yet.</p>
                <Button asChild className="bg-gradient-gold text-black hover:opacity-90">
                    <Link to="/gallery">Browse Collection</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen py-12 px-4 bg-background">
            <div className="container mx-auto max-w-4xl">
                <h1 className="text-4xl font-playfair font-bold mb-8 text-gradient-gold">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map(item => (
                            <Card key={item.id} className="flex flex-col sm:flex-row overflow-hidden border-gold/20">
                                <div className="w-full sm:w-32 h-32 bg-muted">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <CardContent className="flex-1 p-4 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-playfair font-bold text-lg">{item.name}</h3>
                                            <p className="text-sm text-muted-foreground">{item.category}</p>
                                            {item.appliedDiscount && (
                                                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded mt-1 inline-block">
                                                    {item.appliedDiscount}% Off Applied
                                                </span>
                                            )}
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive/90"
                                            onClick={() => removeFromCart(item.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <div className="flex justify-between items-end mt-4">
                                        <div className="text-sm text-muted-foreground">
                                            Qty: {item.quantity}
                                        </div>
                                        <div className="text-right">
                                            {item.appliedDiscount ? (
                                                <>
                                                    <div className="text-sm text-muted-foreground line-through">
                                                        ₹{(item.price * item.quantity).toLocaleString()}
                                                    </div>
                                                    <div className="font-bold text-lg text-primary">
                                                        ₹{(item.price * item.quantity * (1 - item.appliedDiscount / 100)).toLocaleString()}
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="font-bold text-lg">
                                                    ₹{(item.price * item.quantity).toLocaleString()}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        {/* Promo Code Input */}
                        <Card className="border-gold/20">
                            <CardContent className="p-4">
                                <label className="text-sm font-medium mb-2 block">Have a promo code?</label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Enter code"
                                        value={promoInput}
                                        onChange={(e) => setPromoInput(e.target.value)}
                                    />
                                    <Button variant="outline" onClick={handleApplyPromo}>
                                        <Tag className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Order Summary */}
                        <Card className="sticky top-24 border-gold/20 shadow-elegant">
                            <CardContent className="p-6 space-y-4">
                                <h3 className="font-playfair font-bold text-xl mb-4">Order Summary</h3>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toLocaleString()}</span>
                                </div>
                                {discountTotal > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount</span>
                                        <span>-₹{discountTotal.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="border-t border-border pt-4 flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span className="text-primary">₹{total.toLocaleString()}</span>
                                </div>
                                <Button
                                    className="w-full bg-gradient-gold text-black hover:opacity-90 mt-6"
                                    onClick={handleCheckout}
                                    disabled={loading}
                                >
                                    {loading ? 'Processing...' : 'Checkout'} <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
