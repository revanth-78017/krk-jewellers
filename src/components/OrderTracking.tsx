import { Check, Truck, Home } from 'lucide-react'
import { Order } from '@/contexts/OrderContext'

interface OrderTrackingProps {
    order: Order
}

export default function OrderTracking({ order }: OrderTrackingProps) {
    const steps = [
        {
            id: 'confirmed',
            label: 'Order Confirmed',
            icon: Check,
            description: 'Your order has been confirmed',
            completed: true
        },
        {
            id: 'dispatched',
            label: 'Dispatched',
            icon: Truck,
            description: 'Your order is on the way',
            completed: order.status === 'Shipped' || order.status === 'Delivered'
        },
        {
            id: 'delivered',
            label: 'Delivered',
            icon: Home,
            description: 'Order delivered successfully',
            completed: order.status === 'Delivered'
        }
    ]

    return (
        <div className="w-full py-6">
            <h3 className="text-lg font-bold mb-6">Track Your Order</h3>

            <div className="relative">
                {/* Progress Line */}
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-muted" />

                {/* Active Progress Line */}
                <div
                    className="absolute left-6 top-6 w-0.5 bg-primary transition-all duration-500"
                    style={{
                        height: order.status === 'Processing' ? '0%' :
                            order.status === 'Shipped' ? '50%' : '100%'
                    }}
                />

                <div className="space-y-8 relative">
                    {steps.map((step, index) => {
                        const Icon = step.icon
                        const isActive =
                            (index === 0 && order.status === 'Processing') ||
                            (index === 1 && order.status === 'Shipped') ||
                            (index === 2 && order.status === 'Delivered')

                        return (
                            <div key={step.id} className="flex items-start gap-4">
                                <div
                                    className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300
                                        ${step.completed
                                            ? 'bg-primary border-primary text-white'
                                            : isActive
                                                ? 'bg-white border-primary text-primary animate-pulse'
                                                : 'bg-white border-muted text-muted-foreground'
                                        }
                                    `}
                                >
                                    <Icon className="w-6 h-6" />
                                </div>

                                <div className="flex-1 pt-2">
                                    <h4 className={`font-bold ${step.completed || isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                                        {step.label}
                                    </h4>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {step.description}
                                    </p>
                                    {isActive && (
                                        <span className="inline-block mt-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                            Current Status
                                        </span>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
