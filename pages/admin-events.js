import ManageEvents from '../components/ManageEvents';
import React from 'react';

export default function AdminEventsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="py-8">
        <ManageEvents />
      </div>
    </div>
  );
}
