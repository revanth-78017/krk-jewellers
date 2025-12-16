import { createContext, useContext, useState, ReactNode } from 'react'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

export interface SavedDesign {
    id?: string
    userId: string
    prompt: string
    imageUrl: string
    seed: number
    jewelryType: string
    material: string
    gemstone: string
    isPaid?: boolean
    createdAt: any
}

interface DesignContextType {
    saveDesign: (design: Omit<SavedDesign, 'id' | 'userId' | 'createdAt'>) => Promise<boolean>
    loading: boolean
}

const DesignContext = createContext<DesignContextType | undefined>(undefined)

export function DesignProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)

    const saveDesign = async (designData: Omit<SavedDesign, 'id' | 'userId' | 'createdAt'>) => {
        if (!user) {
            toast.error("You must be logged in to save designs")
            return false
        }

        setLoading(true)
        try {
            await addDoc(collection(db, 'users', user.id, 'designs'), {
                ...designData,
                userId: user.id,
                createdAt: serverTimestamp()
            })
            toast.success("Design saved to your account successfully!")
            return true
        } catch (error) {
            console.error("Error saving design:", error)
            toast.error("Failed to save design")
            return false
        } finally {
            setLoading(false)
        }
    }

    return (
        <DesignContext.Provider value={{ saveDesign, loading }}>
            {children}
        </DesignContext.Provider>
    )
}

export function useDesign() {
    const context = useContext(DesignContext)
    if (context === undefined) {
        throw new Error('useDesign must be used within a DesignProvider')
    }
    return context
}
