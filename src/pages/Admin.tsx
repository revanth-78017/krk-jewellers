import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useAdmin } from '@/hooks/useAdmin'
import { useProducts } from '@/contexts/ProductContext'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2, Plus } from 'lucide-react'

export default function Admin() {
    const { user } = useAuth()
    const { isAdmin, loading } = useAdmin()
    const { products, addProduct, deleteProduct } = useProducts()
    const navigate = useNavigate()

    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        image: '',
        category: '',
        promoCode: '',
        discount: ''
    })

    useEffect(() => {
        if (!loading) {
            if (!user) {
                navigate('/auth')
            } else if (!isAdmin) {
                navigate('/')
            }
        }
    }, [user, isAdmin, loading, navigate])

    const handleAddProduct = (e: React.FormEvent) => {
        e.preventDefault()
        addProduct({
            ...newProduct,
            price: Number(newProduct.price),
            discount: newProduct.discount ? Number(newProduct.discount) : undefined
        })
        setNewProduct({ name: '', description: '', price: '', image: '', category: '', promoCode: '', discount: '' })
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    if (!isAdmin) return null

    return (
        <div className="min-h-screen py-12 px-4 bg-background">
            <div className="container mx-auto max-w-6xl">
                <h1 className="text-4xl font-playfair font-bold mb-8 text-gradient-gold">Admin Dashboard</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Add Product Form */}
                    <Card className="lg:col-span-1 h-fit shadow-elegant border-gold/20">
                        <CardHeader>
                            <CardTitle className="text-2xl font-playfair">Add New Product</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAddProduct} className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Name</label>
                                    <Input
                                        value={newProduct.name}
                                        onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                        required
                                        placeholder="Ex: Gold Necklace"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Category</label>
                                    <Input
                                        value={newProduct.category}
                                        onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                                        required
                                        placeholder="Ex: Necklaces"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Price (₹)</label>
                                        <Input
                                            type="number"
                                            value={newProduct.price}
                                            onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                                            required
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Discount (%)</label>
                                        <Input
                                            type="number"
                                            value={newProduct.discount}
                                            onChange={e => setNewProduct({ ...newProduct, discount: e.target.value })}
                                            placeholder="Optional"
                                            min="0"
                                            max="100"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Promo Code</label>
                                    <Input
                                        value={newProduct.promoCode}
                                        onChange={e => setNewProduct({ ...newProduct, promoCode: e.target.value })}
                                        placeholder="Optional (e.g. SAVE10)"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Image URL</label>
                                    <Input
                                        value={newProduct.image}
                                        onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                                        required
                                        placeholder="https://..."
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Description</label>
                                    <Textarea
                                        value={newProduct.description}
                                        onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                                        required
                                        placeholder="Product details..."
                                    />
                                </div>
                                <Button type="submit" className="w-full bg-gradient-gold text-black hover:opacity-90">
                                    <Plus className="w-4 h-4 mr-2" /> Add Product
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Product List */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-2xl font-playfair font-semibold">Inventory ({products.length})</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {products.map(product => (
                                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow border-gold/10">
                                    <div className="aspect-video relative">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                                            ₹{product.price.toLocaleString()}
                                        </div>
                                        {product.promoCode && (
                                            <div className="absolute bottom-2 left-2 bg-primary text-white px-2 py-1 rounded text-xs font-bold">
                                                Code: {product.promoCode} (-{product.discount}%)
                                            </div>
                                        )}
                                    </div>
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-semibold text-lg">{product.name}</h3>
                                                <p className="text-sm text-muted-foreground">{product.category}</p>
                                            </div>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => deleteProduct(product.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
