
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import AddEventForm from './AddEventForm';
import adminEventsStyles from './AdminEvents.module.css';
import buttonStyles from './AdminEventButton.module.css';

export default function ManageEvents() {
  const { data: session } = useSession();
  const [events, setEvents] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDkp, setEditDkp] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPin, setEditPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      setEvents(data);
    } catch {
      setError('Failed to load events.');
    }
    setLoading(false);
  };

  const handleEdit = (event) => {
    setEditId(event._id);
    setEditName(event.name);
    setEditDkp(event.dkp);
    setEditDescription(event.description || '');
    setEditPin(event.pin || '');
    setError('');
    setSuccess('');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/events', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: editId, name: editName, dkp: Number(editDkp), description: editDescription, pin: editPin }),
      });
      if (res.ok) {
        setSuccess('Event updated!');
        setEditId(null);
        fetchEvents();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Failed to update event.');
      }
    } catch {
      setError('Network error.');
    }
    setLoading(false);
  };

  // Generate a random 5-digit PIN
  const generatePin = () => {
    return Math.floor(10000 + Math.random() * 90000).toString();
  };

  const handleGeneratePin = () => {
    setEditPin(generatePin());
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/events', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: id }),
      });
      if (res.ok) {
        setSuccess('Event deleted!');
        fetchEvents();
      } else {
        setError('Failed to delete event.');
      }
    } catch {
      setError('Network error.');
    }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <AddEventForm onEventAdded={fetchEvents} />
      </div>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {success && <div className="text-green-400 mb-2">{success}</div>}
      <div style={{ marginTop: '2rem' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, background: '#23272f', borderRadius: 12, overflow: 'hidden' }}>
          <thead>
            <tr style={{ background: '#18181b' }}>
              <th style={{ padding: '0.75rem 1rem', color: '#fff', fontWeight: 600 }}>Name</th>
              <th style={{ padding: '0.75rem 1rem', color: '#fff', fontWeight: 600 }}>DKP</th>
              <th style={{ padding: '0.75rem 1rem', color: '#fff', fontWeight: 600 }}>Description</th>
              <th style={{ padding: '0.75rem 1rem', color: '#fff', fontWeight: 600 }}>PIN</th>
              <th style={{ padding: '0.75rem 1rem', color: '#fff', fontWeight: 600 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event._id} style={{ borderBottom: '1px solid #2e323c' }}>
                <td style={{ padding: '0.75rem 1rem' }}>
                  {editId === event._id ? (
                    <input
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      className={adminEventsStyles.adminEventInput}
                      style={{ width: 120 }}
                    />
                  ) : event.name}
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  {editId === event._id ? (
                    <input
                      type="number"
                      value={editDkp}
                      onChange={e => setEditDkp(e.target.value)}
                      className={adminEventsStyles.adminEventInput}
                      style={{ width: 70 }}
                    />
                  ) : event.dkp}
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  {editId === event._id ? (
                    <input
                      value={editDescription}
                      onChange={e => setEditDescription(e.target.value)}
                      className={adminEventsStyles.adminEventInput}
                      style={{ width: 180 }}
                    />
                  ) : event.description}
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  {editId === event._id ? (
                    <span style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input
                        value={editPin}
                        onChange={e => setEditPin(e.target.value.replace(/\D/g, '').slice(0,5))}
                        className={adminEventsStyles.adminEventInput}
                        style={{ width: 70, fontFamily: 'monospace' }}
                        placeholder="5-digit PIN"
                        maxLength={5}
                      />
                      <button
                        type="button"
                        className={buttonStyles.adminEventButton}
                        onClick={handleGeneratePin}
                        disabled={loading}
                      >Generate</button>
                    </span>
                  ) : (
                    <span style={{ fontFamily: 'monospace', fontSize: 16, letterSpacing: 2 }}>{event.pin || <span style={{ color: '#888' }}>-</span>}</span>
                  )}
                </td>
                <td style={{ padding: '0.75rem 1rem', verticalAlign: 'middle' }}>
                  {session?.user?.isAdmin && (
                    editId === event._id ? (
                      <span style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className={buttonStyles.adminEventButton}
                          onClick={handleEditSubmit}
                          disabled={loading}
                        >Save</button>
                        <button
                          className={buttonStyles.adminEventButton}
                          onClick={() => setEditId(null)}
                          disabled={loading}
                        >Cancel</button>
                      </span>
                    ) : (
                      <span style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className={buttonStyles.adminEventButton}
                          onClick={() => handleEdit(event)}
                          disabled={loading}
                        >Edit</button>
                        <button
                          className={`${buttonStyles.adminEventButton} ${buttonStyles.delete}`}
                          onClick={() => handleDelete(event._id)}
                          disabled={loading}
                        >Delete</button>
                      </span>
                    )
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {events.length === 0 && <div style={{ color: '#888' }}>No events found.</div>}
      </div>
    </div>
  );
}
