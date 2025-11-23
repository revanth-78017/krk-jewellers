import { motion } from 'framer-motion';
import { ArrowRight, Star, Diamond, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Showcase = () => {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-gold-500 selection:text-black font-serif">
            {/* Hero Section */}
            <section className="relative h-screen w-full overflow-hidden">
                <div
                    className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2070&auto=format&fit=crop')] 
          bg-cover bg-center bg-no-repeat opacity-60 scale-105 animate-slow-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black" />

                <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                    >
                        <h2 className="text-gold-400 tracking-[0.2em] text-sm uppercase mb-4 font-sans">Est. 1985 • Fine Jewelry</h2>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="text-6xl md:text-8xl lg:text-9xl font-playfair font-bold mb-6 leading-tight"
                    >
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200">
                            Timeless
                        </span>
                        <span className="block text-white">Elegance</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="max-w-2xl text-gray-300 text-lg md:text-xl font-light italic mb-10"
                    >
                        Discover a collection where artistry meets eternity. Handcrafted with passion, designed for the extraordinary.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 1 }}
                        className="flex gap-6"
                    >
                        <Button className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-black hover:from-yellow-500 hover:to-yellow-300 px-8 py-6 text-lg rounded-full font-sans font-semibold tracking-wide transition-all hover:scale-105 shadow-[0_0_20px_rgba(234,179,8,0.3)]">
                            Explore Collection
                        </Button>
                        <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full font-sans tracking-wide backdrop-blur-sm">
                            View Lookbook
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* Featured Categories - Glassmorphism */}
            <section className="py-24 px-4 md:px-12 bg-zinc-950 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-yellow-900/20 via-transparent to-transparent" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex justify-between items-end mb-16">
                        <div>
                            <h3 className="text-gold-500 font-sans text-sm tracking-widest uppercase mb-2">Curated Selection</h3>
                            <h2 className="text-4xl md:text-5xl font-playfair text-white">Our Masterpieces</h2>
                        </div>
                        <Button variant="link" className="text-yellow-400 hover:text-yellow-300 hidden md:flex items-center gap-2">
                            View All Categories <ArrowRight size={16} />
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: 'Royal Necklaces', img: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=1974&auto=format&fit=crop', price: 'From $1,200' },
                            { title: 'Bridal Rings', img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=2070&auto=format&fit=crop', price: 'From $850' },
                            { title: 'Vintage Earrings', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1974&auto=format&fit=crop', price: 'From $450' }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10 }}
                                className="group relative h-[500px] rounded-2xl overflow-hidden cursor-pointer"
                            >
                                <div className="absolute inset-0 bg-gray-800">
                                    <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                                <div className="absolute bottom-0 left-0 w-full p-8 transform transition-transform duration-500">
                                    <h3 className="text-3xl font-playfair text-white mb-2">{item.title}</h3>
                                    <p className="text-yellow-400 font-sans mb-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">{item.price}</p>
                                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                                        <ArrowRight size={20} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Feature Section */}
            <section className="py-32 bg-black relative">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-yellow-500 to-yellow-200 rounded-full opacity-20 blur-3xl" />
                        <img
                            src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=1974&auto=format&fit=crop"
                            alt="Craftsmanship"
                            className="relative rounded-lg shadow-2xl border border-white/10"
                        />
                        <div className="absolute -bottom-10 -right-10 bg-zinc-900 p-8 rounded-lg border border-white/10 shadow-xl max-w-xs hidden md:block">
                            <div className="flex gap-1 text-yellow-500 mb-2">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                            </div>
                            <p className="text-gray-300 italic text-sm">"The attention to detail is simply stupendous. A true masterpiece."</p>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-[1px] w-12 bg-yellow-500" />
                            <span className="text-yellow-500 uppercase tracking-widest text-sm">Our Philosophy</span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-playfair text-white mb-8 leading-tight">
                            Crafting <span className="italic text-yellow-400">Dreams</span> into Reality
                        </h2>
                        <p className="text-gray-400 text-lg mb-8 leading-relaxed font-light">
                            Every piece tells a story. Our artisans combine centuries-old techniques with modern innovation to create jewelry that isn't just worn, but experienced.
                        </p>

                        <div className="grid grid-cols-2 gap-8 mb-10">
                            <div className="flex flex-col gap-2">
                                <Diamond className="text-yellow-500 mb-2" size={32} />
                                <h4 className="text-xl text-white font-playfair">Certified Gems</h4>
                                <p className="text-sm text-gray-500">Ethically sourced, GIA certified diamonds and gemstones.</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <ShoppingBag className="text-yellow-500 mb-2" size={32} />
                                <h4 className="text-xl text-white font-playfair">Bespoke Design</h4>
                                <p className="text-sm text-gray-500">Custom creations tailored to your unique vision.</p>
                            </div>
                        </div>

                        <Button className="bg-white text-black hover:bg-gray-200 rounded-none px-8 py-3 font-sans uppercase tracking-widest text-sm">
                            Read Our Story
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Showcase;
