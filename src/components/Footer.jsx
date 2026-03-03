import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div>
                        <div className="footer-brand-name">Angebote Erstellen Online</div>
                        <p className="footer-brand-text">
                            Professionelle Angebote in 2 Minuten. Für Freelancer, Handwerker und KMU.
                            DIN-5008-konform. Made in Germany.
                        </p>
                    </div>
                    <div>
                        <div className="footer-heading">Produkt</div>
                        <ul className="footer-links">
                            <li><a href="#features">Features</a></li>
                            <li><a href="#pricing">Preise</a></li>
                            <li><a href="#branchen">Branchen</a></li>
                            <li><a href="#faq">FAQ</a></li>
                        </ul>
                    </div>
                    <div>
                        <div className="footer-heading">Vorlagen</div>
                        <ul className="footer-links">
                            <li><a href="#branchen">Handwerk</a></li>
                            <li><a href="#branchen">IT & Software</a></li>
                            <li><a href="#branchen">Marketing</a></li>
                            <li><a href="#branchen">Beratung</a></li>
                        </ul>
                    </div>
                    <div>
                        <div className="footer-heading">Rechtliches</div>
                        <ul className="footer-links">
                            <li><Link to="/impressum">Impressum</Link></li>
                            <li><Link to="/agb">AGB</Link></li>
                            <li><Link to="/datenschutz">Datenschutz</Link></li>
                            <li><Link to="/disclaimer">Disclaimer</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <span>© {new Date().getFullYear()} track by track GmbH. Alle Rechte vorbehalten.</span>
                    <span>Gustav-Meyer-Allee 25, 13355 Berlin</span>
                </div>
            </div>
        </footer>
    )
}
