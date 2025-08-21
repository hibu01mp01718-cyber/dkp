

import ManageEvents from '../components/ManageEvents';
import Layout from '../components/Layout';
import React from 'react';
import { useSession } from 'next-auth/react';
import adminEventsStyles from '../components/AdminEvents.module.css';

export default function AdminEventsPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <Layout><section className={adminEventsStyles.adminEventsSection}><div className="text-center">Loading...</div></section></Layout>;
  }

  if (!session?.user?.isAdmin) {
    return (
      <Layout>
        <section className={adminEventsStyles.adminEventsSection}><div className="text-center text-red-400 font-bold text-xl">Access Denied: Admins Only</div></section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className={adminEventsStyles.adminEventsSection}>
        <h1 className={adminEventsStyles.adminEventsTitle}>Manage Events</h1>
        <ManageEvents />
      </section>
    </Layout>
  );
}
