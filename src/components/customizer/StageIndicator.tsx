import { Check } from 'lucide-react'

interface StageIndicatorProps {
    currentStage: number
    stages: string[]
}

export default function StageIndicator({ currentStage, stages }: StageIndicatorProps) {
    return (
        <div className="w-full py-6">
            <div className="flex items-center justify-between relative">
                {/* Progress Bar Background */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-muted -z-10" />

                {/* Active Progress Bar */}
                <div
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-primary transition-all duration-500 -z-10"
                    style={{ width: `${((currentStage - 1) / (stages.length - 1)) * 100}%` }}
                />

                {stages.map((stage, index) => {
                    const stepNumber = index + 1
                    const isActive = stepNumber === currentStage
                    const isCompleted = stepNumber < currentStage

                    return (
                        <div key={index} className="flex flex-col items-center gap-2">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-background
                                    ${isActive ? 'border-primary text-primary scale-110' :
                                        isCompleted ? 'border-primary bg-primary text-primary-foreground' : 'border-muted text-muted-foreground'}
                                `}
                            >
                                {isCompleted ? <Check className="w-5 h-5" /> : <span className="font-bold">{stepNumber}</span>}
                            </div>
                            <span className={`text-xs font-medium hidden md:block ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                                {stage}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
