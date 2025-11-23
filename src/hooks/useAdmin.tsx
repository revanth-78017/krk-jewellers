import { useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import { supabase } from '@/integrations/supabase/client'

export function useAdmin() {
    const { user } = useAuth()
    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function checkAdmin() {
            if (!user) {
                setIsAdmin(false)
                setLoading(false)
                return
            }

            try {
                const { data, error } = await supabase
                    .from('user_roles')
                    .select('role')
                    .eq('user_id', user.id)
                    .eq('role', 'admin')
                    .single()

                if (error && error.code !== 'PGRST116') {
                    console.error('Error checking admin status:', error)
                }

                setIsAdmin(!!data)
            } catch (error) {
                console.error('Error checking admin status:', error)
                setIsAdmin(false)
            } finally {
                setLoading(false)
            }
        }

        checkAdmin()
    }, [user])

    return { isAdmin, loading }
}
