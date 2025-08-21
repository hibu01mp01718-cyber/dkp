
import Layout from '../components/Layout'
import BidList from '../components/BidList'
import BidForm from '../components/BidForm'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import styles from '../components/PageSection.module.css';

export default function BidsPage() {
  const { data: session } = useSession()
  const [bids, setBids] = useState([])
  const [items, setItems] = useState([])
  const [characters, setCharacters] = useState([])
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    if (!session) return
    fetch('/api/bids?guildId=' + session.guildId)
      .then(res => res.json())
      .then(setBids)
    fetch('/api/items?guildId=' + session.guildId)
      .then(res => res.json())
      .then(setItems)
    fetch('/api/characters?guildId=' + session.guildId)
      .then(res => res.json())
      .then(setCharacters)
  }, [session, refresh])

  return (
    <Layout>
      <section className={styles.pageSection}>
        <BidForm items={items} characters={characters} guildId={session?.guildId} onSubmit={() => setRefresh(r => !r)} />
        <BidList bids={bids} />
      </section>
    </Layout>
  )
}
