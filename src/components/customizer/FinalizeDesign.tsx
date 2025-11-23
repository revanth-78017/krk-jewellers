import { Preset, Metal, Gemstone } from '@/data/customization'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingCart, ArrowLeft } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

interface FinalizeDesignProps {
    category: string
    preset: Preset
    metal: Metal
    gemstone: Gemstone
    onBack: () => void
}

export default function FinalizeDesign({ category, preset, metal, gemstone, onBack }: FinalizeDesignProps) {
    const { addToCart } = useCart()
    const navigate = useNavigate()

    // Calculate total price
    const totalPrice = (preset.basePrice * metal.priceMultiplier) + (gemstone.pricePerCarat * 0.5) // Assuming 0.5 carat for simplicity

    const handleAddToCart = () => {
        addToCart({
            id: Math.random().toString(36).substr(2, 9),
            name: `Custom ${preset.name}`,
            description: `Customized ${category} with ${metal.name} and ${gemstone.name}`,
            price: totalPrice,
            image: preset.image,
            category: category
        })
        toast.success('Custom design added to cart!')
        navigate('/cart')
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Visual Preview */}
            <div className="space-y-6">
                <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-gold/20 shadow-2xl">
                    <img
                        src={preset.image}
                        alt="Final Design"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-4 right-4 flex gap-2">
                        <div
                            className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
                            style={{ backgroundColor: metal.color }}
                            title={metal.name}
                        />
                        <div
                            className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
                            style={{ backgroundColor: gemstone.color }}
                            title={gemstone.name}
                        />
                    </div>
                </div>
            </div>

            {/* Details & Actions */}
            <div className="space-y-8">
                <div>
                    <h2 className="text-3xl font-playfair font-bold mb-2">Your Custom Design</h2>
                    <p className="text-muted-foreground">Review your masterpiece before purchasing.</p>
                </div>

                <Card className="border-gold/20">
                    <CardHeader className="bg-muted/30 border-b border-gold/10">
                        <CardTitle className="font-playfair">Configuration Details</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-dashed">
                            <span className="text-muted-foreground">Category</span>
                            <span className="font-medium capitalize">{category}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-dashed">
                            <span className="text-muted-foreground">Design Preset</span>
                            <span className="font-medium">{preset.name}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-dashed">
                            <span className="text-muted-foreground">Metal</span>
                            <span className="font-medium">{metal.name}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-dashed">
                            <span className="text-muted-foreground">Gemstone</span>
                            <span className="font-medium">{gemstone.name}</span>
                        </div>

                        {/* Necklace Specific Logic Placeholder */}
                        {category === 'necklaces' && (
                            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <h4 className="font-bold text-blue-800 mb-2 text-sm">Necklace Configuration</h4>
                                <div className="flex justify-between text-sm text-blue-700">
                                    <span>Upper Chain</span>
                                    <span>Standard {metal.name} Link</span>
                                </div>
                                <div className="flex justify-between text-sm text-blue-700 mt-1">
                                    <span>Pendant Setting</span>
                                    <span>{gemstone.name} Center</span>
                                </div>
                            </div>
                        )}

                        <div className="pt-4 flex justify-between items-center">
                            <span className="text-lg font-bold">Total Price</span>
                            <span className="text-2xl font-bold text-primary">₹{totalPrice.toLocaleString()}</span>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex gap-4">
                    <Button variant="outline" size="lg" className="flex-1" onClick={onBack}>
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    <Button size="lg" className="flex-1 bg-gradient-gold text-black hover:opacity-90" onClick={handleAddToCart}>
                        <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                    </Button>
                </div>
            </div>
        </div>
    )
}
