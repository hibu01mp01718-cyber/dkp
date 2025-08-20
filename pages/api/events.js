
import clientPromise from '../../lib/mongodb'
import { collections } from '../../lib/models'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db();

  if (req.method === 'GET') {
    // Get all events, or filter by guildId if provided
    const { guildId } = req.query;
    let query = {};
    if (guildId) query.guildId = guildId;
    const events = await db.collection(collections.EVENTS).find(query).toArray();
    return res.json(events);
  }

  // For POST, PATCH, DELETE, require authentication
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  // PATCH: Edit event
  if (req.method === 'PATCH') {
    const { eventId, name, dkp, description, pin } = req.body;
    if (!eventId) return res.status(400).json({ error: 'Missing eventId' });
    const { ObjectId } = require('mongodb');
    const update = {};
    if (name !== undefined) update.name = name;
    if (dkp !== undefined) update.dkp = dkp;
    if (description !== undefined) update.description = description;
    if (pin !== undefined) update.pin = pin;
    await db.collection(collections.EVENTS).updateOne(
      { _id: typeof eventId === 'string' ? new ObjectId(eventId) : eventId },
      { $set: update }
    );
    return res.json({ success: true });
  }

  // DELETE: Remove event
  if (req.method === 'DELETE') {
    const { eventId } = req.body;
    if (!eventId) return res.status(400).json({ error: 'Missing eventId' });
    const { ObjectId } = require('mongodb');
    await db.collection(collections.EVENTS).deleteOne({ _id: typeof eventId === 'string' ? new ObjectId(eventId) : eventId });
    return res.json({ success: true });
  }

  if (req.method === 'POST') {
    // Add event log
    const { name, description, guildId, dkp, pin } = req.body;
    if (!name || typeof dkp !== 'number') return res.status(400).json({ error: 'Missing fields' });
    const event = {
      name,
      description,
      dkp,
      timestamp: new Date(),
      userId: session.user.id,
    };
    if (guildId) event.guildId = guildId;
    if (pin) event.pin = pin;
    await db.collection(collections.EVENTS).insertOne(event);
    return res.json({ success: true });
  }

  res.status(405).end();
}
