import { useState, useEffect } from 'react'

export default function GuildDropdown({ value, onChange, valueType = 'id' }) {
  const [guilds, setGuilds] = useState([])

  useEffect(() => {
    fetch('/api/guilds')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setGuilds(data)
        else setGuilds([])
      })
  }, [])

  return (
    <div className="mb-2">
      <label className="block mb-1">Guild</label>
      <select value={value} onChange={e => onChange(e.target.value)} className="w-full bg-background border border-gray-700 rounded p-2" required>
        <option value="">Select guild</option>
        {guilds.map(guild => (
          <option key={guild._id} value={valueType === 'name' ? guild.name : guild._id}>{guild.name}</option>
        ))}
      </select>
    </div>
  )
}
