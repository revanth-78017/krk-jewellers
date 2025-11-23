export interface CustomizationOption {
    id: string
    name: string
    price: number
    image: string // Thumbnail for selection
    layerImage?: string // Image to overlay in Live Preview
    description?: string
}

export interface CustomizationStep {
    id: string
    name: string
    description: string
    options: CustomizationOption[]
    zIndex?: number // For layering order
}

export interface Category {
    id: string
    name: string
    image: string
    basePrice: number
    steps: CustomizationStep[]
}

export const CATEGORIES: Category[] = [
    {
        id: 'rings',
        name: 'Rings',
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=2070&auto=format&fit=crop',
        basePrice: 15000,
        steps: [
            {
                id: 'band',
                name: 'Choose Band Style',
                description: 'Select the metal and design of your ring band.',
                zIndex: 1,
                options: [
                    {
                        id: 'gold-band',
                        name: '18k Yellow Gold',
                        price: 15000,
                        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=200&auto=format&fit=crop',
                        layerImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop' // Placeholder: Full ring image
                    },
                    {
                        id: 'silver-band',
                        name: 'Sterling Silver',
                        price: 5000,
                        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=200&auto=format&fit=crop',
                        layerImage: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop' // Placeholder
                    },
                    {
                        id: 'rose-band',
                        name: '18k Rose Gold',
                        price: 16000,
                        image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=200&auto=format&fit=crop',
                        layerImage: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop' // Placeholder
                    }
                ]
            },
            {
                id: 'stone',
                name: 'Select Center Stone',
                description: 'Choose the perfect gemstone for your centerpiece.',
                zIndex: 2,
                options: [
                    {
                        id: 'diamond-round',
                        name: 'Round Diamond',
                        price: 50000,
                        image: 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?q=80&w=200&auto=format&fit=crop',
                        layerImage: 'https://png.pngtree.com/png-vector/20240130/ourmid/pngtree-diamond-gemstone-png-image_11570809.png' // Transparent diamond placeholder
                    },
                    {
                        id: 'ruby-oval',
                        name: 'Oval Ruby',
                        price: 35000,
                        image: 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?q=80&w=200&auto=format&fit=crop', // Using same placeholder for now
                        layerImage: 'https://png.pngtree.com/png-vector/20240208/ourmid/pngtree-red-ruby-gemstone-png-image_11714967.png' // Transparent ruby placeholder
                    },
                    {
                        id: 'sapphire-cushion',
                        name: 'Cushion Sapphire',
                        price: 30000,
                        image: 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?q=80&w=200&auto=format&fit=crop',
                        layerImage: 'https://png.pngtree.com/png-vector/20240524/ourmid/pngtree-blue-sapphire-gemstone-isolated-on-transparent-background-png-image_12506806.png' // Transparent sapphire placeholder
                    }
                ]
            }
        ]
    },
    {
        id: 'necklaces',
        name: 'Necklaces',
        image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=1974&auto=format&fit=crop',
        basePrice: 20000,
        steps: [
            {
                id: 'chain',
                name: 'Select Chain',
                description: 'Choose your preferred chain style and metal.',
                zIndex: 1,
                options: [
                    {
                        id: 'gold-chain',
                        name: 'Gold Link Chain',
                        price: 12000,
                        image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=200&auto=format&fit=crop',
                        layerImage: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=800&auto=format&fit=crop'
                    },
                    {
                        id: 'silver-chain',
                        name: 'Silver Cable Chain',
                        price: 4000,
                        image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=200&auto=format&fit=crop',
                        layerImage: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop'
                    }
                ]
            },
            {
                id: 'pendant',
                name: 'Choose Pendant',
                description: 'Select a pendant to adorn your necklace.',
                zIndex: 2,
                options: [
                    {
                        id: 'solitaire-pendant',
                        name: 'Solitaire Setting',
                        price: 5000,
                        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=200&auto=format&fit=crop',
                        layerImage: 'https://png.pngtree.com/png-vector/20230415/ourmid/pngtree-gold-pendant-jewelry-vector-png-image_6707267.png'
                    },
                    {
                        id: 'halo-pendant',
                        name: 'Halo Setting',
                        price: 8000,
                        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=200&auto=format&fit=crop',
                        layerImage: 'https://png.pngtree.com/png-vector/20230415/ourmid/pngtree-gold-pendant-jewelry-vector-png-image_6707267.png'
                    }
                ]
            },
            {
                id: 'stone',
                name: 'Select Stone',
                description: 'Add a brilliant stone to your pendant.',
                zIndex: 3,
                options: [
                    {
                        id: 'diamond',
                        name: 'Diamond',
                        price: 40000,
                        image: 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?q=80&w=200&auto=format&fit=crop',
                        layerImage: 'https://png.pngtree.com/png-vector/20240130/ourmid/pngtree-diamond-gemstone-png-image_11570809.png'
                    },
                    {
                        id: 'emerald',
                        name: 'Emerald',
                        price: 25000,
                        image: 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?q=80&w=200&auto=format&fit=crop',
                        layerImage: 'https://png.pngtree.com/png-vector/20240524/ourmid/pngtree-emerald-gemstone-isolated-on-transparent-background-png-image_12506807.png'
                    }
                ]
            }
        ]
    }
]
