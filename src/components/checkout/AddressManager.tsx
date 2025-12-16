import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AddressForm } from './AddressForm'
import { useAddress, SavedAddress } from '@/hooks/useAddress'
import { Address } from '@/contexts/OrderContext'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { PlusCircle, Loader2 } from 'lucide-react'

interface AddressManagerProps {
    onAddressSelect: (address: Address, saveAddress: boolean) => void
    onCancel: () => void
}

export function AddressManager({ onAddressSelect, onCancel }: AddressManagerProps) {
    const { addresses, loading, addAddress } = useAddress()
    const [view, setView] = useState<'list' | 'new'>('list')
    const [selectedAddressId, setSelectedAddressId] = useState<string>('')

    useEffect(() => {
        if (!loading && addresses.length === 0) {
            setView('new')
        }
    }, [loading, addresses])

    const handleNewAddressSubmit = async (address: Address, save: boolean) => {
        // If save is checked, we let the parent handle the "save" logic or we do it here?
        // The plan said: "Update handleAddressSubmit to handle scenarios where an existing address is selected (no need to save again) or a new one is added (save if requested)."
        // So we just pass it up.
        onAddressSelect(address, save)
    }

    const handleExistingSelect = () => {
        const addr = addresses.find(a => a.id === selectedAddressId)
        if (addr) {
            // Remove ID from Address object to match expected type if strictly checked, 
            // but Address interface doesn't have ID, so spread is safe if Address is just data.
            const { id, ...addressData } = addr
            onAddressSelect(addressData, false) // False because it's already saved
        }
    }

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
    }

    if (view === 'new') {
        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-playfair font-bold text-xl">Add New Address</h3>
                    {addresses.length > 0 && (
                        <Button variant="ghost" onClick={() => setView('list')}>
                            Cancel
                        </Button>
                    )}
                </div>
                <AddressForm
                    onAddressSubmit={handleNewAddressSubmit}
                    onCancel={addresses.length > 0 ? () => setView('list') : onCancel}
                    allowSave={true}
                />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <h3 className="font-playfair font-bold text-xl">Select Delivery Address</h3>

            <RadioGroup value={selectedAddressId} onValueChange={setSelectedAddressId} className="space-y-4">
                {addresses.map((addr) => (
                    <div key={addr.id} className="flex items-start space-x-2 border p-4 rounded-lg border-gold/20">
                        <RadioGroupItem value={addr.id} id={addr.id} className="mt-1" />
                        <div className="flex-1 cursor-pointer" onClick={() => setSelectedAddressId(addr.id)}>
                            <Label htmlFor={addr.id} className="font-medium cursor-pointer">{addr.fullName}</Label>
                            <p className="text-sm text-muted-foreground mt-1">
                                {addr.street}, {addr.city}, {addr.state} {addr.zipCode}
                            </p>
                            <p className="text-sm text-muted-foreground">{addr.phone}</p>
                        </div>
                    </div>
                ))}
            </RadioGroup>

            <Button
                className="w-full bg-gradient-gold text-black hover:opacity-90"
                disabled={!selectedAddressId}
                onClick={handleExistingSelect}
            >
                Deliver Here
            </Button>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
            </div>

            <Button
                variant="outline"
                className="w-full"
                onClick={() => setView('new')}
            >
                <PlusCircle className="w-4 h-4 mr-2" /> Add New Address
            </Button>
        </div>
    )
}
