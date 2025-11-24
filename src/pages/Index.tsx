import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function Index() {
    const [scrollY, setScrollY] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Calculate rotation based on scroll
    const rotateX = scrollY * 0.1
    const rotateY = scrollY * 0.2
    const scale = 1 + (scrollY * 0.001)

    return (
        <div className="min-h-screen">
            {/* Hero Section with 3D Background */}
            <section className="relative py-20 px-4 overflow-hidden min-h-[700px] flex items-center">
                {/* 3D Jewelry Background */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div
                        className="relative w-[800px] h-[800px]"
                        style={{
                            transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
                            transition: 'transform 0.1s ease-out'
                        }}
                    >
                        {/* Ring 1 - Top Left */}
                        <motion.img
                            src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop"
                            alt="Ring"
                            className="absolute top-10 left-10 w-80 h-80 object-contain opacity-60 drop-shadow-2xl"
                            style={{
                                transform: `translateZ(100px) rotateZ(${scrollY * 0.3}deg)`,
                                filter: 'brightness(1.2) contrast(1.1)'
                            }}
                        />

                        {/* Necklace - Top Right */}
                        <motion.img
                            src="https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=800&auto=format&fit=crop"
                            alt="Necklace"
                            className="absolute top-20 right-10 w-96 h-96 object-contain opacity-50 drop-shadow-2xl"
                            style={{
                                transform: `translateZ(-50px) rotateZ(${-scrollY * 0.2}deg)`,
                                filter: 'brightness(1.1)'
                            }}
                        />

                        {/* Diamond Ring - Bottom Left */}
                        <motion.img
                            src="https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop"
                            alt="Diamond Ring"
                            className="absolute bottom-20 left-20 w-72 h-72 object-contain opacity-70 drop-shadow-2xl"
                            style={{
                                transform: `translateZ(150px) rotateZ(${scrollY * 0.15}deg)`,
                                filter: 'brightness(1.3) contrast(1.2)'
                            }}
                        />

                        {/* Bracelet - Bottom Right */}
                        <motion.img
                            src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop"
                            alt="Bracelet"
                            className="absolute bottom-10 right-20 w-64 h-64 object-contain opacity-55 drop-shadow-2xl"
                            style={{
                                transform: `translateZ(-80px) rotateZ(${-scrollY * 0.25}deg)`,
                                filter: 'brightness(1.15)'
                            }}
                        />
                    </div>
                </div>

                {/* Gradient Overlay - More subtle */}
                <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />

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
