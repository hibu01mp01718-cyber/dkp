
import CharacterCard from './CharacterCard';

export default function CharacterList({ characters }) {
  const safeCharacters = Array.isArray(characters) ? characters : [];
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4 text-foreground">Characters</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {safeCharacters.map(char => (
          <CharacterCard key={char._id} character={char} />
        ))}
      </div>
    </div>
  );
}
