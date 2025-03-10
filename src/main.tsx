import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter as Router, Navigate, Route, Routes } from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import Games from './pages/Games';
import Game from './pages/Game.tsx';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Router>
			<Routes>
				<Route 
					path="/"
					element={<Navigate 
						replace
						to="/games"
					/>}
				/>
				<Route 
					element={<Games />}
					path='/games' 
				>
					<Route path=":id" element={<Game />} />
				</Route>
			</Routes>
		</Router>
	</StrictMode>,
)
