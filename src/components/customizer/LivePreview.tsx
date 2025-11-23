import { Category } from '@/data/customization'

interface LivePreviewProps {
    category: Category
    selections: Record<string, string> // stepId -> optionId
}

export default function LivePreview({ category, selections }: LivePreviewProps) {
    // Collect all selected option images with their zIndex
    const layers = category.steps
        .filter(step => selections[step.id]) // Only steps with a selection
        .map(step => {
            const selectedOption = step.options.find(opt => opt.id === selections[step.id])
            return {
                image: selectedOption?.layerImage || selectedOption?.image,
                zIndex: step.zIndex || 0,
                id: step.id
            }
        })
        .filter(layer => layer.image) // Filter out missing images
        .sort((a, b) => a.zIndex - b.zIndex) // Sort by zIndex

    return (
        <div className="w-full aspect-square relative bg-muted/20 rounded-xl overflow-hidden border-2 border-gold/20 shadow-inner">
            {layers.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                        <p className="mb-2">Start customizing to see preview</p>
                        <img
                            src={category.image}
                            alt={category.name}
                            className="w-32 h-32 object-cover rounded-full mx-auto opacity-50"
                        />
                    </div>
                </div>
            ) : (
                layers.map((layer) => (
                    <img
                        key={layer.id}
                        src={layer.image}
                        alt="Layer"
                        className="absolute inset-0 w-full h-full object-contain transition-all duration-500"
                        style={{ zIndex: layer.zIndex }}
                    />
                ))
            )}

            {/* Overlay for "Realism" effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none z-50" />
        </div>
    )
}
