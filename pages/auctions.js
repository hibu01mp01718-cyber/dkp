import Layout from '../components/Layout';
import styles from '../components/AddEventForm.module.css';
import { ModernSelect } from '../components/ui/ModernSelect';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

function BidFormInline({ item, bids, characters, user, onBidPlaced }) {
	// Check if bidding has ended
	let ended = false;
	if (item.endTime) {
		const end = new Date(item.endTime).getTime();
		const now = Date.now();
		if (end - now <= 0) ended = true;
	}
	const [amount, setAmount] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [loading, setLoading] = useState(false);
	const userCharacters = characters.filter(c => c.userId === user?.id);
	const character = userCharacters[0];
	const characterId = character?._id || '';
	const maxDKP = character?.dkp ?? 0;
	const minBid = item.minBid ?? 1;
	const increment = item.increment ?? 1;
	const sortedBids = [...bids].sort((a, b) => b.amount - a.amount || new Date(a.createdAt) - new Date(b.createdAt));
	const highestBid = sortedBids[0];
	const minAllowed = highestBid ? highestBid.amount + increment : minBid;
	const canBid = maxDKP >= minAllowed;
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setSuccess('');
		if (!characterId || !amount) return;
		const bidValue = parseInt(amount);
		if (bidValue > maxDKP) {
			setError('Cannot bid more DKP than you have!');
			return;
		}
		if (bidValue < minAllowed) {
			setError(highestBid
				? `Bid must be at least ${minAllowed} (highest bid + increment)`
				: `Bid must be at least the minimum bid!`
			);
			return;
		}
		setLoading(true);
		try {
			const res = await fetch('/api/bids', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ itemId: item._id, characterId, amount: bidValue })
			});
			if (res.ok) {
				setSuccess('Bid placed!');
				setAmount('');
				if (typeof onBidPlaced === 'function') onBidPlaced(item._id, characterId, bidValue);
			} else {
				const data = await res.json().catch(() => ({}));
				setError(data.error || 'Failed to place bid');
			}
		} catch (err) {
			setError('Network error');
		}
		setLoading(false);
	};
	return (
	<form onSubmit={handleSubmit} className="flex flex-row items-center" style={{gap: '0.5rem', marginRight: 0, paddingRight: 0}}>
			<input
				type="number"
				min={minAllowed}
				max={maxDKP}
				value={amount}
				onChange={e => setAmount(e.target.value)}
				placeholder={`Bid (min ${minAllowed})`}
				className={styles.formInput}
	style={{ minWidth: '80px', maxWidth: '100px', textAlign: 'center', fontWeight: 500, fontSize: '0.75rem', padding: '0.3rem 0.45rem' }}
				disabled={!canBid || loading || ended}
			/>
			<button
				type="submit"
				className={styles.formButton}
				style={{ minHeight: '24px', minWidth: '38px', padding: '0.18rem 0.45rem', fontSize: '0.75rem', marginLeft: 0, marginRight: 0 }}
				disabled={!canBid || loading || ended}
			>
				{loading ? '...' : 'Bid'}
			</button>
			{ended && (
				<span className="text-[0.6rem] text-red-400 ml-2" style={{fontSize: '0.6rem'}}>Bidding ended</span>
			)}
			{!ended && !canBid && (
				<span className="text-xs text-red-400 ml-2">Not enough DKP</span>
			)}
			{error && <span className="text-xs text-red-400 ml-2">{error}</span>}
	{success && <span className="text-[0.7rem] text-green-400 ml-2">{success}</span>}
		</form>
	);
}

function BidTableRow({ item, bids, characters, user, onBidPlaced, isAdmin, onDeleteItem }) {
	// Real-time countdown for time left
	const [timeLeft, setTimeLeft] = useState('');
	const [ended, setEnded] = useState(false);
	useEffect(() => {
		if (!item.endTime) {
			setTimeLeft('-');
			setEnded(false);
			return;
		}
		const update = () => {
			const end = new Date(item.endTime).getTime();
			const now = Date.now();
			const diff = end - now;
			if (diff <= 0) {
				setTimeLeft('Ended');
				setEnded(true);
			} else {
				const hours = Math.floor(diff / 1000 / 60 / 60);
				const minutes = Math.floor((diff / 1000 / 60) % 60);
				const seconds = Math.floor((diff / 1000) % 60);
				setTimeLeft((hours > 0 ? hours + ':' : '') + String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0'));
				setEnded(false);
			}
		};
		update();
		const interval = setInterval(update, 1000);
		return () => clearInterval(interval);
	}, [item.endTime]);
	// Highest bid
	const sortedBids = [...bids].sort((a, b) => b.amount - a.amount || new Date(a.createdAt) - new Date(b.createdAt));
	const highestBid = sortedBids[0];
	const winnerChar = highestBid ? characters.find(c => c._id === highestBid.characterId) : null;
	// Track if item is assigned (persistent)
	const assigned = !!item.assignedTo;
	// Assign handler
	const handleAssign = async () => {
		if (!highestBid || !winnerChar || assigned) return;
		if (typeof onDeleteItem === 'function') {
			await onDeleteItem('assign', highestBid._id, item._id);
		}
	};
	// Delete auction handler
	const handleDeleteAuction = async () => {
		if (typeof onDeleteItem === 'function') onDeleteItem('delete', null, item._id);
	};
	return (
		<tr>
	<td className="align-middle text-center" style={{padding: 0, margin: 0, minWidth: 0, width: 'auto'}}>{item.name}</td>
	<td className="align-middle text-center" style={{padding: 0, margin: 0, minWidth: 0, width: 'auto'}}>{item.description}</td>
	<td className="align-middle text-center" style={{padding: 0, margin: 0, minWidth: 0, width: 'auto'}}>{timeLeft}</td>
	<td className="align-middle text-center" style={{padding: 0, margin: 0, minWidth: 0, width: 'auto'}}>{highestBid ? highestBid.amount + ' DKP' : 'No bids yet'}</td>
	<td className="align-middle text-center" style={{padding: 0, margin: 0, minWidth: 0, width: 'auto'}}>{item.minBid ?? 1}</td>
	<td className="align-middle text-center" style={{padding: 0, margin: 0, minWidth: 0, width: 'auto'}}>{item.increment ?? 1}</td>
	<td className="align-middle text-center" style={{padding: 0, margin: 0, minWidth: 0, width: 'auto'}}>{ended && winnerChar ? winnerChar.name : '-'}</td>
			<td className="align-middle" style={{padding: 0, margin: 0, minWidth: 0, width: '1%'}}>
				<div style={{display: 'inline-flex', alignItems: 'center', minWidth: 0, width: 'auto', padding: 0, margin: 0}}>
					<BidFormInline
						item={item}
						bids={bids}
						characters={characters}
						user={user}
						onBidPlaced={onBidPlaced}
					/>
				</div>
			</td>
			{isAdmin && (
				<td className="py-2 align-middle" style={{padding: 0, margin: 0, width: 1, minWidth: 0, maxWidth: 'none'}}>
					<div style={{ display: 'inline-flex', flexDirection: 'row', gap: '0.12rem', alignItems: 'center', padding: 0, margin: 0, width: 'auto', minWidth: 0, maxWidth: 'none' }}>
						<button
							className={styles.formButton}
							style={{ height: '22px', minWidth: 0, width: 'auto', padding: '0.12rem 0.3rem', fontSize: '0.7rem', opacity: ended && highestBid && !assigned ? 1 : 0.6, cursor: ended && highestBid && !assigned ? 'pointer' : 'not-allowed', margin: 0, boxSizing: 'border-box' }}
							onClick={ended && highestBid && !assigned ? handleAssign : undefined}
							disabled={!ended || !highestBid || assigned}
						>
							Assign
						</button>
						<button
							className={styles.formButton}
							style={{ height: '22px', minWidth: 0, width: 'auto', padding: '0.12rem 0.3rem', fontSize: '0.7rem', background: '#ef4444', color: '#fff', margin: 0, boxSizing: 'border-box' }}
							onClick={handleDeleteAuction}
						>
							Delete
						</button>
					</div>
				</td>
			)}
		</tr>
	);
}

export default function BidsPage() {
	const { data: session } = useSession();
	const [items, setItems] = useState([]);
	const [characters, setCharacters] = useState([]);
	const [bids, setBids] = useState([]);
	const [refresh, setRefresh] = useState(false);

	useEffect(() => {
		if (!session) return;
		fetch('/api/items').then(res => res.json()).then(setItems);
		fetch('/api/characters').then(res => res.json()).then(setCharacters);
		fetch('/api/bids').then(res => res.json()).then(setBids);
	}, [session, refresh]);

	const handleBid = async (itemId, characterId, amount) => {
		await fetch('/api/bids', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ itemId, characterId, amount })
		});
		setRefresh(r => !r);
	};

	const handleAssignOrDelete = async (action, bidId, itemId) => {
		if (action === 'assign' && bidId && itemId) {
			await fetch('/api/bids/assign', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ bidId, itemId })
			});
		} else if (action === 'delete' && itemId) {
			await fetch('/api/items/' + itemId, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' }
			});
		}
		setRefresh(r => !r);
	};

	const userChars = characters.filter(c => c.userId === session?.user?.id);

	return (
		<Layout>
			<section className="min-h-screen flex flex-col items-center justify-start py-12">
				   {/* Character DKP balances styled as dashboard cards */}
				   <div className="flex flex-row flex-wrap gap-6 mb-10 w-full max-w-5xl justify-start">
					   {userChars.length > 0 ? (
						   userChars.map(char => (
							   <div key={char._id} className="bg-[#181a20] rounded-lg px-6 py-4 flex flex-col border border-[#23262d] min-w-[180px] max-w-xs" style={{marginTop: 8, marginBottom: 8, paddingTop: 16, paddingBottom: 16, paddingLeft: 16}}>
								   <span className="text-sm text-blue-200 font-semibold mb-2">Available DKP</span>
								   <span className="text-2xl font-extrabold text-white leading-tight">{char.dkp ?? 0}</span>
							   </div>
						   ))
					   ) : (
						   <div className="bg-[#181a20] rounded-lg px-6 py-4 flex flex-col border border-[#23262d] min-w-[180px] max-w-xs" style={{marginTop: 8, marginBottom: 8, paddingTop: 16, paddingBottom: 16, paddingLeft: 16}}>
							   <span className="text-sm text-blue-200 font-semibold mb-2">Available DKP</span>
							   <span className="text-2xl font-extrabold text-white leading-tight">0</span>
							   <span className="text-xs text-gray-400 mt-2">No character found</span>
						   </div>
					   )}
				   </div>
	<h1 className="text-3xl font-bold text-white mb-8">Guild Auction</h1>
				<div className="w-full max-w-6xl bg-[#23262d] rounded-xl shadow-lg p-4">
					<table className="w-full rounded-xl overflow-hidden">
						<thead>
							<tr className="bg-[#181a20] text-white">
								<th className="py-6 text-center font-semibold" style={{paddingTop: '1.25rem', paddingBottom: '1.25rem', paddingLeft: 0, paddingRight: 0}}>Name</th>
								<th className="py-6 text-center font-semibold" style={{paddingTop: '1.25rem', paddingBottom: '1.25rem', paddingLeft: 0, paddingRight: 0}}>Description</th>
								<th className="py-6 text-center font-semibold" style={{paddingTop: '1.25rem', paddingBottom: '1.25rem', paddingLeft: 0, paddingRight: 0}}>Time Left</th>
								<th className="py-6 text-center font-semibold" style={{paddingTop: '1.25rem', paddingBottom: '1.25rem', paddingLeft: 0, paddingRight: 0}}>Highest Bid</th>
								<th className="py-6 text-center font-semibold" style={{paddingTop: '1.25rem', paddingBottom: '1.25rem', paddingLeft: 0, paddingRight: 0}}>Min Bid</th>
								<th className="py-6 text-center font-semibold" style={{paddingTop: '1.25rem', paddingBottom: '1.25rem', paddingLeft: 0, paddingRight: 0}}>Increment</th>
								<th className="py-6 text-center font-semibold" style={{paddingTop: '1.25rem', paddingBottom: '1.25rem', paddingLeft: 0, paddingRight: 0}}>Winner</th>
								<th className="py-6 text-center font-semibold" style={{paddingTop: '1.25rem', paddingBottom: '1.25rem', paddingLeft: 0, paddingRight: 0}}>Bid</th>
								{session?.user?.isAdmin && <th className="py-6 text-center font-semibold" style={{paddingTop: '1.25rem', paddingBottom: '1.25rem', paddingLeft: 0, paddingRight: 0}}>Actions</th>}
							</tr>
						</thead>
						<tbody>
							{items.map((item) => (
								<BidTableRow
									key={item._id}
									item={item}
									bids={bids.filter((bid) => bid.itemId === item._id)}
									characters={characters}
									user={session?.user}
									onBidPlaced={handleBid}
									isAdmin={session?.user?.isAdmin}
									onDeleteItem={handleAssignOrDelete}
								/>
							))}
						</tbody>
					</table>
				</div>
			</section>
		</Layout>
	);
}
