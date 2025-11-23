import { SignIn, SignUp, useUser } from '@clerk/clerk-react'
import { useState } from 'react'
import { Navigate } from 'react-router-dom'

export default function Auth() {
    const { isSignedIn } = useUser()
    const [isSignUp, setIsSignUp] = useState(false)

    if (isSignedIn) {
        return <Navigate to="/" replace />
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background to-muted/30">
            <div className="w-full max-w-md flex flex-col items-center">
                {isSignUp ? (
                    <SignUp />
                ) : (
                    <SignIn />
                )}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {isSignUp
                            ? 'Already have an account? Sign in'
                            : "Don't have an account? Sign up"}
                    </button>
                </div>
            </div>
        </div>
    )
}
