import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useAdmin } from '@/hooks/useAdmin'
import { useEffect } from 'react'

export default function Admin() {
    const { user } = useAuth()
    const { isAdmin, loading } = useAdmin()
    const navigate = useNavigate()

    useEffect(() => {
        if (!loading) {
            if (!user) {
                navigate('/auth')
            } else if (!isAdmin) {
                navigate('/')
            }
        }
    }, [user, isAdmin, loading, navigate])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        )
    }

    if (!isAdmin) {
        return null
    }

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="container mx-auto max-w-7xl">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Admin Panel</h1>
                <p className="text-muted-foreground text-lg mb-8">
                    Manage your jewelry inventory
                </p>
                <div className="bg-card border rounded-lg p-8 text-center">
                    <p className="text-muted-foreground">
                        Admin panel will be available once you set up the Supabase database.
                        <br />
                        You'll be able to add, edit, and delete products here.
                    </p>
                </div>
            </div>
        </div>
    )
}
