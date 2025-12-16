import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Address } from '@/contexts/OrderContext'
import { toast } from 'sonner'

import { Checkbox } from '../ui/checkbox'

interface AddressFormProps {
    onAddressSubmit: (address: Address, saveAddress: boolean) => void
    onCancel: () => void
    allowSave?: boolean
}

export function AddressForm({ onAddressSubmit, onCancel, allowSave = false }: AddressFormProps) {
    const [formData, setFormData] = useState<Address>({
        fullName: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        phone: ''
    })
    const [saveChecked, setSaveChecked] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Basic Validation
        if (Object.values(formData).some(val => !val.trim())) {
            toast.error("Please fill in all address fields")
            return
        }

        if (formData.phone.length < 10) {
            toast.error("Please enter a valid phone number")
            return
        }

        onAddressSubmit(formData, saveChecked)
    }

    return (
        <Card className="w-full max-w-lg mx-auto border-gold/20 shadow-elegant">
            <CardHeader>
                <CardTitle className="text-2xl font-playfair text-center">Shipping Details</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="John Doe"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="street">Street Address</Label>
                        <Input
                            id="street"
                            name="street"
                            value={formData.street}
                            onChange={handleChange}
                            placeholder="123 Gold St"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="Mumbai"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="state">State</Label>
                            <Input
                                id="state"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                placeholder="Maharashtra"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="zipCode">ZIP Code</Label>
                            <Input
                                id="zipCode"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleChange}
                                placeholder="400001"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+91 9876543210"
                            />
                        </div>
                    </div>

                    {allowSave && (
                        <div className="flex items-center space-x-2 pt-2">
                            <Checkbox
                                id="saveAddress"
                                checked={saveChecked}
                                onCheckedChange={(checked: boolean | 'indeterminate') => setSaveChecked(checked === true)}
                            />
                            <Label htmlFor="saveAddress" className="text-sm cursor-pointer">
                                Save this address for future purchases
                            </Label>
                        </div>
                    )}

                    <div className="flex gap-4 pt-4">
                        <Button type="button" variant="outline" className="w-full" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button type="submit" className="w-full bg-gradient-gold text-black hover:opacity-90">
                            Proceed to Pay
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
