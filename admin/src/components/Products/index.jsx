import React, { useEffect, useState, useRef } from "react";
import { SearchIcon, PlusIcon, X } from "lucide-react";
import "./style.css";

const ITEMS_PER_PAGE = 5;

export const Products = () => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [showAddProductForm, setShowAddProductForm] = useState(false);
	const [contextMenu, setContextMenu] = useState(null);
	const [editingProduct, setEditingProduct] = useState(null);

	const contextMenuRef = useRef(null);

	const [productForm, setProductForm] = useState({
		name: "",
		imgUrl: "",
		category: "",
		text: "",
		price: "",
		stock: "",
	});

	const filteredProducts = data.filter(
		(product) =>
			product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			product.category.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const currentItems = filteredProducts.slice(
		startIndex,
		startIndex + ITEMS_PER_PAGE
	);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const res = await fetch("http://localhost:5173/api/products");
				const products = await res.json();
				const newData = products.map((p) => ({
					...p,
					status:
						p.stock === 0
							? "Out of Stock"
							: p.stock < 10
							? "Low Stock"
							: "In Stock",
				}));
				setData(newData);
			} catch (err) {
				console.error("Fetch error:", err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchData();

		const handleClickOutside = (e) => {
			if (
				contextMenuRef.current &&
				!contextMenuRef.current.contains(e.target)
			) {
				setContextMenu(null);
			}
		};

		document.addEventListener("click", handleClickOutside);
		return () => document.removeEventListener("click", handleClickOutside);
	}, []);

	const handleContextMenu = (e, product) => {
		e.preventDefault();
		setContextMenu({
			visible: true,
			x: e.pageX,
			y: e.pageY,
			product,
		});
	};

	const handleEditClick = (product) => {
		setEditingProduct(product);
		setProductForm({ ...product });
		setContextMenu(null);
	};

	const handleDeleteClick = async (product) => {
    console.log('Delete:', product);
    setContextMenu(null);
  
    try {
      const response = await fetch(`http://localhost:5173/api/deleteproduct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: product._id }), // Send only email
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Delete failed');
      }
  
      // Remove product from UI list
      setData((prev) => prev.filter((p) => p.email !== product.email));
  
      console.log('Product deleted successfully');
    } catch (err) {
      console.error('Delete error:', err.message);
    }
  };
  

	const handleEditSubmit = async (e) => {
		e.preventDefault();
    console.log(productForm.name, )
		try {
      const response = await fetch(
        `http://localhost:5173/api/updateproduct`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						id: productForm.name,
						updateData: productForm,
					}),
				}
			);
      console.log(1 )

			if (!response.ok) throw new Error("Update failed");

			const updated = await response.json();
			setData((prev) =>
				prev.map((p) =>
					p.name === updated.name
						? {
								...updated,
								status:
									updated.stock === 0
										? "Out of Stock"
										: updated.stock < 10
										? "Low Stock"
										: "In Stock",
						  }
						: p
				)
			);
			setEditingProduct(null);
		} catch (err) {
			console.error("Edit error:", err.message);
		}
	};

	return (
		<div>
			<div className="products-header">
				<h1 className="products-title">Products</h1>
				<button
					className="add-product-btn"
					onClick={() => setShowAddProductForm(!showAddProductForm)}
				>
					<PlusIcon size={18} className="icon" />
					Add Product
				</button>
			</div>

			<div className="products-table-container">
				<div className="products-search-bar">
					<div className="search-wrapper">
						<input
							type="text"
							placeholder="Search products..."
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
					<div className="loading">Loading products...</div>
				) : (
					<>
						<div className="table-scroll">
							<table className="products-table">
								<thead>
									<tr>
										<th>Product</th>
										<th>Category</th>
										<th>Price</th>
										<th>Stock</th>
										<th>Status</th>
									</tr>
								</thead>
								<tbody>
									{currentItems.map((product) => (
										<tr
											key={product._id?.$oid}
											onContextMenu={(e) =>
												handleContextMenu(e, product)
											}
										>
											<td>
												<div className="product-cell">
													<div className="product-avatar">
														<span>
															{product.name.charAt(
																0
															)}
														</span>
													</div>
													<div className="product-name">
														{product.name}
													</div>
												</div>
											</td>
											<td>{product.category}</td>
											<td>${product.price.toFixed(2)}</td>
											<td>{product.stock}</td>
											<td>
												<span
													className={`status-badge ${
														product.status ===
														"In Stock"
															? "status-green"
															: product.status ===
															  "Low Stock"
															? "status-yellow"
															: "status-red"
													}`}
												>
													{product.status}
												</span>
											</td>
										</tr>
									))}
									{currentItems.length === 0 && (
										<tr>
											<td
												colSpan={5}
												className="no-results"
											>
												No products found
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>

						<div className="pagination-container">
							<div className="pagination-info">
								Showing <span>{startIndex + 1}</span> to{" "}
								<span>{startIndex + currentItems.length}</span>{" "}
								of <span>{filteredProducts.length}</span>{" "}
								products
							</div>
							<div className="pagination-buttons">
								<button
									onClick={() =>
										setCurrentPage((p) =>
											Math.max(p - 1, 1)
										)
									}
									disabled={currentPage === 1}
								>
									Previous
								</button>
								<button
									onClick={() =>
										setCurrentPage((p) =>
											Math.min(p + 1, totalPages)
										)
									}
									disabled={
										currentPage === totalPages ||
										totalPages === 0
									}
								>
									Next
								</button>
							</div>
						</div>
					</>
				)}
			</div>

			{/* Context Menu */}
			{contextMenu?.visible && (
				<div
					ref={contextMenuRef}
					className="context-menu"
					style={{
						top: contextMenu.y,
						left: contextMenu.x,
						position: "absolute",
					}}
				>
					<div
						className="context-item"
						onClick={() => handleEditClick(contextMenu.product)}
					>
						Edit
					</div>
					<div
						className="context-item"
						onClick={() => handleDeleteClick(contextMenu.product)}
					>
						Delete
					</div>
				</div>
			)}

			{/* Edit Modal */}
			{editingProduct && (
				<div className="edit-modal-overlay">
					<div className="edit-modal">
						<button
							className="close-btn"
							onClick={() => setEditingProduct(null)}
						>
							<X size={24} />
						</button>
						<h3>Edit Product</h3>
						<form onSubmit={handleEditSubmit}>
							{[
								"imgUrl",
								"category",
								"text",
								"price",
								"stock",
							].map((field) => (
								<label key={field}>
									{field.charAt(0).toUpperCase() +
										field.slice(1)}
									:
									<input
										type={
											field === "price" ||
											field === "stock"
												? "number"
												: "text"
										}
										value={productForm[field]}
										onChange={(e) =>
											setProductForm({
												...productForm,
												[field]: e.target.value,
											})
										}
										required
									/>
								</label>
							))}
							<button type="submit">Update Product</button>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};
