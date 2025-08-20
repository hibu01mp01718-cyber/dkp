import NextAuth from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'

export const authOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization: { params: { scope: 'identify email guilds' } },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60,   // 24 hours
  },
  callbacks: {
    async session({ session, token, user }) {
      session.user.id = token.sub;
      // Add isAdmin to session.user
      try {
        const clientPromise = (await import('../../../lib/mongodb.js')).default;
        const { collections } = await import('../../../lib/models.js');
        const client = await clientPromise;
        const db = client.db();
        const dbUser = await db.collection(collections.USERS).findOne({ userId: token.sub });
        session.user.isAdmin = !!dbUser?.isAdmin;
      } catch (e) {
        session.user.isAdmin = false;
      }
      return session;
    },
  },
}

export default NextAuth(authOptions)
