import clientPromise from '../../lib/mongodb'
import { collections } from '../../lib/models'
import { getSession } from 'next-auth/react'

export default async function handler(req, res) {
  const session = await getSession({ req })
  if (!session) return res.status(401).json({ error: 'Unauthorized' })
  const client = await clientPromise
  const db = client.db()

  if (req.method === 'POST') {
    // Verify PIN for DKP claim
    const { pin, characterId, guildId } = req.body
    if (!pin || !characterId || !guildId) return res.status(400).json({ error: 'Missing fields' })
    const pinEntry = await db.collection(collections.PINS).findOne({ characterId, guildId, pin })
    if (!pinEntry) return res.status(403).json({ error: 'Invalid PIN' })

    // Find the event for this PIN (assuming pinEntry has eventId)
    const event = pinEntry.eventId
      ? await db.collection(collections.EVENTS).findOne({ _id: typeof pinEntry.eventId === 'string' ? new (require('mongodb').ObjectId)(pinEntry.eventId) : pinEntry.eventId })
      : null;
    if (!event || typeof event.dkp !== 'number') {
      return res.status(400).json({ error: 'Event or DKP not found' });
    }

    // Award DKP to the character
    await db.collection(collections.DKP).insertOne({
      characterId: String(characterId),
      amount: event.dkp,
      reason: `Event: ${event.name}`,
      eventId: event._id,
      timestamp: new Date(),
      userId: session.user.id,
      guildId: String(guildId),
    });

    return res.json({ success: true, awarded: event.dkp });
  }

  res.status(405).end()
}
