import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useApp } from '../context/AppContext'
import { generateQuotePDF } from '../lib/pdfGenerator'

export default function QuoteEditor() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { quotes, company, updateQuote, addItem, updateItem, removeItem, incrementUsage } = useApp()
    const [pdfUrl, setPdfUrl] = useState(null)

    const quote = quotes.find(q => q.id === id)

    const subtotal = useMemo(() => {
        if (!quote) return 0
        return quote.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
    }, [quote])

    const taxAmount = subtotal * ((quote?.taxRate || 19) / 100)
    const total = subtotal + taxAmount

    if (!quote) {
        return (
            <div className="legal-page" style={{ paddingTop: '100px', textAlign: 'center', minHeight: '60vh' }}>
                <h2>Angebot nicht gefunden</h2>
                <button className="btn btn-primary" onClick={() => navigate('/app')} style={{ marginTop: '1rem' }}>
                    Zurück zum Dashboard
                </button>
            </div>
        )
    }

    const handleUpdate = (key, value) => {
        updateQuote(id, { [key]: value })
    }

    const handleItemUpdate = (itemId, key, value) => {
        const parsed = key === 'quantity' || key === 'unitPrice' ? parseFloat(value) || 0 : value
        updateItem(id, itemId, { [key]: parsed })
    }

    const handleGeneratePDF = () => {
        const doc = generateQuotePDF(quote, company)
        const url = doc.output('bloburl')
        setPdfUrl(url)
        incrementUsage()
    }

    const handleDownloadPDF = () => {
        const doc = generateQuotePDF(quote, company)
        doc.save(`${quote.quoteNumber}.pdf`)
    }

    const handleStatusChange = (status) => {
        updateQuote(id, { status })
    }

    return (
        <div style={{ paddingTop: '80px', minHeight: '100vh', paddingBottom: 'var(--spacing-4xl)' }}>
            <Helmet>
                <title>{quote.quoteNumber} — Editor | Angebote Erstellen Online</title>
            </Helmet>

            <div className="container">
                {/* Top Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                        <button className="btn btn-secondary" style={smallBtn} onClick={() => navigate('/app')}>← Dashboard</button>
                        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800 }}>{quote.quoteNumber}</h1>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
                        <select
                            value={quote.status}
                            onChange={e => handleStatusChange(e.target.value)}
                            style={{ ...inputStyle, width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                        >
                            <option value="draft">📝 Entwurf</option>
                            <option value="sent">📧 Gesendet</option>
                            <option value="accepted">✅ Angenommen</option>
                            <option value="rejected">❌ Abgelehnt</option>
                        </select>
                        <button className="btn btn-secondary" style={smallBtn} onClick={handleGeneratePDF}>👁️ Vorschau</button>
                        <button className="btn btn-primary" style={smallBtn} onClick={handleDownloadPDF}>📥 PDF Download</button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: pdfUrl ? '1fr 1fr' : '1fr', gap: 'var(--spacing-xl)' }}>
                    {/* LEFT: Editor Form */}
                    <div>
                        {/* Client Info */}
                        <div className="glass-card" style={{ padding: 'var(--spacing-xl)', marginBottom: 'var(--spacing-lg)' }}>
                            <h3 style={sectionTitle}>📩 Empfänger</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
                                <div>
                                    <label style={labelStyle}>Firma / Name *</label>
                                    <input style={inputStyle} value={quote.clientName} onChange={e => handleUpdate('clientName', e.target.value)} placeholder="Kundin AG" />
                                </div>
                                <div>
                                    <label style={labelStyle}>E-Mail</label>
                                    <input style={inputStyle} type="email" value={quote.clientEmail} onChange={e => handleUpdate('clientEmail', e.target.value)} placeholder="info@kunde.de" />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 'var(--spacing-md)' }}>
                                <div>
                                    <label style={labelStyle}>Straße</label>
                                    <input style={inputStyle} value={quote.clientAddress} onChange={e => handleUpdate('clientAddress', e.target.value)} placeholder="Kundenweg 5" />
                                </div>
                                <div>
                                    <label style={labelStyle}>PLZ</label>
                                    <input style={inputStyle} value={quote.clientZip} onChange={e => handleUpdate('clientZip', e.target.value)} placeholder="80331" />
                                </div>
                                <div>
                                    <label style={labelStyle}>Stadt</label>
                                    <input style={inputStyle} value={quote.clientCity} onChange={e => handleUpdate('clientCity', e.target.value)} placeholder="München" />
                                </div>
                            </div>
                        </div>

                        {/* Quote Settings */}
                        <div className="glass-card" style={{ padding: 'var(--spacing-xl)', marginBottom: 'var(--spacing-lg)' }}>
                            <h3 style={sectionTitle}>⚙️ Einstellungen</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--spacing-md)' }}>
                                <div>
                                    <label style={labelStyle}>MwSt. (%)</label>
                                    <input style={inputStyle} type="number" step="0.1" value={quote.taxRate} onChange={e => handleUpdate('taxRate', parseFloat(e.target.value) || 0)} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Gültigkeit (Tage)</label>
                                    <input style={inputStyle} type="number" value={quote.validDays} onChange={e => handleUpdate('validDays', parseInt(e.target.value) || 30)} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Angebots-Nr.</label>
                                    <input style={inputStyle} value={quote.quoteNumber} onChange={e => handleUpdate('quoteNumber', e.target.value)} />
                                </div>
                            </div>
                        </div>

                        {/* Intro Text */}
                        <div className="glass-card" style={{ padding: 'var(--spacing-xl)', marginBottom: 'var(--spacing-lg)' }}>
                            <h3 style={sectionTitle}>📝 Einleitungstext</h3>
                            <textarea
                                style={{ ...inputStyle, resize: 'vertical', minHeight: '60px' }}
                                value={quote.introText}
                                onChange={e => handleUpdate('introText', e.target.value)}
                            />
                        </div>

                        {/* Positions */}
                        <div className="glass-card" style={{ padding: 'var(--spacing-xl)', marginBottom: 'var(--spacing-lg)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                                <h3 style={{ ...sectionTitle, marginBottom: 0 }}>📋 Positionen</h3>
                                <button className="btn btn-secondary" style={smallBtn} onClick={() => addItem(id)}>+ Position</button>
                            </div>

                            {/* Table Header */}
                            <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 70px 80px 100px 100px 36px', gap: '8px', marginBottom: '8px', padding: '0 4px' }}>
                                <div style={thStyle}>Pos.</div>
                                <div style={thStyle}>Beschreibung</div>
                                <div style={thStyle}>Menge</div>
                                <div style={thStyle}>Einheit</div>
                                <div style={thStyle}>Einzelpreis</div>
                                <div style={thStyle}>Gesamt</div>
                                <div style={thStyle}></div>
                            </div>

                            {quote.items.map((item, i) => (
                                <div key={item.id} style={{
                                    display: 'grid', gridTemplateColumns: '40px 1fr 70px 80px 100px 100px 36px', gap: '8px',
                                    marginBottom: '8px', alignItems: 'center',
                                    padding: '8px 4px', borderRadius: 'var(--radius-md)',
                                    background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent'
                                }}>
                                    <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>{i + 1}</div>
                                    <input style={cellInput} value={item.description} onChange={e => handleItemUpdate(item.id, 'description', e.target.value)} placeholder="Leistungsbeschreibung" />
                                    <input style={{ ...cellInput, textAlign: 'center' }} type="number" min="1" step="1" value={item.quantity} onChange={e => handleItemUpdate(item.id, 'quantity', e.target.value)} />
                                    <select style={cellInput} value={item.unit} onChange={e => handleItemUpdate(item.id, 'unit', e.target.value)}>
                                        <option>Stück</option>
                                        <option>Stunde</option>
                                        <option>Tag</option>
                                        <option>Pauschal</option>
                                        <option>Monat</option>
                                        <option>m²</option>
                                    </select>
                                    <input style={{ ...cellInput, textAlign: 'right' }} type="number" min="0" step="0.01" value={item.unitPrice} onChange={e => handleItemUpdate(item.id, 'unitPrice', e.target.value)} />
                                    <div style={{ textAlign: 'right', fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-text-primary)' }}>
                                        €{(item.quantity * item.unitPrice).toFixed(2)}
                                    </div>
                                    <button
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: 'var(--color-text-muted)', padding: '4px' }}
                                        onClick={() => removeItem(id, item.id)}
                                        title="Position entfernen"
                                    >✕</button>
                                </div>
                            ))}

                            {/* Totals */}
                            <div style={{ borderTop: '2px solid var(--color-border)', marginTop: 'var(--spacing-md)', paddingTop: 'var(--spacing-md)' }}>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-2xl)' }}>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={totalLine}><span style={{ color: 'var(--color-text-muted)' }}>Netto:</span> €{subtotal.toFixed(2)}</div>
                                        <div style={totalLine}><span style={{ color: 'var(--color-text-muted)' }}>MwSt. {quote.taxRate}%:</span> €{taxAmount.toFixed(2)}</div>
                                        <div style={{ ...totalLine, fontSize: 'var(--font-size-xl)', fontWeight: 800, color: 'var(--color-accent-light)', marginTop: '4px' }}>
                                            Gesamt: €{total.toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Outro Text */}
                        <div className="glass-card" style={{ padding: 'var(--spacing-xl)' }}>
                            <h3 style={sectionTitle}>📝 Abschlusstext</h3>
                            <textarea
                                style={{ ...inputStyle, resize: 'vertical', minHeight: '60px' }}
                                value={quote.outroText}
                                onChange={e => handleUpdate('outroText', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* RIGHT: PDF Preview */}
                    {pdfUrl && (
                        <div style={{ position: 'sticky', top: '90px', height: 'calc(100vh - 110px)' }}>
                            <div className="glass-card" style={{ height: '100%', overflow: 'hidden', padding: 0 }}>
                                <div style={{
                                    padding: 'var(--spacing-sm) var(--spacing-md)',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg-tertiary)'
                                }}>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>📄 Live-Vorschau</span>
                                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: '1.2rem' }} onClick={() => setPdfUrl(null)}>✕</button>
                                </div>
                                <iframe
                                    src={pdfUrl}
                                    style={{ width: '100%', height: 'calc(100% - 40px)', border: 'none', background: 'white' }}
                                    title="PDF Vorschau"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

const inputStyle = {
    width: '100%', padding: '0.7rem 0.85rem',
    background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)',
    fontFamily: 'var(--font-family)', fontSize: 'var(--font-size-sm)', outline: 'none',
}
const cellInput = {
    ...inputStyle, padding: '0.5rem 0.6rem', fontSize: '0.8rem', borderRadius: '6px',
}
const labelStyle = { display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px', color: 'var(--color-text-muted)' }
const sectionTitle = { fontSize: 'var(--font-size-base)', fontWeight: 700, marginBottom: 'var(--spacing-lg)' }
const smallBtn = { padding: '0.4rem 0.9rem', fontSize: '0.8rem' }
const totalLine = { fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: '4px' }
const thStyle = { fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }
