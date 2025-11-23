import { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/integrations/supabase/client'
import { Session, User as SupabaseUser } from '@supabase/supabase-js'

// Mock User Interface
export interface User {
    id: string
    email: string
    display_name?: string
    phone_number?: string
    role?: 'admin' | 'user'
}

interface AuthContextType {
    user: User | null
    session: Session | null
    signIn: (email: string, password: string) => Promise<{ role?: 'admin' | 'user' }>
    signUp: (email: string, password: string, displayName?: string, phoneNumber?: string) => Promise<void>
    signInWithGoogle: () => Promise<void>
    signOut: () => Promise<void>
    loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            if (session?.user) {
                mapSupabaseUser(session.user)
            } else {
                setLoading(false)
            }
        })

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            if (session?.user) {
                mapSupabaseUser(session.user)
            } else {
                setUser(null)
                setLoading(false)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    const mapSupabaseUser = (supabaseUser: SupabaseUser) => {
        const user: User = {
            id: supabaseUser.id,
            email: supabaseUser.email || '',
            display_name: supabaseUser.user_metadata.display_name || supabaseUser.user_metadata.full_name,
            phone_number: supabaseUser.phone,
            role: supabaseUser.user_metadata.role || 'user'
        }
        setUser(user)
        setLoading(false)
    }

    const signIn = async (email: string, password: string) => {
        setLoading(true)
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error

            // Check if admin (this logic might need to be server-side or in user metadata in a real app)
            // For now, we'll assume admin role is stored in metadata or we check specific email
            if (email === 'admin@krk.com') {
                toast.success('Welcome back, Admin!')
                return { role: 'admin' as const }
            }

            toast.success('Signed in successfully!')
            return { role: data.user?.user_metadata?.role || 'user' }
        } catch (error: any) {
            toast.error(error.message || 'Failed to sign in')
            throw error
        } finally {
            setLoading(false)
        }
    }

    const signInWithGoogle = async () => {
        setLoading(true)
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth`
                }
            })
            if (error) throw error
        } catch (error: any) {
            toast.error(error.message || 'Failed to sign in with Google')
            throw error
        } finally {
            setLoading(false)
        }
    }

    const signUp = async (
        email: string,
        password: string,
        displayName?: string,
        phoneNumber?: string
    ) => {
        setLoading(true)
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        display_name: displayName,
                        phone_number: phoneNumber,
                        role: 'user'
                    }
                }
            })

            if (error) throw error

            toast.success('Account created successfully! Please check your email.')
        } catch (error: any) {
            toast.error(error.message || 'Failed to sign up')
            throw error
        } finally {
            setLoading(false)
        }
    }

    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut()
            if (error) throw error
            setUser(null)
            setSession(null)
            toast.success('Signed out successfully!')
        } catch (error: any) {
            toast.error(error.message || 'Failed to sign out')
        }
    }

    return (
        <AuthContext.Provider value={{ user, session, signIn, signUp, signInWithGoogle, signOut, loading }}>
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
