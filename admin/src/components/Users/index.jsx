import React, { useEffect, useState } from "react";
import {
	SearchIcon,
	PlusIcon,
	MoreHorizontalIcon,
	EditIcon,
	TrashIcon,
	X,
} from "lucide-react";
import "./style.css";

export const Users = () => {
	const [data, setData] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [expandedUserId, setExpandedUserId] = useState(null);
	const [formData, setFormData] = useState({
		name: "",
		address: "",
		phone: "",
		userName: "",
		email: "",
		password: "",
		role: "user",
	});
	const [showAddUserForm, setShowAddUserForm] = useState(false);
	const usersPerPage = 5;

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const res = await fetch("http://localhost:5173/api/users");
				if (!res.ok) throw new Error("Failed to fetch users");
				const data = await res.json();
				setData(data);
			} catch (err) {
				console.error("Error fetching users:", err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const filteredUsers = data.filter(
		(user) =>
			user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.email?.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
	const startIdx = (currentPage - 1) * usersPerPage;
	const currentUsers = filteredUsers.slice(startIdx, startIdx + usersPerPage);

	const toggleUserDetails = (id) => {
		setExpandedUserId((prevId) => (prevId === id ? null : id));
	};

	const handleAddUser = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch("http://localhost:5173/api/adduser", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			if (!response.ok) throw new Error("Failed to add user");
			const newUser = await response.json();
			setData((prev) => [...prev, newUser.user]);
			setShowAddUserForm(false);
			setFormData({
				name: "",
				address: "",
				phone: "",
				userName: "",
				email: "",
				password: "",
				role: "user",
			});
		} catch (err) {
			console.error("Error adding user:", err.message);
		}
	};

	return (
		<div className="users-table">
			<div className="header">
				<h1 className="title">Users</h1>
				<button
					className="add-user-btn"
					onClick={() => setShowAddUserForm(!showAddUserForm)}
				>
					<PlusIcon size={18} className="icon" />
					Add User
				</button>
			</div>

			{showAddUserForm && (
				<div className="add-user-form-overlay">
					<div className="add-user-form">
						<button
							className="close-btn"
							onClick={() => setShowAddUserForm(false)}
						>
							<X size={24} />
						</button>
						<h3>Add New User</h3>

						<form onSubmit={handleAddUser}>
							{["name", "address", "phone", "userName", "email", "password"].map((field) => (
								<label key={field}>
									{field.charAt(0).toUpperCase() + field.slice(1)}:
									<input
										type={field === "email" ? "email" : field === "password" ? "password" : "text"}
										value={formData[field]}
										onChange={(e) =>
											setFormData({ ...formData, [field]: e.target.value })
										}
										required
									/>
								</label>
							))}
							<label>
								Role:
								<select
									value={formData.role}
									onChange={(e) =>
										setFormData({ ...formData, role: e.target.value })
									}
									required
								>
									<option value="user">User</option>
									<option value="admin">Admin</option>
								</select>
							</label>
							<button type="submit">Add User</button>
						</form>
					</div>
				</div>
			)}

			<div className="table-container">
				<div className="products-search-bar">
					<div className="search-wrapper">
						<input
							type="text"
							placeholder="Search users..."
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
					<div className="loading">Loading users...</div>
				) : (
					<div className="table-wrapper">
						<table className="table">
							<thead>
								<tr>
									<th>User Name</th>
									<th>Phone</th>
									<th>Email</th>
									<th>Role</th>
								</tr>
							</thead>
							<tbody>
								{currentUsers.map((user) => {
									const isExpanded = expandedUserId === user.email;
									return (
										<React.Fragment key={user._id?.$oid}>
											<tr
												className="clickable"
												onClick={() => toggleUserDetails(user.email)}
											>
												<td>{user.userName}</td>
												<td>{user.phone}</td>
												<td>{user.email}</td>
												<td>{user.role}</td>
											</tr>
											{isExpanded && (
												<tr className="expanded-row">
													<td colSpan={4}>
														<div><strong>Name:</strong> {user.name}</div>
														<div><strong>Address:</strong> {user.address}</div>
														<div><strong>Password:</strong> {user.password}</div>
													</td>
												</tr>
											)}
										</React.Fragment>
									);
								})}
								{currentUsers.length === 0 && (
									<tr>
										<td colSpan={4} className="no-users">
											No users found
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				)}

				<div className="pagination">
					<div className="info">
						Showing <span>{startIdx + 1}</span> to{" "}
						<span>
							{Math.min(
								startIdx + usersPerPage,
								filteredUsers.length
							)}
						</span>{" "}
						of <span>{filteredUsers.length}</span> users
					</div>
					<div className="buttons">
						<button
							onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
							disabled={currentPage === 1}
						>
							Previous
						</button>
						<button
							onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
							disabled={currentPage === totalPages}
						>
							Next
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
