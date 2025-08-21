
import Layout from '../components/Layout'
import EventLog from '../components/EventLog'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import styles from '../components/PageSection.module.css';

export default function EventsPage() {
  const { data: session } = useSession()
  const [events, setEvents] = useState([])

  useEffect(() => {
    if (!session) return
    fetch('/api/events?guildId=' + session.guildId)
      .then(res => res.json())
      .then(setEvents)
  }, [session])

  return (
    <Layout>
      <section className={styles.pageSection}>
        <EventLog events={events} />
      </section>
    </Layout>
  )
}
