import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/hooks/useAuth'
import { Toaster } from 'sonner'
import Navigation from '@/components/Navigation'
import Index from '@/pages/Index'
import Gallery from '@/pages/Gallery'
import Design from '@/pages/Design'
import Customize from '@/pages/Customize'
import Auth from '@/pages/Auth'
import Admin from '@/pages/Admin'
import Showcase from '@/pages/Showcase'
import NotFound from '@/pages/NotFound'

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
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </div>
                    <Toaster position="top-right" richColors />
                </AuthProvider>
            </BrowserRouter>
        </QueryClientProvider>
    )
}

export default App
