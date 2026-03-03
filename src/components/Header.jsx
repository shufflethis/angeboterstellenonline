import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Header() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const location = useLocation()

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        setMobileOpen(false)
    }, [location])

    const scrollTo = (id) => {
        if (location.pathname !== '/') {
            window.location.href = `/#${id}`
            return
        }
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
        setMobileOpen(false)
    }

    return (
        <header className={`header ${scrolled ? 'scrolled' : ''}`}>
            <div className="header-inner">
                <Link to="/" className="header-logo">
                    <div className="header-logo-icon">📄</div>
                    <span>Angebote<span style={{ color: 'var(--color-accent-light)' }}>Online</span></span>
                </Link>

                <nav className="header-nav" style={mobileOpen ? {
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(10,10,15,0.97)',
                    backdropFilter: 'blur(20px)',
                    zIndex: 999,
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '2rem',
                    fontSize: '1.25rem',
                } : {}}>
                    {mobileOpen && (
                        <button
                            onClick={() => setMobileOpen(false)}
                            style={{
                                position: 'absolute', top: '1rem', right: '1.5rem',
                                background: 'none', border: 'none', color: 'white',
                                fontSize: '2rem', cursor: 'pointer'
                            }}
                        >✕</button>
                    )}
                    <a onClick={() => scrollTo('features')} style={{ cursor: 'pointer' }}>Features</a>
                    <a onClick={() => scrollTo('branchen')} style={{ cursor: 'pointer' }}>Branchen</a>
                    <a onClick={() => scrollTo('pricing')} style={{ cursor: 'pointer' }}>Preise</a>
                    <a onClick={() => scrollTo('faq')} style={{ cursor: 'pointer' }}>FAQ</a>
                </nav>

                <div className="header-cta">
                    <a href="#pricing" className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.875rem' }}>
                        Kostenlos starten
                    </a>
                    <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)}>☰</button>
                </div>
            </div>
        </header>
    )
}
