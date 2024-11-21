import React, { useState } from 'react';
import '../css/public-searchbar.css';

const PublicSearchbar = () => {
    //states for input fields
    const [destination, setDestination] = useState("");
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guestsNumber, setGuestsNumber] = useState("");

    //function for managing form submission
    const handleSubmit = (e) => {
        e.preventDefault(); //page refresh prevention
        console.log({destination, checkIn, checkOut, guestsNumber});
    }

    return(
        <div className="searchbar-wrapper">
            <form onSubmit={handleSubmit} className="container">
                <div className="row align-items-center g-3">
                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Destination"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            required
                        />
                    </div>
                    <div className="col-md-2">
                        <input
                            type="date"
                            className="form-control"
                            placeholder="Check-in"
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                            required
                        />
                    </div>
                    <div className="col-md-2">
                        <input
                            type="date"
                            className="form-control"
                            placeholder="Check-out"
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.target.value)}
                            required
                        />
                    </div>
                    <div className="col-md-2">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Who"
                            value={guestsNumber}
                            onChange={(e) => setGuestsNumber(e.target.value)}
                            required
                            min="1"
                            max="20"
                        />
                    </div>
                    <div className="col-md-2">
                        <button type="submit" className="btn btn-primary w-100">search</button>
                    </div>
                </div>
            </form>
        </div>
    )
};

export default PublicSearchbar;
