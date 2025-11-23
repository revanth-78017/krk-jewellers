import { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Product } from './ProductContext'

export interface CartItem extends Product {
    quantity: number
    appliedDiscount?: number
}

interface CartContextType {
    cart: CartItem[]
    addToCart: (product: Product) => void
    removeFromCart: (productId: string) => void
    clearCart: () => void
    applyPromoCode: (code: string) => void
    total: number
    subtotal: number
    discountTotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([])

    useEffect(() => {
        const storedCart = localStorage.getItem('krk_cart')
        if (storedCart) {
            setCart(JSON.parse(storedCart))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('krk_cart', JSON.stringify(cart))
    }, [cart])

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id)
            if (existing) {
                toast.success('Item quantity updated!')
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }
            toast.success('Added to cart!')
            return [...prev, { ...product, quantity: 1 }]
        })
    }

    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(item => item.id !== productId))
        toast.success('Removed from cart')
    }

    const clearCart = () => {
        setCart([])
        toast.success('Cart cleared')
    }

    const applyPromoCode = (code: string) => {
        let applied = false
        const updatedCart = cart.map(item => {
            if (item.promoCode === code && item.discount) {
                applied = true
                return { ...item, appliedDiscount: item.discount }
            }
            return item
        })

        if (applied) {
            setCart(updatedCart)
            toast.success('Promo code applied!')
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
