import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'

export default function Datenschutz() {
    useEffect(() => { window.scrollTo(0, 0) }, [])

    return (
        <div className="legal-page container-narrow">
            <Helmet>
                <title>Datenschutzerklärung | Angebote Erstellen Online</title>
                <meta name="robots" content="noindex, follow" />
            </Helmet>

            <h1>Datenschutzerklärung</h1>

            <h2>1. Verantwortlicher</h2>
            <p>
                track by track GmbH<br />
                Schliemannstr. 23<br />
                10437 Berlin<br />
                E-Mail: info@famefact.com
            </p>

            <h2>2. Datenschutzbeauftragter</h2>
            <p>
                Jan Kriedner<br />
                E-Mail: info@famefact.com
            </p>

            <h2>3. Erhebung und Speicherung personenbezogener Daten</h2>
            <h3>3.1 Server-Logfiles</h3>
            <p>
                Bei jedem Zugriff auf unsere Website werden automatisch Informationen durch den Browser
                übermittelt und in Server-Logfiles gespeichert: IP-Adresse, Datum und Uhrzeit der Anfrage,
                Zeitzonendifferenz, Inhalt der Anforderung, Browsertyp und -version, Betriebssystem.
                Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Sicherstellung
                eines störungsfreien Betriebs).
            </p>

            <h3>3.2 Registrierung und Nutzerkonto</h3>
            <p>
                Bei Registrierung speichern wir: E-Mail-Adresse, ggf. Firmenname und Anschrift.
                Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).
                Die Daten werden für die Dauer der Geschäftsbeziehung gespeichert und nach Kündigung
                innerhalb von 30 Tagen gelöscht, soweit keine gesetzlichen Aufbewahrungspflichten bestehen.
            </p>

            <h3>3.3 Angebotsdaten</h3>
            <p>
                Die vom Nutzer eingegebenen Geschäftsdaten (Firmendaten, Kundenadressen, Angebotspositionen,
                Preise) werden serverseitig gespeichert und ausschließlich zur Erbringung des Dienstes verwendet.
                Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.
            </p>

            <h2>4. Zahlungsabwicklung</h2>
            <p>
                Die Zahlungsabwicklung erfolgt über Stripe Payments Europe, Ltd., 1 Grand Canal Street Lower,
                Grand Canal Dock, Dublin, Irland. Stripe verarbeitet Zahlungsdaten (Kreditkartennummern,
                Bankverbindungen) direkt und gibt diese nicht an uns weiter. Wir erhalten lediglich eine
                Bestätigung der Zahlung. Datenschutzhinweise von Stripe:{' '}
                <a href="https://stripe.com/de/privacy" target="_blank" rel="noopener noreferrer">stripe.com/de/privacy</a>.
            </p>

            <h2>5. Hosting</h2>
            <p>
                Unsere Website wird bei Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA, gehostet.
                Die Datenübermittlung in die USA erfolgt auf Grundlage der EU-Standardvertragsklauseln.
            </p>

            <h2>6. Analyse und Tracking</h2>
            <p>
                Wir verwenden Plausible Analytics, einen datenschutzfreundlichen Analysedienst, der keine Cookies
                setzt und keine personenbezogenen Daten verarbeitet. Es werden keine individuellen Nutzerprofile
                erstellt. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO.
            </p>

            <h2>7. E-Mail-Kommunikation</h2>
            <p>
                Transaktionale E-Mails (Registrierung, Angebotsversand) werden über einen E-Mail-Dienstleister
                verarbeitet. Die Verarbeitung erfolgt ausschließlich zur Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO).
            </p>

            <h2>8. Ihre Rechte</h2>
            <p>Sie haben jederzeit das Recht auf:</p>
            <ul>
                <li>Auskunft über Ihre gespeicherten Daten (Art. 15 DSGVO)</li>
                <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
                <li>Löschung Ihrer Daten (Art. 17 DSGVO)</li>
                <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
                <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
                <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
                <li>Beschwerde bei einer Aufsichtsbehörde (Art. 77 DSGVO)</li>
            </ul>

            <h2>9. Änderungen</h2>
            <p>
                Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie stets den aktuellen
                rechtlichen Anforderungen anzupassen oder Änderungen unserer Leistungen umzusetzen.
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
