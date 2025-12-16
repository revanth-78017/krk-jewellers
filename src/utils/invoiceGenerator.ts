import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface InvoiceItem {
    name: string
    quantity: number
    price: number
    image: string
}

interface InvoiceData {
    invoiceNumber: string
    orderDate: string
    estimatedDelivery: string
    customerName: string
    customerEmail: string
    items: InvoiceItem[]
    subtotal: number
    tax: number
    total: number
}

export const generateInvoice = (data: InvoiceData) => {
    const doc = new jsPDF()

    // Brand Header
    doc.setFillColor(212, 175, 55) // Gold color
    doc.rect(0, 0, 210, 40, 'F')

    doc.setTextColor(0, 0, 0)
    doc.setFontSize(28)
    doc.setFont('helvetica', 'bold')
    doc.text('GOLD CRAFT', 105, 20, { align: 'center' })

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Premium Jewelry & Custom Designs', 105, 28, { align: 'center' })

    // Invoice Title
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('INVOICE', 20, 55)

    // Invoice Details
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Invoice Number: ${data.invoiceNumber}`, 20, 65)
    doc.text(`Order Date: ${data.orderDate}`, 20, 72)
    doc.text(`Estimated Delivery: ${data.estimatedDelivery}`, 20, 79)

    // Customer Details
    doc.setFont('helvetica', 'bold')
    doc.text('Bill To:', 20, 92)
    doc.setFont('helvetica', 'normal')
    doc.text(data.customerName, 20, 99)
    doc.text(data.customerEmail, 20, 106)

    // Items Table - Using "Rs" instead of rupee symbol
    const tableData = data.items.map(item => [
        '', // Column 0: Image (placeholder, drawn manually)
        item.name,
        item.quantity.toString(),
        `Rs ${item.price.toLocaleString()}`,
        `Rs ${(item.price * item.quantity).toLocaleString()}`
    ])

    autoTable(doc, {
        startY: 120,
        head: [['Image', 'Item', 'Qty', 'Unit Price', 'Total']],
        body: tableData,
        theme: 'striped',
        headStyles: {
            fillColor: [212, 175, 55],
            textColor: [0, 0, 0],
            fontStyle: 'bold'
        },
        styles: {
            fontSize: 10,
            minCellHeight: 20, // Ensure space for image
            valign: 'middle'
        },
        columnStyles: {
            0: { cellWidth: 25 }, // Image column width
        },
        didDrawCell: (hookData) => {
            if (hookData.section === 'body' && hookData.column.index === 0) {
                const item = data.items[hookData.row.index]
                if (item && item.image) {
                    try {
                        // Draw image inside the cell
                        // Padding: 2
                        doc.addImage(item.image, 'JPEG', hookData.cell.x + 2, hookData.cell.y + 2, 16, 16)
                    } catch (e) {
                        console.error('Error adding image to PDF:', e)
                    }
                }
            }
        }
    })

    // Get the final Y position after the table
    const finalY = (doc as any).lastAutoTable.finalY || 120

    // Totals
    const totalsStartY = finalY + 10
    doc.setFont('helvetica', 'normal')
    doc.text('Subtotal:', 130, totalsStartY)
    doc.text(`Rs ${data.subtotal.toLocaleString()}`, 180, totalsStartY, { align: 'right' })

    doc.text('Tax (3%):', 130, totalsStartY + 7)
    doc.text(`Rs ${data.tax.toLocaleString()}`, 180, totalsStartY + 7, { align: 'right' })

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('Total:', 130, totalsStartY + 17)
    doc.text(`Rs ${data.total.toLocaleString()}`, 180, totalsStartY + 17, { align: 'right' })

    // Payment Status
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 128, 0)
    doc.text('PAID', 20, totalsStartY + 17)

    // Footer
    doc.setTextColor(128, 128, 128)
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(8)
    doc.text('Thank you for your purchase!', 105, 280, { align: 'center' })
    doc.text('For any queries, contact us at support@goldcraft.com', 105, 285, { align: 'center' })

    // Download
    doc.save(`GOLD_CRAFT_Invoice_${data.invoiceNumber}.pdf`)
}
