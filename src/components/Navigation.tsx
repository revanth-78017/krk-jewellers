import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useAdmin } from '@/hooks/useAdmin'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { Moon, Sun, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navigation() {
    const { user, signOut } = useAuth()
    const { isAdmin } = useAdmin()
    const { cart } = useCart()
    const [isDark, setIsDark] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const location = useLocation()

    const toggleTheme = () => {
        setIsDark(!isDark)
        document.documentElement.classList.toggle('dark')
    }

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/gallery', label: 'Gallery' },
        { to: '/customize', label: 'Customize' },
        { to: '/showcase', label: 'Showcase' },
    ]

    return (
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
                            <Button onClick={signOut} variant="outline" className="hidden sm:inline-flex">
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
                            ))}
                            <Link
                                to="/cart"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block py-2 text-foreground/80 hover:text-foreground transition-colors"
                            >
                                Cart ({cart.length})
                            </Link>
                            {isAdmin && (
                                <Link
                                    to="/admin"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block py-2 text-primary hover:text-primary/80 transition-colors"
                                >
                                    Admin
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
                                    <Button onClick={signOut} variant="outline" className="w-full">
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
        </nav>
    )
}
