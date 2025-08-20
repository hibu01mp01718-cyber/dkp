import Layout from '../components/Layout'
import AdminPanel from '../components/AdminPanel'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function AdminPage() {
  const { data: session } = useSession()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session) return
    // Check if user is admin (no guildId)
    fetch('/api/admin')
      .then(res => res.json())
      .then(users => {
        const user = users.find(u => u.userId === session.user.id)
        setIsAdmin(user?.isAdmin)
        setLoading(false)
      })
  }, [session])

  if (!session || loading) return <Layout><div>Loading...</div></Layout>
  if (!isAdmin) return <Layout><div className="text-red-400">Access denied. Admins only.</div></Layout>
  return (
    <Layout>
      <AdminPanel />
    </Layout>
  )
}
