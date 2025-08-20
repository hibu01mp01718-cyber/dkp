import { useState } from 'react'

export default function BidForm({ items, characters, guildId, onSubmit }) {
  const [itemId, setItemId] = useState('')
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
    const res = await fetch('/api/bids', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId, characterId, amount: Number(amount), guildId }),
    })
    if (res.ok) {
      setSuccess('Bid placed!')
      setAmount('')
      setItemId('')
      setCharacterId('')
      if (onSubmit) onSubmit()
    } else {
      setError('Failed to place bid')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-lg p-4 shadow mb-6">
      <h3 className="text-lg font-semibold mb-2">Place a Bid</h3>
      <div className="mb-2">
        <label className="block mb-1">Item</label>
        <select value={itemId} onChange={e => setItemId(e.target.value)} className="w-full bg-background border border-gray-700 rounded p-2">
          <option value="">Select item</option>
          {items.map(item => (
            <option key={item._id} value={item._id}>{item.name}</option>
          ))}
        </select>
      </div>
      <div className="mb-2">
        <label className="block mb-1">Character</label>
        <select value={characterId} onChange={e => setCharacterId(e.target.value)} className="w-full bg-background border border-gray-700 rounded p-2">
          <option value="">Select character</option>
          {characters.map(char => (
            <option key={char._id} value={char._id}>{char.name}</option>
          ))}
        </select>
      </div>
      <div className="mb-2">
        <label className="block mb-1">Bid Amount</label>
  <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-white text-black border border-gray-700 rounded p-2" required />
      </div>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {success && <div className="text-green-400 mb-2">{success}</div>}
      <button type="submit" className="bg-accent px-4 py-2 rounded" disabled={loading}>{loading ? 'Processing...' : 'Submit'}</button>
    </form>
  )
}
