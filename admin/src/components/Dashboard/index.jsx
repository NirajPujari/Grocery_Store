import React, { useEffect, useState } from "react";
import { dashboardStats } from "../mockData";
import {
	UsersIcon,
	ShoppingBagIcon,
	PackageIcon,
	TrendingUpIcon,
} from "lucide-react";
import "./style.css";

export const Dashboard = () => {
	const [data, setData] = useState(dashboardStats);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			const newData = {};
			try {
				setLoading(true);

				const user = await fetch("http://localhost:5173/api/users");
				if (!user.ok) throw new Error("Failed to fetch users");
				const dataUser = await user.json();
				newData["totalUsers"] = dataUser.length;

				const product = await fetch(
					"http://localhost:5173/api/products"
				);
				if (!product.ok) throw new Error("Failed to fetch product");
				const dataProduct = await product.json();
				newData["totalProducts"] = dataProduct.length;

				const order = await fetch(
					"http://localhost:5173/api/buyproducts"
				);
				if (!order.ok) throw new Error("Failed to fetch order");
				const dataOrder = await order.json();
				newData["totalOrders"] = dataOrder.length;

				let totalAmount = 0;
				const revenue = await fetch(
					"http://localhost:5173/api/payments"
				);
				if (!revenue.ok) throw new Error("Failed to fetch revenue");
				const dataRevenue = await revenue.json();
				dataRevenue.forEach((payment) => {
					const total = parseFloat(payment.total);
					if (!isNaN(total)) {
						totalAmount += total;
					}
				});

				newData["revenue"] = totalAmount;
				console.log(newData);

				setData(newData);
			} catch (err) {
				console.error("Error fetching dashboard stats:", err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	if (loading) {
		return (
			<div className="dashboardContainer">
				<h1 className="dashboardTitle">Dashboard Overview</h1>
				<div className="loader-container">
					<div className="loader"></div>
				</div>
			</div>
		);
	}

	return (
		<div className="dashboardContainer">
			<h1 className="dashboardTitle">Dashboard Overview</h1>
			<div className="statGrid">
				<StatCard
					title="Total Users"
					value={data.totalUsers}
					icon={<UsersIcon size={24} className="iconBlue" />}
				/>
				<StatCard
					title="Total Products"
					value={data.totalProducts}
					icon={<ShoppingBagIcon size={24} className="iconGreen" />}
				/>
				<StatCard
					title="Total Orders"
					value={data.totalOrders}
					icon={<PackageIcon size={24} className="iconPurple" />}
				/>
				<StatCard
					title="Revenue (Month)"
					value={`$${data.revenue.toLocaleString()}`}
					icon={<TrendingUpIcon size={24} className="iconRed" />}
				/>
			</div>
			<div className="activityCard">
				<h2 className="activityTitle">Recent Activity</h2>
				<div className="activityList">
					<ActivityItem
						title="New order #1005"
						description="Order placed by Robert Johnson"
						time="10 minutes ago"
					/>
					<ActivityItem
						title="Product stock update"
						description="Wireless Headphones stock changed to 45"
						time="1 hour ago"
					/>
					<ActivityItem
						title="New user registered"
						description="Michael Brown created an account"
						time="2 hours ago"
					/>
					<ActivityItem
						title="Order #1002 status changed"
						description="Order status updated to Processing"
						time="3 hours ago"
					/>
					<ActivityItem
						title="Low stock alert"
						description="Yoga Mat is now low in stock (15 remaining)"
						time="5 hours ago"
					/>
				</div>
			</div>
		</div>
	);
};

const StatCard = ({ title, value, icon }) => {
	return (
		<div className="statCard">
			<div className="statHeader">
				<h3 className="statTitle">{title}</h3>
				{icon}
			</div>
			<div className="statContent">
				<span className="statValue">{value}</span>
			</div>
		</div>
	);
};

const ActivityItem = ({ title, description, time }) => {
	return (
		<div className="activityItem">
			<div className="activityDot"></div>
			<div className="activityText">
				<h4 className="activityItemTitle">{title}</h4>
				<p className="activityDescription">{description}</p>
			</div>
			<span className="activityTime">{time}</span>
		</div>
	);
};
