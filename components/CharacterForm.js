

import { useState } from 'react'
import GuildDropdown from './GuildDropdown'
import { ModernSelect } from './ui/ModernSelect'
import { Button } from './ui/button'
import styles from './CharacterForm.module.css';

export default function CharacterForm({ userId, onSubmit, classes }) {

  const [name, setName] = useState('')
  const [className, setClassName] = useState('')
  const [selectedGuild, setSelectedGuild] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    // Debug log form values
    console.log('Submitting character:', { name, className, guildName: selectedGuild, userId })
    const res = await fetch('/api/characters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, className, guildName: selectedGuild, userId }),
      credentials: 'include',
    })
    if (res.ok) {
      setSuccess('Character created!')
      setName('')
      setClassName('')
      // Do NOT reset selectedGuild here, so the selected guild remains set
      if (onSubmit) onSubmit()
    } else {
      // Debug log error response
      console.log('Create character error:', res.status, res.statusText)
      let errorMsg = 'Failed to create character'
      try {
        const data = await res.clone().json()
        console.log('Error response JSON:', data)
        errorMsg = data.error || errorMsg
      } catch (e) {
        try {
          const text = await res.text()
          console.log('Error response text:', text)
          errorMsg = text || errorMsg
        } catch {}
      }
      setError(errorMsg)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h3 className={styles.formTitle}>Create Character</h3>
      <div className={styles.formField}>
        <GuildDropdown value={selectedGuild} onChange={setSelectedGuild} valueType="name" />
      </div>
      <div className={styles.formField}>
        <label>Name</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} className={styles.formInput} required />
      </div>
      <div className={styles.formField}>
        {Array.isArray(classes) && classes.length > 0 ? (
          <ModernSelect label="Class" value={className} onChange={e => setClassName(e.target.value)} required>
            <option value="" disabled>Select class</option>
            {classes.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </ModernSelect>
        ) : (
          <input type="text" value={className} onChange={e => setClassName(e.target.value)} className={styles.formInput} required />
        )}
      </div>
      {error && <div className={styles.formError}>{error}</div>}
      {success && <div className={styles.formSuccess}>{success}</div>}
      <button
        type="submit"
        className={styles.formButton}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Create'}
      </button>
    </form>
  )
}
