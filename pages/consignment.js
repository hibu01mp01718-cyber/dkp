export default function ConsignmentPage() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [items, setItems] = useState([]);
	const [newItem, setNewItem] = useState({
		name: '',
		description: '',
		duration: 60, // in minutes, default 60
		minBid: 1,
		increment: 1
	});
	const [refresh, setRefresh] = useState(false);



	useEffect(() => {
		if (status === 'loading') return;
		if (session && !session.user.isAdmin) {
			router.replace('/');
		}
	}, [session, status, router]);

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
			<section className={styles.pageSection + ' min-h-screen bg-black text-white'} style={{userSelect: 'none'}}>
				<h1 className="text-3xl font-bold mb-8">Consignment</h1>
					 <form onSubmit={handleAddItem} className={adminEventStyles.adminEventsSection} style={{maxWidth: 700, margin: '0 auto', marginBottom: '2rem'}}>
							 <div className="flex flex-col gap-4">
									 <input
											 name="name"
											 value={newItem.name}
											 onChange={handleInputChange}
											 placeholder="Item Name"
											 className={adminEventStyles.adminEventInput}
											 required
									 />
									 <input
											 name="description"
											 value={newItem.description}
											 onChange={handleInputChange}
											 placeholder="Description (optional)"
											 className={adminEventStyles.adminEventInput}
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
															 className={adminEventStyles.adminEventInput}
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
															 className={adminEventStyles.adminEventInput}
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
															 className={adminEventStyles.adminEventInput}
															 required
													 />
											 </div>
									 </div>
									 <button type="submit" className={adminEventStyles.adminEventInput + ' bg-blue-700 hover:bg-blue-800 text-white font-semibold cursor-pointer'} style={{marginTop: '1rem', width: '100%'}}>Add Item</button>
							 </div>
					 </form>
				   <div className="w-full max-w-4xl mx-auto mt-8">
					   <table className="w-full rounded-xl overflow-hidden bg-[#23262d] text-white shadow-lg">
						   <thead>
							   <tr className="bg-[#181a20] text-white">
								   <th className="py-4 px-4 text-center font-semibold">Name</th>
								   <th className="py-4 px-4 text-center font-semibold">Description</th>
								   <th className="py-4 px-4 text-center font-semibold">Duration (min)</th>
								   <th className="py-4 px-4 text-center font-semibold">Min Bid</th>
								   <th className="py-4 px-4 text-center font-semibold">Increment</th>
								   <th className="py-4 px-4 text-center font-semibold">Actions</th>
							   </tr>
						   </thead>
						   <tbody>
							   {items.length === 0 ? (
								   <tr>
									   <td colSpan={6} className="text-center py-8 text-gray-400">No items found.</td>
								   </tr>
							   ) : (
								   items.map(item => (
									   <tr key={item._id} className="border-b border-[#23262d] hover:bg-[#23262d]/80 transition-colors">
										   <td className="py-3 px-4 text-center align-middle font-medium">{item.name}</td>
										   <td className="py-3 px-4 text-center align-middle text-gray-300">{item.description}</td>
										   <td className="py-3 px-4 text-center align-middle">{item.duration ?? '-'}</td>
										   <td className="py-3 px-4 text-center align-middle">{item.minBid ?? 1}</td>
										   <td className="py-3 px-4 text-center align-middle">{item.increment ?? 1}</td>
										   <td className="py-3 px-4 text-center align-middle">
											   <button
												   type="button"
												   tabIndex={-1}
												   onClick={() => {
													   if (window.confirm('Are you sure you want to delete this item?')) {
														   handleDelete(item._id);
													   }
												   }}
												   className={styles.formButton + ' bg-red-600 hover:bg-red-700 select-none'}
												   style={{
													   padding: '0.5rem 1.2rem',
													   fontSize: '0.95rem',
													   borderRadius: 8,
													   fontWeight: 600,
													   userSelect: 'none',
													   cursor: 'pointer',
													   boxShadow: '0 1px 4px 0 rgba(0,0,0,0.10)',
													   outline: 'none',
													   border: 'none',
													   transition: 'background 0.2s, box-shadow 0.2s',
												   }}
												   onMouseOver={e => e.currentTarget.style.boxShadow = '0 2px 8px 0 rgba(255,0,0,0.15)'}
												   onMouseOut={e => e.currentTarget.style.boxShadow = '0 1px 4px 0 rgba(0,0,0,0.10)'}
											   >
												   Delete
											   </button>
										   </td>
									   </tr>
								   ))
							   )}
						   </tbody>
					   </table>
				   </div>
			</section>
		</Layout>
	);
}
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import styles from '../components/PageSection.module.css';
import adminEventStyles from '../components/AdminEvents.module.css';
