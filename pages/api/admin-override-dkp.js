
import clientPromise from '../../lib/mongodb'
import { collections } from '../../lib/models'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'Unauthorized' })
  const client = await clientPromise
  const db = client.db()

  // Only allow admins to override DKP

  const adminUser = await db.collection(collections.USERS).findOne({ userId: session.user.id })
  if (!adminUser?.isAdmin) return res.status(403).json({ error: 'Admin only' })

  if (req.method === 'POST') {
    // Override DKP for a character
    const { characterId, amount } = req.body
    if (!characterId || typeof amount !== 'number') return res.status(400).json({ error: 'Missing fields' })
    // Find the character to get the guildId
    const character = await db.collection(collections.CHARACTERS).findOne({ _id: typeof characterId === 'string' ? new (require('mongodb').ObjectId)(characterId) : characterId })
    if (!character) return res.status(404).json({ error: 'Character not found' })
    // Remove all DKP entries for this character
    await db.collection(collections.DKP).deleteMany({ characterId })
    // Insert a new DKP entry with the override amount and correct guildId
  await db.collection(collections.DKP).insertOne({ characterId: String(characterId), amount, reason: 'Admin override', timestamp: new Date(), userId: session.user.id, guildId: String(character.guildId) })
    return res.json({ success: true })
  }

  res.status(405).end()
}
