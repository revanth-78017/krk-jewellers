import { useState, useEffect } from 'react'
import { toast } from 'sonner'

export function usePrivacyProtection(enabled: boolean = true) {
    const [isProtected, setIsProtected] = useState(false)

    useEffect(() => {
        if (!enabled) return

        const handleVisibilityChange = () => {
            if (document.hidden) {
                setIsProtected(true)
            } else {
                // Short delay before revealing again to discourage quick toggling
                setTimeout(() => setIsProtected(false), 500)
            }
        }

        const handleWindowBlur = () => {
            setIsProtected(true)
        }

        const handleWindowFocus = () => {
            setTimeout(() => setIsProtected(false), 500)
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            // Detect PrintScreen
            if (e.key === 'PrintScreen') {
                setIsProtected(true)
                toast.error("Screenshots are disabled for privacy.")

                // Hide content for a few seconds
                setTimeout(() => setIsProtected(false), 3000)

                // Clear clipboard to prevent pasting if possible (limited browser support)
                try {
                    navigator.clipboard.writeText('')
                } catch (err) {
                    // Ignore
                }
            }

            // Detect common screenshot shortcuts (approximate)
            if (
                (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5')) || // Mac
                (e.ctrlKey && e.key === 'p') || // Ctrl+P
                (e.metaKey && e.shiftKey && e.key === 's') || // Windows Snipping Tool shortcut sometimes registers
                (e.key === 'F12') // DevTools
            ) {
                setIsProtected(true)
                e.preventDefault()
                toast.error("Capture shortcuts are disabled.")
                setTimeout(() => setIsProtected(false), 3000)
            }
        }

        // Add Listeners
        document.addEventListener('visibilitychange', handleVisibilityChange)
        window.addEventListener('blur', handleWindowBlur)
        window.addEventListener('focus', handleWindowFocus)
        window.addEventListener('keyup', handleKeyDown) // Using keyup often catches PrintScreen better
        window.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange)
            window.removeEventListener('blur', handleWindowBlur)
            window.removeEventListener('focus', handleWindowFocus)
            window.removeEventListener('keyup', handleKeyDown)
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [enabled])

    return isProtected
}
