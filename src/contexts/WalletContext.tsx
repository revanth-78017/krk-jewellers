import React, { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'sonner'

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
    const [balance, setBalance] = useState<number>(() => {
        const saved = localStorage.getItem('wallet_balance')
        return saved ? parseFloat(saved) : 0
    })

    const [pin, setPin] = useState<string | null>(() => {
        return localStorage.getItem('wallet_pin')
    })

    useEffect(() => {
        localStorage.setItem('wallet_balance', balance.toString())
    }, [balance])

    const addToWallet = (amount: number, source: string) => {
        setBalance(prev => prev + amount)
        toast.success(`₹${amount.toLocaleString()} added to wallet from ${source}`)
    }

    const deductFromWallet = (amount: number, reason: string): boolean => {
        if (balance >= amount) {
            setBalance(prev => prev - amount)
            console.log(`Deducted ₹${amount} for: ${reason}`)
            // toast.success(`₹${amount.toLocaleString()} deducted for ${reason}`) // Removed to allow custom success handling
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
        setPin(newPin)
        localStorage.setItem('wallet_pin', newPin)
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
