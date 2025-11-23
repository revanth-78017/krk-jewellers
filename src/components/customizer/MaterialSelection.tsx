import { Card, CardContent } from '@/components/ui/card'

interface MaterialOption {
    id: string
    name: string
    priceDisplay?: string
    color: string
    image?: string
}

interface MaterialSelectionProps {
    title: string
    options: MaterialOption[]
    selectedId: string | null
    onSelect: (id: string) => void
}

export default function MaterialSelection({ title, options, selectedId, onSelect }: MaterialSelectionProps) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-playfair font-bold text-center mb-8">{title}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {options.map((option) => (
                    <Card
                        key={option.id}
                        className={`cursor-pointer transition-all duration-300 hover:shadow-lg group
                            ${selectedId === option.id ? 'ring-2 ring-primary border-primary' : 'border-border'}
                        `}
                        onClick={() => onSelect(option.id)}
                    >
                        <CardContent className="p-6 flex flex-col items-center gap-4">
                            <div
                                className="w-16 h-16 rounded-full shadow-inner border-2 border-muted"
                                style={{ backgroundColor: option.color }}
                            />
                            <div className="text-center">
                                <h3 className="font-bold mb-1">{option.name}</h3>
                                {option.priceDisplay && (
                                    <p className="text-sm text-muted-foreground">{option.priceDisplay}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
