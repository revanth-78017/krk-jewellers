import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore'
import { useAuth } from '@/hooks/useAuth'
import { Address } from '@/contexts/OrderContext'

export interface SavedAddress extends Address {
    id: string
}

export function useAddress() {
    const { user } = useAuth()
    const [addresses, setAddresses] = useState<SavedAddress[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) {
            setAddresses([])
            setLoading(false)
            return
        }

        const addressesRef = collection(db, 'users', user.id, 'addresses')
        const q = query(addressesRef, orderBy('createdAt', 'desc'))

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedAddresses: SavedAddress[] = []
            snapshot.forEach((doc) => {
                fetchedAddresses.push({ id: doc.id, ...doc.data() } as SavedAddress)
            })
            setAddresses(fetchedAddresses)
            setLoading(false)
        }, (error) => {
            console.error("Error fetching addresses:", error)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [user])

    const addAddress = async (address: Address) => {
        if (!user) return
        try {
            const addressesRef = collection(db, 'users', user.id, 'addresses')
            await addDoc(addressesRef, {
                ...address,
                createdAt: Date.now()
            })
        } catch (error) {
            console.error("Error adding address:", error)
            throw error
        }
    }

    const deleteAddress = async (id: string) => {
        if (!user) return
        try {
            await deleteDoc(doc(db, 'users', user.id, 'addresses', id))
        } catch (error) {
            console.error("Error deleting address:", error)
            throw error
        }
    }

    return {
        addresses,
        loading,
        addAddress,
        deleteAddress
    }
}
