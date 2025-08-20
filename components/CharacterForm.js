
import { useState } from 'react'
import GuildDropdown from './GuildDropdown'

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
    <form onSubmit={handleSubmit} className="bg-card rounded-lg p-4 shadow mb-6">
      <h3 className="text-lg font-semibold mb-2">Create Character</h3>
      <GuildDropdown value={selectedGuild} onChange={setSelectedGuild} valueType="name" />
      <div className="mb-2">
        <label className="block mb-1">Name</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-background border border-gray-700 rounded p-2" required />
      </div>
      <div className="mb-2">
        <label className="block mb-1">Class</label>
        {Array.isArray(classes) && classes.length > 0 ? (
          <select value={className} onChange={e => setClassName(e.target.value)} className="w-full bg-background border border-gray-700 rounded p-2" required>
            <option value="" disabled>Select class</option>
            {classes.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        ) : (
          <input type="text" value={className} onChange={e => setClassName(e.target.value)} className="w-full bg-background border border-gray-700 rounded p-2" required />
        )}
      </div>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {success && <div className="text-green-400 mb-2">{success}</div>}
      <button type="submit" className="bg-accent px-4 py-2 rounded" disabled={loading}>{loading ? 'Processing...' : 'Create'}</button>
    </form>
  )
}
