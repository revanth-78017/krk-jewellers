import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/hooks/useAuth'
import { ProductProvider } from '@/contexts/ProductContext'
import { OrderProvider } from '@/contexts/OrderContext'
import MyOrders from '@/pages/MyOrders'

// ... (imports)

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <AuthProvider>
                    <ProductProvider>
                        <CartProvider>
                            <OrderProvider>
                                <div className="min-h-screen bg-background text-foreground">
                                    <Navigation />
                                    <Routes>
                                        <Route path="/" element={<Index />} />
                                        <Route path="/gallery" element={<Gallery />} />
                                        <Route path="/design" element={<Design />} />
                                        <Route path="/customize" element={<Customize />} />
                                        <Route path="/auth" element={<Auth />} />
                                        <Route path="/admin" element={<Admin />} />
                                        <Route path="/showcase" element={<Showcase />} />
                                        <Route path="/cart" element={<Cart />} />
                                        <Route path="/orders" element={<MyOrders />} />
                                        <Route path="/payment" element={<Payment />} />
                                        <Route path="/market-trends" element={<MarketTrends />} />
                                        <Route path="*" element={<NotFound />} />
                                    </Routes>
                                </div>
                                <Toaster position="top-right" richColors />
                            </OrderProvider>
                        </CartProvider>
                    </ProductProvider>
                </AuthProvider>
            </BrowserRouter>
        </QueryClientProvider>
    )
}

export default App
