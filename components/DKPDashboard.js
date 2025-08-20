
import React from 'react';
import { useSession } from 'next-auth/react';
import DKPForm from './DKPForm';
import DashboardSummaryCards from './DashboardSummaryCards';
import DashboardChart from './DashboardChart';
import Card from './Card';

export default function DKPDashboard({ dkp, characters }) {
  const { data: session } = useSession();
  const [refresh, setRefresh] = React.useState(false);
  const safeCharacters = Array.isArray(characters) ? characters : [];
  const userId = session?.user?.id;
  // Only show the user's own characters
  const userCharacters = safeCharacters.filter(c => c.userId === userId);
  const userCharIds = userCharacters.map(c => c._id);
  const userPointsBalance = userCharIds.reduce((sum, id) => sum + (dkp[id] || 0), 0);
  const metrics = {
    totalEvents: 12,
    pointsBalance: userPointsBalance,
  };

  return (
  <div className="ml-8 sm:ml-16">
      <h2 className="text-3xl font-bold mb-6">DKP Dashboard</h2>
      <DashboardSummaryCards metrics={metrics} />
      <DashboardChart />
      <Card className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Your Characters</h3>
        <ul>
          {userCharacters.map(char => (
            <li key={char._id} className="mb-2 flex justify-between items-center">
              <span>{char.name} <span className="text-sm text-gray-400">({char.className})</span></span>
              <span className="font-mono">{dkp[char._id] || 0} DKP</span>
            </li>
          ))}
        </ul>
      </Card>
      <div className="mt-6">
        <DKPForm characters={userCharacters} onSubmit={() => setRefresh(r => !r)} />
      </div>
      {/* Event Log, etc. will go here */}
    </div>
  );
}
