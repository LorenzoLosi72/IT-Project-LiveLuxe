import React from 'react';
import LiveLuxeHeader from './components/Header-Public.jsx';
import LiveLuxeFooter from './components/Footer.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/app.css';

// Base of the react application
function App(){
    return (
        <div>
           <LiveLuxeHeader/>
           <main></main>
           <LiveLuxeFooter/>
        </div>
    );
};

export default App;

