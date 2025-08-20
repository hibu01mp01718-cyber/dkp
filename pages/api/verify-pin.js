import clientPromise from '../../lib/mongodb'
import { collections } from '../../lib/models'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'Unauthorized' })
  const client = await clientPromise
  const db = client.db()

  if (req.method === 'POST') {
    // Verify PIN for DKP claim
    const { pin, characterId, guildId } = req.body

  if (!pin || !characterId) return res.status(400).json({ error: 'Missing fields' })


  // Find the event with this pin
  const event = await db.collection(collections.EVENTS).findOne({ pin })
  if (!event || typeof event.dkp !== 'number') {
    return res.status(403).json({ error: 'Invalid PIN for this event.' });
  }

    // Check if this user has already claimed DKP for this event (PIN) with this character
    const alreadyClaimed = await db.collection(collections.DKP).findOne({
      eventId: event._id,
      userId: session.user.id,
      characterId: String(characterId),
      reason: `Event: ${event.name}`,
    });
    if (alreadyClaimed) {
      return res.status(409).json({ error: 'You have already claimed DKP for this event.' });
    }

    // Award DKP to the character
    await db.collection(collections.DKP).insertOne({
      characterId: String(characterId),
      amount: event.dkp,
      reason: `Event: ${event.name}`,
      eventId: event._id,
      timestamp: new Date(),
      userId: session.user.id,
    });

    return res.json({ success: true, awarded: event.dkp });
  }

  res.status(405).end()
}
