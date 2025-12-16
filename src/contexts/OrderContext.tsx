import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { db } from '@/lib/firebase'
import { collection, doc, onSnapshot, setDoc, query, where, orderBy } from 'firebase/firestore'
import { toast } from 'sonner'

export interface OrderItem {
    id: string
    name: string
    price: number
    image: string
    quantity: number
}

export interface Address {
    fullName: string
    street: string
    city: string
    state: string
    zipCode: string
    phone: string
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
    shippingAddress: Address
}

interface OrderContextType {
    orders: Order[]
    addOrder: (items: OrderItem[], total: number, shippingAddress: Address) => Promise<Order | null>
    updateStatus: (orderId: string, status: Order['status']) => Promise<void>
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

export function OrderProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth()
    const [orders, setOrders] = useState<Order[]>([])

    // Sync orders from Firestore
    useEffect(() => {
        if (!user) {
            setOrders([])
            return
        }

        let q;
        const ordersRef = collection(db, 'orders')

        if (user.role === 'admin') {
            // Admin sees ALL orders, ordered by timestamp desc
            q = query(ordersRef, orderBy('orderTimestamp', 'desc'))
        } else {
            // Regular user sees only THEIR orders
            q = query(ordersRef, where('userId', '==', user.id), orderBy('orderTimestamp', 'desc'))
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedOrders: Order[] = []
            snapshot.forEach((doc) => {
                fetchedOrders.push(doc.data() as Order)
            })
            setOrders(fetchedOrders)
        }, (error) => {
            console.error("Error fetching orders:", error)
            // Fallback for index errors (if composite index missing)
            if (error.code === 'failed-precondition') {
                console.warn("Missing index, falling back to client-side filtering")
                // Simplified query without ordering if index fails
                const simpleQ = user.role === 'admin'
                    ? query(ordersRef)
                    : query(ordersRef, where('userId', '==', user.id))

                onSnapshot(simpleQ, (snap) => {
                    const items: Order[] = []
                    snap.forEach(d => items.push(d.data() as Order))
                    // Sort client-side
                    setOrders(items.sort((a, b) => b.orderTimestamp - a.orderTimestamp))
                })
            }
        })

        return () => unsubscribe()
    }, [user])

    const addOrder = async (items: OrderItem[], total: number, shippingAddress: Address): Promise<Order | null> => {
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
            userEmail: user.email,
            shippingAddress
        }

        try {
            await setDoc(doc(db, 'orders', orderId), newOrder)
            return newOrder
        } catch (error) {
            console.error("Error creating order:", error)
            toast.error("Failed to create order")
            return null
        }
    }

    const updateStatus = async (orderId: string, status: Order['status']) => {
        try {
            await setDoc(doc(db, 'orders', orderId), { status }, { merge: true })
            toast.success(`Order status updated to ${status}`)
        } catch (error) {
            console.error("Error updating status:", error)
            toast.error("Failed to update status")
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
