import { Category } from '@/data/customization'



interface LivePreviewProps {
    category: Category
    selections: Record<string, string> // stepId -> optionId
}

export default function LivePreview({ category, selections }: LivePreviewProps) {
    // Find the selected metal filter to apply to base layers
    // We assume there's a step with id 'metal-type' that defines the global metal color
    const metalStep = category.steps.find(s => s.id === 'metal-type')
    const selectedMetalId = metalStep ? selections[metalStep.id] : null
    const selectedMetalOption = metalStep?.options.find(o => o.id === selectedMetalId)
    const globalMetalFilter = selectedMetalOption?.cssFilter

    // Collect all selected option images with their zIndex
    const layers = category.steps
        .filter(step => selections[step.id]) // Only steps with a selection
        .map(step => {
            const selectedOption = step.options.find(opt => opt.id === selections[step.id])

            // Determine which filter to use
            // If this option has its own filter (like a stone color), use it
            // If it's a base layer (like a band) and we have a global metal filter, use that
            // Otherwise use the option's default filter or none
            let activeFilter = selectedOption?.cssFilter

            // Logic: If this layer is a "Band" or "Chain" (zIndex 1) and doesn't have a specific strong color filter,
            // apply the global metal filter if available.
            if (step.zIndex === 1 && globalMetalFilter && step.id !== 'metal-type') {
                activeFilter = globalMetalFilter
            }

            return {
                image: selectedOption?.layerImage || selectedOption?.image,
                zIndex: step.zIndex || 0,
                id: step.id,
                filter: activeFilter,
                isMetalSelector: step.id === 'metal-type' // Don't render the metal selector itself as a layer
            }
        })
        .filter(layer => layer.image && !layer.isMetalSelector) // Filter out missing images and abstract selectors
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
                        style={{
                            zIndex: layer.zIndex,
                            filter: layer.filter || 'none'
                        }}
                    />
                ))
            )}

            {/* Overlay for "Realism" effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none z-50" />
        </div>
    )
}
