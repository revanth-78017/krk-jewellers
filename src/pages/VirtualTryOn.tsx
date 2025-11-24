import { useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision'
import ARCanvas from '@/components/ARCanvas'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Camera, Loader2 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useProducts } from '@/contexts/ProductContext'

export default function VirtualTryOn() {
    const { productId } = useParams()
    const { products } = useProducts()
    const product = products.find(p => p.id === productId)

    const webcamRef = useRef<Webcam>(null)
    const [landmarks, setLandmarks] = useState<any[]>([])
    const [isModelLoaded, setIsModelLoaded] = useState(false)
    const [cameraPermission, setCameraPermission] = useState<boolean | null>(null)
    const requestRef = useRef<number>()
    const handLandmarkerRef = useRef<HandLandmarker | null>(null)

    useEffect(() => {
        const loadModel = async () => {
            try {
                const vision = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
                )
                handLandmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
                        delegate: "GPU"
                    },
                    runningMode: "VIDEO",
                    numHands: 1
                })
                setIsModelLoaded(true)
                toast.success('AR Model loaded successfully')
            } catch (error) {
                console.error('Error loading model:', error)
                toast.error('Failed to load AR model')
            }
        }
        loadModel()

        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current)
            }
            handLandmarkerRef.current?.close()
        }
    }, [])

    const detect = () => {
        if (
            handLandmarkerRef.current &&
            webcamRef.current &&
            webcamRef.current.video &&
            webcamRef.current.video.readyState === 4
        ) {
            const video = webcamRef.current.video
            const startTimeMs = performance.now()
            const result = handLandmarkerRef.current.detectForVideo(video, startTimeMs)

            if (result.landmarks && result.landmarks.length > 0) {
                setLandmarks(result.landmarks[0])
            } else {
                setLandmarks([])
            }
        }
        requestRef.current = requestAnimationFrame(detect)
    }

    useEffect(() => {
        if (isModelLoaded && cameraPermission) {
            detect()
        }
    }, [isModelLoaded, cameraPermission])

    const handleUserMedia = () => {
        setCameraPermission(true)
    }

    const handleUserMediaError = () => {
        setCameraPermission(false)
        toast.error('Camera permission denied')
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            {/* Header */}
            <div className="p-4 flex items-center justify-between z-10 bg-gradient-to-b from-black/80 to-transparent absolute top-0 w-full">
                <Button variant="ghost" asChild className="text-white hover:bg-white/20">
                    <Link to="/gallery">
                        <ArrowLeft className="mr-2 h-6 w-6" /> Back
                    </Link>
                </Button>
                <div className="text-center">
                    <h1 className="text-xl font-playfair font-bold">Virtual Try-On</h1>
                    {product && <p className="text-sm text-gold">{product.name}</p>}
                </div>
                <div className="w-10" /> {/* Spacer */}
            </div>

            {/* Main Content */}
            <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                {!isModelLoaded && (
                    <div className="absolute z-20 flex flex-col items-center">
                        <Loader2 className="w-10 h-10 animate-spin text-gold mb-2" />
                        <p>Loading AR Model...</p>
                    </div>
                )}

                {cameraPermission === false && (
                    <div className="text-center p-4">
                        <Camera className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="mb-4">Camera access is required for Virtual Try-On.</p>
                        <Button onClick={() => window.location.reload()}>Retry</Button>
                    </div>
                )}

                <Webcam
                    ref={webcamRef}
                    onUserMedia={handleUserMedia}
                    onUserMediaError={handleUserMediaError}
                    className="absolute w-full h-full object-cover"
                    mirrored
                    screenshotFormat="image/jpeg"
                    videoConstraints={{
                        facingMode: "user",
                        width: 1280,
                        height: 720
                    }}
                />

                {/* AR Overlay */}
                <ARCanvas landmarks={landmarks} />

                {/* Instructions Overlay */}
                <div className="absolute bottom-10 left-0 w-full text-center z-10 pointer-events-none">
                    <div className="bg-black/50 inline-block px-4 py-2 rounded-full backdrop-blur-sm">
                        <p className="text-sm font-medium">Show your hand to try on the ring</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
