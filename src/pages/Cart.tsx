import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useRazorpay } from '@/hooks/useRazorpay'
import { useAuth } from '@/hooks/useAuth'

import { useOrders } from '@/contexts/OrderContext'

import { toast } from 'sonner'
import emailjs from 'emailjs-com'

export default function Cart() {
    const { cart, removeFromCart, applyPromoCode, total, subtotal, discountTotal, clearCart } = useCart()
    const { user } = useAuth()
    const { addOrder } = useOrders()
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
            handler: async (response) => {
                console.log(response)

                // EmailJS Configuration
                const SERVICE_ID = 'service_oc58tn9'
                const TEMPLATE_ID = 'template_a0iza3s'
                const PUBLIC_KEY = 'DcZjOXOD41nMuQuRI'

                // Save order first to get ID
                const newOrder = addOrder(cart, total)
                if (!newOrder) {
                    console.error('Failed to create order')
                    return
                }

                // Format items for email (Text Version)
                const itemsList = cart.map(item =>
                    `${item.name} (Qty: ${item.quantity}) - ₹${item.price * item.quantity}`
                ).join('\n')

                // Format items for email (HTML Version for rich emails)
                const itemsHtml = `
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background-color: #f8f9fa;">
                                <th style="padding: 10px; border: 1px solid #ddd;">Image</th>
                                <th style="padding: 10px; border: 1px solid #ddd;">Product</th>
                                <th style="padding: 10px; border: 1px solid #ddd;">Qty</th>
                                <th style="padding: 10px; border: 1px solid #ddd;">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${cart.map(item => `
                                <tr>
                                    <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">
                                        <img src="${window.location.origin}${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover;" />
                                    </td>
                                    <td style="padding: 10px; border: 1px solid #ddd;">${item.name}</td>
                                    <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
                                    <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">₹${item.price * item.quantity}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="3" style="padding: 10px; border: 1px solid #ddd; text-align: right; font-weight: bold;">Total:</td>
                                <td style="padding: 10px; border: 1px solid #ddd; text-align: right; font-weight: bold;">₹${total}</td>
                            </tr>
                        </tfoot>
                    </table>
                `

                // Construct payload matching the user's Handlebars template
                const templateOrders = cart.map(item => {
                    let imageUrl = item.image
                    if (!imageUrl.startsWith('data:') && !imageUrl.startsWith('http')) {
                        imageUrl = `${window.location.origin}${imageUrl}`
                    }

                    return {
                        name: item.name,
                        units: item.quantity,
                        price: item.price * item.quantity,
                        image_url: imageUrl
                    }
                })

                const templateCost = {
                    shipping: "0.00",
                    tax: "0.00",
                    total: total
                }

                const orderDetails = {
                    // Standard fields
                    to_name: user.display_name || "Customer",
                    to_email: user.email,
                    email: user.email,

                    // Template-specific fields
                    order_id: newOrder.invoiceNumber,
                    orders: templateOrders, // Array for {{#orders}}
                    cost: templateCost,     // Object for {{cost.total}}

                    // Fallbacks
                    order_items: itemsList,
                    order_html: itemsHtml,
                    message: `Thank you for your order! Total Paid: ₹${total}\n\nItems:\n${itemsList}`,
                    reply_to: "support@krkjewellers.com"
                }

                // Send Email
                try {
                    console.log('Sending email with details:', orderDetails)
                    const emailResponse = await emailjs.send(SERVICE_ID, TEMPLATE_ID, orderDetails, PUBLIC_KEY)
                    console.log('Email sent successfully:', emailResponse.status, emailResponse.text)
                    toast.success('Order confirmation email sent!')
                } catch (emailError: any) {
                    console.error('Email failed to send:', emailError)
                    toast.error('Failed to send email. Check console for details.')
                }

                // Clear cart
                clearCart()
                // Navigate to orders page
                navigate('/orders')
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
