export const calculateWeight = (item: string, gender: string, style: string, customization: string) => {
    // Heuristic weight estimation
    let baseWeight = 0
    const isMens = gender.toLowerCase().includes('men')
    const analysis: string[] = []

    // Base weight determination
    if (item.toLowerCase().includes('ring')) {
        baseWeight = isMens ? 8 : 4
        analysis.push(isMens ? "Mens sizing (+)" : "Standard sizing")
    } else if (item.toLowerCase().includes('necklace')) {
        baseWeight = isMens ? 25 : 15
    } else if (item.toLowerCase().includes('earrings')) {
        baseWeight = 6 // Pair
    } else if (item.toLowerCase().includes('bracelet')) {
        baseWeight = isMens ? 20 : 12
    } else if (item.toLowerCase().includes('pendant')) {
        baseWeight = isMens ? 8 : 5
    } else {
        baseWeight = 5
    }

    // Adjust for style
    const styleLower = style.toLowerCase()
    if (styleLower.includes('chunk') || styleLower.includes('heavy') || styleLower.includes('bold')) {
        baseWeight *= 1.5
        analysis.push("Heavy/Bold style (+50%)")
    }
    if (styleLower.includes('minimal') || styleLower.includes('thin') || styleLower.includes('delicate')) {
        baseWeight *= 0.7
        analysis.push("Minimalist/Delicate style (-30%)")
    }
    if (styleLower.includes('intricate') || styleLower.includes('filigree') || styleLower.includes('vintage')) {
        baseWeight *= 1.1
        analysis.push("Intricate detailing (+10%)")
    }

    // Adjust for customization text length/keywords (complexity)
    if (customization.length > 20 && customization.toLowerCase() !== 'none') {
        if (customization.toLowerCase().includes('solid') || customization.toLowerCase().includes('thick')) {
            baseWeight *= 1.2
            analysis.push("Custom solid/thick build (+20%)")
        }
    }

    // Final calculation
    const min = (baseWeight * 0.9).toFixed(1)
    const max = (baseWeight * 1.2).toFixed(1)

    return {
        range: `${min}g - ${max}g`,
        analysis: analysis
    }
}
