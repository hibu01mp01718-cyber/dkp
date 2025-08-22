
import React from 'react';
import { useSession } from 'next-auth/react';
import DKPForm from './DKPForm';
import DashboardSummaryCards from './DashboardSummaryCards';

import Card from './Card';
import styles from './DKPDashboard.module.css';


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
    <section className={styles.dashboardSection}>
      <div className={styles.dashboardCard}>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Welcome{session?.user?.name ? `, ${session.user.name}` : ''}</h1>
        <p className="text-muted-foreground text-base">Track your DKP, manage your characters, and view your progress.</p>
      </div>
      <Card className={styles.dashboardCard + ' ' + styles.dashboardCardPadded}>
        <h2 className="text-lg font-semibold mb-4">Your Characters</h2>
        <ul className="divide-y divide-border">
          {userCharacters.length === 0 && (
            <li className="py-4 text-muted-foreground text-center">No characters found.</li>
          )}
          {userCharacters.map(char => (
            <li
              key={char._id}
              className="py-3 flex flex-col items-center text-center"
              style={{ minWidth: 0 }}
            >
              <span className="font-bold text-lg md:text-xl truncate">{char.name}</span>
              <span className="text-sm text-muted-foreground mt-1">{char.className}</span>
              <span className="font-mono text-accent font-semibold text-lg md:text-xl mt-1">{dkp[char._id] || 0} DKP</span>
            </li>
          ))}
        </ul>
      </Card>
      <div className={styles.dashboardCard}>
        <DKPForm characters={userCharacters} onSubmit={() => setRefresh(r => !r)} />
      </div>
      {/* Event Log, etc. will go here */}
    </section>
  );
}
