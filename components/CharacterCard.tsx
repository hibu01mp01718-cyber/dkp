import Card from './Card';

export default function CharacterCard({ character, onClick }) {
  return (
    <Card className="flex flex-row items-center gap-4 p-4 min-h-[56px] cursor-pointer hover:shadow-xl transition bg-card text-foreground" onClick={onClick}>
      <span style={{width:40}}></span>
      <span className="flex-1 text-lg font-semibold text-foreground">{character.name}</span>
      <span className="flex-1 text-sm text-white">{character.className}</span>
      <span className="flex-1 text-xs text-white">{character.userId}</span>
    </Card>
  );
}
