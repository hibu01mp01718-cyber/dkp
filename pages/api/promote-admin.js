import clientPromise from '../../lib/mongodb'
import { collections } from '../../lib/models'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { userId } = req.body
  if (!userId) return res.status(400).json({ error: 'Missing userId' })
  const client = await clientPromise
  const db = client.db()
  await db.collection(collections.USERS).updateOne(
    { userId },
    { $set: { isAdmin: true } },
    { upsert: true }
  )
  return res.json({ success: true })
}
