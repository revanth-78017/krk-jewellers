import { useOrders } from '@/contexts/OrderContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { ShoppingBag, Clock, Download, Truck, ChevronDown, ChevronUp } from 'lucide-react'
import { generateInvoice } from '@/utils/invoiceGenerator'
import { useAuth } from '@/hooks/useAuth'
import OrderTracking from '@/components/OrderTracking'
import { useState } from 'react'

export default function MyOrders() {
    const { orders } = useOrders()
    const { user } = useAuth()
    const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set())

    const toggleOrderExpansion = (orderId: string) => {
        setExpandedOrders(prev => {
            const newSet = new Set(prev)
            if (newSet.has(orderId)) {
                newSet.delete(orderId)
            } else {
                newSet.add(orderId)
            }
            return newSet
        })
    }

    const handleDownloadInvoice = (order: typeof orders[0]) => {
        if (!user) return

        const subtotal = order.total / 1.03 // Reverse calculate subtotal (assuming 3% tax)
        const tax = order.total - subtotal

        generateInvoice({
            invoiceNumber: order.invoiceNumber,
            orderDate: order.date,
            estimatedDelivery: order.estimatedDelivery,
            customerName: user.display_name || 'Valued Customer',
            customerEmail: user.email || '',
            items: order.items,
            subtotal: Math.round(subtotal),
            tax: Math.round(tax),
            total: order.total
        })
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
                <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-playfair font-bold mb-2">No orders yet</h2>
                <p className="text-muted-foreground mb-6">You haven't placed any orders yet.</p>
                <Button asChild className="bg-gradient-gold text-black hover:opacity-90">
                    <Link to="/gallery">Start Shopping</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen py-12 px-4 bg-background">
            <div className="container mx-auto max-w-4xl">
                <h1 className="text-4xl font-playfair font-bold mb-8 text-gradient-gold">My Orders</h1>

                <div className="space-y-6">
                    {orders.map(order => {
                        const isExpanded = expandedOrders.has(order.id)

                        return (
                            <Card key={order.id} className="border-gold/20 overflow-hidden">
                                <CardHeader className="bg-muted/30 border-b border-gold/10">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div>
                                            <CardTitle className="font-playfair text-lg">Order #{order.id}</CardTitle>
                                            <div className="flex flex-col gap-1 mt-2">
                                                <p className="text-sm text-muted-foreground flex items-center">
                                                    <Clock className="w-3 h-3 mr-1" /> Ordered: {order.date}
                                                </p>
                                                <p className="text-sm text-muted-foreground flex items-center">
                                                    <Truck className="w-3 h-3 mr-1" /> Est. Delivery: {order.estimatedDelivery}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col md:items-end gap-2">
                                            <div className="font-bold text-primary text-xl">₹{order.total.toLocaleString()}</div>
                                            <div className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded inline-block">
                                                {order.status}
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-gold/50 hover:bg-gold/10"
                                                    onClick={() => handleDownloadInvoice(order)}
                                                >
                                                    <Download className="w-4 h-4 mr-2" />
                                                    Invoice
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-primary/50 hover:bg-primary/10"
                                                    onClick={() => toggleOrderExpansion(order.id)}
                                                >
                                                    {isExpanded ? (
                                                        <>
                                                            <ChevronUp className="w-4 h-4 mr-2" />
                                                            Hide
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ChevronDown className="w-4 h-4 mr-2" />
                                                            Track
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <div className="space-y-4">
                                        {order.items.map(item => (
                                            <div key={item.id} className="flex items-center gap-4">
                                                <div className="w-16 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-medium">{item.name}</h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {isExpanded && (
                                        <div className="mt-6 pt-6 border-t border-border">
                                            <OrderTracking order={order} />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
