
import Layout from '../components/Layout'
import ItemList from '../components/ItemList'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import styles from '../components/PageSection.module.css';

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
      <section className={styles.pageSection}>
        <ItemList items={items} />
      </section>
    </Layout>
  )
}
