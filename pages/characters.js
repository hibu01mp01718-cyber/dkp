


export default function CharactersPage() {
  const { data: session, status } = useSession();
  const [characters, setCharacters] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetch('/api/characters', {
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch characters');
        return res.json();
      })
      .then(setCharacters)
      .catch(() => setCharacters([]));
  }, [refresh]);

  // Load classes from database
  useEffect(() => {
    fetch('/api/classes')
      .then(res => res.json())
      .then(data => setClasses(data.map(c => c.name)));
  }, [refresh]);

  return (
    <Layout>
      <div className="w-full max-w-3xl mx-auto px-2 sm:px-4 md:px-8 py-4 flex flex-col gap-6">
        {status === "authenticated" && (
          <div className="bg-card rounded-lg shadow p-4 md:p-6">
            <CharacterForm
              userId={session?.user?.id}
              onSubmit={() => setRefresh(r => !r)}
              classes={classes}
            />
          </div>
        )}
        <div className="bg-card rounded-lg shadow p-4 md:p-6 overflow-x-auto">
          <CharacterList characters={characters} />
        </div>
      </div>
    </Layout>
  );
}


import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import CharacterList from '../components/CharacterList';
import CharacterForm from '../components/CharacterForm';
import GuildDropdown from '../components/GuildDropdown';


