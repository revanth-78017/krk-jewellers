import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Bot, User, Send, X, ArrowRight, Sparkles, ArrowUpRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { PollinationsService } from '@/services/PollinationsService'

interface DesignChatbotProps {
    onClose: () => void
    onUsePrompt: (prompt: string) => void
}

type Mode = 'MENU' | 'GUIDED' | 'GENERAL'

interface Message {
    id: string
    role: 'assistant' | 'user'
    content: string
    options?: string[]
    isFinalPrompt?: boolean
    gramEstimate?: string
}

export function DesignChatbot({ onClose, onUsePrompt }: DesignChatbotProps) {
    const [mode, setMode] = useState<Mode>('MENU')
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    // Wizard State
    const [step, setStep] = useState(0)
    const [wizardData, setWizardData] = useState({
        item: '',
        gender: '',
        style: '',
        stones: '',
        customization: ''
    })

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
        }
    }, [messages, isTyping])

    const addMessage = (role: 'assistant' | 'user', content: string, options?: string[], isFinalPrompt?: boolean, gramEstimate?: string) => {
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role,
            content,
            options,
            isFinalPrompt,
            gramEstimate
        }])
        setIsTyping(false)
    }

    const startGuidedMode = () => {
        setMode('GUIDED')
        setStep(1)
        setMessages([]) // Clear menu messages
        setIsTyping(true)
        setTimeout(() => {
            addMessage('assistant', "I'll help you design your perfect piece! Step 1/5: What item would you like to create?", ['Ring', 'Necklace', 'Earrings', 'Bracelet', 'Pendant'])
        }, 600)
    }

    const startGeneralMode = () => {
        setMode('GENERAL')
        setMessages([])
        setIsTyping(true)
        setTimeout(() => {
            addMessage('assistant', "I'm your AI Jewelry Assistant. Ask me anything! For example: 'Suggest a gold ring under 30k' or 'What are the trends for weddings?'")
        }, 600)
    }

    const handleWizardStep = (response: string) => {
        // User response
        addMessage('user', response)
        setIsTyping(true)

        const processStep = async () => {
            switch (step) {
                case 1: // Item -> Gender
                    setWizardData(prev => ({ ...prev, item: response }))
                    setStep(2)
                    addMessage('assistant', `Great choice! Who is this ${response.toLowerCase()} for?`, ['Ladies', 'Mens', 'Unisex', 'Kids'])
                    break
                case 2: // Gender -> Style
                    setWizardData(prev => ({ ...prev, gender: response }))
                    setStep(3)
                    addMessage('assistant', "Do you have a specific style or motif in mind? Select or type your own.", ['Floral', 'Geometric', 'Minimalist', 'Vintage', 'Butterfly', 'Letter/Initial'])
                    break
                case 3: // Style -> Stones
                    setWizardData(prev => ({ ...prev, style: response }))
                    setStep(4)
                    addMessage('assistant', "Would you like to add any gemstones?", ['Diamond', 'Ruby', 'Emerald', 'Sapphire', 'No Stones', 'Multi-colored'])
                    break
                case 4: // Stones -> Customization
                    setWizardData(prev => ({ ...prev, stones: response }))
                    setStep(5)
                    addMessage('assistant', "Almost done! Any final custom details? (e.g., 'Thin band', 'Engraving', 'Matte finish') or just say 'None'.")
                    break
                case 5: // Final -> Generation
                    const finalData = { ...wizardData, customization: response }
                    const prompt = `A premium professional jewelry design of a ${finalData.gender} ${finalData.item}, featuring a ${finalData.style} style. ${finalData.stones !== 'No Stones' ? `Adorned with ${finalData.stones} gemstones.` : 'Plain metal design.'} ${response !== 'None' ? `Details: ${response}.` : ''} High resolution, photorealistic, 8k, studio lighting, white background.`

                    // Real AI Analysis
                    const weightAnalysis = await PollinationsService.analyzeDesign(prompt)
                    const weightString = `${weightAnalysis.range} \n(${weightAnalysis.analysis.join(', ')})`

                    setIsTyping(false)
                    addMessage('assistant', "Here is your professional design prompt. I've also analyzed the estimated weight for this piece.",
                        undefined,
                        true, // isFinalPrompt
                        weightString
                    )
                    addMessage('assistant', prompt, undefined, true)
                    setStep(0) // Reset or End
                    break
            }
        }

        if (step === 5) {
            processStep()
        } else {
            setTimeout(processStep, 800)
        }
    }

    const handleGeneralChat = async (text: string) => {
        addMessage('user', text)
        setIsTyping(true)

        // Map current messages to history format for context
        const history = messages.map(m => ({
            role: m.role,
            parts: m.content
        }))

        const response = await PollinationsService.generateResponse(history, text)
        addMessage('assistant', response)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim()) return

        if (mode === 'GUIDED') {
            handleWizardStep(input)
        } else {
            handleGeneralChat(input)
        }
        setInput('')
    }

    const handleOptionClick = (opt: string) => {
        if (mode === 'GUIDED') {
            handleWizardStep(opt)
        }
    }

    return (
        <Card className="w-[380px] h-[600px] flex flex-col shadow-2xl border-gold/20 animate-in slide-in-from-bottom-5">
            <CardHeader className="bg-gradient-gold p-4 text-black rounded-t-xl shrink-0">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Bot className="h-6 w-6" />
                        <div>
                            <CardTitle className="text-lg leading-none">AI Assistant</CardTitle>
                            <CardDescription className="text-black/70 text-xs mt-1">Design Expert & Guide</CardDescription>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="text-black hover:bg-black/10 h-8 w-8">
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="flex-1 p-0 flex flex-col overflow-hidden bg-background">
                {mode === 'MENU' ? (
                    <div className="flex flex-col items-center justify-center h-full p-6 space-y-6 text-center">
                        <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mb-2">
                            <Sparkles className="h-8 w-8 text-gold" />
                        </div>
                        <h3 className="text-xl font-semibold text-gradient-gold">How can I help you?</h3>
                        <div className="grid gap-3 w-full">
                            <Button
                                variant="outline"
                                className="h-auto py-4 justify-between border-gold/30 hover:border-gold hover:bg-gold/5 group"
                                onClick={startGuidedMode}
                            >
                                <div className="text-left">
                                    <div className="font-semibold text-foreground">Guided Design</div>
                                    <div className="text-xs text-muted-foreground">Step-by-step creation</div>
                                </div>
                                <ArrowRight className="h-4 w-4 text-gold opacity-50 group-hover:opacity-100 transition-opacity" />
                            </Button>
                            <Button
                                variant="outline"
                                className="h-auto py-4 justify-between border-gold/30 hover:border-gold hover:bg-gold/5 group"
                                onClick={startGeneralMode}
                            >
                                <div className="text-left">
                                    <div className="font-semibold text-foreground">General Chat</div>
                                    <div className="text-xs text-muted-foreground">Ask Qs & Get Advice</div>
                                </div>
                                <ArrowRight className="h-4 w-4 text-gold opacity-50 group-hover:opacity-100 transition-opacity" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 p-4 overflow-y-auto" ref={scrollRef}>
                            <div className="space-y-4">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={cn(
                                            "flex gap-2 max-w-[85%]",
                                            msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                            msg.role === 'assistant' ? "bg-gold/20 text-gold" : "bg-muted text-foreground"
                                        )}>
                                            {msg.role === 'assistant' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                                        </div>
                                        <div className="space-y-2">
                                            <div className={cn(
                                                "p-3 rounded-2xl text-sm shadow-sm",
                                                msg.role === 'user'
                                                    ? "bg-primary text-primary-foreground rounded-tr-none"
                                                    : "bg-muted rounded-tl-none border border-border"
                                            )}>
                                                {msg.content}

                                                {msg.gramEstimate && (
                                                    <div className="mt-3 pt-2 border-t border-border/50">
                                                        <div className="flex items-center gap-1.5 text-xs font-medium text-gold-dark mb-1">
                                                            <ArrowUpRight className="h-3 w-3" />
                                                            Weight Analysis
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">
                                                            Estimated Gold Weight (22k): <span className="font-bold text-foreground">{msg.gramEstimate}</span>
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {msg.options && (
                                                <div className="flex flex-wrap gap-2">
                                                    {msg.options.map(opt => (
                                                        <Badge
                                                            key={opt}
                                                            variant="secondary"
                                                            className="cursor-pointer hover:bg-gold hover:text-black transition-colors py-1.5 px-3"
                                                            onClick={() => handleOptionClick(opt)}
                                                        >
                                                            {opt}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}

                                            {msg.isFinalPrompt && !msg.gramEstimate && (
                                                <Button
                                                    size="sm"
                                                    className="w-full bg-gold hover:bg-gold-dark text-black mt-1"
                                                    onClick={() => {
                                                        onUsePrompt(msg.content)
                                                        onClose()
                                                    }}
                                                >
                                                    <Sparkles className="w-3 h-3 mr-2" />
                                                    Use This Prompt
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex gap-2 mr-auto max-w-[85%]">
                                        <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                                            <Bot className="h-4 w-4" />
                                        </div>
                                        <div className="bg-muted p-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                            <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                            <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce"></span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-4 border-t bg-background">
                            <form onSubmit={handleSubmit} className="flex gap-2">
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={mode === 'GUIDED' ? "Type or select an option..." : "Ask me anything..."}
                                    className="flex-1"
                                />
                                <Button type="submit" size="icon" disabled={!input.trim() || isTyping}>
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                            <Button
                                variant="ghost"
                                className="w-full mt-2 text-xs h-6 text-muted-foreground hover:text-foreground"
                                onClick={() => setMode('MENU')}
                            >
                                Back to Menu
                            </Button>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
