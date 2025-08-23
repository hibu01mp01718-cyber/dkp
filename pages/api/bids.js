import clientPromise from '../../lib/mongodb'
import { collections } from '../../lib/models'
import { getToken } from 'next-auth/jwt'

export default async function handler(req, res) {
  const token = await getToken({ req });
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const client = await clientPromise;
  const db = client.db();

  if (req.method === 'GET') {
    // Get all bids (single-guild setup)
    const bids = await db.collection(collections.BIDS).find({}).toArray();
    return res.json(bids);
  }

  if (req.method === 'POST') {
    // Place a bid (single-guild setup)
    const { itemId, characterId, amount } = req.body;
    if (!itemId || !characterId || !amount) return res.status(400).json({ error: 'Missing fields' });
    // Fetch item to get minBid and increment
    let itemObjId;
    try {
      const { ObjectId } = require('mongodb');
      itemObjId = new ObjectId(itemId);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid item ID format' });
    }
    const item = await db.collection(collections.ITEMS).findOne({ _id: itemObjId });
    if (!item) return res.status(400).json({ error: 'Invalid item' });
    const minBid = typeof item.minBid === 'number' ? item.minBid : 1;
    const increment = typeof item.increment === 'number' ? item.increment : 1;
    // Find highest bid for this item
    const highestBid = await db.collection(collections.BIDS)
      .find({ itemId })
      .sort({ amount: -1, timestamp: 1 })
      .limit(1)
      .toArray();
    const minAllowed = highestBid.length > 0 ? highestBid[0].amount + increment : minBid;
    if (amount < minAllowed) {
      return res.status(400).json({ error: `Bid must be at least ${minAllowed}` });
    }
    const bid = {
      itemId,
      characterId,
      amount,
      timestamp: new Date(),
      userId: token.sub,
    };
    await db.collection(collections.BIDS).insertOne(bid);
    return res.json({ success: true });
  }

  res.status(405).end();
}
