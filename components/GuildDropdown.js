import { useState, useEffect } from 'react';
import { CustomSelect } from './ui/CustomSelect';

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
    <CustomSelect label="Guild" value={value} onChange={onChange} options={options} />
  );
}
