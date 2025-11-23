import { useState } from 'react'
import { CATEGORIES } from '@/data/customization'
import StageIndicator from '@/components/customizer/StageIndicator'
import CategorySelection from '@/components/customizer/CategorySelection'
import OptionSelection from '@/components/customizer/OptionSelection'
import FinalizeDesign from '@/components/customizer/FinalizeDesign'
import LivePreview from '@/components/customizer/LivePreview'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function Customize() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [currentStepIndex, setCurrentStepIndex] = useState(0)
    const [selections, setSelections] = useState<Record<string, string>>({})

    const category = CATEGORIES.find(c => c.id === selectedCategory)
    const steps = category?.steps || []
    const currentStep = steps[currentStepIndex]
    const isFinalizing = selectedCategory && currentStepIndex >= steps.length

    // Generate stage names for indicator
    const stageNames = category
        ? ['Category', ...steps.map(s => s.name), 'Finalize']
        : ['Category', 'Customization', 'Finalize']

    // Calculate current stage number (1-based)
    // 1 = Category, 2...N = Steps, N+1 = Finalize
    const currentStageNumber = !selectedCategory ? 1 : isFinalizing ? stageNames.length : currentStepIndex + 2

    const handleCategorySelect = (categoryId: string) => {
        setSelectedCategory(categoryId)
        setCurrentStepIndex(0)
        setSelections({})
    }

    const handleOptionSelect = (optionId: string) => {
        if (!currentStep) return
        setSelections(prev => ({ ...prev, [currentStep.id]: optionId }))
        setCurrentStepIndex(prev => prev + 1)
    }

    const handleBack = () => {
        if (isFinalizing) {
            setCurrentStepIndex(steps.length - 1)
        } else if (currentStepIndex > 0) {
            setCurrentStepIndex(prev => prev - 1)
        } else {
            setSelectedCategory(null)
            setSelections({})
        }
    }

    return (
        <div className="min-h-screen py-8 px-4 bg-background">
            <div className="container mx-auto max-w-7xl">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-4 text-gradient-gold">
                        Customization Studio
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Design your unique jewelry piece, step by step.
                    </p>
                </div>

                <StageIndicator currentStage={currentStageNumber} stages={stageNames} />

                <div className="mt-8 min-h-[600px]">
                    {/* Back Button */}
                    {selectedCategory && (
                        <Button
                            variant="ghost"
                            onClick={handleBack}
                            className="mb-6 hover:bg-transparent hover:text-primary pl-0"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            {currentStepIndex === 0 ? 'Back to Categories' : 'Back to previous step'}
                        </Button>
                    )}

                    {/* Category Selection (Stage 1) */}
                    {!selectedCategory && (
                        <CategorySelection
                            selectedCategory={null}
                            onSelect={handleCategorySelect}
                        />
                    )}

                    {/* Customization Steps (Stage 2...N) */}
                    {selectedCategory && !isFinalizing && category && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Left Column: Live Preview (Sticky) */}
                            <div className="lg:col-span-5">
                                <div className="sticky top-24">
                                    <h3 className="text-xl font-playfair font-bold mb-4">Live Preview</h3>
                                    <LivePreview category={category} selections={selections} />

                                    {/* Current Configuration Summary */}
                                    <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
                                        <h4 className="font-bold mb-2 text-sm uppercase tracking-wider text-muted-foreground">Current Selection</h4>
                                        <ul className="space-y-2 text-sm">
                                            <li className="flex justify-between">
                                                <span>Base Model</span>
                                                <span className="font-medium">{category.name}</span>
                                            </li>
                                            {steps.slice(0, currentStepIndex).map(step => {
                                                const selectedOption = step.options.find(o => o.id === selections[step.id])
                                                return (
                                                    <li key={step.id} className="flex justify-between">
                                                        <span>{step.name}</span>
                                                        <span className="font-medium">{selectedOption?.name}</span>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Options */}
                            <div className="lg:col-span-7">
                                <OptionSelection
                                    title={currentStep.name}
                                    description={currentStep.description}
                                    options={currentStep.options}
                                    selectedId={selections[currentStep.id] || null}
                                    onSelect={handleOptionSelect}
                                />
                            </div>
                        </div>
                    )}

                    {/* Finalize (Stage N+1) */}
                    {isFinalizing && category && (
                        <FinalizeDesign
                            category={category}
                            selections={selections}
                            onBack={handleBack}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}
