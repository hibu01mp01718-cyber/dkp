import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';

export default function Leaderboard() {
  const [characters, setCharacters] = useState([]);
  const [dkp, setDKP] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const charsRes = await fetch('/api/characters');
      const chars = await charsRes.json();
      const dkpRes = await fetch('/api/dkp');
      const dkpData = await dkpRes.json();
      // Build DKP map
      const dkpMap = {};
      const byChar = {};
      dkpData.forEach(entry => {
        if (!byChar[entry.characterId]) byChar[entry.characterId] = [];
        byChar[entry.characterId].push(entry);
      });
      Object.entries(byChar).forEach(([charId, entries]) => {
        entries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        if (entries[0] && entries[0].reason === 'Admin override') {
          dkpMap[charId] = entries[0].amount;
        } else {
          dkpMap[charId] = entries.reduce((sum, e) => sum + e.amount, 0);
        }
      });
      setCharacters(chars);
      setDKP(dkpMap);
      setLoading(false);
    }
    fetchData();
  }, []);

  const leaderboard = characters
    .map(char => ({ ...char, dkp: dkp[String(char._id)] ?? 0 }))
    .sort((a, b) => b.dkp - a.dkp);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-8 px-2 sm:px-4 w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">DKP Leaderboard</h2>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="w-full bg-card rounded-lg min-w-[400px]">
              <thead>
                <tr>
                  <th className="py-2 px-2 sm:px-4 text-left">Rank</th>
                  <th className="py-2 px-2 sm:px-4 text-left">Character</th>
                  <th className="py-2 px-2 sm:px-4 text-left">Class</th>
                  <th className="py-2 px-2 sm:px-4 text-left">DKP</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((char, idx) => (
                  <tr
                    key={char._id}
                    className={`transition-colors ${idx % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'} hover:bg-accent/40`}
                  >
                    <td className="py-2 px-2 sm:px-4 font-bold">{idx + 1}</td>
                    <td className="py-2 px-2 sm:px-4">{char.name}</td>
                    <td className="py-2 px-2 sm:px-4">{char.className}</td>
                    <td className="py-2 px-2 sm:px-4">{char.dkp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
