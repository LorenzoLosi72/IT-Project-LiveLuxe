import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LiveLuxeHeader from './components/Header-Public.jsx';
import LiveLuxeFooter from './components/Footer.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/app.css';
import Login from './components/Login.jsx';
import Signup from './components/Sign-Up.jsx';




// Base of the react application
function App(){
    return (
        <Router>
            <div className="d-flex flex-column min-vh-100">
                <LiveLuxeHeader/>
                <main className="flex-fill">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        {}
                    </Routes>
                </main>
                <LiveLuxeFooter/>
            </div>
        </Router>
    );
};

export default App;
