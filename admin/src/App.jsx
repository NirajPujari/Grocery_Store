import React, { useState } from "react";
import { AdminLayout } from "./components/Layout/";
import { Dashboard } from "./components/Dashboard";
import { Users } from "./components/Users";
import { Products } from "./components/Products";
import { Orders } from "./components/Orders";
// import { Temp } from "./api";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function App() {
	const [currentView, setCurrentView] = useState("dashboard");
	const renderContent = () => {
		switch (currentView) {
			case "dashboard":
				return <Dashboard />;
			case "users":
				return <Users />;
			case "products":
				return <Products />;
			case "orders":
				return <Orders />;
			default:
				return <Dashboard />;
		}
	};

	return (
		<Router>
			<Routes>
				<Route
					path="/"
					element={
						<AdminLayout
							currentView={currentView}
							setCurrentView={setCurrentView}
						>
							{renderContent()}
						</AdminLayout>
					}
				/>
				{/* <Route path="/api" element={<Temp />} /> */}
			</Routes>
		</Router>
	);
}
