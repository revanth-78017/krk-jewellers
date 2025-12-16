import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Rotate3d, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react'

interface Viewer360Props {
    images: string[]
    initialIndex?: number
    autoPlay?: boolean
}

export function Viewer360({ images, initialIndex = 0, autoPlay = false }: Viewer360Props) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex)
    const [isPlaying, setIsPlaying] = useState(autoPlay)
    const [isDragging, setIsDragging] = useState(false)
    const startX = useRef<number>(0)
    const containerRef = useRef<HTMLDivElement>(null)
    const autoPlayRef = useRef<NodeJS.Timeout>()

    useEffect(() => {
        if (isPlaying) {
            autoPlayRef.current = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % images.length)
            }, 800) // Change image every 800ms
        } else {
            clearInterval(autoPlayRef.current)
        }
        return () => clearInterval(autoPlayRef.current)
    }, [isPlaying, images.length])

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true)
        startX.current = e.clientX
        setIsPlaying(false) // Stop autoplay on interaction
    }

    const handleTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true)
        startX.current = e.touches[0].clientX
        setIsPlaying(false)
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return

        const diff = e.clientX - startX.current
        if (Math.abs(diff) > 50) { // Threshold for change
            if (diff > 0) {
                setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
            } else {
                setCurrentIndex((prev) => (prev + 1) % images.length)
            }
            startX.current = e.clientX
        }
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return

        const diff = e.touches[0].clientX - startX.current
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
            } else {
                setCurrentIndex((prev) => (prev + 1) % images.length)
            }
            startX.current = e.touches[0].clientX
        }
    }

    const handleMouseUp = () => setIsDragging(false)

    return (
        <div className="flex flex-col gap-4 w-full">
            <div
                ref={containerRef}
                className="relative aspect-square bg-muted/30 rounded-lg overflow-hidden cursor-grab active:cursor-grabbing select-none border border-gold/20 shadow-inner group"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleMouseUp}
            >
                {/* Images */}
                {images.map((src, index) => (
                    <img
                        key={index}
                        src={src}
                        alt={`Angle ${index + 1}`}
                        className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                            }`}
                        draggable={false}
                    />
                ))}

                {/* Overlay Indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                    Drag to Rotate
                </div>

                <div className="absolute top-4 right-4 z-20">
                    <Badge variant="secondary" className="bg-black/40 text-white backdrop-blur-md">
                        <Rotate3d className="w-3 h-3 mr-1" /> 360° View
                    </Badge>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 justify-between px-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
                    disabled={isPlaying}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex-1 flex gap-2 items-center justify-center">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-32"
                    >
                        {isPlaying ? (
                            <>
                                <Pause className="h-4 w-4 mr-2" /> Pause
                            </>
                        ) : (
                            <>
                                <Play className="h-4 w-4 mr-2" /> Auto Rotate
                            </>
                        )}
                    </Button>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
                    disabled={isPlaying}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-1.5 mt-2">
                {images.map((_, idx) => (
                    <div
                        key={idx}
                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-primary' : 'w-1.5 bg-primary/20'
                            }`}
                    />
                ))}
            </div>
        </div>
    )
}
