import React, { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'

interface WalletContextType {
    balance: number
    isPinSet: boolean
    addToWallet: (amount: number, source: string) => void
    deductFromWallet: (amount: number, reason: string) => boolean
    verifyPin: (pin: string) => boolean
    setWalletPin: (pin: string) => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth()
    const [balance, setBalance] = useState<number>(0)
    const [pin, setPin] = useState<string | null>(null)

    // Load wallet data when user changes
    useEffect(() => {
        if (user) {
            const savedBalance = localStorage.getItem(`wallet_balance_${user.id}`)
            const savedPin = localStorage.getItem(`wallet_pin_${user.id}`)

            setBalance(savedBalance ? parseFloat(savedBalance) : 0)
            setPin(savedPin)
        } else {
            setBalance(0)
            setPin(null)
        }
    }, [user])

    // Save balance whenever it changes
    useEffect(() => {
        if (user) {
            localStorage.setItem(`wallet_balance_${user.id}`, balance.toString())
        }
    }, [balance, user])

    const addToWallet = (amount: number, source: string) => {
        if (!user) return
        setBalance(prev => prev + amount)
        toast.success(`₹${amount.toLocaleString()} added to wallet from ${source}`)
    }

    const deductFromWallet = (amount: number, reason: string): boolean => {
        if (!user) return false
        if (balance >= amount) {
            setBalance(prev => prev - amount)
            console.log(`Deducted ₹${amount} for: ${reason}`)
            return true
        } else {
            toast.error("Insufficient wallet balance")
            return false
        }
    }

    const verifyPin = (inputPin: string): boolean => {
        if (!pin) return true // Should not happen if isPinSet is checked
        return inputPin === pin
    }

    const setWalletPin = (newPin: string) => {
        if (!user) return
        setPin(newPin)
        localStorage.setItem(`wallet_pin_${user.id}`, newPin)
        toast.success("Wallet PIN set successfully")
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
