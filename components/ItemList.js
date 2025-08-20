import { useSession } from 'next-auth/react'

export default function ItemList({ items }) {
  const { data: session } = useSession()
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Tracked Items</h2>
      <div className="bg-card rounded-lg p-4 shadow">
        <ul>
          {items.map(item => (
            <li key={item._id} className="mb-2 flex justify-between items-center">
              <span>{item.name}</span>
              <span className="text-xs text-gray-500">{item.characterId}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
