
import React from 'react'
import { useSession } from 'next-auth/react'
import DKPForm from './DKPForm'

export default function DKPDashboard({ dkp, characters }) {
  const { data: session } = useSession();
  const [refresh, setRefresh] = React.useState(false);
  // Ensure characters is always an array
  const safeCharacters = Array.isArray(characters) ? characters : [];
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">DKP Dashboard</h2>
      <div className="bg-card rounded-lg p-4 shadow mb-6">
        <h3 className="text-xl font-semibold mb-2">Your Characters</h3>
        <ul>
          {safeCharacters.map(char => (
            <li key={char._id} className="mb-2 flex justify-between items-center">
              <span>{char.name} <span className="text-sm text-gray-400">({char.className})</span></span>
              <span className="font-mono">{dkp[char._id] || 0} DKP</span>
            </li>
          ))}
        </ul>
      </div>
      <DKPForm characters={safeCharacters} onSubmit={() => setRefresh(r => !r)} />
      {/* Event Log, etc. will go here */}
    </div>
  );
}
