import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { Environment } from '@react-three/drei'

interface ARCanvasProps {
    landmarks: any[]
}

function Ring({ landmarks }: { landmarks: any[] }) {
    const meshRef = useRef<THREE.Mesh>(null)

    useFrame(() => {
        if (!meshRef.current) return

        if (!landmarks || landmarks.length === 0) {
            meshRef.current.visible = false
            return
        }

        // Hand landmarks for ring finger
        // 13: Ring Finger MCP (base)
        // 14: Ring Finger PIP (middle joint)
        const mcp = landmarks[13]
        const pip = landmarks[14]

        if (mcp && pip) {
            meshRef.current.visible = true

            // Calculate position (midpoint between MCP and PIP, slightly closer to MCP)
            // Coordinates are normalized [0, 1], need to map to 3D space
            // This is a simplified mapping; real AR requires calibration matrix
            // For 2D overlay on webcam, we usually map x/y to screen coords and z to depth

            // In a proper AR setup we'd use the webcam as a background and align the camera
            // Here we'll try to position it in a "screen space" equivalent

            // Note: MediaPipe coords: x (0-1), y (0-1), z (depth)
            // R3F default camera is at z=5 looking at 0,0,0

            // We need to unproject or just map simply for a 2D-like overlay effect
            // Let's try mapping 0-1 to a range visible by the camera
            // Assuming camera z=5, fov=75, aspect ratio ~1.33

            const x = (mcp.x - 0.5) * -10 // Flip X for mirror effect if needed
            const y = -(mcp.y - 0.5) * 8
            const z = -mcp.z * 10 // Depth scaling

            // Calculate rotation
            // Vector from MCP to PIP
            const dx = pip.x - mcp.x
            const dy = pip.y - mcp.y
            const angle = Math.atan2(dy, dx)

            meshRef.current.position.set(x, y, z) // Use calculated depth
            meshRef.current.rotation.z = -angle

            // Scale based on z or distance between points
            const dist = Math.sqrt(dx * dx + dy * dy)
            const scale = dist * 10
            meshRef.current.scale.set(scale, scale, scale)
        }
    })

    return (
        <mesh ref={meshRef} visible={false}>
            <torusGeometry args={[0.3, 0.05, 16, 100]} />
            <meshStandardMaterial
                color="#D4AF37"
                metalness={1}
                roughness={0.1}
            />
        </mesh>
    )
}

export default function ARCanvas({ landmarks }: ARCanvasProps) {
    return (
        <Canvas
            camera={{ position: [0, 0, 5], fov: 75 }}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none' // Let clicks pass through to webcam/ui
            }}
            gl={{ alpha: true }} // Transparent background
        >
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <Environment preset="city" />
            <Ring landmarks={landmarks} />
        </Canvas>
    )
}
