import { useEffect, useRef, useState } from 'react'

interface ARCanvasProps {
    landmarks: any[]
    videoWidth: number
    videoHeight: number
    productImage?: string
}

// Smoothing filter for stable tracking
class SmoothingFilter {
    private history: { x: number; y: number }[] = []
    private maxHistory = 5

    smooth(x: number, y: number): { x: number; y: number } {
        this.history.push({ x, y })
        if (this.history.length > this.maxHistory) {
            this.history.shift()
        }

        const sum = this.history.reduce(
            (acc, point) => ({ x: acc.x + point.x, y: acc.y + point.y }),
            { x: 0, y: 0 }
        )

        return {
            x: sum.x / this.history.length,
            y: sum.y / this.history.length
        }
    }

    reset() {
        this.history = []
    }
}

export default function ARCanvas({ landmarks, videoWidth, videoHeight, productImage }: ARCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [processedImage, setProcessedImage] = useState<HTMLCanvasElement | null>(null)
    const smoothingFilter = useRef(new SmoothingFilter())

    // Load and process product image once
    useEffect(() => {
        if (productImage) {
            const img = new Image()
            img.crossOrigin = 'anonymous'
            img.onload = () => {

                // Pre-process image at higher resolution for better quality
                const tempCanvas = document.createElement('canvas')
                const tempCtx = tempCanvas.getContext('2d', {
                    alpha: true,
                    willReadFrequently: true
                })

                if (tempCtx) {
                    // Use original image size for maximum quality
                    tempCanvas.width = img.width
                    tempCanvas.height = img.height

                    // Enable image smoothing for better quality
                    tempCtx.imageSmoothingEnabled = true
                    tempCtx.imageSmoothingQuality = 'high'

                    tempCtx.drawImage(img, 0, 0)

                    // Get image data to remove background
                    const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height)
                    const data = imageData.data

                    for (let i = 0; i < data.length; i += 4) {
                        const r = data[i]
                        const g = data[i + 1]
                        const b = data[i + 2]

                        // Calculate brightness and saturation
                        const brightness = (r + g + b) / 3
                        const max = Math.max(r, g, b)
                        const min = Math.min(r, g, b)
                        const saturation = max === 0 ? 0 : (max - min) / max

                        // Remove white/light backgrounds with better detection
                        if (brightness > 200 && saturation < 0.2) {
                            data[i + 3] = 0
                        } else if (brightness > 220) {
                            // Gradual fade for edges
                            data[i + 3] = Math.max(0, (255 - brightness) * 3)
                        }
                    }

                    tempCtx.putImageData(imageData, 0, 0)
                    setProcessedImage(tempCanvas)
                }
            }
            img.src = productImage
        }
    }, [productImage])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d', { alpha: true })
        if (!ctx) return

        // Enable high-quality rendering
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'

        // Clear with transparency
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw product image if hand is detected
        if (landmarks && landmarks.length > 0 && processedImage) {
            const mcp = landmarks[13] // Ring Finger MCP (base)
            const pip = landmarks[14] // Ring Finger PIP (middle joint)
            const dip = landmarks[15] // Ring Finger DIP
            const tip = landmarks[16] // Ring Finger TIP

            if (mcp && pip && dip && tip) {
                // Convert to canvas coordinates
                const mcpX = mcp.x * videoWidth
                const mcpY = mcp.y * videoHeight
                const pipX = pip.x * videoWidth
                const pipY = pip.y * videoHeight
                const dipX = dip.x * videoWidth
                const dipY = dip.y * videoHeight

                // Calculate ring position - right at the base of the finger
                const rawRingX = mcpX + (pipX - mcpX) * 0.1
                const rawRingY = mcpY + (pipY - mcpY) * 0.1
                const smoothed = smoothingFilter.current.smooth(rawRingX, rawRingY)

                // Calculate finger width more accurately
                const dx = pipX - mcpX
                const dy = pipY - mcpY
                const fingerLength = Math.sqrt(dx * dx + dy * dy)

                // Use DIP to MCP distance for better width estimation
                const dipDx = dipX - mcpX
                const dipDy = dipY - mcpY
                const baseToMidLength = Math.sqrt(dipDx * dipDx + dipDy * dipDy)

                // Ring size - much smaller and more accurate
                const ringSize = Math.min(fingerLength * 0.35, baseToMidLength * 0.4)

                // Calculate rotation angle
                const angle = Math.atan2(dy, dx)

                // Draw with professional effects
                ctx.save()
                ctx.translate(smoothed.x, smoothed.y)
                ctx.rotate(angle)

                // Enhanced shadow for depth
                ctx.shadowColor = 'rgba(0, 0, 0, 0.7)'
                ctx.shadowBlur = 15
                ctx.shadowOffsetX = 4
                ctx.shadowOffsetY = 4

                // Draw the processed image with high quality
                ctx.globalAlpha = 0.98
                ctx.drawImage(
                    processedImage,
                    -ringSize / 2,
                    -ringSize / 2,
                    ringSize,
                    ringSize
                )

                // Add subtle highlight for metallic effect
                ctx.globalAlpha = 0.15
                ctx.shadowColor = 'transparent'
                const highlightGradient = ctx.createRadialGradient(
                    -ringSize * 0.25, -ringSize * 0.25, 0,
                    -ringSize * 0.25, -ringSize * 0.25, ringSize * 0.35
                )
                highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)')
                highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
                ctx.fillStyle = highlightGradient
                ctx.fillRect(-ringSize / 2, -ringSize / 2, ringSize, ringSize)

                ctx.restore()
            }
        } else {
            // Reset smoothing when hand is lost
            smoothingFilter.current.reset()
        }
    }, [landmarks, videoWidth, videoHeight, processedImage])

    return (
        <canvas
            ref={canvasRef}
            width={videoWidth}
            height={videoHeight}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 10
            }}
        />
    )
}
