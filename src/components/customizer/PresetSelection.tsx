import { PRESETS, Preset } from '@/data/customization'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PresetSelectionProps {
    categoryId: string
    selectedPreset: string | null
    onSelect: (preset: Preset) => void
}

export default function PresetSelection({ categoryId, selectedPreset, onSelect }: PresetSelectionProps) {
    const filteredPresets = PRESETS.filter(p => p.categoryId === categoryId)

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPresets.map((preset) => (
                <Card
                    key={preset.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg overflow-hidden group
                        ${selectedPreset === preset.id ? 'ring-2 ring-primary border-primary' : 'border-border'}
                    `}
                    onClick={() => onSelect(preset)}
                >
                    <div className="h-64 overflow-hidden relative">
                        <img
                            src={preset.image}
                            alt={preset.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    </div>
                    <CardHeader>
                        <CardTitle className="font-playfair text-xl flex justify-between items-center">
                            <span>{preset.name}</span>
                            <span className="text-lg font-normal text-primary">₹{preset.basePrice.toLocaleString()}</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground text-sm">{preset.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
