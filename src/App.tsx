import { HashRouter as Router, Navigate, Route, Routes } from 'react-router';

import Games from './pages/Games';
import Game from './pages/Game';
import { useBreakpoint } from './hooks/breakpoint';


export default function App() {

    useBreakpoint();

    return (
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
    )
}