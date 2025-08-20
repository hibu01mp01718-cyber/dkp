import React, { useEffect, useState } from 'react';
import AddEventForm from './AddEventForm';
import AdminDKPOverride from './AdminDKPOverride';
import { CustomSelect } from './ui/CustomSelect';
import AdminClassSelect from './AdminClassSelect';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [guilds, setGuilds] = useState([]);
  const [guildName, setGuildName] = useState('');
  const [guildMsg, setGuildMsg] = useState('');
  const [editGuildId, setEditGuildId] = useState(null);
  const [editGuildName, setEditGuildName] = useState('');
  const [classes, setClasses] = useState([]);
  const [newClass, setNewClass] = useState('');
  const [characters, setCharacters] = useState([]);
  const [editCharId, setEditCharId] = useState(null);
  const [editCharName, setEditCharName] = useState('');
  const [editCharClass, setEditCharClass] = useState('');
  const [dkp, setDKP] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetch('/api/admin').then(res => res.json()).then(setUsers);
    fetch('/api/characters').then(res => res.json()).then(setCharacters);
    fetch('/api/guilds').then(res => res.json()).then(setGuilds);
    fetch('/api/classes').then(res => res.json()).then(data => setClasses(data.classes || []));
    fetch('/api/dkp').then(res => res.json()).then(data => {
      const dkpMap = {};
      const byChar = {};
      data.forEach(entry => {
        if (!byChar[entry.characterId]) byChar[entry.characterId] = [];
        byChar[entry.characterId].push(entry);
      });
      Object.entries(byChar).forEach(([charId, entries]) => {
        entries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        if (entries[0] && entries[0].reason === 'Admin override') {
          dkpMap[charId] = entries[0].amount;
        } else {
          dkpMap[charId] = entries.reduce((sum, e) => sum + e.amount, 0);
        }
      });
      setDKP(dkpMap);
    });
  }, [success, guildMsg]);

  const handleAddGuild = async (e) => {
    e.preventDefault();
    setGuildMsg('');
    if (!guildName.trim()) {
      setGuildMsg('Guild name required');
      return;
    }
    const res = await fetch('/api/guilds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: guildName.trim() }),
    });
    if (res.ok) {
      setGuildMsg('Guild added!');
      setGuildName('');
      fetch('/api/guilds').then(res => res.json()).then(setGuilds);
    } else {
      setGuildMsg('Failed to add guild');
    }
  };

  const handleEditGuild = (guild) => {
    setEditGuildId(guild._id);
    setEditGuildName(guild.name);
    setGuildMsg('');
  };

  const handleEditGuildSubmit = async (e) => {
    e.preventDefault();
    if (!editGuildName.trim()) {
      setGuildMsg('Guild name required');
      return;
    }
    const res = await fetch('/api/guilds', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guildId: editGuildId, name: editGuildName.trim() }),
    });
    if (res.ok) {
      setGuildMsg('Guild updated!');
      setEditGuildId(null);
      setEditGuildName('');
      fetch('/api/guilds').then(res => res.json()).then(setGuilds);
    } else {
      setGuildMsg('Failed to update guild');
    }
  };

  const handleDeleteGuild = async (guildId) => {
    if (!window.confirm('Delete this guild?')) return;
    const res = await fetch('/api/guilds', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guildId }),
    });
    if (res.ok) {
      setGuildMsg('Guild deleted!');
      fetch('/api/guilds').then(res => res.json()).then(setGuilds);
    } else {
      setGuildMsg('Failed to delete guild');
    }
  };

  const setAdmin = async (userId, isAdmin) => {
    setLoading(true);
    setError('');
    setSuccess('');
    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, isAdmin }),
    });
    if (res.ok) {
      setSuccess('Role updated!');
      fetch('/api/admin').then(res => res.json()).then(setUsers);
    } else {
      setError('Failed to update role');
    }
    setLoading(false);
  };

  // Class management
  const handleAddClass = async (e) => {
    e.preventDefault();
    if (!newClass.trim()) return;
    const res = await fetch('/api/classes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newClass.trim() }),
    });
    if (res.ok) {
      setNewClass('');
      fetch('/api/classes').then(res => res.json()).then(data => setClasses(data.classes || []));
    }
  };
  const handleRemoveClass = async (cls) => {
    const res = await fetch('/api/classes', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: cls }),
    });
    if (res.ok) {
      fetch('/api/classes').then(res => res.json()).then(data => setClasses(data.classes || []));
    }
  };

  // Character management
  const handleEditChar = (char) => {
    setEditCharId(char._id);
    setEditCharName(char.name);
    setEditCharClass(char.className);
  };
  const handleEditCharSubmit = async (e) => {
    e.preventDefault();
    if (!editCharName.trim() || !editCharClass.trim()) return;
    setLoading(true);
    const res = await fetch('/api/characters', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ characterId: editCharId, name: editCharName.trim(), className: editCharClass.trim() }),
    });
    if (res.ok) {
      setEditCharId(null);
      setEditCharName('');
      setEditCharClass('');
      fetch('/api/characters').then(res => res.json()).then(setCharacters);
    }
    setLoading(false);
  };
  const handleDeleteChar = async (charId) => {
    if (!window.confirm('Delete this character?')) return;
    setLoading(true);
    const res = await fetch('/api/characters', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ characterId: charId }),
    });
    if (res.ok) {
      fetch('/api/characters').then(res => res.json()).then(setCharacters);
    } else {
      setError('Failed to delete character');
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 md:px-8 py-4 flex flex-col gap-8">
      {/* Classes Card */}
      <div className="bg-card rounded-lg shadow p-4 md:p-6">
        <h4 className="font-semibold mb-4 text-lg md:text-xl">Manage Classes</h4>
        <form onSubmit={handleAddClass} className="flex flex-col sm:flex-row gap-2 mb-4">
          <input type="text" value={newClass} onChange={e => setNewClass(e.target.value)} className="bg-white text-black border border-gray-700 rounded p-2 flex-1" placeholder="Add class name" />
          <button type="submit" className="bg-accent px-4 py-2 rounded shadow hover:bg-accent/80 transition">Add</button>
        </form>
        <ul className="flex flex-wrap gap-2 mb-2">
          {classes.map(cls => (
            <li key={cls} className="bg-gray-700 px-3 py-1 rounded flex items-center text-sm">
              {cls}
              <button type="button" className="ml-2 text-red-400 hover:text-red-300" onClick={() => handleRemoveClass(cls)}>&times;</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Guilds Card */}
      <div className="bg-card rounded-lg shadow p-4 md:p-6">
        <h3 className="text-lg font-semibold mb-4">Guilds</h3>
        <form onSubmit={handleAddGuild} className="flex flex-col sm:flex-row md:items-end gap-2 mb-4">
          <div className="flex-1">
            <label className="block mb-1">Add Guild</label>
            <input type="text" value={guildName} onChange={e => setGuildName(e.target.value)} className="bg-white text-black border border-gray-700 rounded p-2 w-full" placeholder="Guild name" />
          </div>
          <button type="submit" className="bg-accent px-4 py-2 rounded shadow hover:bg-accent/80 transition">Add</button>
        </form>
        {guildMsg && <div className={guildMsg.includes('added') ? 'text-green-400' : 'text-red-400'}>{guildMsg}</div>}
        <div className="overflow-x-auto">
          <table className="w-full text-left mb-2">
            <thead>
              <tr>
                <th className="py-2">Name</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {guilds.map(guild => (
                <tr key={guild._id}>
                  <td className="py-2">
                    {editGuildId === guild._id ? (
                      <form onSubmit={handleEditGuildSubmit} className="flex gap-2">
                        <input type="text" value={editGuildName} onChange={e => setEditGuildName(e.target.value)} className="bg-white text-black border border-gray-700 rounded p-2" />
                        <button type="submit" className="bg-accent px-2 py-1 rounded">Save</button>
                        <button type="button" className="bg-gray-700 px-2 py-1 rounded" onClick={() => { setEditGuildId(null); setEditGuildName('') }}>Cancel</button>
                      </form>
                    ) : guild.name}
                  </td>
                  <td className="py-2">
                    {editGuildId !== guild._id && (
                      <>
                        <button className="bg-accent px-2 py-1 rounded mr-2 hover:bg-accent/80 transition" onClick={() => handleEditGuild(guild)}>Edit</button>
                        <button className="bg-red-700 px-2 py-1 rounded hover:bg-red-600 transition" onClick={() => handleDeleteGuild(guild._id)}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Users Card */}
      <div className="bg-card rounded-lg shadow p-4 md:p-6">
        <h3 className="text-lg font-semibold mb-4">User Admin</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left mb-2">
            <thead>
              <tr>
                <th className="py-2">User ID</th>
                <th className="py-2">Admin</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.userId}>
                  <td className="py-2">{user.userId}</td>
                  <td className="py-2">{user.isAdmin ? 'Yes' : 'No'}</td>
                  <td className="py-2">
                    <button
                      className="bg-accent px-2 py-1 rounded mr-2 hover:bg-accent/80 transition"
                      disabled={loading || user.isAdmin}
                      onClick={() => setAdmin(user.userId, true)}
                    >Make Admin</button>
                    <button
                      className="bg-gray-700 px-2 py-1 rounded hover:bg-gray-600 transition"
                      disabled={loading || !user.isAdmin}
                      onClick={() => setAdmin(user.userId, false)}
                    >Remove Admin</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Event Card */}
      <div className="bg-card rounded-lg shadow p-4 md:p-6">
        <h3 className="text-lg font-semibold mb-4">Add Event</h3>
        <AddEventForm />
      </div>

      {/* Character Management Card */}
      <div className="bg-card rounded-lg shadow p-4 md:p-6">
        <h4 className="font-semibold mb-4 text-lg md:text-xl">Character Management</h4>
        <ul>
          {characters.map(char => (
            <li key={char._id} className="mb-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              {editCharId === char._id ? (
                <form onSubmit={handleEditCharSubmit} className="flex gap-2 items-center w-full">
                  <input value={editCharName} onChange={e => setEditCharName(e.target.value)} className="bg-white text-black border border-gray-700 rounded p-1 w-32" required />
                  <div className="w-32">
                    <AdminClassSelect value={editCharClass} onChange={setEditCharClass} classes={classes} />
                  </div>
                  <button type="submit" className="text-green-500 hover:text-green-300">Save</button>
                  <button type="button" onClick={() => setEditCharId(null)} className="text-gray-400 hover:text-gray-200">Cancel</button>
                </form>
              ) : (
                <>
                  <span>{char.name} <span className="text-sm text-gray-400">({char.className})</span></span>
                  <span className="text-xs text-gray-500">{char.userId}</span>
                  <span className="text-xs text-accent font-mono">DKP: {dkp[String(char._id)] ?? 0}</span>
                  <button onClick={() => handleEditChar(char)} className="ml-2 text-blue-500 hover:text-blue-300">Edit</button>
                  <button onClick={() => handleDeleteChar(char._id)} className="ml-2 text-red-500 hover:text-red-300">Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-card rounded-lg shadow p-4 md:p-6">
        <AdminDKPOverride characters={characters} />
      </div>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {success && <div className="text-green-400 mb-2">{success}</div>}
    </div>
  );
}
  const handleEditGuild = (guild) => {
    setEditGuildId(guild._id)
    setEditGuildName(guild.name)
    setGuildMsg('')
  }

  const handleEditGuildSubmit = async (e) => {
    e.preventDefault()
    if (!editGuildName.trim()) {
      setGuildMsg('Guild name required')
      return
    }
    const res = await fetch('/api/guilds', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guildId: editGuildId, name: editGuildName.trim() }),
    })
    if (res.ok) {
      setGuildMsg('Guild updated!')
      setEditGuildId(null)
      setEditGuildName('')
      // Refresh guilds
      fetch('/api/guilds').then(res => res.json()).then(setGuilds)
    } else {
      setGuildMsg('Failed to update guild')
    }
  }

  const handleDeleteGuild = async (guildId) => {
    if (!window.confirm('Delete this guild?')) return
    const res = await fetch('/api/guilds', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guildId }),
    })
    if (res.ok) {
      setGuildMsg('Guild deleted!')
      // Refresh guilds
      fetch('/api/guilds').then(res => res.json()).then(setGuilds)
    } else {
      setGuildMsg('Failed to delete guild')
    }
  }

  const handleAddGuild = async (e) => {
    e.preventDefault()
    setGuildMsg('')
    if (!guildName.trim()) {
      setGuildMsg('Guild name required')
      return
    }
    const res = await fetch('/api/guilds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: guildName.trim() }),
    })
    if (res.ok) {
      setGuildMsg('Guild added!')
      setGuildName('')
    } else {
      setGuildMsg('Failed to add guild')
    }
  }

  const setAdmin = async (userId, isAdmin) => {
    setLoading(true)
    setError('')
    setSuccess('')
    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, isAdmin }),
    })
    if (res.ok) {
      setSuccess('Role updated!')
    } else {
      setError('Failed to update role')
    }
    setLoading(false)
  }

  // ...existing code...
  // Only one return statement is allowed. Remove any duplicate returns and code after the first return.
  // (Intentionally left blank to remove stray JSX and code after the main return)

