import Layout from '../components/Layout';
import AdminPanel from '../components/AdminPanel';
import { useSession } from 'next-auth/react';

export default function AdminPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <Layout><div>Loading...</div></Layout>;
  if (!session?.user?.isAdmin) return <Layout><div className="text-red-400 font-bold text-xl text-center py-8">Access Denied: Admins Only</div></Layout>;
  return (
    <Layout>
      <AdminPanel />
    </Layout>
  );
}
