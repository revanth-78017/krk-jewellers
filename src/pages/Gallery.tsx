import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Heart, ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'

interface JewelryItem {
    id: string
    title: string
    price: number
    image: string
    category: string
    description: string
}

export default function Gallery() {
    const [items, setItems] = useState<JewelryItem[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState('all')

    const categories = ['all', 'rings', 'necklaces', 'earrings', 'bracelets']

    useEffect(() => {
        // Simulate loading jewelry items with Unsplash images
        const fetchJewelry = async () => {
            setLoading(true)
            try {
                // Using Unsplash source URLs for jewelry images
                const jewelryData: JewelryItem[] = [
                    {
                        id: '1',
                        title: 'Diamond Engagement Ring',
                        price: 2500,
                        image: 'https://source.unsplash.com/featured/?diamond-ring&sig=1',
                        category: 'rings',
                        description: 'Stunning 2-carat diamond in platinum setting'
                    },
                    {
                        id: '2',
                        title: 'Gold Necklace',
                        price: 1800,
                        image: 'https://source.unsplash.com/featured/?gold-necklace&sig=2',
                        category: 'necklaces',
                        description: '18k gold chain with pendant'
                    },
                    {
                        id: '3',
                        title: 'Pearl Earrings',
                        price: 450,
                        image: 'https://source.unsplash.com/featured/?pearl-earrings&sig=3',
                        category: 'earrings',
                        description: 'Freshwater pearls in sterling silver'
                    },
                    {
                        id: '4',
                        title: 'Silver Bracelet',
                        price: 320,
                        image: 'https://source.unsplash.com/featured/?silver-bracelet&sig=4',
                        category: 'bracelets',
                        description: 'Sterling silver bangle with engraving'
                    },
                    {
                        id: '5',
                        title: 'Sapphire Ring',
                        price: 1200,
                        image: 'https://source.unsplash.com/featured/?sapphire-ring&sig=5',
                        category: 'rings',
                        description: 'Blue sapphire in white gold setting'
                    },
                    {
                        id: '6',
                        title: 'Emerald Necklace',
                        price: 3200,
                        image: 'https://source.unsplash.com/featured/?emerald-necklace&sig=6',
                        category: 'necklaces',
                        description: 'Colombian emeralds in gold chain'
                    },
                    {
                        id: '7',
                        title: 'Diamond Studs',
                        price: 890,
                        image: 'https://source.unsplash.com/featured/?diamond-earrings&sig=7',
                        category: 'earrings',
                        description: '0.5ct diamonds in platinum'
                    },
                    {
                        id: '8',
                        title: 'Gold Bangle',
                        price: 650,
                        image: 'https://source.unsplash.com/featured/?gold-bangle&sig=8',
                        category: 'bracelets',
                        description: '22k gold traditional bangle'
                    }
                ]
                setItems(jewelryData)
            } catch (error) {
                toast.error('Failed to load gallery items')
            } finally {
                setLoading(false)
            }
        }

        fetchJewelry()
    }, [])

    const filteredItems = selectedCategory === 'all'
        ? items
        : items.filter(item => item.category === selectedCategory)

    const handleAddToCart = (item: JewelryItem) => {
        toast.success(`${item.title} added to cart!`)
    }

    const handleAddToWishlist = (item: JewelryItem) => {
        toast.success(`${item.title} added to wishlist!`)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient-gold">
                        Our Collection
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Discover our exquisite collection of handcrafted jewelry pieces
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex justify-center mb-8">
                    <div className="flex gap-2 flex-wrap">
                        {categories.map((category) => (
                            <Button
                                key={category}
                                variant={selectedCategory === category ? "default" : "outline"}
                                onClick={() => setSelectedCategory(category)}
                                className="capitalize"
                            >
                                {category}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredItems.map((item) => (
                        <Card key={item.id} className="group hover:shadow-lg transition-shadow">
                            <CardContent className="p-0">
                                <div className="relative overflow-hidden rounded-t-lg">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                                        loading="lazy"
                                    />
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => handleAddToWishlist(item)}
                                        >
                                            <Heart className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <Badge className="absolute top-2 left-2 capitalize">
                                        {item.category}
                                    </Badge>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                                        {item.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-bold text-gold-600">
                                            ${item.price.toLocaleString()}
                                        </span>
                                        <Button
                                            size="sm"
                                            onClick={() => handleAddToCart(item)}
                                            className="shadow-gold"
                                        >
                                            <ShoppingCart className="h-4 w-4 mr-2" />
                                            Add to Cart
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filteredItems.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground text-lg">
                            No items found in this category.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
