
import React, { useState } from 'react';
import styles from './AddEventForm.module.css';

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
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h3 className={styles.formTitle}>Add Event</h3>
      <div className={styles.formField}>
        <label>Event Name</label>
        <input
          type="text"
          className={styles.formInput}
          placeholder="Event name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>
      <div className={styles.formField}>
        <label>DKP</label>
        <input
          type="number"
          className={styles.formInput}
          placeholder="DKP"
          value={dkp}
          onChange={e => setDkp(e.target.value)}
          required
          min="0"
        />
      </div>
      <div className={styles.formField}>
        <label>Description</label>
        <input
          type="text"
          className={styles.formInput}
          placeholder="Description (optional)"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>
      {error && <div className={styles.formError}>{error}</div>}
      {success && <div className={styles.formSuccess}>{success}</div>}
      <button
        type="submit"
        className={styles.formButton}
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add Event'}
      </button>
    </form>
  );
}
