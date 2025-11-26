import { useUser } from '@clerk/clerk-react'
import { Navigate, useLocation } from 'react-router-dom'
import { ReactNode } from 'react'

interface ProtectedRouteProps {
    children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isSignedIn, isLoaded } = useUser()
    const location = useLocation()

    // Show loading state while checking auth
    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        )
    }

    // Redirect to auth if not signed in
    if (!isSignedIn) {
        return <Navigate to="/auth" replace state={{ from: location }} />
    }

    return <>{children}</>
}
