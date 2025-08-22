This file is being deleted as per the request.
import React, { useEffect, useState } from 'react';
import PromoteAdminForm from '../components/PromoteAdminForm';
import AddEventForm from '../components/AddEventForm';
import AdminDKPOverride from '../components/AdminDKPOverride';
import AdminClassSelect from '../components/AdminClassSelect';
import adminPanelStyles from '../components/AdminPanel.module.css';

export default function AdminPanelModern() {
  // ...existing state and logic...
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

  // ...existing handlers (handleAddGuild, handleEditGuild, etc.)...
  // ...copy all logic from the original AdminPanel.js...

  // For brevity, only the layout is shown here. The logic will be copied in the next step.
  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Column 1 */}
        <div className="flex flex-col gap-8">
          <div className="bg-card rounded-lg shadow p-6">
            <PromoteAdminForm />
          </div>
          <div className="bg-card rounded-lg shadow p-6">
            <h4 className="font-semibold mb-4 text-lg md:text-xl">Manage Classes</h4>
            {/* ...class management form and list... */}
          </div>
        </div>
        {/* Column 2 */}
        <div className="flex flex-col gap-8">
          <div className="bg-card rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Guilds</h3>
            {/* ...guild management form and table... */}
          </div>
          <div className="bg-card rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">User Admin</h3>
            {/* ...user admin table... */}
          </div>
        </div>
        {/* Column 3 */}
        <div className="flex flex-col gap-8">
          <div className="bg-card rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Add Event</h3>
            <AddEventForm />
          </div>
          <div className="bg-card rounded-lg shadow p-6">
            <h4 className="font-semibold mb-4 text-lg md:text-xl">Character Management</h4>
            {/* ...character management table... */}
          </div>
          <div className="bg-card rounded-lg shadow p-6">
            <AdminDKPOverride characters={characters} />
          </div>
        </div>
      </div>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {success && <div className="text-green-400 mb-2">{success}</div>}
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import PromoteAdminForm from '../components/PromoteAdminForm';
import AddEventForm from '../components/AddEventForm';
import AdminDKPOverride from '../components/AdminDKPOverride';
import AdminClassSelect from '../components/AdminClassSelect';
import adminPanelStyles from '../components/AdminPanel.module.css';

export default function AdminPanelModern() {
  // ...existing state and logic...
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

  // ...existing handlers (handleAddGuild, handleEditGuild, etc.)...
  // ...copy all logic from the original AdminPanel.js...

  // For brevity, only the layout is shown here. The logic will be copied in the next step.
  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Column 1 */}
        <div className="flex flex-col gap-8">
          <div className="bg-card rounded-lg shadow p-6">
            <PromoteAdminForm />
          </div>
          <div className="bg-card rounded-lg shadow p-6">
            <h4 className="font-semibold mb-4 text-lg md:text-xl">Manage Classes</h4>
            {/* ...class management form and list... */}
          </div>
        </div>
        {/* Column 2 */}
        <div className="flex flex-col gap-8">
          <div className="bg-card rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Guilds</h3>
            {/* ...guild management form and table... */}
          </div>
          <div className="bg-card rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">User Admin</h3>
            {/* ...user admin table... */}
          </div>
        </div>
        {/* Column 3 */}
        <div className="flex flex-col gap-8">
          <div className="bg-card rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Add Event</h3>
            <AddEventForm />
          </div>
          <div className="bg-card rounded-lg shadow p-6">
            <h4 className="font-semibold mb-4 text-lg md:text-xl">Character Management</h4>
            {/* ...character management table... */}
          </div>
          <div className="bg-card rounded-lg shadow p-6">
            <AdminDKPOverride characters={characters} />
          </div>
        </div>
      </div>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {success && <div className="text-green-400 mb-2">{success}</div>}
    </div>
  );
}
