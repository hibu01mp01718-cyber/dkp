import Card from './Card';
import { User } from 'lucide-react';

export default function CharacterCard({ character, onClick }) {
  return (
    <Card className="flex flex-col items-center gap-2 p-4 cursor-pointer hover:shadow-xl transition bg-card text-foreground" onClick={onClick}>
      <div className="bg-accent/20 rounded-full p-3 mb-2">
        <User size={32} className="text-accent" />
      </div>
      <div className="text-lg font-semibold text-foreground">{character.name}</div>
  <div className="text-sm text-white mb-1">{character.className}</div>
  <div className="text-xs text-white">Owner: {character.userId}</div>
    </Card>
  );
}
