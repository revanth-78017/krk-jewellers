import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

interface AuthContextType {
    user: User | null
    session: Session | null
    signIn: (email: string, password: string) => Promise<void>
    signUp: (email: string, password: string, displayName?: string, phoneNumber?: string) => Promise<void>
    signOut: () => Promise<void>
    loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
        })

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    const signIn = async (email: string, password: string) => {
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })
            if (error) throw error
            toast.success('Signed in successfully!')
            navigate('/')
        } catch (error: any) {
            toast.error(error.message || 'Failed to sign in')
            throw error
        }
    }

    const signUp = async (
        email: string,
        password: string,
        displayName?: string,
        phoneNumber?: string
    ) => {
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        display_name: displayName,
                        phone_number: phoneNumber,
                    },
                    emailRedirectTo: window.location.origin,
                },
            })
            if (error) throw error
            toast.success('Account created! Please check your email to confirm.')
            navigate('/')
        } catch (error: any) {
            toast.error(error.message || 'Failed to sign up')
            throw error
        }
    }

    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut()
            if (error) throw error
            toast.success('Signed out successfully!')
            navigate('/auth')
        } catch (error: any) {
            toast.error(error.message || 'Failed to sign out')
            throw error
        }
    }

    return (
        <AuthContext.Provider value={{ user, session, signIn, signUp, signOut, loading }}>
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
