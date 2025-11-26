import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'

export interface OrderItem {
    id: string
    name: string
    price: number
    image: string
    quantity: number
}

export interface Order {
    id: string
    invoiceNumber: string
    date: string
    orderTimestamp: number
    estimatedDelivery: string
    total: number
    items: OrderItem[]
    status: 'Paid' | 'Processing' | 'Shipped' | 'Delivered'
    userId: string
    userEmail: string
}

interface OrderContextType {
    orders: Order[]
    addOrder: (items: OrderItem[], total: number) => Order | null
    updateStatus: (orderId: string, status: Order['status']) => void
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

export function OrderProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth()
    const [orders, setOrders] = useState<Order[]>([])

    // Load orders from global local storage on mount and when user changes
    useEffect(() => {
        const loadOrders = () => {
            const savedOrdersStr = localStorage.getItem('krk_all_orders')
            let allOrders: Order[] = []
            if (savedOrdersStr) {
                try {
                    allOrders = JSON.parse(savedOrdersStr)
                } catch (e) {
                    console.error("Failed to parse orders", e)
                }
            }

            if (user?.role === 'admin') {
                // Admin sees ALL orders
                setOrders(allOrders)
            } else if (user) {
                // Regular user sees only THEIR orders
                setOrders(allOrders.filter(order => order.userId === user.id))
            } else {
                setOrders([])
            }
        }

        loadOrders()

        // Listen for storage events to update in real-time (optional but good for multi-tab)
        window.addEventListener('storage', loadOrders)
        return () => window.removeEventListener('storage', loadOrders)
    }, [user])

    const addOrder = (items: OrderItem[], total: number): Order | null => {
        if (!user) return null

        const orderTimestamp = Date.now()
        const orderDate = new Date(orderTimestamp)
        const deliveryDate = new Date(orderTimestamp + 7 * 24 * 60 * 60 * 1000) // 7 days later

        const orderId = Math.random().toString(36).substring(2, 11).toUpperCase()
        const invoiceNumber = `INV-${orderId}`

        const newOrder: Order = {
            id: orderId,
            invoiceNumber,
            date: orderDate.toLocaleDateString(),
            orderTimestamp,
            estimatedDelivery: deliveryDate.toLocaleDateString(),
            total,
            items,
            status: 'Paid',
            userId: user.id,
            userEmail: user.email
        }

        // Get existing global orders
        const savedOrdersStr = localStorage.getItem('krk_all_orders')
        let allOrders: Order[] = []
        if (savedOrdersStr) {
            try {
                allOrders = JSON.parse(savedOrdersStr)
            } catch (e) { console.error(e) }
        }

        // Add new order to global list
        const updatedAllOrders = [newOrder, ...allOrders]
        localStorage.setItem('krk_all_orders', JSON.stringify(updatedAllOrders))

        // Update local state
        if (user.role === 'admin') {
            setOrders(updatedAllOrders)
        } else {
            setOrders(prev => [newOrder, ...prev])
        }

        return newOrder
    }

    const updateStatus = (orderId: string, status: Order['status']) => {
        // Get existing global orders
        const savedOrdersStr = localStorage.getItem('krk_all_orders')
        let allOrders: Order[] = []
        if (savedOrdersStr) {
            try {
                allOrders = JSON.parse(savedOrdersStr)
            } catch (e) { console.error(e) }
        }

        // Update status in global list
        const updatedAllOrders = allOrders.map(order =>
            order.id === orderId ? { ...order, status } : order
        )
        localStorage.setItem('krk_all_orders', JSON.stringify(updatedAllOrders))

        // Update local state
        if (user?.role === 'admin') {
            setOrders(updatedAllOrders)
        } else {
            setOrders(prev => prev.map(order =>
                order.id === orderId ? { ...order, status } : order
            ))
        }
    }

    return (
        <OrderContext.Provider value={{ orders, addOrder, updateStatus }}>
            {children}
        </OrderContext.Provider>
    )
}

export function useOrders() {
    const context = useContext(OrderContext)
    if (context === undefined) {
        throw new Error('useOrders must be used within an OrderProvider')
    }
    return context
}
