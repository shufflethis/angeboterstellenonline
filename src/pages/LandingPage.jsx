import { useState, useRef } from 'react'
import { Helmet } from 'react-helmet-async'

const FEATURES = [
    { icon: '✏️', title: 'Drag & Drop Editor', text: 'Positionen hinzufügen, sortieren, Preise kalkulieren. Intuitiv und schnell — kein Designwissen nötig.' },
    { icon: '📄', title: 'Live PDF-Vorschau', text: 'Sehen Sie in Echtzeit, was Ihr Kunde sieht. DIN-5008-konform, professionell formatiert.' },
    { icon: '🏗️', title: 'Branchen-Templates', text: 'Vorlagen für Handwerk, IT, Marketing, Beratung und mehr. Sofort einsatzbereit.' },
    { icon: '📧', title: '1-Klick Versand', text: 'Angebot direkt per E-Mail an den Kunden senden. Mit Lesebestätigung und Tracking.' },
    { icon: '📊', title: 'Status-Tracking', text: 'Wissen, ob Ihr Angebot geöffnet, angenommen oder abgelehnt wurde. In Echtzeit.' },
    { icon: '🧾', title: 'Angebot → Rechnung', text: 'Akzeptiertes Angebot wird mit einem Klick zur Rechnung. Automatische Rechnungsnummer.' },
]

const BRANCHEN = [
    { icon: '🔧', name: 'Handwerk', desc: 'Maler, Elektriker, Klempner' },
    { icon: '💻', name: 'IT & Software', desc: 'Entwicklung, Hosting, Support' },
    { icon: '📱', name: 'Marketing', desc: 'SEO, Social Media, Ads' },
    { icon: '📋', name: 'Beratung', desc: 'Management, Strategie, Coaching' },
    { icon: '🍽️', name: 'Gastronomie', desc: 'Catering, Events, Lieferung' },
    { icon: '🏠', name: 'Immobilien', desc: 'Makler, Verwaltung, Bewertung' },
    { icon: '⚖️', name: 'Recht', desc: 'Anwälte, Notare, Steuerberater' },
    { icon: '🏥', name: 'Medizin', desc: 'Praxen, Labore, Therapeuten' },
    { icon: '🏋️', name: 'Fitness', desc: 'Studios, Personal Trainer' },
    { icon: '🎓', name: 'Bildung', desc: 'Schulungen, Kurse, Nachhilfe' },
    { icon: '🛒', name: 'E-Commerce', desc: 'Shops, Dropshipping, FBA' },
    { icon: '🎪', name: 'Event', desc: 'Planung, Technik, Location' },
]

const STEPS = [
    { num: '1', title: 'Firma eintragen', text: 'Name, Adresse, Logo — einmalig eingeben, für immer gespeichert.' },
    { num: '2', title: 'Positionen anlegen', text: 'Leistungen, Preise, MwSt. und Rabatte eingeben.' },
    { num: '3', title: 'Vorschau prüfen', text: 'Live-PDF-Vorschau checken und anpassen.' },
    { num: '4', title: 'Senden & Tracken', text: 'PDF downloaden oder direkt per E-Mail versenden.' },
]

const PRICING = [
    {
        name: 'Free',
        price: '0',
        period: 'Für immer',
        features: [
            { text: '1 Angebot / Monat', included: true },
            { text: '1 Standard-Template', included: true },
            { text: 'PDF-Export', included: true },
            { text: 'DIN 5008-konform', included: true },
            { text: 'Eigenes Logo', included: false },
            { text: 'E-Mail-Versand', included: false },
            { text: 'Angebot → Rechnung', included: false },
            { text: 'Branding entfernen', included: false },
        ],
        cta: 'Kostenlos starten',
        featured: false,
    },
    {
        name: 'Starter',
        price: '19',
        period: '/ Monat',
        features: [
            { text: '10 Angebote / Monat', included: true },
            { text: 'Eigenes Logo', included: true },
            { text: '5 Branchen-Templates', included: true },
            { text: '50 Kontakte', included: true },
            { text: 'E-Mail-Versand (5/Monat)', included: true },
            { text: 'Angebot → Rechnung', included: false },
            { text: 'Digitale Unterschrift', included: false },
            { text: 'Branding entfernen', included: false },
        ],
        cta: 'Starter wählen',
        featured: false,
    },
    {
        name: 'Business',
        price: '49',
        period: '/ Monat',
        badge: 'Beliebtester Tarif',
        features: [
            { text: 'Unbegrenzte Angebote', included: true },
            { text: 'Eigenes Logo + Farben', included: true },
            { text: 'Alle Templates + Custom', included: true },
            { text: 'Unbegrenzte Kontakte', included: true },
            { text: 'Unbegrenzter E-Mail-Versand', included: true },
            { text: 'Angebot → Rechnung', included: true },
            { text: 'Digitale Unterschrift', included: true },
            { text: 'Branding entfernen', included: true },
        ],
        cta: 'Business wählen',
        featured: true,
    },
    {
        name: 'Enterprise',
        price: '129',
        period: '/ Monat',
        features: [
            { text: 'Alles aus Business', included: true },
            { text: 'DATEV-Export', included: true },
            { text: 'Custom Domain E-Mail', included: true },
            { text: 'API-Zugang', included: true },
            { text: 'White-Label Option', included: true },
            { text: 'Qualifizierte e-Signatur', included: true },
            { text: 'CRM-Export', included: true },
            { text: 'Dedicated Support', included: true },
        ],
        cta: 'Enterprise anfragen',
        featured: false,
    },
]

const FAQ_DATA = [
    { q: 'Ist das erste Angebot wirklich kostenlos?', a: 'Ja, zu 100%. Sie erstellen Ihr erstes professionelles Angebot vollständig kostenlos — inklusive PDF-Export. Kein Haken, keine Kreditkarte nötig. Erst ab dem zweiten Angebot wählen Sie einen passenden Tarif.' },
    { q: 'Wie funktioniert der PDF-Export?', a: 'Ihr Angebot wird als hochwertige DIN-A4-PDF generiert, die dem DIN-5008-Standard entspricht (Geschäftsbrief-Norm in Deutschland). Die PDF enthält Ihr Logo, alle Positionen mit Berechnungen und kann direkt per E-Mail versendet oder heruntergeladen werden.' },
    { q: 'Kann ich mein eigenes Firmenlogo verwenden?', a: 'Ab dem Starter-Tarif (€19/Monat) können Sie Ihr eigenes Logo hochladen. Im Business-Tarif können Sie zusätzlich Ihre Firmenfarben anpassen und das „Erstellt mit Angebote Online"-Branding vollständig entfernen.' },
    { q: 'Sind die Angebote rechtssicher?', a: 'Unsere Angebote folgen dem deutschen Geschäftsbrief-Standard (DIN 5008) und enthalten alle wichtigen Pflichtangaben wie USt-IdNr., Zahlungsbedingungen und Gültigkeitsdauer. Für die inhaltliche Richtigkeit Ihres konkreten Angebots sind jedoch Sie als Ersteller verantwortlich.' },
    { q: 'Welche Zahlungsmethoden akzeptiert ihr?', a: 'Wir akzeptieren Kreditkarten (Visa, Mastercard, American Express), SEPA-Lastschrift, PayPal und Überweisung. Die Zahlungsabwicklung läuft sicher über Stripe.' },
    { q: 'Kann ich Angebote in Rechnungen umwandeln?', a: 'Ja, ab dem Business-Tarif (€49/Monat). Wenn Ihr Kunde ein Angebot annimmt, können Sie es mit einem Klick in eine Rechnung mit automatischer Rechnungsnummer umwandeln.' },
    { q: 'Wie kündige ich mein Abo?', a: 'Jederzeit mit einem Klick in Ihrem Dashboard. Kein Mindestvertragslaufzeit, keine versteckten Gebühren. Nach der Kündigung bleiben Ihre Daten 30 Tage erhalten.' },
    { q: 'Werden meine Daten in Deutschland gespeichert?', a: 'Ja. Alle Daten werden auf Servern innerhalb der EU gespeichert und sind vollständig DSGVO-konform. Wir verwenden Supabase mit europäischen Servern.' },
    { q: 'Gibt es eine API-Schnittstelle?', a: 'Im Enterprise-Tarif (€129/Monat) erhalten Sie API-Zugang, um Angebote programmatisch zu erstellen und in Ihre bestehenden Systeme (CRM, ERP) zu integrieren.' },
    { q: 'Kann ich Angebote auch auf Englisch erstellen?', a: 'Aktuell unterstützen wir Deutsch als Hauptsprache. Mehrsprachige Unterstützung (Englisch, Französisch, Spanisch) ist für Q3 2026 geplant.' },
    { q: 'Was passiert mit meinen Daten nach der Kündigung?', a: 'Nach der Kündigung bleiben Ihre Daten 30 Tage gespeichert. In diesem Zeitraum können Sie Ihr Konto reaktivieren. Danach werden alle Daten vollständig und unwiderruflich gelöscht.' },
    { q: 'Gibt es einen Einzel-Kauf statt Abo?', a: 'Ja! Wenn Sie kein monatliches Abo möchten, können Sie einzelne Angebote für €4,99 pro Stück erstellen. Ideal für Gelegenheitsnutzer.' },
]

export default function LandingPage() {
    const [openFaq, setOpenFaq] = useState(null)
    const [selectedPlan, setSelectedPlan] = useState('')
    const [formStatus, setFormStatus] = useState('idle') // idle, sending, success, error
    const [formData, setFormData] = useState({ name: '', email: '', company: '', phone: '', message: '' })
    const contactRef = useRef(null)

    const scrollToContact = (plan) => {
        setSelectedPlan(plan)
        contactRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormStatus('sending')
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, plan: selectedPlan })
            })
            if (res.ok) {
                setFormStatus('success')
                setFormData({ name: '', email: '', company: '', phone: '', message: '' })
            } else {
                setFormStatus('error')
            }
        } catch {
            setFormStatus('error')
        }
    }

    const faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": FAQ_DATA.map(item => ({
            "@type": "Question",
            "name": item.q,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.a
            }
        }))
    }

    return (
        <>
            <Helmet>
                <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
            </Helmet>

            {/* === HERO === */}
            <section className="hero section">
                <div className="bg-glow bg-glow-1"></div>
                <div className="bg-glow bg-glow-2"></div>
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-text animate-in">
                            <div className="hero-badge">
                                ✨ 1 Angebot komplett kostenlos
                            </div>
                            <h1 className="hero-title">
                                Professionelle Angebote<br />
                                <span className="gradient-text">in 2 Minuten.</span>
                            </h1>
                            <p className="hero-subtitle">
                                Firmendaten eingeben. Positionen hinzufügen. Als PDF exportieren.
                                DIN-5008-konform. Ohne Designkenntnisse. Ohne Installation.
                            </p>
                            <div className="hero-actions">
                                <a href="#pricing" className="btn btn-primary btn-lg">
                                    Jetzt kostenlos testen →
                                </a>
                                <a href="#features" className="btn btn-secondary btn-lg">
                                    Features entdecken
                                </a>
                            </div>
                            <div className="hero-stats">
                                <div className="hero-stat">
                                    <div className="hero-stat-value">2 Min.</div>
                                    <div className="hero-stat-label">Ø Erstellungszeit</div>
                                </div>
                                <div className="hero-stat">
                                    <div className="hero-stat-value">DIN 5008</div>
                                    <div className="hero-stat-label">Norm-konform</div>
                                </div>
                                <div className="hero-stat">
                                    <div className="hero-stat-value">€0</div>
                                    <div className="hero-stat-label">Erstes Angebot</div>
                                </div>
                            </div>
                        </div>

                        <div className="hero-visual animate-in" style={{ animationDelay: '0.2s' }}>
                            <div className="hero-mockup">
                                <div className="hero-mockup-header">
                                    <span className="mockup-dot red"></span>
                                    <span className="mockup-dot yellow"></span>
                                    <span className="mockup-dot green"></span>
                                    <span style={{ marginLeft: '1rem', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                                        Angebot-2026-001.pdf
                                    </span>
                                </div>
                                <div className="hero-mockup-body">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                        <div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>VON</div>
                                            <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>Mustermann GmbH</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Musterstraße 1, 10115 Berlin</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>AN</div>
                                            <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>Kundin AG</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Kundenweg 5, 80331 München</div>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem' }}>Angebot #2026-001</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>Gültig bis: 03.04.2026</div>

                                    <table className="mockup-table">
                                        <thead>
                                            <tr><th>Pos.</th><th>Beschreibung</th><th>Menge</th><th style={{ textAlign: 'right' }}>Preis</th></tr>
                                        </thead>
                                        <tbody>
                                            <tr><td>1</td><td>Website Relaunch</td><td>1</td><td style={{ textAlign: 'right' }}>€4.500</td></tr>
                                            <tr><td>2</td><td>SEO-Optimierung</td><td>1</td><td style={{ textAlign: 'right' }}>€1.200</td></tr>
                                            <tr><td>3</td><td>Monatl. Wartung</td><td>12</td><td style={{ textAlign: 'right' }}>€300</td></tr>
                                        </tbody>
                                    </table>

                                    <div className="mockup-total">
                                        <span className="mockup-total-label">Gesamtbetrag (netto)</span>
                                        <span className="mockup-total-value">€9.300,00</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* === PROBLEM === */}
            <section className="problem section">
                <div className="container">
                    <div className="section-header">
                        <div className="section-label">Das Problem</div>
                        <h2 className="section-title">Warum Word und Excel nicht reichen</h2>
                        <p className="section-subtitle">
                            80% aller Freelancer und KMU erstellen Angebote noch mit veralteten Tools.
                            Das kostet Zeit, Nerven — und Aufträge.
                        </p>
                    </div>
                    <div className="problem-grid">
                        <div className="glass-card problem-card">
                            <div className="problem-card-icon">⏰</div>
                            <h3 className="problem-card-title">45 Minuten pro Angebot</h3>
                            <p className="problem-card-text">
                                Formatierung anpassen, Summen manuell berechnen, als PDF exportieren, Logo einfügen…
                                <span className="problem-highlight"> Das sind 15+ Stunden pro Monat</span>, die Sie nicht in Rechnung stellen können.
                            </p>
                        </div>
                        <div className="glass-card problem-card">
                            <div className="problem-card-icon">🚫</div>
                            <h3 className="problem-card-title">Unprofessioneller Eindruck</h3>
                            <p className="problem-card-text">
                                Schiefe Tabellen, unterschiedliche Schriftgrößen, fehlendes Logo. Ihr Angebot ist Ihre Visitenkarte —
                                <span className="problem-highlight"> und der erste Eindruck zählt</span>.
                            </p>
                        </div>
                        <div className="glass-card problem-card">
                            <div className="problem-card-icon">🔍</div>
                            <h3 className="problem-card-title">Kein Überblick</h3>
                            <p className="problem-card-text">
                                Welche Angebote sind offen? Was wurde angenommen? Wo liegt die Datei?
                                <span className="problem-highlight"> Excel-Chaos kostet Umsatz</span>.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* === FEATURES === */}
            <section className="section" id="features">
                <div className="container">
                    <div className="section-header">
                        <div className="section-label">Features</div>
                        <h2 className="section-title">Alles, was Sie brauchen</h2>
                        <p className="section-subtitle">
                            Von der ersten Position bis zur fertigen Rechnung — ein durchgehender Workflow.
                        </p>
                    </div>
                    <div className="features-grid">
                        {FEATURES.map((f, i) => (
                            <div className="glass-card feature-card" key={i}>
                                <div className="feature-icon">{f.icon}</div>
                                <h3 className="feature-title">{f.title}</h3>
                                <p className="feature-text">{f.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* === BRANCHEN === */}
            <section className="branchen section" id="branchen">
                <div className="container">
                    <div className="section-header">
                        <div className="section-label">Branchen</div>
                        <h2 className="section-title">Für jede Branche die passende Vorlage</h2>
                        <p className="section-subtitle">
                            Professionelle Angebotsvorlagen, optimiert für Ihre Branche. Sofort einsatzbereit.
                        </p>
                    </div>
                    <div className="branchen-grid">
                        {BRANCHEN.map((b, i) => (
                            <div className="glass-card branche-card" key={i}>
                                <div className="branche-icon">{b.icon}</div>
                                <div className="branche-name">{b.name}</div>
                                <div className="branche-desc">{b.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* === HOW IT WORKS === */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <div className="section-label">So einfach geht's</div>
                        <h2 className="section-title">In 4 Schritten zum perfekten Angebot</h2>
                    </div>
                    <div className="steps-grid">
                        {STEPS.map((s, i) => (
                            <div className="step-card" key={i}>
                                <div className="step-number">{s.num}</div>
                                <h3 className="step-title">{s.title}</h3>
                                <p className="step-text">{s.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* === PRICING === */}
            <section className="section" id="pricing" style={{ background: 'var(--color-bg-secondary)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
                <div className="container">
                    <div className="section-header">
                        <div className="section-label">Preise</div>
                        <h2 className="section-title">Transparent. Fair. Ohne versteckte Kosten.</h2>
                        <p className="section-subtitle">
                            Starten Sie kostenlos. Upgraden Sie, wenn Sie wachsen. Kündigen Sie jederzeit.
                        </p>
                    </div>
                    <div className="pricing-grid">
                        {PRICING.map((p, i) => (
                            <div className={`glass-card pricing-card ${p.featured ? 'featured' : ''}`} key={i}>
                                {p.badge && <div className="pricing-badge">{p.badge}</div>}
                                <div className="pricing-name">{p.name}</div>
                                <div className="pricing-price">
                                    <span className="currency">€</span>{p.price}
                                </div>
                                <div className="pricing-period">{p.period}</div>
                                <ul className="pricing-features">
                                    {p.features.map((f, j) => (
                                        <li key={j}>
                                            <span className={f.included ? 'pricing-check' : 'pricing-x'}>
                                                {f.included ? '✓' : '—'}
                                            </span>
                                            {f.text}
                                        </li>
                                    ))}
                                </ul>
                                <button className={`btn ${p.featured ? 'btn-primary' : 'btn-secondary'}`} style={{ width: '100%' }} onClick={() => scrollToContact(`${p.name} (€${p.price}${p.period})`)}>
                                    {p.cta}
                                </button>
                            </div>
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: 'var(--spacing-xl)', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                        💡 Oder: Einzelnes Angebot für <strong style={{ color: 'var(--color-accent-light)' }}>€4,99</strong> — ohne Abo.
                    </div>
                </div>
            </section>

            {/* === FAQ === */}
            <section className="section" id="faq">
                <div className="container">
                    <div className="section-header">
                        <div className="section-label">FAQ</div>
                        <h2 className="section-title">Häufig gestellte Fragen</h2>
                    </div>
                    <div className="faq-list">
                        {FAQ_DATA.map((item, i) => (
                            <div className="faq-item" key={i}>
                                <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                                    <span>{item.q}</span>
                                    <span className={`faq-toggle ${openFaq === i ? 'open' : ''}`}>+</span>
                                </button>
                                <div className={`faq-answer ${openFaq === i ? 'open' : ''}`}>
                                    <p>{item.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* === CTA === */}
            <section className="cta-section section">
                <div className="container">
                    <div className="cta-box">
                        <div className="bg-glow bg-glow-1" style={{ top: '-100px', right: '-100px', width: '400px', height: '400px' }}></div>
                        <h2 className="cta-title">Bereit für Ihr erstes Angebot?</h2>
                        <p className="cta-subtitle">
                            Kostenlos starten. Kein Abo nötig. Kein Haken.
                            Ihr erstes professionelles Angebot in unter 2 Minuten.
                        </p>
                        <button onClick={() => scrollToContact('Kostenlos testen')} className="btn btn-primary btn-lg" style={{ animation: 'pulse-glow 2s ease infinite' }}>
                            Jetzt kostenloses Angebot erstellen →
                        </button>
                        <div className="cta-trust">
                            <div className="cta-trust-item">🔒 DSGVO-konform</div>
                            <div className="cta-trust-item">🇩🇪 Server in Deutschland</div>
                            <div className="cta-trust-item">💳 Sichere Zahlung via Stripe</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* === CONTACT === */}
            <section className="section" id="contact" ref={contactRef}>
                <div className="container" style={{ maxWidth: '640px' }}>
                    <div className="section-header">
                        <div className="section-label">Kontakt</div>
                        <h2 className="section-title">Jetzt starten oder Fragen stellen</h2>
                        <p className="section-subtitle">
                            {selectedPlan ? `Gewählter Tarif: ${selectedPlan}` : 'Wir melden uns innerhalb von 24 Stunden.'}
                        </p>
                    </div>

                    {formStatus === 'success' ? (
                        <div className="glass-card" style={{ padding: 'var(--spacing-3xl)', textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>✅</div>
                            <h3 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, marginBottom: 'var(--spacing-sm)' }}>Anfrage gesendet!</h3>
                            <p style={{ color: 'var(--color-text-secondary)' }}>Wir melden uns innerhalb von 24 Stunden bei Ihnen.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="glass-card" style={{ padding: 'var(--spacing-2xl)' }}>
                            {selectedPlan && (
                                <div style={{
                                    background: 'var(--color-accent-glow)',
                                    border: '1px solid rgba(108,99,255,0.3)',
                                    borderRadius: 'var(--radius-md)',
                                    padding: 'var(--spacing-sm) var(--spacing-md)',
                                    marginBottom: 'var(--spacing-lg)',
                                    fontSize: 'var(--font-size-sm)',
                                    color: 'var(--color-accent-light)',
                                    fontWeight: 600
                                }}>
                                    📋 Gewählter Tarif: {selectedPlan}
                                </div>
                            )}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--spacing-xs)', color: 'var(--color-text-secondary)' }}>Name *</label>
                                    <input
                                        type="text" required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        style={inputStyle}
                                        placeholder="Max Mustermann"
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--spacing-xs)', color: 'var(--color-text-secondary)' }}>E-Mail *</label>
                                    <input
                                        type="email" required
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        style={inputStyle}
                                        placeholder="max@firma.de"
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--spacing-xs)', color: 'var(--color-text-secondary)' }}>Firma</label>
                                    <input
                                        type="text"
                                        value={formData.company}
                                        onChange={e => setFormData({ ...formData, company: e.target.value })}
                                        style={inputStyle}
                                        placeholder="Mustermann GmbH"
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--spacing-xs)', color: 'var(--color-text-secondary)' }}>Telefon</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        style={inputStyle}
                                        placeholder="+49 30 12345678"
                                    />
                                </div>
                            </div>
                            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                                <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--spacing-xs)', color: 'var(--color-text-secondary)' }}>Nachricht</label>
                                <textarea
                                    rows={4}
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }}
                                    placeholder="Wie können wir Ihnen helfen?"
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ width: '100%' }}
                                disabled={formStatus === 'sending'}
                            >
                                {formStatus === 'sending' ? 'Wird gesendet…' : 'Anfrage senden →'}
                            </button>
                            {formStatus === 'error' && (
                                <p style={{ color: 'var(--color-danger)', fontSize: 'var(--font-size-sm)', textAlign: 'center', marginTop: 'var(--spacing-md)' }}>
                                    Fehler beim Senden. Bitte versuchen Sie es erneut.
                                </p>
                            )}
                        </form>
                    )}
                </div>
            </section>

            {/* === RATGEBER TEASER (SEO Content) === */}
            <section className="section" style={{ background: 'var(--color-bg-secondary)', borderTop: '1px solid var(--color-border)' }}>
                <div className="container-narrow">
                    <div className="section-header">
                        <div className="section-label">Ratgeber</div>
                        <h2 className="section-title">Wie schreibe ich ein professionelles Angebot?</h2>
                    </div>

                    <div style={{ color: 'var(--color-text-secondary)', lineHeight: '1.9', fontSize: '1rem' }}>
                        <p style={{ marginBottom: '1.5rem' }}>
                            Ein <strong style={{ color: 'var(--color-text-primary)' }}>professionelles Angebot</strong> ist mehr als nur eine Auflistung von Leistungen und Preisen. Es ist Ihre Visitenkarte, Ihr Verkargument und oft der entscheidende Faktor, ob Sie den Auftrag bekommen oder Ihr Wettbewerber.
                        </p>

                        <h3 style={{ color: 'var(--color-text-primary)', fontSize: '1.25rem', fontWeight: 700, margin: '2rem 0 1rem' }}>
                            Die 7 Pflichtbestandteile eines Angebots
                        </h3>
                        <ol style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
                            <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: 'var(--color-text-primary)' }}>Absender-Informationen</strong> — Firmenname, Adresse, Kontaktdaten, USt-IdNr.</li>
                            <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: 'var(--color-text-primary)' }}>Empfänger-Informationen</strong> — Name und Adresse des potenziellen Kunden.</li>
                            <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: 'var(--color-text-primary)' }}>Angebotsnummer und Datum</strong> — Eindeutige Identifikation für beide Seiten.</li>
                            <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: 'var(--color-text-primary)' }}>Leistungsbeschreibung</strong> — Detaillierte Auflistung aller Positionen mit Mengen und Einzelpreisen.</li>
                            <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: 'var(--color-text-primary)' }}>Preisangaben</strong> — Netto, MwSt., Brutto. Bei B2B-Kunden ist der Nettopreis üblich.</li>
                            <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: 'var(--color-text-primary)' }}>Gültigkeitsdauer</strong> — Üblich sind 14-30 Tage. Schafft Dringlichkeit.</li>
                            <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: 'var(--color-text-primary)' }}>Zahlungsbedingungen</strong> — Zahlungsziel, Skonto, Abschlagszahlungen.</li>
                        </ol>

                        <h3 style={{ color: 'var(--color-text-primary)', fontSize: '1.25rem', fontWeight: 700, margin: '2rem 0 1rem' }}>
                            5 Tipps für höhere Abschlussquoten
                        </h3>
                        <p style={{ marginBottom: '1rem' }}>
                            <strong style={{ color: 'var(--color-text-primary)' }}>1. Professionelles Design nutzen:</strong> Ein sauber formatiertes Angebot im Corporate Design signalisiert Kompetenz. Studien zeigen, dass professionell gestaltete Angebote eine bis zu 30% höhere Annahmequote haben.
                        </p>
                        <p style={{ marginBottom: '1rem' }}>
                            <strong style={{ color: 'var(--color-text-primary)' }}>2. Mehrwert statt nur Preis:</strong> Beschreiben Sie nicht nur WAS Sie liefern, sondern WARUM. „SEO-Optimierung" klingt abstrakt. „SEO-Optimierung — für mehr organische Sichtbarkeit und qualifizierte Leads" verkauft.
                        </p>
                        <p style={{ marginBottom: '1rem' }}>
                            <strong style={{ color: 'var(--color-text-primary)' }}>3. Optionen anbieten:</strong> Geben Sie dem Kunden 2-3 Pakete (Basic, Standard, Premium). Psychologisch tendieren Menschen zur mittleren Option. Der „Ankereffekt" des Premium-Pakets lässt das Standard-Paket als vernünftig erscheinen.
                        </p>
                        <p style={{ marginBottom: '1rem' }}>
                            <strong style={{ color: 'var(--color-text-primary)' }}>4. Schnell sein:</strong> Ein Angebot, das innerhalb von 24 Stunden nach dem Erstgespräch verschickt wird, hat eine deutlich höhere Erfolgsquote. Mit einem Angebotsgenerator wie <em>Angebote Erstellen Online</em> schaffen Sie das in 2 Minuten.
                        </p>
                        <p style={{ marginBottom: '1.5rem' }}>
                            <strong style={{ color: 'var(--color-text-primary)' }}>5. Nachfassen:</strong> 44% aller Angebote werden nach dem Versand nie besprochen. Ein systematisches Follow-up nach 3 und 7 Tagen erhöht Ihre Abschlussrate drastisch. Mit unserem Status-Tracking wissen Sie genau, wann der richtige Zeitpunkt ist.
                        </p>

                        <h3 style={{ color: 'var(--color-text-primary)', fontSize: '1.25rem', fontWeight: 700, margin: '2rem 0 1rem' }}>
                            Angebot vs. Kostenvoranschlag: Was ist der Unterschied?
                        </h3>
                        <p style={{ marginBottom: '1rem' }}>
                            Ein <strong style={{ color: 'var(--color-text-primary)' }}>Angebot</strong> ist rechtlich bindend — der angegebene Preis gilt für die vereinbarte Gültigkeitsdauer. Ein <strong style={{ color: 'var(--color-text-primary)' }}>Kostenvoranschlag</strong> (KVA) ist eine unverbindliche Schätzung, bei der eine Abweichung von 15-20% üblich und rechtlich zulässig ist. Im Handwerk werden häufig Kostenvoranschläge verwendet, in der IT und Beratung eher verbindliche Angebote.
                        </p>
                        <p>
                            Mit <em>Angebote Erstellen Online</em> können Sie beide Varianten erstellen — und durch klare Bezeichnung im Dokument für Transparenz sorgen.
                        </p>
                    </div>
                </div>
            </section>
        </>
    )
}

const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--color-text-primary)',
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--font-size-base)',
    outline: 'none',
    transition: 'border-color 0.2s ease',
}
