export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') return res.status(200).end()
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

    try {
        const { name, email, company, phone, plan, message } = req.body

        if (!name || !email) {
            return res.status(400).json({ error: 'Name und E-Mail sind erforderlich.' })
        }

        const token = process.env.SLACK_BOT_TOKEN
        const channel = process.env.SLACK_CHANNEL_ID

        if (!token || !channel) {
            console.error('Missing Slack env vars')
            return res.status(500).json({ error: 'Server configuration error' })
        }

        const blocks = [
            {
                type: 'header',
                text: {
                    type: 'plain_text',
                    text: '📄 Neue Anfrage: angeboterstellenonline.de',
                    emoji: true
                }
            },
            {
                type: 'section',
                fields: [
                    { type: 'mrkdwn', text: `*Name:*\n${name}` },
                    { type: 'mrkdwn', text: `*E-Mail:*\n${email}` }
                ]
            },
            ...(company || phone ? [{
                type: 'section',
                fields: [
                    ...(company ? [{ type: 'mrkdwn', text: `*Firma:*\n${company}` }] : []),
                    ...(phone ? [{ type: 'mrkdwn', text: `*Telefon:*\n${phone}` }] : [])
                ]
            }] : []),
            ...(plan ? [{
                type: 'section',
                fields: [
                    { type: 'mrkdwn', text: `*Gewählter Tarif:*\n${plan}` }
                ]
            }] : []),
            ...(message ? [{
                type: 'section',
                text: { type: 'mrkdwn', text: `*Nachricht:*\n${message}` }
            }] : []),
            {
                type: 'context',
                elements: [
                    {
                        type: 'mrkdwn',
                        text: `📅 ${new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })} | 🌐 angeboterstellenonline.de`
                    }
                ]
            }
        ]

        const slackRes = await fetch('https://slack.com/api/chat.postMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                channel,
                blocks,
                text: `Neue Anfrage von ${name} (${email}) – angeboterstellenonline.de`
            })
        })

        const slackData = await slackRes.json()

        if (!slackData.ok) {
            console.error('Slack API error:', slackData.error)
            return res.status(500).json({ error: 'Nachricht konnte nicht gesendet werden.' })
        }

        return res.status(200).json({ success: true })
    } catch (err) {
        console.error('Contact API error:', err)
        return res.status(500).json({ error: 'Interner Serverfehler.' })
    }
}
