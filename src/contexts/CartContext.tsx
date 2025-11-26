import { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Product, useProducts } from './ProductContext'
import { useAuth } from '@/hooks/useAuth'

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
    const { products } = useProducts()
    const { user } = useAuth()
    const [cart, setCart] = useState<CartItem[]>([])
    const [isInitialized, setIsInitialized] = useState(false)

    // Hydrate cart from localStorage when products are available and user is logged in
    useEffect(() => {
        if (products.length > 0 && !isInitialized && user) {
            const storedCartStr = localStorage.getItem(`krk_cart_${user.id}`)
            if (storedCartStr) {
                try {
                    const storedItems = JSON.parse(storedCartStr) as { id: string, quantity: number, appliedDiscount?: number }[]
                    const hydratedCart = storedItems.map(item => {
                        const product = products.find(p => p.id === item.id)
                        if (product) {
                            const cartItem: CartItem = {
                                ...product,
                                quantity: item.quantity,
                                appliedDiscount: item.appliedDiscount
                            }
                            return cartItem
                        }
                        return null
                    }).filter((item): item is CartItem => item !== null)

                    setCart(hydratedCart)
                } catch (e) {
                    console.error("Failed to parse cart from storage", e)
                }
            } else {
                setCart([])
            }
            setIsInitialized(true)
        } else if (products.length > 0 && isInitialized) {
            // If products change (e.g. edited in admin), update cart items
            setCart(prev => prev.map(item => {
                const updatedProduct = products.find(p => p.id === item.id)
                if (updatedProduct) {
                    return { ...updatedProduct, quantity: item.quantity, appliedDiscount: item.appliedDiscount }
                }
                return item
            }))
        } else if (!user) {
            setCart([])
            setIsInitialized(false)
        }
    }, [products, isInitialized, user])

    // Persist cart to localStorage (only IDs and metadata)
    useEffect(() => {
        if (isInitialized && user) {
            const simplifiedCart = cart.map(item => ({
                id: item.id,
                quantity: item.quantity,
                appliedDiscount: item.appliedDiscount
            }))
            try {
                localStorage.setItem(`krk_cart_${user.id}`, JSON.stringify(simplifiedCart))
            } catch (e) {
                console.error("Failed to save cart to storage (Quota Exceeded?)", e)
                toast.error("Cart storage full. Some items may not be saved.")
            }
        }
    }, [cart, isInitialized, user])

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
