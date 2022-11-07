import React from "react";
import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import LandingPage from "./components/LandingPage/LandingPage";

const App: React.FC = () => {
	return (
		<div className='App'>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<LandingPage />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
};

export default App;
