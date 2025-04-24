export const mockUsers = [
  { id: 1, userName: "John Doe", email: "john@example.com", role: "Customer", status: "Active", joinDate: "2023-01-15" },
  { id: 2, userName: "Jane Smith", email: "jane@example.com", role: "Customer", status: "Active", joinDate: "2023-02-20" },
  { id: 3, userName: "Robert Johnson", email: "robert@example.com", role: "Admin", status: "Active", joinDate: "2022-11-05" },
  { id: 4, userName: "Sarah Williams", email: "sarah@example.com", role: "Customer", status: "Inactive", joinDate: "2023-03-10" },
  { id: 5, userName: "Michael Brown", email: "michael@example.com", role: "Customer", status: "Active", joinDate: "2023-04-25" },
];
export const mockProducts = [
  { id: 1, name: "Wireless Headphones", category: "Electronics", price: 89.99, stock: 45, status: "In Stock" },
  { id: 2, name: "Organic Cotton T-shirt", category: "Clothing", price: 24.99, stock: 120, status: "In Stock" },
  { id: 3, name: "Stainless Steel Water Bottle", category: "Accessories", price: 19.99, stock: 78, status: "In Stock" },
  { id: 4, name: "Smartphone Case", category: "Electronics", price: 14.99, stock: 0, status: "Out of Stock" },
  { id: 5, name: "Yoga Mat", category: "Fitness", price: 29.99, stock: 15, status: "Low Stock" },
];
export const mockOrders = [
  { id: 1001, customer: "John Doe", date: "2023-06-15", status: "Delivered", total: 114.98, items: 2 },
  { id: 1002, customer: "Jane Smith", date: "2023-06-16", status: "Processing", total: 49.98, items: 1 },
  { id: 1003, customer: "Sarah Williams", date: "2023-06-14", status: "Shipped", total: 134.97, items: 3 },
  { id: 1004, customer: "Michael Brown", date: "2023-06-17", status: "Pending", total: 89.99, items: 1 },
  { id: 1005, customer: "Robert Johnson", date: "2023-06-13", status: "Delivered", total: 44.98, items: 2 },
];
export const dashboardStats = {
  totalUsers: 1254,
  totalProducts: 532,
  totalOrders: 2876,
  revenue: 48750,
};