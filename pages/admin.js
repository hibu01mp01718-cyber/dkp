
import Layout from '../components/Layout';
import AdminPanel from '../components/AdminPanel';
import { useSession } from 'next-auth/react';
import styles from '../components/PageSection.module.css';

export default function AdminPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <Layout><section className={styles.pageSection}><div>Loading...</div></section></Layout>;
  if (!session?.user?.isAdmin) return <Layout><section className={styles.pageSection}><div className="text-red-400 font-bold text-xl text-center py-8">Access Denied: Admins Only</div></section></Layout>;
  return (
    <Layout>
      <section className={styles.pageSection}>
        <AdminPanel />
      </section>
    </Layout>
  );
}
