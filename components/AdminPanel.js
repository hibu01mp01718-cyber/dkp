import PromoteAdminForm from './PromoteAdminForm';
import React, { useEffect, useState } from 'react';
import AddEventForm from './AddEventForm';
import AdminDKPOverride from './AdminDKPOverride';
import { CustomSelect } from './ui/CustomSelect';
import AdminClassSelect from './AdminClassSelect';
import adminPanelStyles from './AdminPanel.module.css';

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
    fetch('/api/classes').then(res => res.json()).then(data => setClasses(Array.isArray(data) ? data.map(cls => cls.name) : []));
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
      body: JSON.stringify({ charId: editCharId, name: editCharName.trim(), className: editCharClass.trim() }),
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
      body: JSON.stringify({ charId }),
    });
    if (res.ok) {
      fetch('/api/characters').then(res => res.json()).then(setCharacters);
    } else {
      setError('Failed to delete character');
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-4">
      <div className="adminPanelGrid grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <div className="adminPanelCard bg-card rounded-lg shadow p-4 md:p-6 min-h-0 w-full">
          <PromoteAdminForm />
        </div>
  <div className="adminPanelCard bg-card rounded-lg shadow p-4 md:p-6 min-h-0 w-full">
          <h4 className="font-semibold mb-4 text-lg md:text-xl">Manage Classes</h4>
          <form onSubmit={handleAddClass} className="flex flex-col sm:flex-row gap-2 mb-4">
            <input type="text" value={newClass} onChange={e => setNewClass(e.target.value)} className={adminPanelStyles.adminPanelInput + ' flex-1'} placeholder="Add class name" />
            <button type="submit" className={adminPanelStyles.adminPanelButton}>Add</button>
          </form>
          <ul className="flex flex-wrap gap-2 mb-2">
            {classes.map(cls => (
              <li key={cls} className="bg-gray-700 px-3 py-1 rounded flex items-center text-sm">
                {cls}
                <button type="button" className={adminPanelStyles.adminPanelButton + ' ' + adminPanelStyles.delete} style={{ marginLeft: 8, padding: '0.6rem 1rem' }} onClick={() => handleRemoveClass(cls)}>&times;</button>
              </li>
            ))}
          </ul>
        </div>
  <div className="adminPanelCard bg-card rounded-lg shadow p-4 md:p-6 min-h-0 w-full">
          <h3 className="text-lg font-semibold mb-4">Guilds</h3>
          <form onSubmit={handleAddGuild} className="flex flex-col sm:flex-row md:items-end gap-2 mb-4">
            <div className="flex-1">
              <label className="block mb-1">Add Guild</label>
              <input type="text" value={guildName} onChange={e => setGuildName(e.target.value)} className={adminPanelStyles.adminPanelInput + ' w-full'} placeholder="Guild name" />
            </div>
            <button type="submit" className={adminPanelStyles.adminPanelButton}>Add</button>
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
                          <input type="text" value={editGuildName} onChange={e => setEditGuildName(e.target.value)} className={adminPanelStyles.adminPanelInput} />
                          <button type="submit" className={adminPanelStyles.adminPanelButton}>Save</button>
                          <button type="button" className={adminPanelStyles.adminPanelButton} style={{ background: '#23272f', color: '#fff', border: '1px solid #444' }} onClick={() => { setEditGuildId(null); setEditGuildName('') }}>Cancel</button>
                        </form>
                      ) : guild.name}
                    </td>
                    <td className="py-2">
                      {editGuildId !== guild._id && (
                        <>
                          <button className={adminPanelStyles.adminPanelButton} style={{ marginRight: 8 }} onClick={() => handleEditGuild(guild)}>Edit</button>
                          <button className={adminPanelStyles.adminPanelButton + ' ' + adminPanelStyles.delete} onClick={() => handleDeleteGuild(guild._id)}>Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
  <div className="adminPanelCard bg-card rounded-lg shadow p-4 md:p-6 min-h-0 w-full">
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
                        className={adminPanelStyles.adminPanelButton}
                        style={{ marginRight: 8 }}
                        disabled={loading || user.isAdmin}
                        onClick={() => setAdmin(user.userId, true)}
                      >Make Admin</button>
                      <button
                        className={adminPanelStyles.adminPanelButton}
                        style={{ background: '#23272f', color: '#fff', border: '1px solid #444' }}
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
  <div className="adminPanelCard bg-card rounded-lg shadow p-4 md:p-6 min-h-0 w-full">
          <h3 className="text-lg font-semibold mb-4">Add Event</h3>
          <AddEventForm />
        </div>
        <div className="bg-card rounded-lg shadow p-4 md:p-6">
          <AdminDKPOverride characters={characters} />
        </div>
      </div>
      <div className="adminPanelCard bg-card rounded-lg shadow p-4 md:p-6 min-h-0 w-full">
        <h4 className="font-semibold mb-4 text-lg md:text-xl">Character Management</h4>
        <div className="overflow-x-auto">
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr>
                <th style={{ padding: '1rem 1.5rem', fontSize: '1.1rem', fontWeight: 700, textAlign: 'left' }}>Name</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '1.1rem', fontWeight: 700, textAlign: 'left' }}>Class</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '1.1rem', fontWeight: 700, textAlign: 'left' }}>User ID</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '1.1rem', fontWeight: 700, textAlign: 'left' }}>DKP</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '1.1rem', fontWeight: 700, textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {characters.map(char => (
                <tr key={char._id}>
                  {editCharId === char._id ? (
                    <>
                      <td style={{ padding: '0.85rem 1.5rem' }}>
                        <form onSubmit={handleEditCharSubmit} className="flex gap-2 items-center w-full">
                          <input value={editCharName} onChange={e => setEditCharName(e.target.value)} className={adminPanelStyles.adminPanelInput + ' w-32'} required />
                        </form>
                      </td>
                      <td style={{ padding: '0.85rem 1.5rem' }}>
                        <form onSubmit={handleEditCharSubmit} className="flex gap-2 items-center w-full">
                          <div className="w-32">
                            <AdminClassSelect value={editCharClass} onChange={setEditCharClass} classes={classes} />
                          </div>
                        </form>
                      </td>
                      <td style={{ padding: '0.85rem 1.5rem' }}>{char.userId}</td>
                      <td style={{ padding: '0.85rem 1.5rem' }}>{dkp[String(char._id)] ?? 0}</td>
                      <td style={{ padding: '0.85rem 1.5rem' }}>
                        <form onSubmit={handleEditCharSubmit} className="flex gap-2 items-center w-full">
                          <button type="submit" className={adminPanelStyles.adminPanelButton} style={{ background: '#22c55e' }}>Save</button>
                          <button type="button" onClick={() => setEditCharId(null)} className={adminPanelStyles.adminPanelButton} style={{ background: '#23272f', color: '#fff', border: '1px solid #444' }}>Cancel</button>
                        </form>
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={{ padding: '0.85rem 1.5rem' }}>{char.name}</td>
                      <td style={{ padding: '0.85rem 1.5rem' }}>{char.className}</td>
                      <td style={{ padding: '0.85rem 1.5rem' }}>{char.userId}</td>
                      <td style={{ padding: '0.85rem 1.5rem' }}>{dkp[String(char._id)] ?? 0}</td>
                      <td style={{ padding: '0.85rem 1.5rem' }}>
                        <button onClick={() => handleEditChar(char)} className={adminPanelStyles.adminPanelButton} style={{ marginRight: 8, background: '#2563eb' }}>Edit</button>
                        <button onClick={() => handleDeleteChar(char._id)} className={adminPanelStyles.adminPanelButton + ' ' + adminPanelStyles.delete}>Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

