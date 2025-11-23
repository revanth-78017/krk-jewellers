import { useEffect, useState } from 'react'
import { useAuth } from './useAuth'

export function useAdmin() {
    const { user, loading: authLoading } = useAuth()
    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (authLoading) return

        if (user?.role === 'admin') {
            setIsAdmin(true)
        } else {
            setIsAdmin(false)
        }
        setLoading(false)
    }, [user, authLoading])

    return { isAdmin, loading }
}
