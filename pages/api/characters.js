import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import clientPromise from '../../lib/mongodb';
import { collections } from '../../lib/models';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });
  const client = await clientPromise;
  const db = client.db();

  if (req.method === 'PATCH') {
    // Edit character profile
    const { charId, name, className } = req.body;
    if (!charId) return res.status(400).json({ error: 'Missing charId' });
    const update = {};
    if (name) update.name = name;
    if (className) update.className = className;
    if (Object.keys(update).length === 0) return res.status(400).json({ error: 'No fields to update' });
    const { ObjectId } = require('mongodb');
    await db.collection(collections.CHARACTERS).updateOne(
      { _id: new ObjectId(charId) },
      { $set: update }
    );
    return res.json({ success: true });
  }

  if (req.method === 'DELETE') {
    // Delete character
    const { charId } = req.body;
    if (!charId) return res.status(400).json({ error: 'Missing charId' });
    const { ObjectId } = require('mongodb');
    await db.collection(collections.CHARACTERS).deleteOne({ _id: new ObjectId(charId) });
    return res.json({ success: true });
  }

  if (req.method === 'GET') {
    // If admin, get all characters; else, only user's characters
    const adminUser = await db.collection(collections.USERS).findOne({ userId: session.user.id });
    let query = {};
    if (!adminUser?.isAdmin) {
      query.userId = session.user.id;
    }
    const { guildId } = req.query;
    if (guildId) query.guildId = guildId;
    console.log('[GET /api/characters] userId:', session.user.id, 'guildId:', guildId);
    const chars = await db.collection(collections.CHARACTERS).find(query).toArray();
    console.log('[GET /api/characters] found:', chars.length, 'characters');
    return res.json(chars);
  }

  if (req.method === 'POST') {
    // Add character profile
    const { name, className, guildName, userId } = req.body;
    console.log('[POST /api/characters] body:', req.body);
    if (!name) return res.status(400).json({ error: 'Missing name' });
    if (!className) return res.status(400).json({ error: 'Missing className' });
    if (!guildName) return res.status(400).json({ error: 'Missing guildName' });
    if (!userId) return res.status(400).json({ error: 'Missing userId' });

    // Prevent duplicate character names (case-insensitive)
    const existingChar = await db.collection(collections.CHARACTERS).findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
    if (existingChar) {
      return res.status(400).json({ error: 'A character with this name already exists.' });
    }

    // Create guild if it doesn't exist
    let guild = await db.collection(collections.GUILDS).findOne({ name: guildName });
    if (!guild) {
      const result = await db.collection(collections.GUILDS).insertOne({ name: guildName, createdBy: userId, createdAt: new Date() });
      guild = { _id: result.insertedId, name: guildName };
    }
    const char = {
      name,
      className,
      guildId: guild._id.toString(),
      userId,
      timestamp: new Date(),
    };
    console.log('[POST /api/characters] inserting:', char);
    await db.collection(collections.CHARACTERS).insertOne(char);
    console.log('[POST /api/characters] character created');
    return res.json({ success: true });
  }

  res.status(405).end();
}
