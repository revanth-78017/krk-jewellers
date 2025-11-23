import { Category } from '@/data/customization'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingCart, ArrowLeft } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import LivePreview from './LivePreview'

interface FinalizeDesignProps {
    category: Category
    selections: Record<string, string>
    onBack: () => void
}

export default function FinalizeDesign({ category, selections, onBack }: FinalizeDesignProps) {
    const { addToCart } = useCart()
    const navigate = useNavigate()

    // Calculate total price
    let totalPrice = category.basePrice
    const selectedOptions = category.steps.map(step => {
        const optionId = selections[step.id]
        const option = step.options.find(o => o.id === optionId)
        if (option) {
            totalPrice += option.price
        }
        return { stepName: step.name, option }
    }).filter(item => item.option !== undefined)

    const handleAddToCart = () => {
        addToCart({
            id: Math.random().toString(36).substr(2, 9),
            name: `Custom ${category.name}`,
            description: selectedOptions.map(s => s.option!.name).join(', '),
            price: totalPrice,
            image: category.image, // Use base image for cart thumbnail
            category: category.id
        })
        toast.success('Custom design added to cart!')
        navigate('/cart')
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in duration-500">
            {/* Visual Preview */}
            <div className="space-y-6">
                <LivePreview category={category} selections={selections} />
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
                            <span className="text-muted-foreground">Base Model</span>
                            <span className="font-medium">{category.name}</span>
                        </div>

                        {selectedOptions.map((item, index) => (
                            <div key={index} className="flex justify-between items-center py-2 border-b border-dashed">
                                <span className="text-muted-foreground">{item.stepName}</span>
                                <span className="font-medium">{item.option!.name}</span>
                            </div>
                        ))}

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
