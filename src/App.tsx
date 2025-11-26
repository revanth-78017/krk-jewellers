import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/hooks/useAuth'
import { ProductProvider } from '@/contexts/ProductContext'
import { OrderProvider } from '@/contexts/OrderContext'
import { CartProvider } from '@/contexts/CartContext'
import { WalletProvider } from '@/contexts/WalletContext'
import { Toaster } from 'sonner'
import Navigation from '@/components/Navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import Index from '@/pages/Index'
import Gallery from '@/pages/Gallery'
import Design from '@/pages/Design'
import Customize from '@/pages/Customize'
import Auth from '@/pages/Auth'
import Admin from '@/pages/Admin'
import Showcase from '@/pages/Showcase'
import Cart from '@/pages/Cart'
import MyOrders from '@/pages/MyOrders'
import Payment from '@/pages/Payment'
import MarketTrends from '@/pages/MarketTrends'
import ProductDetails from '@/pages/ProductDetails'
import NotFound from '@/pages/NotFound'
import VirtualTryOn from '@/pages/VirtualTryOn'
import Wallet from '@/pages/Wallet'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 1,
        },
    },
})

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <AuthProvider>
                    <ProductProvider>
                        <CartProvider>
                            <OrderProvider>
                                <WalletProvider>
                                    <div className="min-h-screen bg-background text-foreground">
                                        <Navigation />
                                        <Routes>
                                            {/* Public routes - only home and auth */}
                                            <Route path="/" element={<Index />} />
                                            <Route path="/auth" element={<Auth />} />

                                            {/* Protected routes - everything else requires sign in */}
                                            <Route path="/gallery" element={<ProtectedRoute><Gallery /></ProtectedRoute>} />
                                            <Route path="/showcase" element={<ProtectedRoute><Showcase /></ProtectedRoute>} />
                                            <Route path="/invest" element={<ProtectedRoute><MarketTrends /></ProtectedRoute>} />
                                            <Route path="/product/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
                                            <Route path="/design" element={<ProtectedRoute><Design /></ProtectedRoute>} />
                                            <Route path="/customize" element={<ProtectedRoute><Customize /></ProtectedRoute>} />
                                            <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
                                            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                                            <Route path="/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
                                            <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
                                            <Route path="/try-on/:productId" element={<ProtectedRoute><VirtualTryOn /></ProtectedRoute>} />
                                            <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />

                                            <Route path="*" element={<NotFound />} />
                                        </Routes>
                                    </div>
                                    <Toaster position="top-right" richColors />
                                </WalletProvider>
                            </OrderProvider>
                        </CartProvider>
                    </ProductProvider>
                </AuthProvider>
            </BrowserRouter>
        </QueryClientProvider>
    )
}

export default App
