import { useSession } from 'next-auth/react'

export default function BidList({ bids }) {
  const { data: session } = useSession()
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Bids</h2>
      <div className="bg-card rounded-lg p-4 shadow">
        <ul>
          {bids.map(bid => (
            <li key={bid._id} className="mb-2 flex justify-between items-center">
              <span>Item: {bid.itemId}</span>
              <span>Char: {bid.characterId}</span>
              <span className="font-mono">{bid.amount} DKP</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
