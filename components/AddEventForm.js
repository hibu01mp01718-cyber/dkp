import React, { useState } from 'react';

export default function AddEventForm({ onEventAdded }) {
  const [name, setName] = useState('');
  const [dkp, setDkp] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!name.trim() || !dkp.trim()) {
      setError('Event name and DKP value are required.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), dkp: Number(dkp), description: description.trim() }),
      });
      if (res.ok) {
        setSuccess('Event added!');
        setName('');
        setDkp('');
        setDescription('');
        if (onEventAdded) onEventAdded();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Failed to add event.');
      }
    } catch (err) {
      setError('Network error.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 md:flex-row md:items-end">
      <input
        type="text"
  className="bg-white text-black border border-gray-700 rounded p-2 flex-1"
        placeholder="Event name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <input
        type="number"
  className="bg-white text-black border border-gray-700 rounded p-2 w-24"
        placeholder="DKP"
        value={dkp}
        onChange={e => setDkp(e.target.value)}
        required
        min="0"
      />
      <input
        type="text"
  className="bg-white text-black border border-gray-700 rounded p-2 flex-1"
        placeholder="Description (optional)"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <button
        type="submit"
        className="bg-accent px-4 py-2 rounded shadow hover:bg-accent/80 transition min-w-[100px]"
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add Event'}
      </button>
      {error && <div className="text-red-400 text-sm mt-2 md:ml-4">{error}</div>}
      {success && <div className="text-green-400 text-sm mt-2 md:ml-4">{success}</div>}
    </form>
  );
}
