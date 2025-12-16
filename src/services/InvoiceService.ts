import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface InvoiceItem {
    description: string
    weight: string
    rate: string
    amount: string
}

interface InvoiceDetails {
    transactionId: string
    date: string
    customerName: string
    items: InvoiceItem[]
    totalAmount: string
    profit: string
}

export const InvoiceService = {
    generateSellInvoice: (details: InvoiceDetails) => {
        const doc = new jsPDF()

        // Header
        doc.setFontSize(22)
        doc.setTextColor(212, 175, 55) // Gold color
        doc.text("GOLD CRAFT", 105, 20, { align: "center" })

        doc.setFontSize(10)
        doc.setTextColor(100)
        doc.text("Premium Gold & Silver Investments", 105, 26, { align: "center" })
        doc.text("123, Gold Souk, Mumbai, India - 400001", 105, 31, { align: "center" })

        // Line separator
        doc.setDrawColor(212, 175, 55)
        doc.line(20, 35, 190, 35)

        // Invoice Details
        doc.setFontSize(12)
        doc.setTextColor(0)
        doc.text("SALE INVOICE", 20, 45)

        doc.setFontSize(10)
        doc.text(`Transaction ID: ${details.transactionId}`, 20, 55)
        doc.text(`Date: ${details.date}`, 20, 60)
        doc.text(`Customer: ${details.customerName}`, 20, 65)

        // Table
        autoTable(doc, {
            startY: 75,
            head: [['Description', 'Weight', 'Rate', 'Amount']],
            body: details.items.map(item => [
                item.description,
                item.weight,
                item.rate,
                item.amount
            ]),
            headStyles: { fillColor: [212, 175, 55], textColor: [255, 255, 255] },
            alternateRowStyles: { fillColor: [250, 250, 240] },
            styles: { fontSize: 10 }
        })

        // Totals
        const finalY = (doc as any).lastAutoTable.finalY || 75
        doc.setFontSize(10)
        doc.text("Total Amount Credited:", 140, finalY + 10)
        doc.setFontSize(12)
        doc.setFont("helvetica", "bold")
        doc.text(`Rs. ${details.totalAmount}`, 190, finalY + 10, { align: "right" })

        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        doc.text("Profit/Loss Realized:", 140, finalY + 18)
        doc.text(`Rs. ${details.profit}`, 190, finalY + 18, { align: "right" })

        // Footer
        doc.setFontSize(8)
        doc.setTextColor(150)
        doc.text("This is a computer generated invoice and does not require a signature.", 105, 280, { align: "center" })
        doc.text("Thank you for investing with GOLD CRAFT.", 105, 285, { align: "center" })

        // Save
        doc.save(`GOLD_CRAFT_Invoice_${details.transactionId}.pdf`)
    }
}
