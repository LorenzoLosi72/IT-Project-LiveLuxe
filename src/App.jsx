// // Import packages, libraries and stylesheets
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicHeader from './components/Public-Header.jsx';
import GlobalFooter from './components/Global-Footer.jsx';
import PublicSearchbar from './components/Public-Searchbar.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/app.css';
import Login from './components/Login.jsx';
import HostRegistration from './components/Host-Registration.jsx';

// Base of the react application
function App(){
    return (
        <Router>
            <div className="d-flex flex-column min-vh-100">
                <PublicHeader/>
                <main className="flex-fill">
                    <PublicSearchbar/>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/host-registration" element={<HostRegistration />} />
                        {}
                    </Routes>
                </main>
                <GlobalFooter/>
            </div>
        </Router>
    );
};

export default App;
