import { useState, useEffect } from 'react';
import { CustomSelect } from './ui/CustomSelect';

export default function DKPForm({ characters, onSubmit }) {
  const [characterId, setCharacterId] = useState(characters && characters.length > 0 ? characters[0]._id : '');
  // Update selected character if characters prop changes
  useEffect(() => {
    if (characters && characters.length > 0) {
      setCharacterId(prev => prev || characters[0]._id);
    }
  }, [characters]);
  const [eventName, setEventName] = useState('');
  const [events, setEvents] = useState([]);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Load events from backend
  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => setEvents(Array.isArray(data) ? data : []));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    // Find selected event
    const selectedEvent = events.find(ev => ev.name === eventName);
    if (!selectedEvent) {
      setError('Please select a valid event.');
      setLoading(false);
      return;
    }
    if (!pin || pin.length !== 5) {
      setError('Please enter the 5-digit PIN.');
      setLoading(false);
      return;
    }
    // Call backend to verify and claim DKP (enforces one-time use)
    const res = await fetch('/api/verify-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ characterId, pin, guildId: selectedEvent.guildId || '' }),
    });
    if (res.ok) {
      setSuccess('DKP claimed!');
      setPin('');
      if (onSubmit) onSubmit();
    } else {
      const data = await res.json();
      if (res.status === 409 && data.error) {
        setError('This pin code has already been redeemed for this event.');
      } else if (res.status === 403 && data.error) {
        setError('Invalid PIN for this event.');
      } else {
        setError('Failed to claim DKP');
      }
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-lg p-4 shadow mb-6">
      <h3 className="text-lg font-semibold mb-2">Add/Remove DKP</h3>
      <CustomSelect
        label="Character"
        value={characterId}
        onChange={setCharacterId}
        options={[
          { value: '', label: 'Select character' },
          ...characters.map(char => ({ value: char._id, label: char.name }))
        ]}
      />
      <CustomSelect
        label="Event Name"
        value={eventName}
        onChange={setEventName}
        options={[
          { value: '', label: 'Select event' },
          ...events.map(ev => ({ value: ev.name, label: `${ev.name} (${ev.dkp} DKP)` }))
        ]}
      />
      <div className="mb-2">
        <label className="block mb-1">PIN</label>
  <input type="password" value={pin} onChange={e => setPin(e.target.value)} className="w-full bg-white text-black border border-gray-700 rounded p-2" required />
      </div>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {success && <div className="text-green-400 mb-2">{success}</div>}
      <button
        type="submit"
        className="bg-[#5865F2] hover:bg-[#4752c4] text-white px-6 py-2 rounded-lg font-semibold text-base transition mb-2 w-full max-w-xs mx-auto block"
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Submit'}
      </button>
    </form>
  )
}
