import { useProducts } from '@/contexts/ProductContext'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { ShoppingBag } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function Gallery() {
    const { products } = useProducts()
    const { addToCart } = useCart()

    return (
        <div className="min-h-screen py-12 px-4 bg-background">
            <div className="container mx-auto max-w-7xl">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-4 text-gradient-gold">
                        Exquisite Collection
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Explore our handpicked selection of timeless jewelry, crafted for those who appreciate elegance.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="group overflow-hidden border-gold/20 hover:shadow-elegant transition-all duration-300 h-full flex flex-col">
                                <Link to={`/product/${product.id}`} className="block flex-grow">
                                    <div className="relative aspect-[4/5] overflow-hidden">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-playfair text-xl font-semibold">{product.name}</h3>
                                            <span className="text-primary font-bold">₹{product.price.toLocaleString()}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{product.description}</p>
                                    </CardContent>
                                </Link>
                                <CardFooter className="p-6 pt-0 mt-auto">
                                    <Button
                                        className="w-full bg-gradient-gold text-black hover:opacity-90"
                                        onClick={() => addToCart(product)}
                                    >
                                        <ShoppingBag className="w-4 h-4 mr-2" /> Add to Cart
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}
