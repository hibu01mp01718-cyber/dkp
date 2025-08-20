import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import Card from './Card';

// Example data, replace with real DKP/event data
const data = [
  { name: 'Event 1', DKP: 10 },
  { name: 'Event 2', DKP: 20 },
  { name: 'Event 3', DKP: 15 },
  { name: 'Event 4', DKP: 30 },
  { name: 'Event 5', DKP: 25 },
];

export default function DashboardChart({ chartData = data }) {
  return (
    <Card className="mb-8">
      <div className="text-lg font-semibold mb-2">DKP Progress</div>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="DKP" stroke="#6366f1" strokeWidth={3} dot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
