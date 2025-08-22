import clientPromise from '../../lib/mongodb';
import { collections } from '../../lib/models';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const client = await clientPromise;
  const db = client.db();
  const { guildId } = req.query;
  let query = {};
  if (guildId) query.guildId = guildId;
  const chars = await db.collection(collections.CHARACTERS).find(query).toArray();
  res.json(chars);
}