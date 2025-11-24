import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useUser, useClerk, useSession } from '@clerk/clerk-react'

export interface User {
    id: string
    email: string
    display_name?: string
    phone_number?: string
    role?: 'admin' | 'user'
}

interface AuthContextType {
    user: User | null
    session: any
    signOut: () => Promise<void>
    loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const { user: clerkUser, isLoaded: isUserLoaded } = useUser()
    const { session } = useSession()
    const { signOut } = useClerk()
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (isUserLoaded) {
            if (clerkUser) {
                const email = clerkUser.primaryEmailAddress?.emailAddress || ''
                const mappedUser: User = {
                    id: clerkUser.id,
                    email: email,
                    display_name: clerkUser.fullName || '',
                    phone_number: clerkUser.primaryPhoneNumber?.phoneNumber,
                    role: email === 'revanthkumar3747@gmail.com' ? 'admin' : (clerkUser.publicMetadata.role as 'admin' | 'user') || 'user'
                }
                setUser(mappedUser)
            } else {
                setUser(null)
            }
            setLoading(false)
        }
    }, [isUserLoaded, clerkUser])

    const handleSignOut = async () => {
        await signOut()
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, session, signOut: handleSignOut, loading }}>
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
