import { useSession } from 'next-auth/react'

export default function EventLog({ events }) {
  const { data: session } = useSession()
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Event Log</h2>
      <div className="bg-card rounded-lg p-4 shadow">
        <ul>
          {events.map(event => (
            <li key={event._id} className="mb-2 flex flex-col">
              <span className="font-semibold">{event.name}</span>
              <span className="text-xs text-gray-400">{event.description}</span>
              <span className="text-xs text-gray-500">{new Date(event.timestamp).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
