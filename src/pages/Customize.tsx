import { useState } from 'react'
import { METALS, GEMSTONES, Preset } from '@/data/customization'
import StageIndicator from '@/components/customizer/StageIndicator'
import CategorySelection from '@/components/customizer/CategorySelection'
import PresetSelection from '@/components/customizer/PresetSelection'
import MaterialSelection from '@/components/customizer/MaterialSelection'
import FinalizeDesign from '@/components/customizer/FinalizeDesign'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

const STAGES = ['Category', 'Design', 'Metal', 'Gemstone', 'Finalize']

export default function Customize() {
    const [currentStage, setCurrentStage] = useState(1)
    const [selections, setSelections] = useState({
        category: null as string | null,
        preset: null as Preset | null,
        metal: null as string | null,
        gemstone: null as string | null
    })

    const handleNext = () => setCurrentStage(prev => Math.min(prev + 1, STAGES.length))
    const handleBack = () => setCurrentStage(prev => Math.max(prev - 1, 1))

    const updateSelection = (key: keyof typeof selections, value: any) => {
        setSelections(prev => ({ ...prev, [key]: value }))
        handleNext()
    }

    return (
        <div className="min-h-screen py-8 px-4 bg-background">
            <div className="container mx-auto max-w-6xl">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-4 text-gradient-gold">
                        Customization Studio
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Create your unique masterpiece in 5 simple steps. Choose your style, materials, and details.
                    </p>
                </div>

                <StageIndicator currentStage={currentStage} stages={STAGES} />

                <div className="mt-8 min-h-[500px]">
                    {currentStage > 1 && currentStage < 5 && (
                        <Button
                            variant="ghost"
                            onClick={handleBack}
                            className="mb-6 hover:bg-transparent hover:text-primary pl-0"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to previous step
                        </Button>
                    )}

                    {currentStage === 1 && (
                        <CategorySelection
                            selectedCategory={selections.category}
                            onSelect={(id) => updateSelection('category', id)}
                        />
                    )}

                    {currentStage === 2 && selections.category && (
                        <PresetSelection
                            categoryId={selections.category}
                            selectedPreset={selections.preset?.id || null}
                            onSelect={(preset) => updateSelection('preset', preset)}
                        />
                    )}

                    {currentStage === 3 && (
                        <MaterialSelection
                            title="Select Your Metal"
                            options={METALS.map(m => ({
                                id: m.id,
                                name: m.name,
                                color: m.color,
                                priceDisplay: `Base x ${m.priceMultiplier}`
                            }))}
                            selectedId={selections.metal}
                            onSelect={(id) => updateSelection('metal', id)}
                        />
                    )}

                    {currentStage === 4 && (
                        <MaterialSelection
                            title="Select Your Gemstone"
                            options={GEMSTONES.map(g => ({
                                id: g.id,
                                name: g.name,
                                color: g.color,
                                priceDisplay: `₹${g.pricePerCarat.toLocaleString()}/ct`
                            }))}
                            selectedId={selections.gemstone}
                            onSelect={(id) => updateSelection('gemstone', id)}
                        />
                    )}

                    {currentStage === 5 && selections.preset && selections.metal && selections.gemstone && (
                        <FinalizeDesign
                            category={selections.category!}
                            preset={selections.preset}
                            metal={METALS.find(m => m.id === selections.metal)!}
                            gemstone={GEMSTONES.find(g => g.id === selections.gemstone)!}
                            onBack={handleBack}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}
