import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import clientPromise from '../../lib/mongodb';
import { collections } from '../../lib/models';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });
  const client = await clientPromise;
  const db = client.db();

  if (req.method === 'GET') {
    // Get all classes
    const classes = await db.collection(collections.CLASSES || 'classes').find({}).toArray();
    return res.json(classes);
  }

  if (req.method === 'POST') {
    // Add a new class
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Missing class name' });
    await db.collection(collections.CLASSES || 'classes').insertOne({ name });
    return res.json({ success: true });
  }

  if (req.method === 'DELETE') {
    // Delete a class
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Missing class name' });
    await db.collection(collections.CLASSES || 'classes').deleteOne({ name });
    return res.json({ success: true });
  }

  res.status(405).end();
}
