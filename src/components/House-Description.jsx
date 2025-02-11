import React, { useEffect, useState, useContext } from "react"; 
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Carousel, Row, Col } from "react-bootstrap";
import { FaMapMarkerAlt, FaUserFriends, FaBed, FaUtensils, FaWifi, FaSwimmer, FaCar, FaSnowflake } from "react-icons/fa";
import "../css/house-description.css";
import { AuthContext } from "../Auth-Context";
const HouseDescription = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isLoggedIn } = useContext(AuthContext);
    const [house, setHouse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [arrivalDate, setArrivalDate] = useState(null);
    const [departureDate, setDepartureDate] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
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

    const isAvailable = (date) => {
        if (!house || !house.availabilities) return null;
        const dateToCheck = new Date(date).setHours(0, 0, 0, 0);
        for (const availability of house.availabilities) {
            const startDate = new Date(availability.startDate).setHours(0, 0, 0, 0);
            const endDate = new Date(availability.endDate).setHours(0, 0, 0, 0);
            if (dateToCheck >= startDate && dateToCheck <= endDate) {
                return availability.PricePerNight;
            }
        }
        return null;
    };

    const handleDateChange = (date) => {
        setErrorMessage("");
        if (!arrivalDate || (arrivalDate && departureDate)) {
            setArrivalDate(date);
            setDepartureDate(null);
            setTotalPrice(0);
        } else {
            if (date > arrivalDate) {
                if (!isRangeAvailable(arrivalDate, date)) {
                    setErrorMessage("There are unavailable dates in this range.");
                    return;
                }
                setDepartureDate(date);
                calculateTotalPrice(arrivalDate, date);
            } else {
                setArrivalDate(date);
                setDepartureDate(null);
                setTotalPrice(0);
            }
        }
    };

    const isRangeAvailable = (start, end) => {
        let currentDate = new Date(start);
        while (currentDate < end) {
            if (isAvailable(currentDate) === null) {
                window.location.reload();
                return false; 
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return true; 
    };

    const calculateTotalPrice = (start, end) => {
        let total = 0;
        let currentDate = new Date(start);
        while (currentDate < end) {
            const price = isAvailable(currentDate);
            if (price !== null) {
                total += price;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        setTotalPrice(total);
    };

    const tileClassName = ({ date }) => {
        if (date >= arrivalDate && date <= departureDate) {
            return "react-calendar__tile--selected";
        }
        return isAvailable(date) === null ? "react-calendar__tile--disabled" : null;
    };

    const getPriceForDay = (date) => {
        const price = isAvailable(date);
        return price ? `$${price}` : '';
    };
// function to handle the booking botton
const handleBooking = () => {
    if (!isLoggedIn) {
        setErrorMessage("To book a house you have to be logged in"); 
        return;
    }

    if (!arrivalDate || !departureDate) {
        setErrorMessage("Please select both check-in and check-out dates.");
        return;
    }

    navigate("/booking-page", {
        state: {
            houseId: id,
            houseName: house.name,
            checkIn: arrivalDate,
            checkOut: departureDate,
            totalPrice: totalPrice
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
        { name: "Air Conditioning", icon: <FaSnowflake className="icon-services" />, available: house.airConditioning },
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
                    <div className="calendar-title">Availability</div>
                    <Calendar
                        onClickDay={handleDateChange}
                        tileClassName={tileClassName}
                        showNeighboringMonth={false}
                        minDate={today}
                        tileContent={({ date }) => {
                            const price = getPriceForDay(date);
                            return price ? (
                                <div className="calendar-price">{price}</div>
                            ) : null;
                        }}
                    />
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    <div className="total-price">Total Price: ${totalPrice}</div>
                    <button className="book-button" onClick={handleBooking}>Book</button>
                </Col>
            </Row>
            <Row className="justify-content-center gx-4 mx-2">
                <Col md={10} className="house-location">
                    <FaMapMarkerAlt className="house-icon-location" /> {house.address}
                    <span className="detail-separator mx-2">•</span>{house.city}, {house.state}.
                </Col>
            </Row>
            <Row className="justify-content-center gx-4 mx-2">
                <Col md={10} className="house-guests-details">
                    <FaUserFriends className="house-icon-guests" /> Guests: {house.guestsNumber}
                    <span className="detail-separator mx-2"> • </span>
                    <FaBed className="house-icon-guests" /> Bedrooms: {house.bedrooms}
                </Col>
            </Row>
            <Row className="justify-content-center gx-4 mx-2">
                <Col md={10} className="house-services-details">
                    {advancedServices.filter(service => service.available).map((service, idx, filteredServices) => (
                        <React.Fragment key={idx}>
                            {service.icon} {service.name}
                            {idx < filteredServices.length - 1 && (
                                <span className="detail-separator mx-2"> • </span>
                            )}
                        </React.Fragment>
                    ))}
                </Col>
            </Row>
        </div>
    );
};

export default HouseDescription;
