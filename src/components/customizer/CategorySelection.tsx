import { CATEGORIES } from '@/data/customization'
import { Card, CardContent } from '@/components/ui/card'

interface CategorySelectionProps {
    selectedCategory: string | null
    onSelect: (categoryId: string) => void
}

export default function CategorySelection({ selectedCategory, onSelect }: CategorySelectionProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((category) => (
                <Card
                    key={category.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg overflow-hidden group
                        ${selectedCategory === category.id ? 'ring-2 ring-primary border-primary' : 'border-border'}
                    `}
                    onClick={() => onSelect(category.id)}
                >
                    <div className="h-48 overflow-hidden relative">
                        <img
                            src={category.image}
                            alt={category.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    </div>
                    <CardContent className="p-4 text-center">
                        <h3 className={`font-playfair text-xl font-bold ${selectedCategory === category.id ? 'text-primary' : ''}`}>
                            {category.name}
                        </h3>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
