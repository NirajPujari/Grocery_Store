import React, { useEffect, useState } from "react";
import {
	SearchIcon,
	EyeIcon,
	MoreHorizontalIcon,
	EditIcon,
	TrashIcon,
} from "lucide-react";
import "./style.css";

const ITEMS_PER_PAGE = 5;

export const Orders = () => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);

	const filteredOrders = data.filter(
		(order) =>
			order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
			order.id.toString().includes(searchTerm)
	);

	const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const currentItems = filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);

				const res1 = await fetch("http://localhost:5173/api/payments");
				const res2 = await fetch("http://localhost:5173/api/buyproducts");

				if (!res1.ok || !res2.ok) {
					throw new Error("Failed to fetch data");
				}

				const payments = await res1.json();
				const buyproducts = await res2.json();

				const ordersMap = {};

				buyproducts.forEach((item) => {
					const pid = item.paymentid;

					if (!ordersMap[pid]) {
						ordersMap[pid] = {
							id: pid,
							customer: "",
							date: item.date || "",
							status: item.status || "Pending",
							total: 0,
							items: 0,
						};
					}

					ordersMap[pid].total += item.price;
					ordersMap[pid].items += 1;
				});

				payments.forEach((pay) => {
					const pid = pay._id?.$oid || pay._id;
					if (ordersMap[pid]) {
						ordersMap[pid].customer = pay.cardHolderName;
						const totalFromPay = parseFloat(pay.total);
						if (!isNaN(totalFromPay)) {
							ordersMap[pid].total = totalFromPay;
						}
					}
				});

				const finalOrders = Object.values(ordersMap).map((order) => ({
					...order,
					total: parseFloat(order.total.toFixed(2)),
				}));

				setData(finalOrders);
			} catch (err) {
				console.error("Error fetching orders:", err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const handlePrevious = () => {
		setCurrentPage((prev) => Math.max(prev - 1, 1));
	};

	const handleNext = () => {
		setCurrentPage((prev) => Math.min(prev + 1, totalPages));
	};

	return (
		<div>
			<div className="orders-header">
				<h1 className="orders-title">Orders</h1>
			</div>

			<div className="orders-table-container">
				<div className="orders-search-bar">
					<div className="search-wrapper">
						<input
							type="text"
							placeholder="Search orders by ID or customer name..."
							className="search-input"
							value={searchTerm}
							onChange={(e) => {
								setSearchTerm(e.target.value);
								setCurrentPage(1);
							}}
						/>
						<SearchIcon size={18} className="search-icon" />
					</div>
				</div>

				{loading ? (
					<div className="loading">Loading orders...</div>
				) : (
					<>
						<div className="table-scroll">
							<table className="orders-table">
								<thead>
									<tr>
										<th className="table-header">Order ID</th>
										<th className="table-header">Customer</th>
										<th className="table-header">Date</th>
										<th className="table-header">Status</th>
										<th className="table-header">Items</th>
										<th className="table-header">Total</th>
										<th className="table-header actions-column">
											Actions
										</th>
									</tr>
								</thead>
								<tbody className="orders-table-body">
									{currentItems.map((order) => (
										<tr key={order.id} className="table-row">
											<td className="order-id">#{order.id}</td>
											<td className="order-customer">{order.customer}</td>
											<td className="order-date">{order.date}</td>
											<td>
												<span
													className={`status-badge ${order.status.toLowerCase()}`}
												>
													{order.status}
												</span>
											</td>
											<td className="order-items">{order.items}</td>
											<td className="order-total">${order.total.toFixed(2)}</td>
											<td className="actions-column">
												<div className="dropdown">
													<button className="dropdown-btn">
														<MoreHorizontalIcon size={18} />
													</button>
													<div className="dropdown-menu">
														<button className="dropdown-item view-details">
															<EyeIcon size={16} className="icon" />
															View Details
														</button>
														<button className="dropdown-item edit">
															<EditIcon size={16} className="icon" />
															Edit
														</button>
														<button className="dropdown-item cancel">
															<TrashIcon size={16} className="icon" />
															Cancel
														</button>
													</div>
												</div>
											</td>
										</tr>
									))}
									{currentItems.length === 0 && (
										<tr>
											<td colSpan={7} className="no-results">
												No orders found
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>

						<div className="pagination-container">
							<div className="pagination-info">
								Showing <span>{startIndex + 1}</span> to{" "}
								<span>{startIndex + currentItems.length}</span> of{" "}
								<span>{filteredOrders.length}</span> orders
							</div>
							<div className="pagination-buttons">
								<button className="pagination-btn" onClick={handlePrevious} disabled={currentPage === 1}>
									Previous
								</button>
								<button className="pagination-btn" onClick={handleNext} disabled={currentPage === totalPages || totalPages === 0}>
									Next
								</button>
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
};
