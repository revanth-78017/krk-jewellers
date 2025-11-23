export interface CustomizationOption {
    id: string
    name: string
    price: number
    image: string // Thumbnail for selection
    layerImage?: string // Image to overlay in Live Preview
    cssFilter?: string // CSS filter to apply to the layerImage
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
                id: 'band-style',
                name: 'Band Style',
                description: 'Select the design of your ring band.',
                zIndex: 1,
                options: [
                    {
                        id: 'classic-band',
                        name: 'Classic Polished',
                        price: 0,
                        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=200&auto=format&fit=crop',
                        layerImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop',
                        cssFilter: 'grayscale(100%) brightness(1.2)' // Base silver look
                    },
                    {
                        id: 'pave-band',
                        name: 'Pavé Setting',
                        price: 12000,
                        image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=200&auto=format&fit=crop',
                        layerImage: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop',
                        cssFilter: 'grayscale(100%) brightness(1.2)'
                    }
                ]
            },
            {
                id: 'metal-type',
                name: 'Metal Type',
                description: 'Choose the metal for your band.',
                zIndex: 1, // Applies filter to the band layer (conceptually, we might need a better way to link this, but for now we'll assume it modifies the band layer or adds a tint)
                options: [
                    {
                        id: 'white-gold',
                        name: '18k White Gold',
                        price: 15000,
                        image: 'https://www.colorcombos.com/images/colors/E1E1E1.png',
                        cssFilter: 'grayscale(100%) brightness(1.1)', // Silver/White look
                        layerImage: '' // This option modifies existing layers in a real app, but here we'll simulate by re-rendering the band with this filter if we could. 
                        // For simplicity in this version, we will make the Band Style step determine the shape, and THIS step determine the color filter.
                        // We'll handle this logic in LivePreview.
                    },
                    {
                        id: 'yellow-gold',
                        name: '18k Yellow Gold',
                        price: 15000,
                        image: 'https://www.colorcombos.com/images/colors/FFD700.png',
                        cssFilter: 'sepia(100%) saturate(200%) hue-rotate(5deg) brightness(1.1)' // Gold look
                    },
                    {
                        id: 'rose-gold',
                        name: '18k Rose Gold',
                        price: 16000,
                        image: 'https://www.colorcombos.com/images/colors/B76E79.png',
                        cssFilter: 'sepia(80%) saturate(150%) hue-rotate(320deg) brightness(1.1)' // Rose Gold look
                    },
                    {
                        id: 'platinum',
                        name: 'Platinum',
                        price: 25000,
                        image: 'https://www.colorcombos.com/images/colors/E5E4E2.png',
                        cssFilter: 'grayscale(100%) brightness(1.3) contrast(1.1)' // Platinum look
                    }
                ]
            },
            {
                id: 'center-stone',
                name: 'Center Stone',
                description: 'Select the perfect gemstone.',
                zIndex: 2,
                options: [
                    {
                        id: 'diamond',
                        name: 'Diamond',
                        price: 50000,
                        image: 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?q=80&w=200&auto=format&fit=crop',
                        layerImage: 'https://png.pngtree.com/png-vector/20240130/ourmid/pngtree-diamond-gemstone-png-image_11570809.png',
                        cssFilter: 'brightness(1.2) contrast(1.1)' // Sparkle
                    },
                    {
                        id: 'ruby',
                        name: 'Ruby',
                        price: 35000,
                        image: 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?q=80&w=200&auto=format&fit=crop', // Placeholder
                        layerImage: 'https://png.pngtree.com/png-vector/20240130/ourmid/pngtree-diamond-gemstone-png-image_11570809.png', // Using diamond shape but coloring it
                        cssFilter: 'sepia(100%) saturate(500%) hue-rotate(320deg) brightness(0.8)' // Deep Red
                    },
                    {
                        id: 'sapphire',
                        name: 'Sapphire',
                        price: 30000,
                        image: 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?q=80&w=200&auto=format&fit=crop',
                        layerImage: 'https://png.pngtree.com/png-vector/20240130/ourmid/pngtree-diamond-gemstone-png-image_11570809.png',
                        cssFilter: 'sepia(100%) saturate(500%) hue-rotate(190deg) brightness(0.7)' // Deep Blue
                    },
                    {
                        id: 'emerald',
                        name: 'Emerald',
                        price: 28000,
                        image: 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?q=80&w=200&auto=format&fit=crop',
                        layerImage: 'https://png.pngtree.com/png-vector/20240130/ourmid/pngtree-diamond-gemstone-png-image_11570809.png',
                        cssFilter: 'sepia(100%) saturate(400%) hue-rotate(90deg) brightness(0.8)' // Green
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
                id: 'chain-style',
                name: 'Chain Style',
                description: 'Choose your chain link style.',
                zIndex: 1,
                options: [
                    {
                        id: 'cable-chain',
                        name: 'Cable Chain',
                        price: 5000,
                        image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=200&auto=format&fit=crop',
                        layerImage: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=800&auto=format&fit=crop',
                        cssFilter: 'grayscale(100%)'
                    },
                    {
                        id: 'rope-chain',
                        name: 'Rope Chain',
                        price: 8000,
                        image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=200&auto=format&fit=crop',
                        layerImage: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop',
                        cssFilter: 'grayscale(100%)'
                    }
                ]
            },
            {
                id: 'metal-type',
                name: 'Metal Type',
                description: 'Select the metal for your chain.',
                zIndex: 1,
                options: [
                    {
                        id: 'yellow-gold',
                        name: '18k Yellow Gold',
                        price: 12000,
                        image: 'https://www.colorcombos.com/images/colors/FFD700.png',
                        cssFilter: 'sepia(100%) saturate(200%) hue-rotate(5deg) brightness(1.1)'
                    },
                    {
                        id: 'white-gold',
                        name: '18k White Gold',
                        price: 12000,
                        image: 'https://www.colorcombos.com/images/colors/E1E1E1.png',
                        cssFilter: 'grayscale(100%) brightness(1.1)'
                    },
                    {
                        id: 'rose-gold',
                        name: '18k Rose Gold',
                        price: 13000,
                        image: 'https://www.colorcombos.com/images/colors/B76E79.png',
                        cssFilter: 'sepia(80%) saturate(150%) hue-rotate(320deg) brightness(1.1)'
                    }
                ]
            },
            {
                id: 'pendant-stone',
                name: 'Pendant Stone',
                description: 'Choose the main gemstone.',
                zIndex: 2,
                options: [
                    {
                        id: 'diamond',
                        name: 'Diamond',
                        price: 40000,
                        image: 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?q=80&w=200&auto=format&fit=crop',
                        layerImage: 'https://png.pngtree.com/png-vector/20240130/ourmid/pngtree-diamond-gemstone-png-image_11570809.png',
                        cssFilter: 'brightness(1.2)'
                    },
                    {
                        id: 'emerald',
                        name: 'Emerald',
                        price: 25000,
                        image: 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?q=80&w=200&auto=format&fit=crop',
                        layerImage: 'https://png.pngtree.com/png-vector/20240130/ourmid/pngtree-diamond-gemstone-png-image_11570809.png',
                        cssFilter: 'sepia(100%) saturate(400%) hue-rotate(90deg) brightness(0.8)'
                    }
                ]
            }
        ]
    }
]
