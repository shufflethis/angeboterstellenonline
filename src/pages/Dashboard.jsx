import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'

const STATUS_MAP = {
    draft: { label: 'Entwurf', color: 'var(--color-text-muted)' },
    sent: { label: 'Gesendet', color: 'var(--color-warning)' },
    accepted: { label: 'Angenommen', color: 'var(--color-positive)' },
    rejected: { label: 'Abgelehnt', color: 'var(--color-danger)' },
}

export default function Dashboard() {
    const { user, signOut } = useAuth()
    const { quotes, company, createQuote, deleteQuote, canCreateQuote, getMonthlyUsage } = useApp()
    const navigate = useNavigate()

    const handleNewQuote = () => {
        if (!company.name) {
            navigate('/app/company')
            return
        }
        if (!canCreateQuote()) {
            // Show upgrade prompt
            alert('Sie haben Ihr monatliches Limit (1 Angebot) erreicht. Upgraden Sie auf Starter für mehr Angebote.')
            return
        }
        const id = createQuote()
        navigate(`/app/editor/${id}`)
    }

    const calcTotal = (quote) => {
        const subtotal = quote.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
        return subtotal * (1 + (quote.taxRate || 19) / 100)
    }

    const usage = getMonthlyUsage()

    return (
        <div className="legal-page" style={{ paddingTop: '100px', minHeight: '80vh' }}>
            <Helmet>
                <title>Dashboard | Angebote Erstellen Online</title>
            </Helmet>

            <div className="container">
                {/* Header Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-2xl)' }}>
                    <div>
                        <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, marginBottom: 'var(--spacing-xs)' }}>
                            Dashboard
                        </h1>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                            {user?.email} · Free Tarif · {usage}/1 Angebot diesen Monat
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                        <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }} onClick={() => navigate('/app/company')}>
                            ⚙️ Firmendaten
                        </button>
                        <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }} onClick={signOut}>
                            Abmelden
                        </button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-2xl)' }}>
                    {[
                        { label: 'Gesamt', value: quotes.length, icon: '📄' },
                        { label: 'Entwürfe', value: quotes.filter(q => q.status === 'draft').length, icon: '✏️' },
                        { label: 'Gesendet', value: quotes.filter(q => q.status === 'sent').length, icon: '📧' },
                        { label: 'Angenommen', value: quotes.filter(q => q.status === 'accepted').length, icon: '✅' },
                    ].map((s, i) => (
                        <div className="glass-card" key={i} style={{ padding: 'var(--spacing-lg)', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-xs)' }}>{s.icon}</div>
                            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800 }}>{s.value}</div>
                            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Company Warning */}
                {!company.name && (
                    <div className="glass-card" style={{
                        padding: 'var(--spacing-lg)',
                        marginBottom: 'var(--spacing-xl)',
                        borderColor: 'var(--color-warning)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                            <span style={{ fontSize: '1.5rem' }}>⚠️</span>
                            <div>
                                <strong>Firmendaten fehlen</strong>
                                <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', margin: 0 }}>
                                    Bitte hinterlegen Sie Ihre Firmendaten, bevor Sie ein Angebot erstellen.
                                </p>
                            </div>
                        </div>
                        <button className="btn btn-primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.8rem' }} onClick={() => navigate('/app/company')}>
                            Jetzt einrichten →
                        </button>
                    </div>
                )}

                {/* New Quote Button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                    <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700 }}>Meine Angebote</h2>
                    <button className="btn btn-primary" onClick={handleNewQuote}>
                        + Neues Angebot
                    </button>
                </div>

                {/* Quotes List */}
                {quotes.length === 0 ? (
                    <div className="glass-card" style={{ padding: 'var(--spacing-4xl)', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>📋</div>
                        <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--spacing-sm)' }}>
                            Noch keine Angebote
                        </h3>
                        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-xl)' }}>
                            Erstellen Sie Ihr erstes professionelles Angebot — kostenlos!
                        </p>
                        <button className="btn btn-primary" onClick={handleNewQuote}>
                            Erstes Angebot erstellen →
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        {quotes.slice().reverse().map(quote => {
                            const status = STATUS_MAP[quote.status] || STATUS_MAP.draft
                            const total = calcTotal(quote)
                            return (
                                <div
                                    className="glass-card"
                                    key={quote.id}
                                    style={{ padding: 'var(--spacing-lg)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                    onClick={() => navigate(`/app/editor/${quote.id}`)}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)' }}>
                                        <div style={{
                                            width: '48px', height: '48px', borderRadius: 'var(--radius-md)',
                                            background: 'var(--color-accent-glow)', display: 'flex', alignItems: 'center',
                                            justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0
                                        }}>📄</div>
                                        <div>
                                            <div style={{ fontWeight: 700, marginBottom: '2px' }}>{quote.quoteNumber}</div>
                                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                                                {quote.clientName || 'Kein Kunde'} · {new Date(quote.createdAt).toLocaleDateString('de-DE')}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xl)' }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: 700, fontSize: 'var(--font-size-lg)' }}>
                                                €{total.toFixed(2).replace('.', ',')}
                                            </div>
                                            <div style={{
                                                fontSize: 'var(--font-size-xs)', fontWeight: 600, color: status.color,
                                                textTransform: 'uppercase', letterSpacing: '0.05em'
                                            }}>
                                                {status.label}
                                            </div>
                                        </div>
                                        <button
                                            className="btn btn-secondary"
                                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                                            onClick={(e) => { e.stopPropagation(); deleteQuote(quote.id) }}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
