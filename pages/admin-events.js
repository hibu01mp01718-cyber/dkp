import ManageEvents from '../components/ManageEvents';
import Layout from '../components/Layout';
import React from 'react';

export default function AdminEventsPage() {
  return (
    <Layout>
      <div className="py-8">
        <ManageEvents />
      </div>
    </Layout>
  );
}
