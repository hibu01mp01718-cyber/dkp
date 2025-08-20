import Card from './Card';
import { Trophy, Users, Star, TrendingUp, TrendingDown } from 'lucide-react';

function StatCard({ icon, label, value, trend, trendLabel, accent = '' }) {
  return (
    <Card className="flex items-center gap-4 min-h-[90px]">
      <div className={`rounded-xl bg-accent/20 p-3 flex items-center justify-center ${accent}`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">{label}
          {trend !== undefined && (
            <span className={`flex items-center gap-1 text-xs font-semibold ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {trend > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {Math.abs(trend)}%
              <span className="hidden sm:inline">{trendLabel}</span>
            </span>
          )}
        </div>
        <div className="text-2xl font-bold text-foreground">{value}</div>
      </div>
    </Card>
  );
}

export default function DashboardSummaryCards({ metrics }) {
  // Example trend data for demo
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 mb-8">
      <StatCard
        icon={<Star className="text-accent" size={28} />}
        label="Total DKP Points"
        value={metrics.pointsBalance}
        trend={+1.2}
        trendLabel="vs. previous week"
      />
    </div>
  );
}
