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
                        cssFilter: 'grayscale(100%) brightness(1.2)'
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
                zIndex: 1,
                options: [
                    {
                        id: 'white-gold',
                        name: '18k White Gold',
                        price: 15000,
                        image: 'https://www.colorcombos.com/images/colors/E1E1E1.png',
                        cssFilter: 'grayscale(100%) brightness(1.1)'
                    },
                    {
                        id: 'yellow-gold',
                        name: '18k Yellow Gold',
                        price: 15000,
                        image: 'https://www.colorcombos.com/images/colors/FFD700.png',
                        cssFilter: 'sepia(100%) saturate(200%) hue-rotate(5deg) brightness(1.1)'
                    },
                    {
                        id: 'rose-gold',
                        name: '18k Rose Gold',
                        price: 16000,
                        image: 'https://www.colorcombos.com/images/colors/B76E79.png',
                        cssFilter: 'sepia(80%) saturate(150%) hue-rotate(320deg) brightness(1.1)'
                    },
                    {
                        id: 'platinum',
                        name: 'Platinum',
                        price: 25000,
                        image: 'https://www.colorcombos.com/images/colors/E5E4E2.png',
                        cssFilter: 'grayscale(100%) brightness(1.3) contrast(1.1)'
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
                        cssFilter: 'brightness(1.2) contrast(1.1)'
                    },
                    {
                        id: 'ruby',
                        name: 'Ruby',
                        price: 35000,
                        image: 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?q=80&w=200&auto=format&fit=crop',
                        layerImage: 'https://png.pngtree.com/png-vector/20240130/ourmid/pngtree-diamond-gemstone-png-image_11570809.png',
                        cssFilter: 'sepia(100%) saturate(500%) hue-rotate(320deg) brightness(0.8)'
                    },
                    {
                        id: 'sapphire',
                        name: 'Sapphire',
                        price: 30000,
                        image: 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?q=80&w=200&auto=format&fit=crop',
                        layerImage: 'https://png.pngtree.com/png-vector/20240130/ourmid/pngtree-diamond-gemstone-png-image_11570809.png',
                        cssFilter: 'sepia(100%) saturate(500%) hue-rotate(190deg) brightness(0.7)'
                    },
                    {
                        id: 'emerald',
                        name: 'Emerald',
                        price: 28000,
                        image: 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?q=80&w=200&auto=format&fit=crop',
                        layerImage: 'https://png.pngtree.com/png-vector/20240130/ourmid/pngtree-diamond-gemstone-png-image_11570809.png',
                        cssFilter: 'sepia(100%) saturate(400%) hue-rotate(90deg) brightness(0.8)'
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
                        cssFilter: 'grayscale(100%) brightness(1.1)'
                    },
                    {
                        id: 'rope-chain',
                        name: 'Rope Chain',
                        price: 8000,
                        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=200&auto=format&fit=crop',
                        layerImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop',
                        cssFilter: 'grayscale(100%) brightness(1.1)'
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
    },
    {
        id: 'bracelets',
        name: 'Bracelets',
        image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2070&auto=format&fit=crop',
        basePrice: 18000,
        steps: [
            {
                id: 'bracelet-style',
                name: 'Bracelet Style',
                description: 'Choose your bracelet design.',
                zIndex: 1,
                options: [
                    {
                        id: 'tennis',
                        name: 'Tennis Bracelet',
                        price: 0,
                        image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=200&auto=format&fit=crop',
                        layerImage: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop',
                        cssFilter: 'grayscale(100%) brightness(1.1)'
                    },
                    {
                        id: 'bangle',
                        name: 'Solid Bangle',
                        price: 5000,
                        image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=200&auto=format&fit=crop',
                        layerImage: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=800&auto=format&fit=crop',
                        cssFilter: 'grayscale(100%) brightness(1.1)'
                    },
                    {
                        id: 'chain-bracelet',
                        name: 'Chain Bracelet',
                        price: 3000,
                        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=200&auto=format&fit=crop',
                        layerImage: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop',
                        cssFilter: 'grayscale(100%) brightness(1.1)'
                    }
                ]
            },
            {
                id: 'metal-type',
                name: 'Metal Type',
                description: 'Select the metal.',
                zIndex: 1,
                options: [
                    {
                        id: 'yellow-gold',
                        name: '18k Yellow Gold',
                        price: 10000,
                        image: 'https://www.colorcombos.com/images/colors/FFD700.png',
                        cssFilter: 'sepia(100%) saturate(200%) hue-rotate(5deg) brightness(1.1)'
                    },
                    {
                        id: 'white-gold',
                        name: '18k White Gold',
                        price: 10000,
                        image: 'https://www.colorcombos.com/images/colors/E1E1E1.png',
                        cssFilter: 'grayscale(100%) brightness(1.1)'
                    },
                    {
                        id: 'rose-gold',
                        name: '18k Rose Gold',
                        price: 11000,
                        image: 'https://www.colorcombos.com/images/colors/B76E79.png',
                        cssFilter: 'sepia(80%) saturate(150%) hue-rotate(320deg) brightness(1.1)'
                    }
                ]
            }
        ]
    },
    {
        id: 'earrings',
        name: 'Earrings',
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1974&auto=format&fit=crop',
        basePrice: 12000,
        steps: [
            {
                id: 'earring-style',
                name: 'Earring Style',
                description: 'Choose your earring design.',
                zIndex: 1,
                options: [
                    {
                        id: 'studs',
                        name: 'Classic Studs',
                        price: 0,
                        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=200&auto=format&fit=crop',
                        layerImage: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop',
                        cssFilter: 'grayscale(100%) brightness(1.1)'
                    },
                    {
                        id: 'hoops',
                        name: 'Hoop Earrings',
                        price: 5000,
                        image: 'https://images.unsplash.com/photo-1596944924591-4ccf8b430c9a?q=80&w=200&auto=format&fit=crop',
                        layerImage: 'https://images.unsplash.com/photo-1596944924591-4ccf8b430c9a?q=80&w=800&auto=format&fit=crop',
                        cssFilter: 'grayscale(100%) brightness(1.1)'
                    },
                    {
                        id: 'drop',
                        name: 'Drop Earrings',
                        price: 8000,
                        image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=200&auto=format&fit=crop',
                        layerImage: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=800&auto=format&fit=crop',
                        cssFilter: 'grayscale(100%) brightness(1.1)'
                    }
                ]
            },
            {
                id: 'metal-type',
                name: 'Metal Type',
                description: 'Select the metal.',
                zIndex: 1,
                options: [
                    {
                        id: 'yellow-gold',
                        name: '18k Yellow Gold',
                        price: 8000,
                        image: 'https://www.colorcombos.com/images/colors/FFD700.png',
                        cssFilter: 'sepia(100%) saturate(200%) hue-rotate(5deg) brightness(1.1)'
                    },
                    {
                        id: 'white-gold',
                        name: '18k White Gold',
                        price: 8000,
                        image: 'https://www.colorcombos.com/images/colors/E1E1E1.png',
                        cssFilter: 'grayscale(100%) brightness(1.1)'
                    },
                    {
                        id: 'rose-gold',
                        name: '18k Rose Gold',
                        price: 9000,
                        image: 'https://www.colorcombos.com/images/colors/B76E79.png',
                        cssFilter: 'sepia(80%) saturate(150%) hue-rotate(320deg) brightness(1.1)'
                    }
                ]
            },
            {
                id: 'stone',
                name: 'Stone',
                description: 'Add a gemstone.',
                zIndex: 2,
                options: [
                    {
                        id: 'diamond',
                        name: 'Diamond',
                        price: 20000,
                        image: 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?q=80&w=200&auto=format&fit=crop',
                        layerImage: 'https://png.pngtree.com/png-vector/20240130/ourmid/pngtree-diamond-gemstone-png-image_11570809.png',
                        cssFilter: 'brightness(1.2)'
                    },
                    {
                        id: 'pearl',
                        name: 'Pearl',
                        price: 8000,
                        image: 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?q=80&w=200&auto=format&fit=crop',
                        layerImage: 'https://png.pngtree.com/png-vector/20240130/ourmid/pngtree-diamond-gemstone-png-image_11570809.png',
                        cssFilter: 'grayscale(100%) brightness(1.5)'
                    }
                ]
            }
        ]
    },
    {
        id: 'bangles',
        name: 'Bangles',
        image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=2070&auto=format&fit=crop',
        basePrice: 25000,
        steps: [
            {
                id: 'bangle-style',
                name: 'Bangle Style',
                description: 'Choose your bangle design.',
                zIndex: 1,
                options: [
                    {
                        id: 'plain',
                        name: 'Plain Bangle',
                        price: 0,
                        image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=200&auto=format&fit=crop',
                        layerImage: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=800&auto=format&fit=crop',
                        cssFilter: 'grayscale(100%) brightness(1.1)'
                    },
                    {
                        id: 'carved',
                        name: 'Carved Design',
                        price: 8000,
                        image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=200&auto=format&fit=crop',
                        layerImage: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop',
                        cssFilter: 'grayscale(100%) brightness(1.1)'
                    }
                ]
            },
            {
                id: 'metal-type',
                name: 'Metal Type',
                description: 'Select the metal.',
                zIndex: 1,
                options: [
                    {
                        id: 'yellow-gold',
                        name: '22k Yellow Gold',
                        price: 15000,
                        image: 'https://www.colorcombos.com/images/colors/FFD700.png',
                        cssFilter: 'sepia(100%) saturate(200%) hue-rotate(5deg) brightness(1.1)'
                    },
                    {
                        id: 'rose-gold',
                        name: '22k Rose Gold',
                        price: 16000,
                        image: 'https://www.colorcombos.com/images/colors/B76E79.png',
                        cssFilter: 'sepia(80%) saturate(150%) hue-rotate(320deg) brightness(1.1)'
                    }
                ]
            }
        ]
    }
]
