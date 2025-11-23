import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useAdmin } from '@/hooks/useAdmin'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { Moon, Sun, Menu, X, TrendingUp, TrendingDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MarketService, MarketRate } from '@/services/MarketService'

export default function Navigation() {
    const { user, signOut } = useAuth()
    const navigate = useNavigate()
    const { isAdmin } = useAdmin()
    const { cart } = useCart()
    const [isDark, setIsDark] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [rates, setRates] = useState<MarketRate[]>([])
    const location = useLocation()

    useEffect(() => {
        const fetchRates = async () => {
            const data = await MarketService.getLiveRates()
            setRates(data)
        }
        fetchRates()
        const interval = setInterval(fetchRates, 30000) // Update every 30s
        return () => clearInterval(interval)
    }, [])

    const toggleTheme = () => {
        setIsDark(!isDark)
        document.documentElement.classList.toggle('dark')
    }

    const handleSignOut = async () => {
        await signOut()
        navigate('/auth')
    }

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/gallery', label: 'Gallery' },
        { to: '/customize', label: 'Customize' },
        { to: '/showcase', label: 'Showcase' },
        { to: '/market-trends', label: 'Market Trends' },
    ]

    return (
        <>
            {/* Live Ticker */}
            <div className="bg-black text-gold py-1 overflow-hidden border-b border-gold/20">
                <div className="container mx-auto px-4 flex justify-between items-center text-xs sm:text-sm">
                    <div className="flex items-center gap-4 animate-pulse">
                        <span className="font-bold text-primary">LIVE RATES (India):</span>
                        {rates.map((rate, index) => (
                            <span key={index} className="flex items-center gap-1 text-white">
                                {rate.metal} {rate.purity ? `(${rate.purity})` : ''}:
                                <span className="font-mono">₹{rate.price.toLocaleString()}</span>
                                {rate.trend === 'up' ? <TrendingUp size={12} className="text-green-500" /> : <TrendingDown size={12} className="text-red-500" />}
                            </span>
                        ))}
                    </div>
                    <Link to="/market-trends" className="text-primary hover:underline hidden sm:block">View Predictions &rarr;</Link>
                </div>
            </div>

            <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-gradient-gold">KRK</span>
                            <span className="text-xl font-semibold hidden sm:inline">Jewellers</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === link.to ? 'text-primary' : 'text-muted-foreground'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <Link
                                to="/cart"
                                className={`text-sm font-medium transition-colors hover:text-primary relative ${location.pathname === '/cart' ? 'text-primary' : 'text-muted-foreground'
                                    }`}
                            >
                                Cart
                                {cart.length > 0 && (
                                    <span className="absolute -top-2 -right-3 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                        {cart.length}
                                    </span>
                                )}
                            </Link>
                            {user && (
                                <Link
                                    to="/orders"
                                    className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === '/orders' ? 'text-primary' : 'text-muted-foreground'
                                        }`}
                                >
                                    My Orders
                                </Link>
                            )}
                            {isAdmin && (
                                <Link
                                    to="/admin"
                                    className="text-primary hover:text-primary/80 transition-colors font-medium"
                                >
                                    Admin
                                </Link>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleTheme}
                                className="hidden sm:inline-flex"
                            >
                                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </Button>

                            {user ? (
                                <Button onClick={handleSignOut} variant="outline" className="hidden sm:inline-flex">
                                    Sign Out
                                </Button>
                            ) : (
                                <Button asChild className="hidden sm:inline-flex">
                                    <Link to="/auth">Sign In</Link>
                                </Button>
                            )}

                            {/* Mobile Menu Button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden"
                            >
                                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden border-t bg-background"
                        >
                            <div className="container mx-auto px-4 py-4 space-y-3">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block py-2 text-foreground/80 hover:text-foreground transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                )}
                                <div className="pt-3 border-t space-y-3">
                                    <Button
                                        variant="ghost"
                                        onClick={toggleTheme}
                                        className="w-full justify-start"
                                    >
                                        {isDark ? <Sun className="h-5 w-5 mr-2" /> : <Moon className="h-5 w-5 mr-2" />}
                                        {isDark ? 'Light Mode' : 'Dark Mode'}
                                    </Button>
                                    {user ? (
                                        <Button onClick={handleSignOut} variant="outline" className="w-full">
                                            Sign Out
                                        </Button>
                                    ) : (
                                        <Button asChild className="w-full">
                                            <Link to="/auth">Sign In</Link>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav >
        </>
    )
}
