import React, { useEffect, useState } from 'react';
import AddEventForm from './AddEventForm';

export default function ManageEvents() {
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
    <div className="w-full max-w-3xl mx-auto px-2 sm:px-4 md:px-8 py-4">
      <h2 className="text-2xl font-bold mb-6">Manage Events</h2>
      <div className="mb-6">
        <AddEventForm />
      </div>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {success && <div className="text-green-400 mb-2">{success}</div>}
      <div className="bg-card rounded-lg shadow p-4 md:p-6">
        <table className="w-full text-left mb-2">
          <thead>
            <tr>
              <th className="py-2">Name</th>
              <th className="py-2">DKP</th>
              <th className="py-2">Description</th>
              <th className="py-2">PIN</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event._id}>
                <td className="py-2">
                  {editId === event._id ? (
                    <input
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      className="bg-background border border-gray-700 rounded p-1 w-32"
                    />
                  ) : event.name}
                </td>
                <td className="py-2">
                  {editId === event._id ? (
                    <input
                      type="number"
                      value={editDkp}
                      onChange={e => setEditDkp(e.target.value)}
                      className="bg-background border border-gray-700 rounded p-1 w-20"
                    />
                  ) : event.dkp}
                </td>
                <td className="py-2">
                  {editId === event._id ? (
                    <input
                      value={editDescription}
                      onChange={e => setEditDescription(e.target.value)}
                      className="bg-background border border-gray-700 rounded p-1 w-40"
                    />
                  ) : event.description}
                </td>
                <td className="py-2">
                  {editId === event._id ? (
                    <div className="flex gap-2 items-center">
                      <input
                        value={editPin}
                        onChange={e => setEditPin(e.target.value.replace(/\D/g, '').slice(0,5))}
                        className="bg-background border border-gray-700 rounded p-1 w-20 font-mono"
                        placeholder="5-digit PIN"
                        maxLength={5}
                      />
                      <button
                        type="button"
                        className="bg-accent px-2 py-1 rounded hover:bg-accent/80 transition"
                        onClick={handleGeneratePin}
                        disabled={loading}
                      >Generate</button>
                    </div>
                  ) : (
                    <span className="font-mono text-lg tracking-widest">{event.pin || <span className="text-gray-500">-</span>}</span>
                  )}
                </td>
                <td className="py-2">
                  {editId === event._id ? (
                    <>
                      <button
                        className="bg-accent px-2 py-1 rounded mr-2 hover:bg-accent/80 transition"
                        onClick={handleEditSubmit}
                        disabled={loading}
                      >Save</button>
                      <button
                        className="bg-gray-700 px-2 py-1 rounded hover:bg-gray-600 transition"
                        onClick={() => setEditId(null)}
                        disabled={loading}
                      >Cancel</button>
                    </>
                  ) : (
                    <>
                      <button
                        className="bg-accent px-2 py-1 rounded mr-2 hover:bg-accent/80 transition"
                        onClick={() => handleEdit(event)}
                        disabled={loading}
                      >Edit</button>
                      <button
                        className="bg-red-700 px-2 py-1 rounded hover:bg-red-600 transition"
                        onClick={() => handleDelete(event._id)}
                        disabled={loading}
                      >Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {events.length === 0 && <div className="text-gray-400">No events found.</div>}
      </div>
    </div>
  );
}
