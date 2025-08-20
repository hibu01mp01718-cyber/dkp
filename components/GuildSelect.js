import { useState, useEffect } from 'react'

export default function GuildSelect({ value, onChange }) {
  const [guilds, setGuilds] = useState([])


  useEffect(() => {
    fetch('/api/user-guilds')
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
        {Array.isArray(guilds) && guilds.length > 0 ? (
          guilds.map(guild => (
            <option key={guild.id} value={guild.id}>{guild.name}</option>
          ))
        ) : (
          <option value="" disabled>No guilds found</option>
        )}
      </select>
    </div>
  )
}
