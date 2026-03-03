import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'

export default function AGB() {
    useEffect(() => { window.scrollTo(0, 0) }, [])

    return (
        <div className="legal-page container-narrow">
            <Helmet>
                <title>AGB | Angebote Erstellen Online</title>
                <meta name="robots" content="noindex, follow" />
            </Helmet>

            <h1>Allgemeine Geschäftsbedingungen (AGB)</h1>

            <h2>§ 1 Geltungsbereich</h2>
            <p>
                Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge zwischen der track by track GmbH,
                Schliemannstr. 23, 10437 Berlin (nachfolgend „Anbieter") und dem Nutzer (nachfolgend „Kunde")
                über die Nutzung der SaaS-Plattform „Angebote Erstellen Online" unter der Domain angeboterstellenonline.de.
            </p>

            <h2>§ 2 Vertragsgegenstand</h2>
            <p>
                Der Anbieter stellt dem Kunden eine webbasierte Softwarelösung zur Erstellung, Verwaltung und zum Versand
                von Geschäftsangeboten und Kostenvoranschlägen zur Verfügung. Der genaue Leistungsumfang ergibt sich
                aus der jeweiligen Tarifbeschreibung auf der Plattform.
            </p>

            <h2>§ 3 Registrierung und Kontoeröffnung</h2>
            <p>
                Die Nutzung der Plattform erfordert eine Registrierung mit gültiger E-Mail-Adresse. Der Kunde
                sichert zu, dass die bei der Registrierung angegebenen Daten vollständig und wahrheitsgemäß sind.
                Jeder Kunde darf nur ein Konto führen.
            </p>

            <h2>§ 4 Kostenlose Nutzung und Tarife</h2>
            <p>
                Jeder registrierte Kunde kann ein (1) Angebot kostenlos erstellen. Die weitere Nutzung setzt den
                Abschluss eines kostenpflichtigen Tarifs oder den Einzelkauf voraus. Die aktuellen Tarife und Preise
                sind auf der Plattform unter „Preise" einsehbar. Alle Preise verstehen sich zuzüglich der gesetzlichen
                Mehrwertsteuer.
            </p>

            <h2>§ 5 Zahlung</h2>
            <p>
                Die Zahlungsabwicklung erfolgt über den Zahlungsdienstleister Stripe (Stripe Payments Europe, Ltd.).
                Bei Abonnements erfolgt die Abbuchung monatlich im Voraus. Bei Einzelkäufen wird der Betrag
                unmittelbar bei Erstellung fällig.
            </p>

            <h2>§ 6 Kündigung</h2>
            <p>
                Abonnements können jederzeit zum Ende des laufenden Abrechnungszeitraums gekündigt werden.
                Die Kündigung erfolgt über das Dashboard des Kunden. Es gibt keine Mindestvertragslaufzeit.
                Nach Kündigung bleiben die Daten des Kunden für 30 Tage gespeichert und können durch
                Reaktivierung wiederhergestellt werden.
            </p>

            <h2>§ 7 Haftung</h2>
            <p>
                Der Anbieter haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit. Bei einfacher Fahrlässigkeit
                haftet der Anbieter nur bei Verletzung wesentlicher Vertragspflichten und beschränkt auf den vorhersehbaren,
                vertragstypischen Schaden. Die Haftung für den Inhalt der vom Kunden erstellten Angebote liegt
                ausschließlich beim Kunden.
            </p>

            <h2>§ 8 Datenschutz</h2>
            <p>
                Der Umgang mit personenbezogenen Daten ist in unserer <Link to="/datenschutz">Datenschutzerklärung</Link> geregelt.
            </p>

            <h2>§ 9 Nutzungsrechte</h2>
            <p>
                Der Kunde erhält für die Dauer des Vertragsverhältnisses ein einfaches, nicht übertragbares
                Nutzungsrecht an der Plattform. Die vom Kunden erstellten Inhalte (Angebote, Firmendaten)
                verbleiben im Eigentum des Kunden.
            </p>

            <h2>§ 10 Schlussbestimmungen</h2>
            <p>
                Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist Berlin, soweit gesetzlich zulässig.
                Sollte eine Bestimmung dieser AGB unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.
            </p>

            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '2rem' }}>
                Stand: März 2026
            </p>

            <p style={{ marginTop: '1rem' }}>
                <Link to="/">← Zurück zur Startseite</Link>
            </p>
        </div>
    )
}
