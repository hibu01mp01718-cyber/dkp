
import CharacterCard from './CharacterCard';


export default function CharacterList({ characters }) {
  const safeCharacters = Array.isArray(characters) ? characters : [];
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4 text-foreground">Characters</h2>
      <div className="flex flex-row items-center gap-4 px-4 mb-2 text-xs font-semibold text-muted-foreground" style={{minHeight:'28px'}}>
        <span style={{width: 40}}></span>
        <span className="flex-1">Name</span>
        <span className="flex-1">Class</span>
        <span className="flex-1">Discord ID</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {safeCharacters.map(char => (
          <CharacterCard key={char._id} character={char} />
        ))}
      </div>
    </div>
  );
}
