import Layout from '../components/Layout';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import styles from '../components/PageSection.module.css';

export default function ConsignmentPage() {
	const { data: session } = useSession();
	const [items, setItems] = useState([]);
	const [newItem, setNewItem] = useState({
		name: '',
		description: '',
		duration: 60, // in minutes, default 60
		minBid: 1,
		increment: 1
	});
	const [refresh, setRefresh] = useState(false);

	// Only allow admin (after all hooks)
	if (session && !session.user.isAdmin) {
		return (
			<Layout>
				<section className={styles.pageSection + ' min-h-screen bg-black text-white flex items-center justify-center'}>
					<div className="text-xl">Access Denied</div>
				</section>
			</Layout>
		);
	}

	useEffect(() => {
		if (!session) return;
		fetch('/api/items')
			.then(res => res.json())
			.then(setItems);
	}, [session, refresh]);

	const handleInputChange = e => {
		const { name, value, type } = e.target;
		setNewItem({
			...newItem,
			[name]: type === 'number' ? Number(value) : value
		});
	};

	const handleAddItem = async e => {
		e.preventDefault();
		if (!newItem.name) return;
		try {
			const now = new Date();
			const endTime = new Date(now.getTime() + (newItem.duration || 60) * 60000); // duration in minutes
			const itemToSend = {
				...newItem,
				endTime: endTime.toISOString(),
			};
			const res = await fetch('/api/items', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(itemToSend)
			});
			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				alert('Failed to add item: ' + (data.error || res.statusText));
				return;
			}
			setNewItem({ name: '', description: '', duration: 60, minBid: 1, increment: 1 });
			setRefresh(r => !r);
		} catch (err) {
			alert('Failed to add item: ' + err.message);
		}
	};

	const handleDelete = async (itemId) => {
		try {
			const res = await fetch('/api/items/' + itemId, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' }
			});
			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				alert('Failed to delete item: ' + (data.error || res.statusText));
				return;
			}
			setRefresh(r => !r);
		} catch (err) {
			alert('Failed to delete item: ' + err.message);
		}
	};

	return (
		<Layout>
			<section className={styles.pageSection + ' min-h-screen bg-black text-white'}>
				<h1 className="text-3xl font-bold mb-8">Consignment</h1>
				<form onSubmit={handleAddItem} className="bg-gray-900 rounded-xl p-6 mb-8 flex flex-col gap-4 max-w-md">
					<input
						name="name"
						value={newItem.name}
						onChange={handleInputChange}
						placeholder="Item Name"
						className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2"
						required
					/>
					<input
						name="description"
						value={newItem.description}
						onChange={handleInputChange}
						placeholder="Description (optional)"
						className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2"
					/>
					<div className="flex gap-2">
						<div className="flex-1">
							<label className="block text-sm mb-1">Bidding Duration (minutes)</label>
							<input
								type="number"
								name="duration"
								value={newItem.duration}
								onChange={handleInputChange}
								min={1}
								className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 w-full"
								required
							/>
						</div>
						<div className="flex-1">
							<label className="block text-sm mb-1">Minimum Bid</label>
							<input
								type="number"
								name="minBid"
								value={newItem.minBid}
								onChange={handleInputChange}
								min={1}
								className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 w-full"
								required
							/>
						</div>
						<div className="flex-1">
							<label className="block text-sm mb-1">Bid Increment</label>
							<input
								type="number"
								name="increment"
								value={newItem.increment}
								onChange={handleInputChange}
								min={1}
								className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 w-full"
								required
							/>
						</div>
					</div>
					<button type="submit" className="bg-blue-700 text-white rounded px-4 py-2 mt-2">Add Item</button>
				</form>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{items.map(item => (
						<div key={item._id} className="bg-gray-900 rounded-xl p-4 flex flex-col gap-2 border border-gray-800">
							{item.image && <img src={item.image} alt={item.name} className="rounded mb-2 h-20 object-cover w-full" />}
							<div className="font-bold text-lg">{item.name}</div>
							<div className="text-gray-400 text-sm mb-2">{item.description}</div>
							<button onClick={() => handleDelete(item._id)} className="bg-red-700 text-white rounded px-3 py-1 mt-auto">Delete</button>
						</div>
					))}
				</div>
			</section>
		</Layout>
	);
}
