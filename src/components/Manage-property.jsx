import React, { useEffect, useState, useContext } from "react"; 
import axios from "axios";
import { AuthContext } from "../Auth-Context";
import { useParams, useNavigate } from "react-router-dom";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import enUS from 'date-fns/locale/en-US';
import { Carousel, Row, Col } from "react-bootstrap";
import { FaMapMarkerAlt, FaUserFriends, FaBed, FaUtensils, FaWifi, FaSwimmer, FaCar, FaSnowflake } from "react-icons/fa";
import "../css/house-description.css";

const ManageProperty = () => {
     const { id } = useParams();
     const navigate = useNavigate();
     const { isLoggedIn } = useContext(AuthContext);
     const [house, setHouse] = useState(null);
     const [loading, setLoading] = useState(true);
     const [arrivalDate, setArrivalDate] = useState(null);
     const [departureDate, setDepartureDate] = useState(null);
     const [errorMessage, setErrorMessage] = useState("");
 
     const today = new Date();
 
     useEffect(() => {
         const fetchHouseDetails = async () => {
             try {
                 const response = await axios.get(`http://localhost:3001/api/house/${id}`);
                 setHouse(response.data);
             } catch (error) {
                 console.error("Error fetching house details:", error);
             } finally {
                 setLoading(false);
             }
         };
         fetchHouseDetails();
     }, [id]);
 
     const isUnavailable = (date) => {
        if (!house || !house.availabilities) return true;
    
        const dateToCheck = new Date(date).setHours(0, 0, 0, 0);
    
        for (const availability of house.availabilities) {
            const startDate = new Date(availability.startDate).setHours(0, 0, 0, 0);
            const endDate = new Date(availability.endDate).setHours(0, 0, 0, 0);
    
            if (dateToCheck >= startDate && dateToCheck <= endDate) {
                return false;
            }
        }
    
        return true;
    };
 
     const handleDateChange = (date) => {
         setErrorMessage("");
 
         if (!arrivalDate || (arrivalDate && departureDate)) { setArrivalDate(date); setDepartureDate(null); }
         else 
         {
             if (date > arrivalDate) {
                 if (!isRangeAvailable(arrivalDate, date)) { setErrorMessage("There are unavailable dates in this range."); return; }
                 
                 setDepartureDate(date);
             } 
             else { setArrivalDate(date); setDepartureDate(null); }
         }
     };
 
     const isRangeAvailable = (start, end) => {
        let currentDate = new Date(start);
    
        while (currentDate < end) {
            if (!isUnavailable(currentDate)) { 
                window.location.reload(); 
                return false; 
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
    
        return true; 
    };
    
 
    const tileClassName = ({ date }) => {
        if (date < today) return "react-calendar__tile--disabled"; // Blocca le date passate
        
        if (arrivalDate && departureDate && date >= arrivalDate && date <= departureDate) {
            return "react-calendar__tile--selected"; // Evidenzia il range selezionato
        }
    
        return isUnavailable(date) ? null : "react-calendar__tile--disabled"; // Rendi selezionabili solo le date non disponibili
    };
    
 
 const handleBooking = () => {
     if (!isLoggedIn) {
         navigate("/login");
         return;
     }
 
     if (!arrivalDate || !departureDate) {
         setErrorMessage("Please select both check-in and check-out dates.");
         return;
     }
 
     navigate("/booking-page", {
         state: {
             houseId: house.id,
             houseName: house.name,
             houseAddress: house.address,
             houseCity: house.city,
             houseState: house.state,
             houseImage: house.images[0],
             checkIn: arrivalDate,
             checkOut: departureDate,
         }
     });
 };
 
     if (loading) return <div>Loading...</div>;
     if (!house) return <div>House not found.</div>;
 
     const advancedServices = [
         { name: "Kitchen", icon: <FaUtensils className="icon-services" />, available: house.kitchen },
         { name: "Wi-Fi", icon: <FaWifi className="icon-services" />, available: house.wifi },
         { name: "Pool", icon: <FaSwimmer className="icon-services" />, available: house.pool },
         { name: "Parking", icon: <FaCar className="icon-services" />, available: house.parking },
         { name: "AC", icon: <FaSnowflake className="icon-services" />, available: house.airConditioning },
     ];
 
     return (
         <div className="container-house-description">
             <Row className="justify-content-center gx-4 mx-2">
                 <Col md={10}><h1 className="house-title">{house.name}</h1></Col>
             </Row>
             <Row className="justify-content-center gx-4 mx-2">
                 <Col md={6}>
                     <Carousel interval={null} className="house-carousel">
                         {house.images && house.images.map((image, idx) => (
                             <Carousel.Item key={idx}>
                                 <img src={image} alt={`House Image ${idx + 1}`} className="d-block w-100 house-carousel-image" />
                             </Carousel.Item>
                         ))}
                     </Carousel>
                 </Col>
                 <Col md={4} className="calendar-container">
                     <div className="calendar-title">Availabilities</div>
                     <Calendar
                         locale="en-US"
                         onClickDay={handleDateChange}
                         tileClassName={tileClassName}
                         showNeighboringMonth={false}
                         minDate={today}
                     />
                     {errorMessage && <p className="text-danger">{errorMessage}</p>}
                     <button className="book-button" onClick={handleBooking}>Booking</button>
                 </Col>
             </Row>
         </div>
     );
 };
 
export default ManageProperty;
