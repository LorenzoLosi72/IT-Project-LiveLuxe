import React, { useEffect, useState, useContext } from "react"; 
import axios from "axios";
import { AuthContext } from "../Auth-Context";
import { useParams, useNavigate } from "react-router-dom";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Carousel, Row, Col, Form } from "react-bootstrap";
import { 
    FaMapMarkerAlt, FaUserFriends, FaBed, FaUtensils, 
    FaWifi, FaSwimmer, FaCar, FaSnowflake 
} from "react-icons/fa";
import "../css/manage-property.css";

const ManageProperty = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isLoggedIn } = useContext(AuthContext);
    const [house, setHouse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [blockedDates, setBlockedDates] = useState([]); 
    const [arrivalDate, setArrivalDate] = useState(null);
    const [departureDate, setDepartureDate] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [pricePerNight, setPricePerNight] = useState(""); 

    const today = new Date();

    useEffect(() => {
        fetchHouseDetails();
        fetchBlockedDates();
    }, [id]);

    // Function to get house info
    const fetchHouseDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/house/${id}`);
            console.log("House Data:", response.data);
            setHouse(response.data);
        } catch (error) {
            console.error("Error fetching house details:", error);
        }
    };

    // function to get from the API the availabilities and booking date
    const fetchBlockedDates = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/house-availability/${id}`);
        

            const allBlockedDates = [...(response.data.availabilities || []), ...(response.data.bookedDates || [])];
            setBlockedDates(allBlockedDates);
        } catch (error) {
            console.error("Error fetching blocked dates:", error);
        } finally {
            setLoading(false);
        }
    };

    // Lock a date
    const isBlocked = (date) => {
        const dateToCheck = new Date(date).toISOString().split('T')[0];

        for (const range of blockedDates) {
            const startDate = new Date(range.startDate).toISOString().split('T')[0];
            const adjustedEndDate = new Date(range.endDate);
            adjustedEndDate.setDate(adjustedEndDate.getDate() - 1); 
            const endDate = adjustedEndDate.toISOString().split('T')[0];

            if (dateToCheck >= startDate && dateToCheck <= endDate) {
                return true;
            }
        }

        return false;
    };

   
    const isRangeAvailable = (start, end) => {
        let currentDate = new Date(start);

        while (currentDate <= end) {
            if (isBlocked(currentDate)) {
                return false;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return true;
    };

    const handleDateChange = (date) => {
        setErrorMessage("");

        if (!arrivalDate || (arrivalDate && departureDate)) {
            setArrivalDate(date);
            setDepartureDate(null);
        } else {
            if (date > arrivalDate) {
                if (!isRangeAvailable(arrivalDate, date)) {
                    setErrorMessage("There are unavailable dates in this range.");
                    setArrivalDate(null);
                    setDepartureDate(null);
                    return;
                }
                setDepartureDate(date);
            } else {
                setArrivalDate(date);
                setDepartureDate(null);
            }
        }
    };

    const handlePriceChange = (event) => {
        const value = event.target.value;
        if (!isNaN(value) && Number(value) >= 0) {
            setPricePerNight(value);
        }
    };

    const handleAddAvailability = async () => {
        if (!arrivalDate || !departureDate) {
            setErrorMessage("Please select a valid date range.");
            return;
        }

        if (!pricePerNight || pricePerNight <= 0) {
            setErrorMessage("Please enter a valid price per night.");
            return;
        }

        const availabilityData = {
            startDate: arrivalDate.toISOString().split('T')[0], 
            endDate: departureDate.toISOString().split('T')[0], 
            pricePerNight: parseFloat(pricePerNight),
            propertyID: id 
        };

        try {
            const response = await axios.post("http://localhost:3001/api/add-availability", availabilityData);
            console.log("Availability Added:", response.data);
            alert("Availability added successfully!");

            fetchBlockedDates();
            setArrivalDate(null);
            setDepartureDate(null);
            setPricePerNight("");
        } catch (error) {
            console.error("Error adding availability:", error);
            setErrorMessage("Error adding availability. Please try again.");
        }
    };

    const tileClassName = ({ date }) => {
        if (date < today) return "react-calendar__tile--disabled";
        if (isBlocked(date)) return "react-calendar__tile--disabled";
        if (arrivalDate && departureDate && date >= arrivalDate && date <= departureDate) {
            return "react-calendar__tile--selected"; 
        }
        return null;
    };

    if (loading) return <div>Loading...</div>;
    if (!house) return <div>House not found.</div>;

    // Advanced services 
        const advancedServices = [
            { name: "Kitchen", icon: <FaUtensils className="icon-services" />, available: house.kitchen },
            { name: "Wi-Fi", icon: <FaWifi className="icon-services" />, available: house.wifi },
            { name: "Pool", icon: <FaSwimmer className="icon-services" />, available: house.pool },
            { name: "Parking", icon: <FaCar className="icon-services" />, available: house.parking },
            { name: "AC", icon: <FaSnowflake className="icon-services" />, available: house.airConditioning },
        ];

    return (
        <div className="container-house-description-host">
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
                    <p className="house-location">
                        <FaMapMarkerAlt className="house-icon-location"/> {house.address}, {house.city}, {house.state}
                    </p>
                    <Row className="justify-content-left gx-4 mx-2">
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
                </Col>
                <Col md={4} className="calendar-container-host">
                    <div className="calendar-title">Add Availabilities</div>
                    <Calendar locale="en-US" onClickDay={handleDateChange} tileClassName={tileClassName} showNeighboringMonth={false} minDate={today} />
                    <Form.Group className="mt-3">
                    <Form.Label className="price-label-host">Price per Night ($)</Form.Label>
                    <Form.Control type="number" placeholder="Enter price" value={pricePerNight} onChange={handlePriceChange} />
                    </Form.Group>
                    <button className="book-button mt-3" onClick={handleAddAvailability}>Add Availability</button>
                </Col>
            </Row>
        </div>
    );
};

export default ManageProperty;
