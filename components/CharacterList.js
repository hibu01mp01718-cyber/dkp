
import { useSession } from 'next-auth/react';

export default function CharacterList({ characters }) {
  // Ensure characters is always an array
  const safeCharacters = Array.isArray(characters) ? characters : [];
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Characters</h2>
      <div className="bg-card rounded-lg p-4 shadow">
        <ul>
          {safeCharacters.map(char => (
            <li key={char._id} className="mb-2 flex justify-between items-center">
              <span>{char.name} <span className="text-sm text-gray-400">({char.className})</span></span>
              <span className="text-xs text-gray-500">{char.userId}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
