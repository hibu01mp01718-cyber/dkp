
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
    // Get all users (no guild filter)
    const users = await db.collection(collections.USERS).find({}).toArray()
    return res.json(users)
  }

  if (req.method === 'POST') {
    // Set admin role for a user (no guild filter)
    const { userId, isAdmin } = req.body
    if (!userId) return res.status(400).json({ error: 'Missing fields' })
    await db.collection(collections.USERS).updateOne(
      { userId },
      { $set: { isAdmin: !!isAdmin } },
      { upsert: true }
    )
    return res.json({ success: true })
  }

  res.status(405).end()
}
