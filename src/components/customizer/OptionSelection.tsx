import { Card, CardContent } from '@/components/ui/card'
import { CustomizationOption } from '@/data/customization'
import { Check } from 'lucide-react'

interface OptionSelectionProps {
    title: string
    description?: string
    options: CustomizationOption[]
    selectedId: string | null
    onSelect: (id: string) => void
}

export default function OptionSelection({ title, description, options, selectedId, onSelect }: OptionSelectionProps) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
                <h2 className="text-3xl font-playfair font-bold mb-2">{title}</h2>
                {description && <p className="text-muted-foreground">{description}</p>}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {options.map((option) => (
                    <Card
                        key={option.id}
                        className={`cursor-pointer transition-all duration-300 hover:shadow-lg group relative overflow-hidden
                            ${selectedId === option.id ? 'ring-2 ring-primary border-primary bg-primary/5' : 'border-border'}
                        `}
                        onClick={() => onSelect(option.id)}
                    >
                        {selectedId === option.id && (
                            <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1 z-10">
                                <Check className="w-3 h-3" />
                            </div>
                        )}

                        <div className="aspect-square overflow-hidden bg-muted/30">
                            <img
                                src={option.image}
                                alt={option.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>

                        <CardContent className="p-4 text-center">
                            <h3 className="font-bold text-sm md:text-base mb-1">{option.name}</h3>
                            <p className="text-sm text-primary font-medium">
                                +₹{option.price.toLocaleString()}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
