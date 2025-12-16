import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { db } from '@/lib/firebase'
import { collection, query, orderBy, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { SavedDesign } from '@/contexts/DesignContext'
import { toast } from 'sonner'
import { Loader2, Trash2, Download, Sparkles, Lock, CheckCircle2, Eye, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useRazorpay } from '@/hooks/useRazorpay'
import { Badge } from '@/components/ui/badge'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

const Watermark = () => (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none select-none overflow-hidden bg-black/10">
        <div className="flex flex-wrap gap-12 justify-center content-center w-[200%] h-[200%] -rotate-45 opacity-30">
            {Array.from({ length: 50 }).map((_, i) => (
                <span key={i} className="text-white font-black text-2xl whitespace-nowrap shadow-sm drop-shadow-md">
                    PREVIEW • UNPAID
                </span>
            ))}
        </div>
    </div>
)

export default function MyDesigns() {
    const { user } = useAuth()
    const { initializePayment, loading: paymentLoading } = useRazorpay()
    const [designs, setDesigns] = useState<SavedDesign[]>([])
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState<string | null>(null)
    const [processingPaymentId, setProcessingPaymentId] = useState<string | null>(null)
    const [selectedDesign, setSelectedDesign] = useState<SavedDesign | null>(null)

    useEffect(() => {
        if (user) {
            fetchDesigns()
        }
    }, [user])

    const fetchDesigns = async () => {
        if (!user) return

        try {
            const designsRef = collection(db, 'users', user.id, 'designs')
            const q = query(designsRef, orderBy('createdAt', 'desc'))
            const querySnapshot = await getDocs(q)

            const fetchedDesigns: SavedDesign[] = []
            querySnapshot.forEach((doc) => {
                fetchedDesigns.push({ id: doc.id, ...doc.data() } as SavedDesign)
            })

            setDesigns(fetchedDesigns)
        } catch (error) {
            console.error("Error fetching designs:", error)
            toast.error("Failed to load your designs")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (designId: string) => {
        if (!user || !designId) return

        if (!confirm("Are you sure you want to delete this design?")) return

        setDeleting(designId)
        try {
            await deleteDoc(doc(db, 'users', user.id, 'designs', designId))
            setDesigns(designs.filter(d => d.id !== designId))
            toast.success("Design deleted successfully")
            if (selectedDesign?.id === designId) {
                setSelectedDesign(null)
            }
        } catch (error) {
            console.error("Error deleting design:", error)
            toast.error("Failed to delete design")
        } finally {
            setDeleting(null)
        }
    }

    const executeDownload = async (imageUrl: string, id: string) => {
        try {
            const response = await fetch(imageUrl)
            const blob = await response.blob()
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = `my-design-${id}.jpg`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (error) {
            // Fallback for direct link
            window.open(imageUrl, '_blank')
        }
    }

    const handleDownloadClick = async (design: SavedDesign) => {
        if (!design.id) return

        // If already paid, download immediately
        if (design.isPaid) {
            executeDownload(design.imageUrl, design.id)
            return
        }

        // Otherwise, initiate payment
        setProcessingPaymentId(design.id)

        initializePayment({
            key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_RkMznI33g63X9w',
            amount: 10000, // 100 INR
            currency: 'INR',
            name: 'GOLD CRAFT',
            description: 'Design Download High Res',
            image: '/favicon.ico',
            handler: async () => {
                try {
                    // Update FireStore to mark as paid
                    await updateDoc(doc(db, 'users', user!.id, 'designs', design.id!), {
                        isPaid: true
                    })

                    // Update local state and selected design if open
                    const updatedDesign = { ...design, isPaid: true }
                    setDesigns(prev => prev.map(d =>
                        d.id === design.id ? updatedDesign : d
                    ))

                    if (selectedDesign?.id === design.id) {
                        setSelectedDesign(updatedDesign)
                    }

                    toast.success('Payment successful! Validating license...')

                    // Allow small delay for state update then download
                    setTimeout(() => {
                        executeDownload(design.imageUrl, design.id!)
                        setProcessingPaymentId(null)
                    }, 1000)

                } catch (error) {
                    console.error("Error updating payment status:", error)
                    toast.error("Payment successful but failed to update status. Please contact support.")
                    setProcessingPaymentId(null)
                }
            },
            prefill: {
                name: user?.display_name || "",
                email: user?.email || "",
                contact: user?.phone_number || ""
            },
            theme: {
                color: '#D4AF37'
            }
        })
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen py-12 px-4 bg-background">
            <div className="container mx-auto max-w-7xl">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-playfair font-bold text-gradient-gold">My Designs</h1>
                    <Button asChild>
                        <Link to="/design">
                            <Sparkles className="mr-2 h-4 w-4" />
                            Create New
                        </Link>
                    </Button>
                </div>

                {designs.length === 0 ? (
                    <div className="text-center py-20 bg-muted/30 rounded-lg">
                        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <Sparkles className="h-10 w-10 opacity-50" />
                        </div>
                        <h2 className="text-2xl font-semibold mb-2">No designs yet</h2>
                        <p className="text-muted-foreground mb-6">Start creating your dream jewelry with our AI Design Studio.</p>
                        <Button asChild variant="secondary">
                            <Link to="/design">Go to Studio</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {designs.map((design) => (
                            <Card key={design.id} className={`overflow-hidden group hover:shadow-elegant transition-all cursor-pointer ${design.isPaid ? 'border-primary/50' : ''}`} onClick={() => setSelectedDesign(design)}>
                                <div
                                    className="aspect-square relative overflow-hidden bg-muted select-none"
                                    onContextMenu={(e) => e.preventDefault()}
                                >
                                    <img
                                        src={design.imageUrl}
                                        alt={design.prompt}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        draggable="false"
                                    />

                                    {/* Watermark for unpaid designs */}
                                    {!design.isPaid && <Watermark />}

                                    {/* Status Badge */}
                                    <div className="absolute top-2 right-2 z-20">
                                        {design.isPaid ? (
                                            <Badge className="bg-green-600 hover:bg-green-700 flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3" /> Paid
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary" className="bg-black/50 backdrop-blur-sm text-white flex items-center gap-1">
                                                <Lock className="w-3 h-3" /> Locked
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Overlay Hint */}
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-30">
                                        <Badge variant="secondary" className="bg-black/70 text-white flex items-center gap-2 px-3 py-1.5">
                                            <Eye className="w-4 h-4" /> Click to Preview
                                        </Badge>
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="text-sm font-medium text-primary mb-1">
                                                {design.jewelryType} • {design.material}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2" title={design.prompt}>
                                        {design.prompt}
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                                        {design.gemstone !== 'None' && (
                                            <span className="bg-secondary px-2 py-1 rounded-md">
                                                {design.gemstone}
                                            </span>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Preview Dialog */}
            <Dialog open={!!selectedDesign} onOpenChange={(open) => !open && setSelectedDesign(null)}>
                <DialogContent className="max-w-4xl w-[95vw] h-[90vh] md:h-auto overflow-y-auto p-0 gap-0 bg-background/95 backdrop-blur-xl border-gold/20">
                    <button
                        onClick={() => setSelectedDesign(null)}
                        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-50 text-white bg-black/50 p-1"
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                        {/* Image Side */}
                        <div
                            className="relative bg-black flex items-center justify-center min-h-[40vh] md:h-full overflow-hidden select-none"
                            onContextMenu={(e) => e.preventDefault()}
                        >
                            {selectedDesign && (
                                <>
                                    <img
                                        src={selectedDesign.imageUrl}
                                        alt={selectedDesign.prompt}
                                        className="max-h-full max-w-full object-contain"
                                        draggable="false"
                                    />
                                    {/* Watermark for unpaid designs */}
                                    {!selectedDesign.isPaid && <Watermark />}
                                </>
                            )}
                        </div>

                        {/* Details Side */}
                        <div className="p-6 md:p-8 flex flex-col h-full overflow-hidden">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-playfair font-bold text-gradient-gold mb-2 pr-8">
                                    Design Details
                                </DialogTitle>
                            </DialogHeader>

                            {selectedDesign && (
                                <div className="space-y-6 flex-1 overflow-y-auto mt-4 pr-2">
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                                            <p className="text-lg leading-relaxed">{selectedDesign.prompt}</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="text-sm font-medium text-muted-foreground mb-1">Type</h4>
                                                <p className="font-medium">{selectedDesign.jewelryType}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-muted-foreground mb-1">Material</h4>
                                                <p className="font-medium">{selectedDesign.material}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-muted-foreground mb-1">Gemstone</h4>
                                                <p className="font-medium">{selectedDesign.gemstone}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-muted-foreground mb-1">Created</h4>
                                                <p className="font-medium text-sm text-muted-foreground">
                                                    {selectedDesign.createdAt?.toDate ? selectedDesign.createdAt.toDate().toLocaleDateString() : 'Just now'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 mt-auto border-t border-border flex flex-col gap-3">
                                        <Button
                                            size="lg"
                                            className="w-full text-lg h-12 shadow-gold"
                                            variant={selectedDesign.isPaid ? "default" : "secondary"}
                                            onClick={() => handleDownloadClick(selectedDesign)}
                                            disabled={processingPaymentId === selectedDesign.id || (paymentLoading && processingPaymentId === selectedDesign.id)}
                                        >
                                            {processingPaymentId === selectedDesign.id ? (
                                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                            ) : selectedDesign.isPaid ? (
                                                <Download className="h-5 w-5 mr-2" />
                                            ) : (
                                                <Lock className="h-5 w-5 mr-2" />
                                            )}
                                            {selectedDesign.isPaid ? "Download High Quality" : "Unlock to Download (₹100)"}
                                        </Button>

                                        <Button
                                            variant="outline"
                                            className="w-full border-red-500/50 text-red-500 hover:bg-red-500/10"
                                            onClick={() => selectedDesign.id && handleDelete(selectedDesign.id)}
                                            disabled={deleting === selectedDesign.id}
                                        >
                                            {deleting === selectedDesign.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            ) : (
                                                <Trash2 className="h-4 w-4 mr-2" />
                                            )}
                                            Delete Design
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
