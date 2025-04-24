import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { MongoClient } from "mongodb";

const uri =
	"mongodb+srv://pujariniraj09:pujari.niraj999@db.sahsa.mongodb.net/?retryWrites=true&w=majority&appName=DB"; // Replace with your Mongo URI
const dbName = "aditya"; // Replace with your DB name

export default defineConfig({
	plugins: [
		react(),
		{
			name: "admin-api",
			configureServer(server) {
				const client = new MongoClient(uri);
				let db;

				client
					.connect()
					.then(() => {
						console.log("✅ MongoDB connected");
						db = client.db(dbName);
					})
					.catch((err) =>
						console.error("❌ MongoDB connection failed", err)
					);

				server.middlewares.use("/api/users", async (req, res) => {
					res.setHeader("Content-Type", "application/json");

					try {
						const users = await db
							.collection("users")
							.find({})
							.toArray();
						res.end(JSON.stringify(users));
					} catch (err) {
						res.statusCode = 500;
						res.end(
							JSON.stringify({
								error: "DB error",
								details: err.message,
							})
						);
					}
				});

				server.middlewares.use("/api/adduser", async (req, res) => {
					if (req.method === "POST") {
						let body = "";
						req.on("data", (chunk) => {
							body += chunk;
						});

						req.on("end", async () => {
							try {
								const user = JSON.parse(body); // Expecting the user data as JSON
								const result = await db
									.collection("users")
									.insertOne(user);

								res.statusCode = 201; // Created
								res.setHeader(
									"Content-Type",
									"application/json"
								);
								res.end(
									JSON.stringify({
										message: "User added successfully",
										user: result.ops[0],
									})
								);
							} catch (err) {
								res.statusCode = 500;
								res.end(
									JSON.stringify({
										error: "DB error",
										details: err.message,
									})
								);
							}
						});
					} else {
						res.statusCode = 405; // Method Not Allowed
						res.end(
							JSON.stringify({
								error: "Invalid method. Use POST to add a user.",
							})
						);
					}
				});

				server.middlewares.use("/api/buyproducts", async (req, res) => {
					res.setHeader("Content-Type", "application/json");

					try {
						const buyproducts = await db
							.collection("buyproducts")
							.find({})
							.toArray();
						res.end(JSON.stringify(buyproducts));
					} catch (err) {
						res.statusCode = 500;
						res.end(
							JSON.stringify({
								error: "DB error",
								details: err.message,
							})
						);
					}
				});

				server.middlewares.use("/api/products", async (req, res) => {
					res.setHeader("Content-Type", "application/json");

					try {
						const products = await db
							.collection("products")
							.find({})
							.toArray();
						res.end(JSON.stringify(products));
					} catch (err) {
						res.statusCode = 500;
						res.end(
							JSON.stringify({
								error: "DB error",
								details: err.message,
							})
						);
					}
				});

				server.middlewares.use("/api/addproduct", async (req, res) => {
					if (req.method === "POST") {
						let body = "";
						req.on("data", (chunk) => {
							body += chunk;
						});

						req.on("end", async () => {
							try {
								const product = JSON.parse(body); // Expecting the product data as JSON
								const result = await db
									.collection("products")
									.insertOne(product);

								res.statusCode = 201; // Created
								res.setHeader(
									"Content-Type",
									"application/json"
								);
								res.end(
									JSON.stringify({
										message: "Product added successfully",
										product: {
											...product,
											_id: result.insertedId,
										},
									})
								);
							} catch (err) {
								res.statusCode = 500;
								res.end(
									JSON.stringify({
										error: "DB error",
										details: err.message,
									})
								);
							}
						});
					} else {
						res.statusCode = 405; // Method Not Allowed
						res.end(
							JSON.stringify({
								error: "Invalid method. Use POST to add a product.",
							})
						);
					}
				});

				server.middlewares.use("/api/products", async (req, res) => {
					res.setHeader("Content-Type", "application/json");

					try {
						const products = await db
							.collection("products")
							.find({})
							.toArray();
						res.end(JSON.stringify(products));
					} catch (err) {
						res.statusCode = 500;
						res.end(
							JSON.stringify({
								error: "DB error",
								details: err.message,
							})
						);
					}
				});

				server.middlewares.use("/api/addproduct", async (req, res) => {
					if (req.method === "POST") {
						let body = "";
						req.on("data", (chunk) => {
							body += chunk;
						});

						req.on("end", async () => {
							try {
								const product = JSON.parse(body); // Expecting the product data as JSON
								const result = await db
									.collection("products")
									.insertOne(product);

								res.statusCode = 201; // Created
								res.setHeader(
									"Content-Type",
									"application/json"
								);
								res.end(
									JSON.stringify({
										message: "Product added successfully",
										product: {
											...product,
											_id: result.insertedId,
										},
									})
								);
							} catch (err) {
								res.statusCode = 500;
								res.end(
									JSON.stringify({
										error: "DB error",
										details: err.message,
									})
								);
							}
						});
					} else {
						res.statusCode = 405; // Method Not Allowed
						res.end(
							JSON.stringify({
								error: "Invalid method. Use POST to add a product.",
							})
						);
					}
				});

				// Delete product by email
				server.middlewares.use(
					"/api/deleteproduct",
					async (req, res) => {
						if (req.method === "POST") {
							let body = "";
							req.on("data", (chunk) => {
								body += chunk;
							});

							req.on("end", async () => {
								try {
									const { id } = JSON.parse(body);

									if (!id) {
										res.statusCode = 400;
										res.end(
											JSON.stringify({
												error: "Email is required to delete product.",
											})
										);
										return;
									}

									const result = await db
										.collection("products")
										.deleteOne({ name:id });

									if (result.deletedCount === 0) {
										res.statusCode = 404;
										res.end(
											JSON.stringify({
												error: "Product with given email not found.",
											})
										);
										return;
									}

									res.statusCode = 200; // OK
									res.end(
										JSON.stringify({
											message:
												"Product deleted successfully.",
										})
									);
								} catch (err) {
									res.statusCode = 500;
									res.end(
										JSON.stringify({
											error: "DB error",
											details: err.message,
										})
									);
								}
							});
						} else {
							res.statusCode = 405; // Method Not Allowed
							res.end(
								JSON.stringify({
									error: "Invalid method. Use POST to delete a product.",
								})
							);
						}
					}
				);

				// Update product by email
				server.middlewares.use("/api/updateproduct", async (req, res) => {
					if (req.method === "POST") {
						let body = "";
						req.on("data", (chunk) => {
							body += chunk;
						});
				
						req.on("end", async () => {
							try {
								const { id, updateData } = JSON.parse(body);
								console.log(id, updateData)
				
								if (!id || !updateData) {
									res.statusCode = 400;
									res.end(JSON.stringify({ error: "Name and updateData are required." }));
									return;
								}
								
								console.log(await db
									.collection("products")
									.find({})
									.toArray())
									const result = await db.collection("products").findOneAndUpdate(
										{ name: id.trim() },  // Trim whitespace just in case
										{ $set: updateData },
										{ returnDocument: "after" }
									);
				
								if (!result.value) {
									res.statusCode = 404;
									res.end(JSON.stringify({ error: "Product with given name not found." }));
									return;
								}
				
								res.statusCode = 200;
								res.setHeader("Content-Type", "application/json");
								res.end(JSON.stringify(result.value)); // Return updated product
							} catch (err) {
								res.statusCode = 500;
								res.end(JSON.stringify({ error: "DB error", details: err.message }));
							}
						});
					} else {
						res.statusCode = 405;
						res.end(JSON.stringify({ error: "Use POST to update a product." }));
					}
				});
				

				server.middlewares.use("/api/payments", async (req, res) => {
					res.setHeader("Content-Type", "application/json");

					try {
						const payments = await db
							.collection("payments")
							.find({})
							.toArray();
						res.end(JSON.stringify(payments));
					} catch (err) {
						res.statusCode = 500;
						res.end(
							JSON.stringify({
								error: "DB error",
								details: err.message,
							})
						);
					}
				});
			},
		},
	],
});
