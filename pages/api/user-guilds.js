import { getSession } from 'next-auth/react'

export default async function handler(req, res) {
  const session = await getSession({ req })
  if (!session) return res.status(401).json({ error: 'Unauthorized' })
  // Get guilds from the session (if available)
  if (session.guilds) {
    return res.json(session.guilds)
  }
  // Otherwise, fetch from Discord API
  const accessToken = session.accessToken
  if (!accessToken) return res.status(403).json({ error: 'No access token' })
  const response = await fetch('https://discord.com/api/users/@me/guilds', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!response.ok) return res.status(500).json({ error: 'Failed to fetch guilds' })
  const guilds = await response.json()
  return res.json(guilds)
}
