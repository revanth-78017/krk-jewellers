export interface Category {
    id: string
    name: string
    image: string
}

export interface Preset {
    id: string
    categoryId: string
    name: string
    image: string
    basePrice: number
    description: string
}

export interface Metal {
    id: string
    name: string
    priceMultiplier: number
    color: string // CSS color code or hex
    image?: string
}

export interface Gemstone {
    id: string
    name: string
    pricePerCarat: number
    color: string
    image?: string
}

export const CATEGORIES: Category[] = [
    {
        id: 'rings',
        name: 'Rings',
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=2070&auto=format&fit=crop'
    },
    {
        id: 'necklaces',
        name: 'Necklaces',
        image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=1974&auto=format&fit=crop'
    },
    {
        id: 'earrings',
        name: 'Earrings',
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1974&auto=format&fit=crop'
    },
    {
        id: 'bracelets',
        name: 'Bracelets',
        image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2070&auto=format&fit=crop'
    }
]

export const PRESETS: Preset[] = [
    // Rings
    {
        id: 'ring-solitaire',
        categoryId: 'rings',
        name: 'Classic Solitaire',
        basePrice: 25000,
        description: 'Timeless elegance with a single center stone.',
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=2070&auto=format&fit=crop'
    },
    {
        id: 'ring-halo',
        categoryId: 'rings',
        name: 'Halo Setting',
        basePrice: 35000,
        description: 'A center stone surrounded by smaller pavé diamonds.',
        image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=2080&auto=format&fit=crop'
    },
    // Necklaces
    {
        id: 'necklace-pendant',
        categoryId: 'necklaces',
        name: 'Solitaire Pendant',
        basePrice: 15000,
        description: 'A single stunning gem suspended from a delicate chain.',
        image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=1974&auto=format&fit=crop'
    },
    {
        id: 'necklace-statement',
        categoryId: 'necklaces',
        name: 'Royal Statement',
        basePrice: 85000,
        description: 'Elaborate design fit for a queen.',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2070&auto=format&fit=crop'
    },
    // Earrings
    {
        id: 'earring-studs',
        categoryId: 'earrings',
        name: 'Classic Studs',
        basePrice: 12000,
        description: 'Simple yet elegant studs for everyday wear.',
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1974&auto=format&fit=crop'
    },
    // Bracelets
    {
        id: 'bracelet-tennis',
        categoryId: 'bracelets',
        name: 'Tennis Bracelet',
        basePrice: 45000,
        description: 'A continuous line of individually set gemstones.',
        image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2070&auto=format&fit=crop'
    }
]

export const METALS: Metal[] = [
    { id: 'gold-yellow', name: '18k Yellow Gold', priceMultiplier: 1, color: '#E6C200' },
    { id: 'gold-white', name: '18k White Gold', priceMultiplier: 1.1, color: '#E1E1E1' },
    { id: 'gold-rose', name: '18k Rose Gold', priceMultiplier: 1.05, color: '#B76E79' },
    { id: 'platinum', name: 'Platinum', priceMultiplier: 1.5, color: '#E5E4E2' },
    { id: 'silver', name: 'Sterling Silver', priceMultiplier: 0.3, color: '#C0C0C0' }
]

export const GEMSTONES: Gemstone[] = [
    { id: 'diamond', name: 'Diamond', pricePerCarat: 50000, color: '#E0F7FA' },
    { id: 'ruby', name: 'Ruby', pricePerCarat: 35000, color: '#D32F2F' },
    { id: 'sapphire', name: 'Sapphire', pricePerCarat: 30000, color: '#1976D2' },
    { id: 'emerald', name: 'Emerald', pricePerCarat: 28000, color: '#388E3C' }
]
