import clientPromise from '../../lib/mongodb';
import { collections } from '../../lib/models';
import { getToken } from 'next-auth/jwt';

export default async function handler(req, res) {
  const token = await getToken({ req });
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const client = await clientPromise;
  const db = client.db();

  if (req.method === 'GET') {
    // Get all items (single-guild setup)
    const items = await db.collection(collections.ITEMS).find({}).toArray();
    return res.json(items);
  }

  if (req.method === 'POST') {
    // Add item to tracking (single-guild setup)
    const { name, description, endTime, minBid, increment } = req.body;
    if (!name) return res.status(400).json({ error: 'Missing fields' });
    const item = {
      name,
      description: description || '',
      endTime: endTime || null,
      minBid: typeof minBid === 'number' ? minBid : 1,
      increment: typeof increment === 'number' ? increment : 1,
      timestamp: new Date(),
      userId: token.sub,
    };
    await db.collection(collections.ITEMS).insertOne(item);
    return res.json({ success: true });
  }

  res.status(405).end();
}
