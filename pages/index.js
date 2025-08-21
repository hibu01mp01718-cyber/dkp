import Layout from '../components/Layout'
import DKPDashboard from '../components/DKPDashboard'
import { useSession, signIn } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function Home() {
  const { data: session, status } = useSession()
  const [dkp, setDKP] = useState({})
  const [characters, setCharacters] = useState([])

  useEffect(() => {
    if (!session) return;
    fetch('/api/characters')
      .then(res => res.json())
      .then(setCharacters);
    fetch('/api/dkp')
      .then(res => res.json())
      .then(data => {
        const dkpMap = {};
        data.forEach(entry => {
          dkpMap[entry.characterId] = (dkpMap[entry.characterId] || 0) + entry.amount;
        });
        setDKP(dkpMap);
      });
  }, [session]);

  return (
    <Layout>
      {!session ? (
        <section className="flex flex-col items-center justify-center min-h-[60vh] px-2 sm:px-4 md:px-8 w-full">
          <div className="max-w-2xl w-full flex flex-col items-center gap-6 py-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-center bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">DKP Tracker</h1>
            <p className="text-lg text-muted-foreground text-center max-w-xl">A modern, minimal DKP tracker for your guild. Track points, manage characters, and more—all with a beautiful, Vercel-inspired interface.</p>
            <button
              className="flex items-center gap-2 bg-accent hover:bg-accent/80 text-white px-6 py-3 rounded-lg shadow-md font-semibold text-lg transition w-full max-w-xs justify-center"
              onClick={() => signIn('discord')}
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M20.317 4.369A19.791 19.791 0 0016.885 3.1a.074.074 0 00-.078.037c-.34.607-.719 1.396-.984 2.013a18.524 18.524 0 00-5.456 0 12.51 12.51 0 00-.995-2.013.077.077 0 00-.078-.037A19.736 19.736 0 003.684 4.369a.07.07 0 00-.032.027C.533 9.09-.32 13.579.099 18.021a.082.082 0 00.031.056c2.104 1.548 4.13 2.488 6.102 3.115a.077.077 0 00.084-.027c.472-.65.893-1.34 1.248-2.065a.076.076 0 00-.041-.104c-.662-.25-1.292-.549-1.902-.892a.077.077 0 01-.008-.127c.128-.096.256-.197.378-.299a.074.074 0 01.077-.01c4.002 1.826 8.317 1.826 12.278 0a.075.075 0 01.078.009c.122.102.25.203.379.3a.077.077 0 01-.006.127 12.298 12.298 0 01-1.903.891.076.076 0 00-.04.105c.36.724.78 1.414 1.247 2.064a.076.076 0 00.084.028c1.978-.627 4.004-1.567 6.107-3.115a.077.077 0 00.03-.055c.5-5.177-.838-9.637-3.548-13.625a.061.061 0 00-.03-.028zM8.02 15.331c-1.183 0-2.156-1.085-2.156-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.175 1.094 2.156 2.418 0 1.334-.955 2.419-2.157 2.419zm7.974 0c-1.183 0-2.156-1.085-2.156-2.419 0-1.333.955-2.418 2.156-2.418 1.21 0 2.175 1.094 2.156 2.418 0 1.334-.946 2.419-2.156 2.419z"/></svg>
              Login with Discord
            </button>
            <p className="text-sm text-muted-foreground text-center">You must log in with Discord to use DKP Tracker.</p>
          </div>
        </section>
      ) : (
        <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 md:px-8 py-8">
          <DKPDashboard dkp={dkp} characters={characters} />
        </div>
      )}
    </Layout>
  )
}
