import { useState, useEffect } from 'react';
import { ModernSelect } from './ui/ModernSelect';

export default function GuildDropdown({ value, onChange, valueType = 'id' }) {
  const [guilds, setGuilds] = useState([]);

  useEffect(() => {
    fetch('/api/guilds')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setGuilds(data);
        else setGuilds([]);
      });
  }, []);

  const options = [
    { value: '', label: 'Select guild' },
    ...guilds.map(guild => ({
      value: valueType === 'name' ? guild.name : guild._id,
      label: guild.name
    }))
  ];
  return (
    <ModernSelect label="Guild" value={value} onChange={e => onChange(e.target.value)} required>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </ModernSelect>
  );
}
