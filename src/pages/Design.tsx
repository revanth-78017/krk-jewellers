import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2, Download, Sparkles, Wand2, RefreshCcw, Bot, MessageCircle } from 'lucide-react'

import { DesignService } from '@/services/DesignService'
import { Badge } from '@/components/ui/badge'
import { useDesign } from '@/contexts/DesignContext'
import { useRazorpay } from '@/hooks/useRazorpay'
import { useAuth } from '@/hooks/useAuth'
import { Save } from 'lucide-react'
import { DesignChatbot } from '@/components/design/DesignChatbot'
import { GeminiService } from '@/services/GeminiService'

export default function Design() {
    const { saveDesign, loading: saving } = useDesign()
    const { initializePayment, loading: paying } = useRazorpay()
    const { user } = useAuth()

    const [prompt, setPrompt] = useState('')
    const [jewelryType, setJewelryType] = useState('Ring')
    const [material, setMaterial] = useState('Gold')
    const [gemstone, setGemstone] = useState('Diamond')
    const [loading, setLoading] = useState(false)
    const [generatedImage, setGeneratedImage] = useState<string | null>(null)
    const [currentSeed, setCurrentSeed] = useState<number | null>(null)
    const [refinePrompt, setRefinePrompt] = useState('')
    const [showChatbot, setShowChatbot] = useState(false)
    const [weightData, setWeightData] = useState<{ range: string, analysis: string[] } | null>(null)

    const handleSuggestionClick = (suggestion: string) => {
        setPrompt((prev) => {
            const separator = prev.length > 0 ? ', ' : ''
            return prev + separator + suggestion
        })
        toast.info(`Added "${suggestion}" to prompt`)
    }

    const handleRefinementTagClick = (tag: string) => {
        setRefinePrompt((prev) => {
            const separator = prev.length > 0 ? ', ' : ''
            return prev + separator + tag
        })
        toast.info(`Added "${tag}" to refinement`)
    }

    const handleFixGrammar = () => {
        if (!prompt.trim()) return

        // 1. Normalize spacing and case
        let corrected = prompt
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase()

        // Common jewelry typos
        const typos: Record<string, string> = {
            'jewelery': 'jewelry', 'jewellry': 'jewelry', 'jewelry': 'jewelry', 'jwellery': 'jewelry',
            'dimond': 'diamond', 'daimond': 'diamond', 'diamon': 'diamond',
            'saphire': 'sapphire', 'safire': 'sapphire',
            'emrald': 'emerald', 'emarald': 'emerald',
            'gold': 'gold', 'golld': 'gold',
            'silver': 'silver', 'sliver': 'silver',
            'ring': 'ring', 'rng': 'ring',
            'necklas': 'necklace', 'neclace': 'necklace', 'necklace': 'necklace',
            'pendant': 'pendant', 'pandent': 'pendant',
            'earings': 'earrings', 'earing': 'earrings',
            'braclet': 'bracelet', 'barcelet': 'bracelet',
            'platnum': 'platinum', 'platinium': 'platinum',
            'rosegold': 'rose gold',
            'whitegold': 'white gold',
            'stone': 'stone', 'stons': 'stones',
            'dissign': 'design', 'desing': 'design',
            'pattren': 'pattern', 'patern': 'pattern',
            'filigree': 'filigree', 'filigre': 'filigree',
            'vinatge': 'vintage', 'vintge': 'vintage',
            'modren': 'modern',
            'elagent': 'elegant',
        }

        // Fix typos
        Object.entries(typos).forEach(([key, value]) => {
            const regex = new RegExp(`\\b${key}\\b`, 'gi')
            corrected = corrected.replace(regex, value)
        })

        // Dictionary of professional jewelry terms
        const replacements: Record<string, string> = {
            'nice': 'exquisite',
            'pretty': 'elegant',
            'beautiful': 'stunning',
            'big': 'statement',
            'small': 'delicate',
            'shiny': 'high polish',
            'good': 'premium quality',
            'red': 'ruby red',
            'blue': 'sapphire blue',
            'green': 'emerald green',
            'white': 'pristine white',
            'black': 'obsidian black',
            'sparkly': 'brilliant',
            'fancy': 'ornate',
            'simple': 'minimalist',
            'round': 'brilliant cut',
            'square': 'princess cut',
            "it's": 'it is',
            "don't": 'do not',
            "can't": 'cannot',
            "i'm": 'I am',
            "i ": 'I '
        }

        // Apply professional replacements
        Object.entries(replacements).forEach(([key, value]) => {
            const regex = new RegExp(`\\b${key}\\b`, 'gi')
            corrected = corrected.replace(regex, value)
        })

        // Simple sentence case (capitalize first char, and chars after . ! ?)
        corrected = corrected.replace(/(^\w|[.!?]\s*\w)/g, letter => letter.toUpperCase())

        // Ensure ends with punctuation
        if (!/[.!?]$/.test(corrected)) {
            corrected += '.'
        }

        setPrompt(corrected)
        toast.success('Prompt revised and formatted')
    }

    const handleGenerate = async () => {
        if (!prompt) {
            toast.error('Please describe your design idea')
            return
        }

        setLoading(true)
        try {
            const result = await DesignService.generateDesign({
                type: jewelryType,
                material,
                gemstone,
                prompt
            })
            setGeneratedImage(result.url)
            setCurrentSeed(result.seed)
            setRefinePrompt(prompt) // Initialize refinement prompt with original

            // AI-powered weight calculation for display
            const estWeight = await GeminiService.analyzeDesign(prompt)
            setWeightData(estWeight)

            toast.success('Design generated successfully!')
        } catch (error: any) {
            console.error('Generation error:', error)
            toast.error('Failed to generate design. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateDesign = async () => {
        if (!refinePrompt || currentSeed === null) return

        setLoading(true)
        try {
            // Use existing seed to refine the image
            const result = await DesignService.generateDesign({
                type: jewelryType,
                material,
                gemstone,
                prompt: refinePrompt
            }, currentSeed)

            setGeneratedImage(result.url)
            // Seed remains the same for further refinements
            toast.success('Design updated!')
        } catch (error: any) {
            console.error('Update error:', error)
            toast.error('Failed to update design.')
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        if (!generatedImage || !currentSeed) return

        await saveDesign({
            prompt,
            imageUrl: generatedImage,
            seed: currentSeed,
            jewelryType,
            material,
            gemstone
        })
    }

    const executeDownload = async () => {
        if (!generatedImage) return

        try {
            // Fetch the image to get a blob (avoids CORS issues with canvas if headers allow)
            const response = await fetch(generatedImage)
            const blob = await response.blob()
            const imageBitmap = await createImageBitmap(blob)

            const canvas = document.createElement('canvas')
            canvas.width = imageBitmap.width
            canvas.height = imageBitmap.height
            const ctx = canvas.getContext('2d')

            if (!ctx) {
                throw new Error('Could not get canvas context')
            }

            // Fill white background (JPG doesn't support transparency)
            ctx.fillStyle = '#FFFFFF'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(imageBitmap, 0, 0)

            // Convert to JPG
            const jpgUrl = canvas.toDataURL('image/jpeg', 0.95)

            const link = document.createElement('a')
            link.href = jpgUrl
            link.download = `krk-design-${Date.now()}.jpg`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            toast.success('Image downloaded as JPG')
        } catch (error) {
            console.error('Download failed:', error)
            toast.error('Failed to download image. Try right-click > Save Image As.')

            // Fallback: direct link download
            const link = document.createElement('a')
            link.href = generatedImage
            link.download = `krk-design-${Date.now()}.jpg`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }
    }

    const handlePaymentAndDownload = () => {
        if (!generatedImage) return

        initializePayment({
            key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_RkMznI33g63X9w',
            amount: 10000, // 100 INR
            currency: 'INR',
            name: 'GOLD CRAFT',
            description: 'Design Download High Res',
            image: '/favicon.ico',
            handler: () => {
                toast.success('Payment successful! Downloading design...')
                executeDownload()
            },
            prefill: {
                name: user?.display_name || "",
                email: user?.email || "",
                contact: user?.phone_number || ""
            },
            theme: {
                color: '#D4AF37'
            }
        })
    }

    return (
        <div className="min-h-screen py-8 px-4 bg-muted/30">
            <div className="container mx-auto max-w-6xl">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient-gold">AI Design Studio</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Transform your imagination into reality. Describe your dream jewelry, and let our AI create a stunning visualization for you.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Controls Section */}
                    <Card className="h-fit shadow-elegant">
                        <CardContent className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Jewelry Type</Label>
                                    <Select value={jewelryType} onValueChange={setJewelryType}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Ring">Ring</SelectItem>
                                            <SelectItem value="Necklace">Necklace</SelectItem>
                                            <SelectItem value="Earrings">Earrings</SelectItem>
                                            <SelectItem value="Bracelet">Bracelet</SelectItem>
                                            <SelectItem value="Pendant">Pendant</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Material</Label>
                                    <Select value={material} onValueChange={setMaterial}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Gold">Gold (24K)</SelectItem>
                                            <SelectItem value="Rose Gold">Rose Gold</SelectItem>
                                            <SelectItem value="White Gold">White Gold</SelectItem>
                                            <SelectItem value="Platinum">Platinum</SelectItem>
                                            <SelectItem value="Silver">Silver</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Gemstone</Label>
                                    <Select value={gemstone} onValueChange={setGemstone}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Diamond">Diamond</SelectItem>
                                            <SelectItem value="Ruby">Ruby</SelectItem>
                                            <SelectItem value="Emerald">Emerald</SelectItem>
                                            <SelectItem value="Sapphire">Sapphire</SelectItem>
                                            <SelectItem value="Pearl">Pearl</SelectItem>
                                            <SelectItem value="None">None</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label>Design Description</Label>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleFixGrammar}
                                        className="h-6 text-xs text-muted-foreground hover:text-primary px-2"
                                        title="Fix grammar and formatting"
                                    >
                                        <Wand2 className="w-3 h-3 mr-1" />
                                        Fix Grammar
                                    </Button>
                                </div>
                                <Textarea
                                    placeholder="Describe the details... e.g., 'A vintage floral pattern with intricate filigree work'"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    className="min-h-[150px] resize-none"
                                />
                                <div className="mt-4">
                                    <Label className="text-sm font-medium mb-3 block">Quick Suggestions:</Label>
                                    <div className="flex flex-wrap gap-2.5">
                                        {SUGGESTION_TAGS.map((tag) => (
                                            <Badge
                                                key={tag}
                                                variant="secondary"
                                                className="cursor-pointer hover:bg-primary/20 transition-all px-3 py-1"
                                                onClick={() => handleSuggestionClick(tag)}
                                            >
                                                + {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={handleGenerate}
                                disabled={loading}
                                className="w-full h-12 text-lg shadow-gold"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Generating Design...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-5 w-5" />
                                        Generate Design
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Preview Section */}
                    <Card className="min-h-[400px] flex items-center justify-center bg-muted/50 border-dashed">
                        <CardContent className="p-6 w-full h-full flex flex-col items-center justify-center">
                            {generatedImage ? (
                                <div className="w-full space-y-6">
                                    <div className="relative w-full aspect-square group">
                                        <img
                                            src={generatedImage}
                                            alt="Generated Design"
                                            className="w-full h-full object-cover rounded-xl shadow-lg"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-3 items-center justify-center rounded-xl p-4">
                                            <Button onClick={handlePaymentAndDownload} variant="secondary" size="lg" className="w-full max-w-[200px]" disabled={paying}>
                                                {paying ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Download className="mr-2 h-5 w-5" />}
                                                Download (₹100)
                                            </Button>
                                            <Button onClick={handleSave} variant="outline" size="lg" className="w-full max-w-[200px] bg-white/90 text-black hover:bg-white" disabled={saving}>
                                                {saving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                                                Save to Account
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Weight Display */}
                                    {weightData && (
                                        <div className="bg-gold/10 border border-gold/30 rounded-lg p-3 text-sm">
                                            <div className="flex items-center gap-2 font-medium text-gold-dark mb-1">
                                                <Sparkles className="h-4 w-4" />
                                                Estimated Gold Weight: {weightData.range}
                                            </div>
                                            <p className="text-muted-foreground text-xs">
                                                Based on design analysis: {weightData.analysis.join(', ')}
                                            </p>
                                        </div>
                                    )}

                                    <div className="space-y-4 pt-4 border-t">
                                        <div className="space-y-2">
                                            <Label className="text-lg font-medium">Refine Result</Label>
                                            <p className="text-sm text-muted-foreground">Make adjustments to this specific design:</p>
                                        </div>

                                        <Textarea
                                            value={refinePrompt}
                                            onChange={(e) => setRefinePrompt(e.target.value)}
                                            className="min-h-[100px]"
                                            placeholder="Refine your prompt here..."
                                        />

                                        <div className="flex flex-wrap gap-2">
                                            {REFINEMENT_TAGS.map((tag) => (
                                                <Badge
                                                    key={tag}
                                                    variant="outline"
                                                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-1 text-sm"
                                                    onClick={() => handleRefinementTagClick(tag)}
                                                >
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>

                                        <Button
                                            onClick={handleUpdateDesign}
                                            disabled={loading}
                                            className="w-full"
                                            variant="secondary"
                                        >
                                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="mr-2 h-4 w-4" />}
                                            Update Design
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-muted-foreground">
                                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Sparkles className="h-10 w-10 opacity-50" />
                                    </div>
                                    <p className="text-lg font-medium">Ready to Create</p>
                                    <p className="text-sm">Your AI-generated design will appear here</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
            {/* Floating Chatbot Button */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
                {showChatbot && (
                    <DesignChatbot
                        onClose={() => setShowChatbot(false)}
                        onUsePrompt={(newPrompt) => setPrompt(newPrompt)}
                    />
                )}
                <Button
                    size="icon"
                    className={cn(
                        "h-14 w-14 rounded-full shadow-lg transition-transform hover:scale-105",
                        showChatbot ? "bg-red-500 hover:bg-red-600" : "bg-gradient-gold text-black"
                    )}
                    onClick={() => setShowChatbot(!showChatbot)}
                >
                    {showChatbot ? <Bot className="h-6 w-6 text-white" /> : <MessageCircle className="h-6 w-6" />}
                </Button>
            </div>
        </div>
    )
}

const SUGGESTION_TAGS = [
    "Vintage Style",
    "Modern Minimalist",
    "Art Deco",
    "Nature Inspired",
    "Geometric Patterns",
    "Floral Motifs",
    "Celestial Theme",
    "Royal & Ornate"
]

const REFINEMENT_TAGS = [
    "Add more side stones",
    "Make it simpler",
    "Add intricate filigree",
    "Change to oval cut",
    "Make it chunkier",
    "Add pave setting",
    "Make it more delicate",
    "Add engraving details"
]
