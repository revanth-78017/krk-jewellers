import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

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
    signIn: (email: string, password: string) => Promise<void>
    signUp: (email: string, password: string, displayName?: string, phoneNumber?: string) => Promise<void>
    signOut: () => Promise<void>
    loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        // Check local storage for existing session
        const storedUser = localStorage.getItem('krk_user')
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }
        setLoading(false)
    }, [])

    const signIn = async (email: string, password: string) => {
        setLoading(true)
        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500))

            // Hardcoded Admin Check
            if (email === 'admin@krk.com' && password === 'admin123') {
                const adminUser: User = {
                    id: 'admin-123',
                    email: 'admin@krk.com',
                    display_name: 'Admin',
                    role: 'admin'
                }
                setUser(adminUser)
                localStorage.setItem('krk_user', JSON.stringify(adminUser))
                toast.success('Welcome back, Admin!')
                navigate('/admin')
                return
            }

            // Check for registered users in local storage
            const users = JSON.parse(localStorage.getItem('krk_users') || '[]')
            const foundUser = users.find((u: any) => u.email === email && u.password === password)

            if (foundUser) {
                const { password, ...userWithoutPassword } = foundUser
                setUser(userWithoutPassword)
                localStorage.setItem('krk_user', JSON.stringify(userWithoutPassword))
                toast.success('Signed in successfully!')
                navigate('/')
            } else {
                throw new Error('Invalid email or password')
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to sign in')
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
            await new Promise(resolve => setTimeout(resolve, 500))

            const users = JSON.parse(localStorage.getItem('krk_users') || '[]')

            if (users.some((u: any) => u.email === email)) {
                throw new Error('User already exists')
            }

            const newUser = {
                id: Math.random().toString(36).substr(2, 9),
                email,
                password, // In a real app, never store passwords plainly!
                display_name: displayName,
                phone_number: phoneNumber,
                role: 'user'
            }

            users.push(newUser)
            localStorage.setItem('krk_users', JSON.stringify(users))

            // Auto sign in
            const { password: _, ...userWithoutPassword } = newUser
            setUser(userWithoutPassword)
            localStorage.setItem('krk_user', JSON.stringify(userWithoutPassword))

            toast.success('Account created successfully!')
            navigate('/')
        } catch (error: any) {
            toast.error(error.message || 'Failed to sign up')
            throw error
        } finally {
            setLoading(false)
        }
    }

    const signOut = async () => {
        setUser(null)
        localStorage.removeItem('krk_user')
        toast.success('Signed out successfully!')
        navigate('/auth')
    }

    return (
        <AuthContext.Provider value={{ user, signIn, signUp, signOut, loading }}>
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
