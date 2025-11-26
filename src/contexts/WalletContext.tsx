import React, { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { db } from '@/lib/firebase'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'

interface WalletContextType {
    balance: number
    isPinSet: boolean
    addToWallet: (amount: number, source: string) => Promise<void>
    deductFromWallet: (amount: number, reason: string) => Promise<boolean>
    verifyPin: (pin: string) => boolean
    setWalletPin: (pin: string) => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth()
    const [balance, setBalance] = useState<number>(0)
    const [pin, setPin] = useState<string | null>(null)

    // Load wallet data from Firestore
    useEffect(() => {
        if (user) {
            const walletRef = doc(db, 'users', user.id, 'wallet', 'info')
            const unsubscribe = onSnapshot(walletRef, (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data()
                    setBalance(data.balance || 0)
                    setPin(data.pin || null)
                } else {
                    // Initialize wallet if it doesn't exist
                    setDoc(walletRef, { balance: 0, pin: null }, { merge: true })
                    setBalance(0)
                    setPin(null)
                }
            })
            return () => unsubscribe()
        } else {
            setBalance(0)
            setPin(null)
        }
    }, [user])

    const addToWallet = async (amount: number, source: string) => {
        if (!user) return
        const newBalance = balance + amount
        try {
            await setDoc(doc(db, 'users', user.id, 'wallet', 'info'), {
                balance: newBalance
            }, { merge: true })
            toast.success(`₹${amount.toLocaleString()} added to wallet from ${source}`)
        } catch (error) {
            console.error("Error adding to wallet:", error)
            toast.error("Failed to update wallet balance")
        }
    }

    const deductFromWallet = async (amount: number, reason: string): Promise<boolean> => {
        if (!user) return false
        if (balance >= amount) {
            const newBalance = balance - amount
            try {
                await setDoc(doc(db, 'users', user.id, 'wallet', 'info'), {
                    balance: newBalance
                }, { merge: true })
                console.log(`Deducted ₹${amount} for: ${reason}`)
                return true
            } catch (error) {
                console.error("Error deducting from wallet:", error)
                toast.error("Failed to process transaction")
                return false
            }
        } else {
            toast.error("Insufficient wallet balance")
            return false
        }
    }

    const verifyPin = (inputPin: string): boolean => {
        if (!pin) return true
        return inputPin === pin
    }

    const setWalletPin = async (newPin: string) => {
        if (!user) return
        try {
            await setDoc(doc(db, 'users', user.id, 'wallet', 'info'), {
                pin: newPin
            }, { merge: true })
            toast.success("Wallet PIN set successfully")
        } catch (error) {
            console.error("Error setting PIN:", error)
            toast.error("Failed to set PIN")
        }
    }

    return (
        <WalletContext.Provider value={{
            balance,
            isPinSet: !!pin,
            addToWallet,
            deductFromWallet,
            verifyPin,
            setWalletPin
        }}>
            {children}
        </WalletContext.Provider>
    )
}

export function useWallet() {
    const context = useContext(WalletContext)
    if (context === undefined) {
        throw new Error('useWallet must be used within a WalletProvider')
    }
    return context
}
