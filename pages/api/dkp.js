
import clientPromise from '../../lib/mongodb'
import { collections } from '../../lib/models'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'Unauthorized' })

  const client = await clientPromise
  const db = client.db()

  if (req.method === 'GET') {
    // Get DKP for all characters in user's guild, or all if no guildId
    const { guildId } = req.query;
    let query = {};
    if (guildId) query.guildId = guildId;
    const dkp = await db.collection(collections.DKP).find(query).toArray();
    return res.json(dkp);
  }

  if (req.method === 'POST') {
    // Add or remove DKP
    const { characterId, amount, reason, eventId } = req.body
    if (!characterId || !amount) return res.status(400).json({ error: 'Missing fields' })
    const dkpEntry = {
      characterId: String(characterId),
      amount,
      reason,
      eventId,
      timestamp: new Date(),
      userId: session.user.id,
      guildId: req.body.guildId,
    }
    await db.collection(collections.DKP).insertOne(dkpEntry)
    return res.json({ success: true })
  }

  res.status(405).end()
}
