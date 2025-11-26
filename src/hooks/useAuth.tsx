import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth'

export interface User {
    id: string
    email: string
    display_name?: string
    phone_number?: string
    role?: 'admin' | 'user'
    imageUrl?: string
}

interface AuthContextType {
    user: User | null
    signOut: () => Promise<void>
    loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                const email = firebaseUser.email || ''
                const mappedUser: User = {
                    id: firebaseUser.uid,
                    email: email,
                    display_name: firebaseUser.displayName || '',
                    phone_number: firebaseUser.phoneNumber || undefined,
                    role: email === 'revanthkumar3747@gmail.com' ? 'admin' : 'user', // Basic role check
                    imageUrl: firebaseUser.photoURL || undefined
                }
                setUser(mappedUser)
            } else {
                setUser(null)
            }
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const handleSignOut = async () => {
        await firebaseSignOut(auth)
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, signOut: handleSignOut, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
