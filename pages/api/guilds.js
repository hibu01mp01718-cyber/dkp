import clientPromise from '../../lib/mongodb'
import { collections } from '../../lib/models'

export default async function handler(req, res) {
  const client = await clientPromise
  const db = client.db()

  if (req.method === 'POST') {
    const { name } = req.body
    if (!name) return res.status(400).json({ error: 'Name required' })
    const result = await db.collection(collections.GUILDS).insertOne({ name })
    return res.json({ success: true, guildId: result.insertedId })
  }

  if (req.method === 'PATCH') {
    const { guildId, name } = req.body
    if (!guildId || !name) return res.status(400).json({ error: 'Missing guildId or name' })
    const { ObjectId } = require('mongodb')
    await db.collection(collections.GUILDS).updateOne(
      { _id: new ObjectId(guildId) },
      { $set: { name } }
    )
    return res.json({ success: true })
  }

  if (req.method === 'DELETE') {
    const { guildId } = req.body
    if (!guildId) return res.status(400).json({ error: 'Missing guildId' })
    const { ObjectId } = require('mongodb')
    await db.collection(collections.GUILDS).deleteOne({ _id: new ObjectId(guildId) })
    return res.json({ success: true })
  }

  // Default: GET all guilds
  const guilds = await db.collection(collections.GUILDS).find({}).toArray()
  res.json(guilds)
}
