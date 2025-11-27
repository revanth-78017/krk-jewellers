import { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { db } from '@/lib/firebase'
import { collection, onSnapshot, addDoc, deleteDoc, doc, writeBatch } from 'firebase/firestore'

export interface Product {
    id: string
    name: string
    description: string
    price: number
    image: string
    category: string
    promoCode?: string
    discount?: number // Percentage (0-100)
    weight?: string
    material?: string
    stoneWeight?: string
    makingCharges?: number
    gst?: number
}

interface ProductContextType {
    products: Product[]
    addProduct: (product: Omit<Product, 'id'>) => Promise<void>
    deleteProduct: (id: string) => Promise<void>
    getProduct: (id: string) => Product | undefined
}

const ProductContext = createContext<ProductContextType | undefined>(undefined)

export function ProductProvider({ children }: { children: React.ReactNode }) {
    const [products, setProducts] = useState<Product[]>([])

    useEffect(() => {
        console.log("Setting up Firestore listener for 'products'...")
        const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
            console.log(`Firestore update: ${snapshot.size} products found`)
            const items: Product[] = []
            snapshot.forEach((doc) => {
                items.push({ id: doc.id, ...doc.data() } as Product)
            })
            setProducts(items)

            // Seed initial products if empty
            if (snapshot.empty) {
                console.log("Products collection is empty. Seeding initial data...")
                seedInitialProducts()
            }
        }, (error) => {
            console.error("Firestore listener error:", error)
            toast.error(`Failed to load products: ${error.message}`)
        })
        return () => unsubscribe()
    }, [])

    const seedInitialProducts = async () => {
        const initialProducts: Omit<Product, 'id'>[] = [
            {
                name: 'Royal Diamond Necklace',
                description: 'Exquisite diamond necklace suitable for royalty.',
                price: 145000,
                image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=1974&auto=format&fit=crop',
                category: 'Necklaces',
                weight: '25.5g',
                material: '18KT Gold',
                stoneWeight: '2.5 ct',
                makingCharges: 15000,
                gst: 4350
            },
            {
                name: 'Gold Bridal Ring',
                description: '24k Gold ring with intricate design.',
                price: 45000,
                image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=2070&auto=format&fit=crop',
                category: 'Rings',
                weight: '8.2g',
                material: '24KT Gold',
                stoneWeight: '0 ct',
                makingCharges: 4000,
                gst: 1350
            },
            {
                name: 'Vintage Pearl Earrings',
                description: 'Classic pearl earrings with a vintage touch.',
                price: 12500,
                image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1974&auto=format&fit=crop',
                category: 'Earrings',
                weight: '4.5g',
                material: '18KT Gold',
                stoneWeight: 'Pearl',
                makingCharges: 2000,
                gst: 375
            }
        ]

        try {
            const batch = writeBatch(db)
            initialProducts.forEach(p => {
                const ref = doc(collection(db, 'products'))
                batch.set(ref, p)
            })
            await batch.commit()
            console.log("Seeded initial products to Firestore")
        } catch (error) {
            console.error("Error seeding products:", error)
        }
    }

    const addProduct = async (product: Omit<Product, 'id'>) => {
        try {
            await addDoc(collection(db, 'products'), product)
            toast.success('Product added successfully!')
        } catch (error) {
            console.error("Error adding product:", error)
            toast.error("Failed to add product")
        }
    }

    const deleteProduct = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'products', id))
            toast.success('Product deleted successfully!')
        } catch (error) {
            console.error("Error deleting product:", error)
            toast.error("Failed to delete product")
        }
    }

    const getProduct = (id: string) => products.find(p => p.id === id)

    return (
        <ProductContext.Provider value={{ products, addProduct, deleteProduct, getProduct }}>
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
