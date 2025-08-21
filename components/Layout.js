
import Navbar from './Navbar';
import { useSession, signOut } from 'next-auth/react';


export default function Layout({ children }) {
  const { data: session } = useSession();
  return (
    <div className={styles.mainContainer}>
  <Navbar user={session?.user} onLogout={signOut} />
      <main className={styles.bodyContent}>
        {children}
      </main>
    </div>
  );
}
import styles from './Layout.module.css';
