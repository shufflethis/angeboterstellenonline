import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../context/AuthContext'

export default function Login() {
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState('idle') // idle, sending, sent, error
    const { signIn, user } = useAuth()
    const navigate = useNavigate()

    // If already logged in, redirect
    if (user) {
        navigate('/app')
        return null
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setStatus('sending')
        const { error } = await signIn(email)
        if (error) {
            setStatus('error')
        } else {
            if (user || !import.meta.env.VITE_SUPABASE_URL) {
                // Demo mode or instant login
                navigate('/app')
            } else {
                setStatus('sent')
            }
        }
    }

    return (
        <div className="legal-page" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '80px' }}>
            <Helmet>
                <title>Login | Angebote Erstellen Online</title>
            </Helmet>

            <div className="glass-card" style={{ maxWidth: '440px', width: '100%', padding: 'var(--spacing-3xl)' }}>
                <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-md)' }}>📄</div>
                    <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, marginBottom: 'var(--spacing-sm)' }}>
                        Kostenlos starten
                    </h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                        Erstellen Sie Ihr erstes Angebot — kostenlos und ohne Kreditkarte.
                    </p>
                </div>

                {status === 'sent' ? (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>✉️</div>
                        <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--spacing-sm)' }}>
                            Check deine E-Mails
                        </h2>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                            Wir haben einen Magic Link an <strong style={{ color: 'var(--color-accent-light)' }}>{email}</strong> gesendet.
                            Klicke auf den Link, um dich einzuloggen.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                            <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--spacing-xs)', color: 'var(--color-text-secondary)' }}>
                                E-Mail-Adresse
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="ihre@email.de"
                                style={{
                                    width: '100%',
                                    padding: '0.875rem 1rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-md)',
                                    color: 'var(--color-text-primary)',
                                    fontFamily: 'var(--font-family)',
                                    fontSize: 'var(--font-size-base)',
                                    outline: 'none',
                                }}
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', marginBottom: 'var(--spacing-md)' }}
                            disabled={status === 'sending'}
                        >
                            {status === 'sending' ? 'Wird gesendet…' : 'Kostenlos starten →'}
                        </button>
                        {status === 'error' && (
                            <p style={{ color: 'var(--color-danger)', fontSize: 'var(--font-size-sm)', textAlign: 'center' }}>
                                Fehler beim Login. Bitte versuche es erneut.
                            </p>
                        )}
                        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)', marginTop: 'var(--spacing-md)' }}>
                            Kein Passwort nötig. Wir senden dir einen Login-Link per E-Mail.
                        </p>
                    </form>
                )}
            </div>
        </div>
    )
}
