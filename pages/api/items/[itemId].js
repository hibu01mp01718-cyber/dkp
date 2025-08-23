import clientPromise from '../../../lib/mongodb';
import { collections } from '../../../lib/models';
import { getToken } from 'next-auth/jwt';

export default async function handler(req, res) {
  const token = await getToken({ req });
  if (!token || !token.isAdmin) return res.status(401).json({ error: 'Unauthorized' });
  const client = await clientPromise;
  const db = client.db();

  const { itemId } = req.query;
  if (!itemId) return res.status(400).json({ error: 'Missing itemId' });

  if (req.method === 'DELETE') {
    const result = await db.collection(collections.ITEMS).deleteOne({ _id: typeof itemId === 'string' ? new (await import('mongodb')).ObjectId(itemId) : itemId });
    if (result.deletedCount === 1) {
      return res.json({ success: true });
    } else {
      return res.status(404).json({ error: 'Item not found' });
    }
  }

  res.status(405).end();
}
