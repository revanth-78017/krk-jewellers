import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2, Download, Sparkles } from 'lucide-react'

export default function Design() {
    const [prompt, setPrompt] = useState('')
    const [jewelryType, setJewelryType] = useState('Ring')
    const [material, setMaterial] = useState('Gold')
    const [gemstone, setGemstone] = useState('Diamond')
    const [loading, setLoading] = useState(false)
    const [generatedImage, setGeneratedImage] = useState<string | null>(null)

    const handleGenerate = async () => {
        if (!prompt) {
            toast.error('Please describe your design idea')
            return
        }

        setLoading(true)
        try {
            const fullPrompt = `Design a realistic, high-quality luxury ${jewelryType} made of ${material} featuring ${gemstone}. Description: ${prompt}. The image should be photorealistic, professional jewelry photography style, white background.`

            const apiKey = import.meta.env.VITE_IMAGE_GENERATION_API_KEY

            if (!apiKey) {
                throw new Error('Image Generation API Key is missing')
            }

            const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'google/gemini-2.5-flash-image-preview',
                    messages: [{
                        role: 'user',
                        content: fullPrompt
                    }]
                })
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error?.message || 'Failed to generate design')
            }

            const data = await response.json()
            const imageUrl = data.choices[0].message.content
            setGeneratedImage(imageUrl)
            toast.success('Design generated successfully!')
        } catch (error: any) {
            console.error('Generation error:', error)
            toast.error(error.message || 'Failed to generate design')
        } finally {
            setLoading(false)
        }
    }

    const handleDownload = () => {
        if (generatedImage) {
            const link = document.createElement('a')
            link.href = generatedImage
            link.download = `krk-design-${Date.now()}.png`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }
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
                                <Label>Design Description</Label>
                                <Textarea
                                    placeholder="Describe the details... e.g., 'A vintage floral pattern with intricate filigree work'"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    className="min-h-[150px] resize-none"
                                />
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
                                <div className="relative w-full h-full group">
                                    <img
                                        src={generatedImage}
                                        alt="Generated Design"
                                        className="w-full h-auto rounded-lg shadow-lg"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                                        <Button onClick={handleDownload} variant="secondary" size="lg">
                                            <Download className="mr-2 h-5 w-5" />
                                            Download Design
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
        </div>
    )
}
