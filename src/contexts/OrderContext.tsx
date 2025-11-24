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
    status: 'Processing' | 'Shipped' | 'Delivered'
}

interface OrderContextType {
    orders: Order[]
    addOrder: (items: OrderItem[], total: number) => void
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

export function OrderProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth()
    const [orders, setOrders] = useState<Order[]>([])

    // Load orders from local storage on mount
    useEffect(() => {
        if (user) {
            const savedOrders = localStorage.getItem(`orders_${user.id}`)
            if (savedOrders) {
                setOrders(JSON.parse(savedOrders))
            } else {
                setOrders([])
            }
        } else {
            setOrders([])
        }
    }, [user])

    const addOrder = (items: OrderItem[], total: number) => {
        if (!user) return

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
            status: 'Processing'
        }

        const updatedOrders = [newOrder, ...orders]
        setOrders(updatedOrders)
        localStorage.setItem(`orders_${user.id}`, JSON.stringify(updatedOrders))
    }

    return (
        <OrderContext.Provider value={{ orders, addOrder }}>
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
