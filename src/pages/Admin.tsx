import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useAdmin } from '@/hooks/useAdmin'
import { useProducts } from '@/contexts/ProductContext'
import { useOrders, Order } from '@/contexts/OrderContext'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2, Plus, Package } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function Admin() {
    const { user } = useAuth()
    const { isAdmin, loading } = useAdmin()
    const { products, addProduct, deleteProduct } = useProducts()
    const { orders, updateStatus } = useOrders()
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
    const [imagePreview, setImagePreview] = useState<string>('')

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Create preview
            const reader = new FileReader()
            reader.onloadend = () => {
                const result = reader.result as string
                setImagePreview(result)
                setNewProduct(prev => ({ ...prev, image: result }))
            }
            reader.readAsDataURL(file)
        }
    }

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
            discount: newProduct.discount ? Number(newProduct.discount) : 0
        })
        setNewProduct({ name: '', description: '', price: '', image: '', category: '', promoCode: '', discount: '' })
        setImagePreview('')
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Paid': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
            case 'Processing': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
            case 'Shipped': return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
            case 'Delivered': return 'bg-green-500/10 text-green-500 border-green-500/20'
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
        }
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    if (!isAdmin) return null

    return (
        <div className="min-h-screen py-12 px-4 bg-background">
            <div className="container mx-auto max-w-7xl">
                <h1 className="text-4xl font-playfair font-bold mb-8 text-gradient-gold">Admin Dashboard</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
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
                                    <label className="text-sm font-medium mb-1 block">Product Image</label>

                                    {/* Image Preview */}
                                    {imagePreview && (
                                        <div className="mb-3 relative">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-48 object-cover rounded-lg border-2 border-gold/20"
                                            />
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="destructive"
                                                className="absolute top-2 right-2"
                                                onClick={() => {
                                                    setImagePreview('')
                                                    setNewProduct({ ...newProduct, image: '' })
                                                }}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    )}

                                    {/* Upload Button */}
                                    <div className="space-y-2">
                                        <label className="block">
                                            <div className="cursor-pointer">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className="w-full border-gold/50 hover:bg-gold/10"
                                                    onClick={() => document.getElementById('image-upload')?.click()}
                                                >
                                                    📁 Upload from Computer
                                                </Button>
                                                <input
                                                    id="image-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleImageUpload}
                                                />
                                            </div>
                                        </label>

                                        <div className="text-center text-xs text-muted-foreground">OR</div>

                                        {/* URL Input */}
                                        <Input
                                            value={newProduct.image}
                                            onChange={e => {
                                                setNewProduct({ ...newProduct, image: e.target.value })
                                                setImagePreview(e.target.value)
                                            }}
                                            placeholder="Paste image URL"
                                        />
                                    </div>
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

                {/* Order Management Section */}
                <Card className="border-gold/20 shadow-elegant">
                    <CardHeader>
                        <CardTitle className="text-2xl font-playfair flex items-center gap-2">
                            <Package className="w-6 h-6 text-gold" />
                            Order Management
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Items</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                            No orders found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    orders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-mono">{order.invoiceNumber}</TableCell>
                                            <TableCell>{order.date}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{order.userEmail}</span>
                                                    <span className="text-xs text-muted-foreground">ID: {order.userId.substring(0, 8)}...</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    {order.items.map((item, idx) => (
                                                        <span key={idx} className="text-sm">
                                                            {item.quantity}x {item.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-bold">₹{order.total.toLocaleString()}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={getStatusColor(order.status)}>
                                                    {order.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Select
                                                    defaultValue={order.status}
                                                    onValueChange={(value) => updateStatus(order.id, value as Order['status'])}
                                                >
                                                    <SelectTrigger className="w-[140px]">
                                                        <SelectValue placeholder="Update Status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Paid">Paid</SelectItem>
                                                        <SelectItem value="Processing">Processing</SelectItem>
                                                        <SelectItem value="Shipped">Shipped</SelectItem>
                                                        <SelectItem value="Delivered">Delivered</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
