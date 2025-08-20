import Layout from '../components/Layout'
import ItemList from '../components/ItemList'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function ItemsPage() {
  const { data: session } = useSession()
  const [items, setItems] = useState([])

  useEffect(() => {
    if (!session) return
    fetch('/api/items?guildId=' + session.guildId)
      .then(res => res.json())
      .then(setItems)
  }, [session])

  return (
    <Layout>
      <ItemList items={items} />
    </Layout>
  )
}
