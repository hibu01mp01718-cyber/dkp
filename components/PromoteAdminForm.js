import { useState } from 'react'

export default function PromoteAdminForm() {
  const [userId, setUserId] = useState('')
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess('')
    setError('')
    setLoading(true)
    const res = await fetch('/api/promote-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
    if (res.ok) {
      setSuccess('User promoted to admin!')
      setUserId('')
    } else {
      setError('Failed to promote user')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-lg p-4 shadow mb-6 max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-2">Promote User to Admin</h3>
      <div className="mb-2">
        <label className="block mb-1">User ID</label>
        <input type="text" value={userId} onChange={e => setUserId(e.target.value)} className="w-full bg-background border border-gray-700 rounded p-2" required />
      </div>
  {/* Guild ID field removed */}
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {success && <div className="text-green-400 mb-2">{success}</div>}
      <button type="submit" className="bg-accent px-4 py-2 rounded" disabled={loading}>{loading ? 'Processing...' : 'Promote'}</button>
    </form>
  )
}
