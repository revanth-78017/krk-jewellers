import { useParams, useNavigate } from 'react-router-dom'
import { useProducts } from '@/contexts/ProductContext'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, ShoppingBag, Truck, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

export default function ProductDetails() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { getProduct } = useProducts()
    const { addToCart } = useCart()

    const product = getProduct(id || '')

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <p className="text-xl mb-4">Product not found</p>
                <Button onClick={() => navigate('/gallery')}>Back to Gallery</Button>
            </div>
        )
    }

    const handleAddToCart = () => {
        addToCart(product)
        toast.success('Added to cart')
    }

    return (
        <div className="min-h-screen py-12 px-4 bg-background">
            <div className="container mx-auto max-w-6xl">
                <Button
                    variant="ghost"
                    className="mb-8 hover:bg-transparent hover:text-primary"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Product Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative aspect-square rounded-lg overflow-hidden border-gold/20 shadow-elegant"
                    >
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </motion.div>

                    {/* Product Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <div>
                            <h1 className="text-4xl font-playfair font-bold mb-2 text-gradient-gold">{product.name}</h1>
                            <p className="text-muted-foreground">{product.category}</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-3xl font-bold text-primary">₹{product.price.toLocaleString()}</span>
                            {product.weight && <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">Weight: {product.weight}</span>}
                        </div>

                        <Tabs defaultValue="details" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="details">Product Details</TabsTrigger>
                                <TabsTrigger value="breakup">Price Breakup</TabsTrigger>
                            </TabsList>

                            <TabsContent value="details" className="mt-6 space-y-4">
                                <p className="text-muted-foreground leading-relaxed">
                                    {product.description}
                                </p>
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <ShieldCheck className="w-4 h-4 text-gold" /> Certified Authenticity
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Truck className="w-4 h-4 text-gold" /> Secure Shipping
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="breakup" className="mt-6">
                                <div className="border rounded-lg overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead className="bg-muted/50">
                                            <tr>
                                                <th className="p-3 text-left font-medium">Component</th>
                                                <th className="p-3 text-right font-medium">Rate/Weight</th>
                                                <th className="p-3 text-right font-medium">Value</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            <tr>
                                                <td className="p-3">
                                                    <div className="font-medium">{product.material || 'Gold'}</div>
                                                </td>
                                                <td className="p-3 text-right text-muted-foreground">{product.weight}</td>
                                                <td className="p-3 text-right">₹{((product.price - (product.makingCharges || 0) - (product.gst || 0) - (product.stoneWeight === '0 ct' ? 0 : 5000))).toLocaleString()}</td>
                                            </tr>
                                            {product.stoneWeight && product.stoneWeight !== '0 ct' && (
                                                <tr>
                                                    <td className="p-3">
                                                        <div className="font-medium">Stone</div>
                                                    </td>
                                                    <td className="p-3 text-right text-muted-foreground">{product.stoneWeight}</td>
                                                    <td className="p-3 text-right">₹5,000</td>
                                                </tr>
                                            )}
                                            <tr>
                                                <td className="p-3">Making Charges</td>
                                                <td className="p-3 text-right text-muted-foreground">-</td>
                                                <td className="p-3 text-right">₹{(product.makingCharges || 0).toLocaleString()}</td>
                                            </tr>
                                            <tr>
                                                <td className="p-3">GST (3%)</td>
                                                <td className="p-3 text-right text-muted-foreground">-</td>
                                                <td className="p-3 text-right">₹{(product.gst || 0).toLocaleString()}</td>
                                            </tr>
                                            <tr className="bg-muted/20 font-bold">
                                                <td className="p-3">Grand Total</td>
                                                <td className="p-3 text-right"></td>
                                                <td className="p-3 text-right">₹{product.price.toLocaleString()}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </TabsContent>
                        </Tabs>

                        <div className="pt-6 border-t">
                            <Button
                                size="lg"
                                className="w-full bg-gradient-gold text-black hover:opacity-90"
                                onClick={handleAddToCart}
                            >
                                <ShoppingBag className="w-4 h-4 mr-2" /> Add to Cart
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
