import { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Product, useProducts } from './ProductContext'
import { useAuth } from '@/hooks/useAuth'
import { db } from '@/lib/firebase'
import { collection, doc, onSnapshot, setDoc, deleteDoc, writeBatch } from 'firebase/firestore'

export interface CartItem extends Product {
    quantity: number
    appliedDiscount?: number
}

interface CartContextType {
    cart: CartItem[]
    addToCart: (product: Product) => Promise<void>
    removeFromCart: (productId: string) => Promise<void>
    clearCart: () => Promise<void>
    applyPromoCode: (code: string) => Promise<void>
    total: number
    subtotal: number
    discountTotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const { products } = useProducts()
    const { user } = useAuth()
    const [cart, setCart] = useState<CartItem[]>([])

    // Sync cart from Firestore
    useEffect(() => {
        if (user) {
            const cartRef = collection(db, 'users', user.id, 'cart')
            const unsubscribe = onSnapshot(cartRef, (snapshot) => {
                const items: CartItem[] = []
                snapshot.forEach((doc) => {
                    const data = doc.data()
                    // Find product details from products context to keep info fresh
                    const product = products.find(p => p.id === doc.id)
                    if (product) {
                        items.push({
                            ...product,
                            quantity: data.quantity,
                            appliedDiscount: data.appliedDiscount
                        })
                    }
                })
                setCart(items)
            })
            return () => unsubscribe()
        } else {
            setCart([])
        }
    }, [user, products])

    const addToCart = async (product: Product) => {
        if (!user) {
            toast.error("Please sign in to add items to cart")
            return
        }

        const existingItem = cart.find(item => item.id === product.id)
        const newQuantity = existingItem ? existingItem.quantity + 1 : 1

        try {
            await setDoc(doc(db, 'users', user.id, 'cart', product.id), {
                quantity: newQuantity,
                appliedDiscount: existingItem?.appliedDiscount || null
            }, { merge: true })

            toast.success(existingItem ? 'Item quantity updated!' : 'Added to cart!')
        } catch (error) {
            console.error("Error adding to cart:", error)
            toast.error("Failed to add item")
        }
    }

    const removeFromCart = async (productId: string) => {
        if (!user) return
        try {
            await deleteDoc(doc(db, 'users', user.id, 'cart', productId))
            toast.success('Removed from cart')
        } catch (error) {
            console.error("Error removing from cart:", error)
            toast.error("Failed to remove item")
        }
    }

    const clearCart = async () => {
        if (!user) return
        try {
            const batch = writeBatch(db)
            cart.forEach(item => {
                const ref = doc(db, 'users', user.id, 'cart', item.id)
                batch.delete(ref)
            })
            await batch.commit()
            toast.success('Cart cleared')
        } catch (error) {
            console.error("Error clearing cart:", error)
            toast.error("Failed to clear cart")
        }
    }

    const applyPromoCode = async (code: string) => {
        if (!user) return

        let applied = false
        const batch = writeBatch(db)

        cart.forEach(item => {
            if (item.promoCode === code && item.discount) {
                applied = true
                const ref = doc(db, 'users', user.id, 'cart', item.id)
                batch.update(ref, { appliedDiscount: item.discount })
            }
        })

        if (applied) {
            try {
                await batch.commit()
                toast.success('Promo code applied!')
            } catch (error) {
                console.error("Error applying promo code:", error)
                toast.error("Failed to apply promo code")
            }
        } else {
            toast.error('Invalid promo code')
        }
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    const discountTotal = cart.reduce((sum, item) => {
        if (item.appliedDiscount) {
            return sum + (item.price * item.quantity * (item.appliedDiscount / 100))
        }
        return sum
    }, 0)

    const total = subtotal - discountTotal

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            clearCart,
            applyPromoCode,
            total,
            subtotal,
            discountTotal
        }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
