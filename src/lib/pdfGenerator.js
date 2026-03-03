import jsPDF from 'jspdf'
import 'jspdf-autotable'

/**
 * Generate a DIN 5008-compliant quote PDF
 */
export function generateQuotePDF(quote, company) {
    const doc = new jsPDF('p', 'mm', 'a4')
    const pageWidth = 210
    const marginLeft = 25
    const marginRight = 20
    const contentWidth = pageWidth - marginLeft - marginRight

    // Colors
    const primary = [108, 99, 255] // accent
    const textDark = [30, 30, 40]
    const textMuted = [130, 130, 150]

    let y = 20

    // --- Header: Company Name ---
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...primary)
    doc.text(company.name || 'Ihr Unternehmen', marginLeft, y)
    y += 8

    // Company details line
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...textMuted)
    const companyLine = [company.address, company.zip, company.city].filter(Boolean).join(', ')
    if (companyLine) {
        doc.text(companyLine, marginLeft, y)
        y += 4
    }
    const contactLine = [company.email, company.phone].filter(Boolean).join(' · ')
    if (contactLine) {
        doc.text(contactLine, marginLeft, y)
        y += 4
    }
    if (company.ustId) {
        doc.text(`USt-IdNr.: ${company.ustId}`, marginLeft, y)
        y += 4
    }

    // Separator line
    y += 4
    doc.setDrawColor(...primary)
    doc.setLineWidth(0.8)
    doc.line(marginLeft, y, pageWidth - marginRight, y)
    y += 10

    // --- Recipient address block (DIN 5008 position: ~50mm from top) ---
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...textDark)
    doc.text(quote.clientName || 'Empfänger', marginLeft, y)
    y += 5
    if (quote.clientAddress) {
        doc.text(quote.clientAddress, marginLeft, y)
        y += 5
    }
    const clientCityLine = [quote.clientZip, quote.clientCity].filter(Boolean).join(' ')
    if (clientCityLine) {
        doc.text(clientCityLine, marginLeft, y)
        y += 5
    }
    if (quote.clientEmail) {
        doc.setTextColor(...textMuted)
        doc.setFontSize(8)
        doc.text(quote.clientEmail, marginLeft, y)
        y += 5
    }

    y += 10

    // --- Date and Quote Number (right aligned) ---
    const today = new Date()
    const dateStr = today.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
    const validDate = new Date(today.getTime() + (quote.validDays || 30) * 86400000)
    const validStr = validDate.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...textMuted)
    doc.text(`Datum: ${dateStr}`, pageWidth - marginRight, y, { align: 'right' })
    y += 5
    doc.text(`Gültig bis: ${validStr}`, pageWidth - marginRight, y, { align: 'right' })

    // Quote title (left)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...textDark)
    doc.text(`Angebot ${quote.quoteNumber}`, marginLeft, y - 3)
    y += 10

    // --- Intro text ---
    if (quote.introText) {
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(...textDark)
        const introLines = doc.splitTextToSize(`Sehr geehrte Damen und Herren, ${quote.introText}`, contentWidth)
        doc.text(introLines, marginLeft, y)
        y += introLines.length * 5 + 5
    }

    // --- Positions Table ---
    const tableItems = quote.items.map((item, i) => [
        String(i + 1),
        item.description || '–',
        String(item.quantity),
        item.unit || 'Stück',
        `€${item.unitPrice.toFixed(2)}`,
        `€${(item.quantity * item.unitPrice).toFixed(2)}`
    ])

    doc.autoTable({
        startY: y,
        head: [['Pos.', 'Beschreibung', 'Menge', 'Einheit', 'Einzelpreis', 'Gesamt']],
        body: tableItems,
        margin: { left: marginLeft, right: marginRight },
        headStyles: {
            fillColor: primary,
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 9,
        },
        bodyStyles: {
            fontSize: 9,
            textColor: textDark,
        },
        alternateRowStyles: {
            fillColor: [245, 245, 250],
        },
        columnStyles: {
            0: { cellWidth: 12, halign: 'center' },
            2: { cellWidth: 15, halign: 'center' },
            3: { cellWidth: 18 },
            4: { cellWidth: 25, halign: 'right' },
            5: { cellWidth: 25, halign: 'right' },
        },
        theme: 'grid',
    })

    y = doc.lastAutoTable.finalY + 8

    // --- Totals ---
    const subtotal = quote.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
    const taxAmount = subtotal * (quote.taxRate / 100)
    const total = subtotal + taxAmount

    const totalsX = pageWidth - marginRight - 60
    const valuesX = pageWidth - marginRight

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...textMuted)
    doc.text('Nettobetrag:', totalsX, y)
    doc.setTextColor(...textDark)
    doc.text(`€${subtotal.toFixed(2)}`, valuesX, y, { align: 'right' })
    y += 6

    doc.setTextColor(...textMuted)
    doc.text(`MwSt. ${quote.taxRate}%:`, totalsX, y)
    doc.setTextColor(...textDark)
    doc.text(`€${taxAmount.toFixed(2)}`, valuesX, y, { align: 'right' })
    y += 6

    // Total line
    doc.setDrawColor(...primary)
    doc.setLineWidth(0.5)
    doc.line(totalsX, y, valuesX, y)
    y += 6

    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...primary)
    doc.text('Gesamtbetrag:', totalsX, y)
    doc.text(`€${total.toFixed(2)}`, valuesX, y, { align: 'right' })
    y += 12

    // --- Outro text ---
    if (quote.outroText) {
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(...textDark)
        const outroLines = doc.splitTextToSize(quote.outroText, contentWidth)
        doc.text(outroLines, marginLeft, y)
        y += outroLines.length * 5 + 5
    }

    // --- Footer with bank details ---
    const footerY = 275
    doc.setDrawColor(200, 200, 210)
    doc.setLineWidth(0.3)
    doc.line(marginLeft, footerY, pageWidth - marginRight, footerY)

    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...textMuted)

    const footerParts = [
        company.name, companyLine,
        company.bankName ? `Bank: ${company.bankName}` : '',
        company.bankIban ? `IBAN: ${company.bankIban}` : '',
        company.bankBic ? `BIC: ${company.bankBic}` : '',
    ].filter(Boolean)

    doc.text(footerParts.join(' | '), pageWidth / 2, footerY + 4, { align: 'center' })

    // Branding
    doc.setFontSize(6)
    doc.text('Erstellt mit angeboterstellenonline.de', pageWidth / 2, footerY + 8, { align: 'center' })

    return doc
}
