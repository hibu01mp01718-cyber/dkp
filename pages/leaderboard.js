import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import leaderboardStyles from '../components/Leaderboard.module.css';
import styles from '../components/PageSection.module.css';

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
      <section className={styles.pageSection + ' ' + styles.pageSectionCentered}>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">DKP Leaderboard</h1>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className={leaderboardStyles.leaderboardTableWrapper}>
            <table className={leaderboardStyles.leaderboardTable}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Character</th>
                  <th>Class</th>
                  <th>DKP</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((char, idx) => (
                  <tr key={char._id || idx}>
                    <td>{idx + 1}</td>
                    <td>{char.name}</td>
                    <td>{char.className}</td>
                    <td>{char.dkp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </Layout>
  );
}
