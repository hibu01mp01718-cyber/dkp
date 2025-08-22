
import { useState, useEffect } from 'react';
import { ModernSelect } from './ui/ModernSelect';
import styles from './DKPForm.module.css';

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
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h3 className={styles.formTitle}>Add/Remove DKP</h3>
      <div className={styles.formField}>
        <ModernSelect
          label="Character"
          value={characterId}
          onChange={e => setCharacterId(e.target.value)}
          required
        >
          <option value="">Select character</option>
          {characters.map(char => (
            <option key={char._id} value={char._id}>{char.name}</option>
          ))}
        </ModernSelect>
      </div>
      <div className={styles.formField}>
        <ModernSelect
          label="Event Name"
          value={eventName}
          onChange={e => setEventName(e.target.value)}
          required
        >
          <option value="">Select event</option>
          {events.map(ev => (
            <option key={ev.name} value={ev.name}>{`${ev.name} (${ev.dkp} DKP)`}</option>
          ))}
        </ModernSelect>
      </div>
      <div className={styles.formField}>
        <label htmlFor="dkp-pin">PIN</label>
        <input
          id="dkp-pin"
          type="password"
          value={pin}
          onChange={e => setPin(e.target.value)}
          className={styles.formInput}
          required
        />
      </div>
      {error && <div className={styles.formError}>{error}</div>}
      {success && <div className={styles.formSuccess}>{success}</div>}
      <button
        type="submit"
        className={styles.formButton}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Submit'}
      </button>
    </form>
  )
}
