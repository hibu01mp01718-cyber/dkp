import { useState } from 'react'
import { CustomSelect } from './ui/CustomSelect'

export default function AdminDKPOverride({ characters, onSubmit }) {
  const [characterId, setCharacterId] = useState('')
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    const res = await fetch('/api/admin-override-dkp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ characterId, amount: Number(amount) }),
    })
    if (res.ok) {
      setSuccess('DKP overridden!')
      setAmount('')
      setCharacterId('')
      if (onSubmit) onSubmit()
    } else {
      setError('Failed to override DKP')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-lg p-4 shadow mb-6">
      <h3 className="text-lg font-semibold mb-2">Admin DKP Override</h3>
      <CustomSelect
        label="Character"
        value={characterId}
        onChange={setCharacterId}
        options={[
          { value: '', label: 'Select character' },
          ...characters.map(char => ({ value: char._id, label: char.name }))
        ]}
      />
      <div className="mb-2">
        <label className="block mb-1">Override DKP Amount</label>
  <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-white text-black border border-gray-700 rounded p-2" required />
      </div>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {success && <div className="text-green-400 mb-2">{success}</div>}
      <button type="submit" className="bg-accent px-4 py-2 rounded" disabled={loading}>{loading ? 'Processing...' : 'Override'}</button>
    </form>
  )
}
