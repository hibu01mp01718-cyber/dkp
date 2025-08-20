import clientPromise from '../../lib/mongodb'
import { collections } from '../../lib/models'
import { getSession } from 'next-auth/react'

export default async function handler(req, res) {
  const session = await getSession({ req })
  if (!session) return res.status(401).json({ error: 'Unauthorized' })
  const client = await clientPromise
  const db = client.db()

  if (req.method === 'GET') {
    // Get all bids for a guild
    const { guildId } = req.query
    const bids = await db.collection(collections.BIDS).find({ guildId }).toArray()
    return res.json(bids)
  }

  if (req.method === 'POST') {
    // Place a bid
    const { itemId, characterId, amount, guildId } = req.body
    if (!itemId || !characterId || !amount || !guildId) return res.status(400).json({ error: 'Missing fields' })
    const bid = {
      itemId,
      characterId,
      amount,
      guildId,
      timestamp: new Date(),
      userId: session.user.id,
    }
    await db.collection(collections.BIDS).insertOne(bid)
    return res.json({ success: true })
  }

  res.status(405).end()
}
