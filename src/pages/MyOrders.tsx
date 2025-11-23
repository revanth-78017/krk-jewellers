import { useOrders } from '@/contexts/OrderContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { ShoppingBag, Package, Clock } from 'lucide-react'

export default function MyOrders() {
    const { orders } = useOrders()

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
                    {orders.map(order => (
                        <Card key={order.id} className="border-gold/20 overflow-hidden">
                            <CardHeader className="bg-muted/30 border-b border-gold/10 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="font-playfair text-lg">Order #{order.id}</CardTitle>
                                    <p className="text-sm text-muted-foreground flex items-center mt-1">
                                        <Clock className="w-3 h-3 mr-1" /> {order.date}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-primary">₹{order.total.toLocaleString()}</div>
                                    <div className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded mt-1 inline-block">
                                        {order.status}
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
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
