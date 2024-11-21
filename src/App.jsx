import React from 'react';
import PublicHeader from './components/Public-Header.jsx';
import GlobalFooter from './components/Global-Footer.jsx';
import PublicSearchbar from './components/Public-Searchbar.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/app.css';

// Base of the react application
function App(){
    return (
        <div>
           <PublicHeader/>
           <main>
                <PublicSearchbar/>
                <hr></hr>
           </main>
           <GlobalFooter/>
        </div>
    );
};

export default App;

