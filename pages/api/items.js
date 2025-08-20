import clientPromise from '../../lib/mongodb'
import { collections } from '../../lib/models'
import { getSession } from 'next-auth/react'

export default async function handler(req, res) {
  const session = await getSession({ req })
  if (!session) return res.status(401).json({ error: 'Unauthorized' })
  const client = await clientPromise
  const db = client.db()

  if (req.method === 'GET') {
    // Get all items for a guild
    const { guildId } = req.query
    const items = await db.collection(collections.ITEMS).find({ guildId }).toArray()
    return res.json(items)
  }

  if (req.method === 'POST') {
    // Add item to tracking
    const { name, characterId, eventId, guildId } = req.body
    if (!name || !characterId || !guildId) return res.status(400).json({ error: 'Missing fields' })
    const item = {
      name,
      characterId,
      eventId,
      guildId,
      timestamp: new Date(),
      userId: session.user.id,
    }
    await db.collection(collections.ITEMS).insertOne(item)
    return res.json({ success: true })
  }

  res.status(405).end()
}
