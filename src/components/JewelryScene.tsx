import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, PerspectiveCamera, Float } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

interface JewelrySceneProps {
    scrollY: number
}

function Ring({ position, scrollY }: { position: [number, number, number], scrollY: number }) {
    const meshRef = useRef<THREE.Mesh>(null)

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh ref={meshRef} position={position} rotation={[0, scrollY * 0.01, 0]}>
                {/* Outer Ring */}
                <torusGeometry args={[1, 0.15, 32, 100]} />
                <meshStandardMaterial
                    color="#FFD700"
                    metalness={0.9}
                    roughness={0.1}
                    envMapIntensity={1.5}
                />

                {/* Diamond on top */}
                <mesh position={[0, 1.2, 0]} rotation={[0, Math.PI / 4, 0]}>
                    <octahedronGeometry args={[0.3, 0]} />
                    <meshPhysicalMaterial
                        color="#ffffff"
                        metalness={0.1}
                        roughness={0}
                        transmission={0.95}
                        thickness={0.5}
                        envMapIntensity={2}
                        clearcoat={1}
                        clearcoatRoughness={0}
                    />
                </mesh>
            </mesh>
        </Float>
    )
}

function Necklace({ position, scrollY }: { position: [number, number, number], scrollY: number }) {
    return (
        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
            <group position={position} rotation={[0, -scrollY * 0.008, 0]}>
                {/* Chain */}
                <mesh>
                    <torusGeometry args={[1.5, 0.05, 16, 100, Math.PI * 1.5]} />
                    <meshStandardMaterial
                        color="#FFD700"
                        metalness={0.95}
                        roughness={0.05}
                    />
                </mesh>

                {/* Pendant */}
                <mesh position={[0, -1.8, 0]}>
                    <sphereGeometry args={[0.4, 32, 32]} />
                    <meshPhysicalMaterial
                        color="#4169E1"
                        metalness={0.2}
                        roughness={0}
                        transmission={0.9}
                        thickness={0.8}
                        envMapIntensity={2.5}
                    />
                </mesh>
            </group>
        </Float>
    )
}

function Bracelet({ position, scrollY }: { position: [number, number, number], scrollY: number }) {
    return (
        <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.4}>
            <group position={position} rotation={[Math.PI / 2, scrollY * 0.012, 0]}>
                {/* Multiple linked segments */}
                {Array.from({ length: 12 }).map((_, i) => (
                    <mesh
                        key={i}
                        position={[
                            Math.cos((i / 12) * Math.PI * 2) * 1.2,
                            Math.sin((i / 12) * Math.PI * 2) * 1.2,
                            0
                        ]}
                        rotation={[0, 0, (i / 12) * Math.PI * 2]}
                    >
                        <boxGeometry args={[0.3, 0.15, 0.1]} />
                        <meshStandardMaterial
                            color="#C0C0C0"
                            metalness={0.95}
                            roughness={0.1}
                        />
                    </mesh>
                ))}
            </group>
        </Float>
    )
}

function Earring({ position, scrollY }: { position: [number, number, number], scrollY: number }) {
    return (
        <Float speed={2.2} rotationIntensity={0.6} floatIntensity={0.6}>
            <group position={position} rotation={[0, scrollY * 0.015, 0]}>
                {/* Hook */}
                <mesh position={[0, 0.5, 0]}>
                    <torusGeometry args={[0.15, 0.03, 16, 32, Math.PI]} />
                    <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
                </mesh>

                {/* Hanging gem */}
                <mesh position={[0, -0.3, 0]}>
                    <coneGeometry args={[0.25, 0.6, 32]} />
                    <meshPhysicalMaterial
                        color="#DC143C"
                        metalness={0.1}
                        roughness={0}
                        transmission={0.85}
                        thickness={0.5}
                        envMapIntensity={2}
                    />
                </mesh>
            </group>
        </Float>
    )
}

export default function JewelryScene({ scrollY }: JewelrySceneProps) {
    return (
        <Canvas shadows style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <PerspectiveCamera makeDefault position={[0, 0, 8]} />

            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <spotLight position={[-10, -10, -10]} angle={0.15} penumbra={1} intensity={0.5} />
            <pointLight position={[0, 5, 0]} intensity={0.5} />

            {/* Environment for reflections */}
            <Environment preset="studio" />

            {/* 3D Jewelry Models */}
            <Ring position={[-3, 2, 0]} scrollY={scrollY} />
            <Necklace position={[3, 1, -1]} scrollY={scrollY} />
            <Bracelet position={[-2, -2, 1]} scrollY={scrollY} />
            <Earring position={[3, -1, 0]} scrollY={scrollY} />

            {/* Subtle orbit controls */}
            <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate
                autoRotateSpeed={0.5}
                maxPolarAngle={Math.PI / 2}
                minPolarAngle={Math.PI / 2}
            />
        </Canvas>
    )
}
