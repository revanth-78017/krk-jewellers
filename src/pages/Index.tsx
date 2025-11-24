import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useState, useEffect, Suspense } from 'react'
import JewelryScene from '@/components/JewelryScene'

export default function Index() {
    const [scrollY, setScrollY] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div className="min-h-screen">
            {/* Hero Section with 3D Background */}
            <section className="relative py-20 px-4 overflow-hidden min-h-[700px] flex items-center">
                {/* 3D Jewelry Scene */}
                <div className="absolute inset-0 pointer-events-none opacity-40">
                    <Suspense fallback={<div className="w-full h-full bg-gradient-to-b from-background/50 to-background" />}>
                        <JewelryScene scrollY={scrollY} />
                    </Suspense>
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background pointer-events-none" />

                <div className="container mx-auto max-w-6xl relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <h1 className="text-5xl md:text-7xl font-bold mb-6">
                            Luxury Jewelry
                            <span className="block text-gradient-gold">Redefined</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Experience the perfect blend of traditional craftsmanship and AI-powered design innovation
                        </p>
                        <div className="flex gap-4 justify-center flex-wrap">
                            <Button asChild size="lg" className="shadow-gold">
                                <Link to="/gallery">Explore Collection</Link>
                            </Button>
                            <Button asChild size="lg" variant="outline">
                                <Link to="/design">AI Design Studio</Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 px-4 bg-muted/30">
                <div className="container mx-auto max-w-6xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                        Why Choose KRK Jewellers
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            title="AI-Powered Design"
                            description="Create custom jewelry designs using cutting-edge AI technology"
                            icon="✨"
                        />
                        <FeatureCard
                            title="Live Gold Rates"
                            description="Real-time gold and silver pricing for transparent transactions"
                            icon="📈"
                        />
                        <FeatureCard
                            title="Premium Quality"
                            description="Certified jewelry with guaranteed purity and craftsmanship"
                            icon="💎"
                        />
                    </div>
                </div>
            </section>

            {/* Products Preview */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl md:text-4xl font-bold">Featured Collection</h2>
                        <Button asChild variant="outline">
                            <Link to="/gallery">View All</Link>
                        </Button>
                    </div>
                    <p className="text-muted-foreground text-center py-8">
                        Products will be displayed here once you set up your Supabase database
                    </p>
                </div>
            </section>
        </div>
    )
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-lg bg-card border shadow-sm hover:shadow-gold transition-all"
        >
            <div className="text-4xl mb-4">{icon}</div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
        </motion.div>
    )
}
