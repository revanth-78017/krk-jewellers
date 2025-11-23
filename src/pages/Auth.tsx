import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Navigate, useNavigate } from 'react-router-dom'

export default function Auth() {
    const { user, signIn, signUp } = useAuth()
    const navigate = useNavigate()
    const [isSignUp, setIsSignUp] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [displayName, setDisplayName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [loading, setLoading] = useState(false)

    if (user) {
        return <Navigate to="/" replace />
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email || !password) {
            toast.error('Please fill in all required fields')
            return
        }

        setLoading(true)
        try {
            if (isSignUp) {
                await signUp(email, password, displayName, phoneNumber)
                navigate('/')
            } else {
                const result = await signIn(email, password)
                if (result.role === 'admin') {
                    navigate('/admin')
                } else {
                    navigate('/')
                }
            }
        } catch (error) {
            // Error is handled in the auth hook
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background to-muted/30">
            <Card className="w-full max-w-md shadow-elegant">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold text-gradient-gold">
                        {isSignUp ? 'Create Account' : 'Welcome Back'}
                    </CardTitle>
                    <CardDescription>
                        {isSignUp
                            ? 'Join KRK Jewellers to start designing'
                            : 'Sign in to your account'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {isSignUp && (
                            <>
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block">
                                        Display Name (Optional)
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="Your name"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block">
                                        Phone Number (Optional)
                                    </label>
                                    <Input
                                        type="tel"
                                        placeholder="+91 XXXXX XXXXX"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                    />
                                </div>
                            </>
                        )}
                        <div>
                            <label className="text-sm font-medium mb-1.5 block">
                                Email *
                            </label>
                            <Input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1.5 block">
                                Password *
                            </label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            type="button"
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {isSignUp
                                ? 'Already have an account? Sign in'
                                : "Don't have an account? Sign up"}
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
