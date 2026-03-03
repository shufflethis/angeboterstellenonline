import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useApp } from '../context/AppContext'

export default function CompanySetup() {
    const { company, setCompany } = useApp()
    const [form, setForm] = useState({ ...company })
    const [saved, setSaved] = useState(false)
    const navigate = useNavigate()

    const handleSave = (e) => {
        e.preventDefault()
        setCompany(form)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    const field = (label, key, placeholder, type = 'text', half = false) => (
        <div style={half ? { flex: '1 1 48%' } : {}}>
            <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--spacing-xs)', color: 'var(--color-text-secondary)' }}>{label}</label>
            <input
                type={type}
                value={form[key] || ''}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder}
                style={inputStyle}
            />
        </div>
    )

    return (
        <div className="legal-page" style={{ paddingTop: '100px', minHeight: '80vh' }}>
            <Helmet><title>Firmendaten | Angebote Erstellen Online</title></Helmet>
            <div className="container" style={{ maxWidth: '680px' }}>
                <button className="btn btn-secondary" style={{ marginBottom: 'var(--spacing-xl)', padding: '0.4rem 1rem', fontSize: '0.8rem' }} onClick={() => navigate('/app')}>
                    ← Zurück zum Dashboard
                </button>
                <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, marginBottom: 'var(--spacing-sm)' }}>Firmendaten</h1>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-2xl)' }}>
                    Diese Daten erscheinen auf jedem Angebot als Absender.
                </p>

                <form onSubmit={handleSave} className="glass-card" style={{ padding: 'var(--spacing-2xl)' }}>
                    <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--spacing-lg)' }}>Unternehmen</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                        {field('Firmenname *', 'name', 'Mustermann GmbH')}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                        {field('Straße + Nr.', 'address', 'Musterstraße 1', 'text', true)}
                        {field('PLZ', 'zip', '10115', 'text', true)}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                        {field('Stadt', 'city', 'Berlin', 'text', true)}
                        {field('USt-IdNr.', 'ustId', 'DE123456789', 'text', true)}
                    </div>

                    <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--spacing-lg)', marginTop: 'var(--spacing-xl)' }}>Kontakt</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                        {field('E-Mail', 'email', 'info@firma.de', 'email', true)}
                        {field('Telefon', 'phone', '+49 30 12345678', 'tel', true)}
                    </div>

                    <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--spacing-lg)', marginTop: 'var(--spacing-xl)' }}>Bankverbindung</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                        {field('Bank', 'bankName', 'Deutsche Bank', 'text', true)}
                        {field('IBAN', 'bankIban', 'DE89 3704 0044 0532 0130 00', 'text', true)}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' }}>
                        {field('BIC', 'bankBic', 'COBADEFFXXX', 'text', true)}
                    </div>

                    <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
                        <button type="submit" className="btn btn-primary">
                            {saved ? '✅ Gespeichert!' : 'Firmendaten speichern'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
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
}
