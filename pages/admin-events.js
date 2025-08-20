
import ManageEvents from '../components/ManageEvents';
import Layout from '../components/Layout';
import React from 'react';
import { useSession } from 'next-auth/react';

export default function AdminEventsPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <Layout><div className="py-8 text-center">Loading...</div></Layout>;
  }

  if (!session?.user?.isAdmin) {
    return (
      <Layout>
        <div className="py-8 text-center text-red-400 font-bold text-xl">Access Denied: Admins Only</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-8">
        <ManageEvents />
      </div>
    </Layout>
  );
}
