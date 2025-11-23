import { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'

export interface Product {
    id: string
    name: string
    description: string
    price: number
    image: string
    category: string
    promoCode?: string
    discount?: number // Percentage (0-100)
}

interface ProductContextType {
    products: Product[]
    addProduct: (product: Omit<Product, 'id'>) => void
    deleteProduct: (id: string) => void
}

const ProductContext = createContext<ProductContextType | undefined>(undefined)

export function ProductProvider({ children }: { children: React.ReactNode }) {
    const [products, setProducts] = useState<Product[]>([])

    useEffect(() => {
        const storedProducts = localStorage.getItem('krk_products')
        if (storedProducts) {
            setProducts(JSON.parse(storedProducts))
        } else {
            // Seed initial products if empty
            const initialProducts: Product[] = [
                {
                    id: '1',
                    name: 'Royal Diamond Necklace',
                    description: 'Exquisite diamond necklace suitable for royalty.',
                    price: 12000,
                    image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=1974&auto=format&fit=crop',
                    category: 'Necklaces'
                },
                {
                    id: '2',
                    name: 'Gold Bridal Ring',
                    description: '24k Gold ring with intricate design.',
                    price: 8500,
                    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=2070&auto=format&fit=crop',
                    category: 'Rings'
                },
                {
                    id: '3',
                    name: 'Vintage Pearl Earrings',
                    description: 'Classic pearl earrings with a vintage touch.',
                    price: 4500,
                    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1974&auto=format&fit=crop',
                    category: 'Earrings'
                }
            ]
            setProducts(initialProducts)
            localStorage.setItem('krk_products', JSON.stringify(initialProducts))
        }
    }, [])

    const addProduct = (product: Omit<Product, 'id'>) => {
        const newProduct = { ...product, id: Math.random().toString(36).substr(2, 9) }
        setProducts(prev => {
            const updated = [...prev, newProduct]
            localStorage.setItem('krk_products', JSON.stringify(updated))
            return updated
        })
        toast.success('Product added successfully!')
    }

    const deleteProduct = (id: string) => {
        setProducts(prev => {
            const updated = prev.filter(p => p.id !== id)
            localStorage.setItem('krk_products', JSON.stringify(updated))
            return updated
        })
        toast.success('Product deleted successfully!')
    }

    return (
        <ProductContext.Provider value={{ products, addProduct, deleteProduct }}>
            {children}
        </ProductContext.Provider>
    )
}

export function useProducts() {
    const context = useContext(ProductContext)
    if (context === undefined) {
        throw new Error('useProducts must be used within a ProductProvider')
    }
    return context
}
