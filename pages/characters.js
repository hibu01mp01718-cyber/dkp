
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import CharacterList from '../components/CharacterList';
import CharacterForm from '../components/CharacterForm';
import GuildDropdown from '../components/GuildDropdown';
import styles from '../components/PageSection.module.css';

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

  useEffect(() => {
    fetch('/api/classes')
      .then(res => res.json())
      .then(data => setClasses(data.map(c => c.name)));
  }, [refresh]);

  return (
    <Layout>
      <section className={styles.pageSection}>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Characters</h1>
          <p className="text-muted-foreground text-base">Create and manage your characters for DKP tracking.</p>
        </div>
        {status === "authenticated" && (
          <div>
            <CharacterForm
              userId={session?.user?.id}
              onSubmit={() => setRefresh(r => !r)}
              classes={classes}
            />
          </div>
        )}
        <CharacterList characters={characters.filter(c => c.userId === session?.user?.id)} />
      </section>
    </Layout>
  );
}


