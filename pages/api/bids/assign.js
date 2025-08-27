import clientPromise from '../../../lib/mongodb';
import { collections } from '../../../lib/models';
import { getToken } from 'next-auth/jwt';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const token = await getToken({ req });
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const client = await clientPromise;
  const db = client.db();

  const { bidId, itemId } = req.body;
  if (!bidId || !itemId) return res.status(400).json({ error: 'Missing bidId or itemId' });
  const { ObjectId } = require('mongodb');

  // Find the winning bid
  const bid = await db.collection(collections.BIDS).findOne({ _id: new ObjectId(bidId) });
  if (!bid) return res.status(404).json({ error: 'Bid not found' });

  // Find the item and check if already assigned
  const item = await db.collection(collections.ITEMS).findOne({ _id: new ObjectId(itemId) });
  if (!item) return res.status(404).json({ error: 'Item not found' });
  if (item.assignedTo) return res.status(400).json({ error: 'Item already assigned' });

  // Find the character
  const char = await db.collection(collections.CHARACTERS).findOne({ _id: new ObjectId(bid.characterId) });
  if (!char) return res.status(404).json({ error: 'Character not found' });

  // Calculate current DKP for the character
  const dkpAgg = await db.collection(collections.DKP).aggregate([
    { $match: { characterId: char._id.toString() } },
    { $group: { _id: "$characterId", total: { $sum: "$amount" } } }
  ]).toArray();
  const currentDKP = dkpAgg.length > 0 ? dkpAgg[0].total : 0;
  if (currentDKP < bid.amount) {
    return res.status(400).json({ error: 'Not enough DKP to assign item. Assignment blocked.' });
  }

  // Deduct DKP from the winner (insert negative DKP record)
  await db.collection(collections.DKP).insertOne({
    characterId: char._id.toString(),
    amount: -Math.abs(bid.amount),
    reason: `Won item: ${itemId}`,
    timestamp: new Date(),
    adminId: token.sub,
  });

  // Mark the item as assigned
  await db.collection(collections.ITEMS).updateOne(
    { _id: new ObjectId(itemId) },
    { $set: { assignedTo: char._id.toString(), assignedAt: new Date() } }
  );

  return res.json({ success: true });
}
