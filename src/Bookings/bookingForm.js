import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './bookingForm.css'; 
import Toolbar from '../ToolBar/toolBar';
import { useUser} from '../UserContext';
import { useEffect,useCallback } from 'react';
import {Timestamp } from 'firebase/firestore';
import { auth } from "../Firebase/firebaseApp";


const BookingForm = () => {
  const user = auth.currentUser;
  const userType = useUser();
  const [date, setDate] = useState(new Date());
  const [showTimePopup, setShowTimePopup] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  const[bookings,setBookings] = useState([]);
  const[venues,setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [purpose, setPurpose] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fetchBookings = useCallback(async () => {
    try {
      const response = await fetch('https://getacceptedfuturebookings-mokwbj4tsa-uc.a.run.app');
      const data = await response.json();
      setBookings(data.bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  }, []);
    const fetchvenues = async () => {
      try {
        const response = await fetch('https://getvenuedatafull-mokwbj4tsa-uc.a.run.app'); 
        const data = await response.json();
        setVenues(data);
      } catch (error) {
        console.error('Error fetching venues:', error);
      }
    };
    useEffect(()=>{
      fetchvenues();
    },[])
    useEffect(() => {
      fetchBookings();
    }, [fetchBookings]);
  useEffect(() => {
    if (venues && venues.length > 0) {
      setSelectedVenue(venues[0].Name);
    }
  }, [venues]);
  const generateHourlySlots = () => {
    const slots = [];
    for (let hour = 8; hour < 17; hour++) { 
      const startHour = hour < 10 ? '0' + hour : hour;
      const endHour = hour + 1 < 10 ? '0' + (hour + 1) : hour + 1;
      const timeSlot = `${startHour}:00 - ${endHour}:00`;
      slots.push(timeSlot);
    }
    return slots;
  };
  const getAvailableTimeSlots = () => {
    const allSlots = generateHourlySlots();
    const now = new Date();
    const selectedDateStr = date.toDateString();
    const todayStr = now.toDateString();
  
    // Filter bookings on the same date and venue
    const bookedSlots = bookings.filter((b) => {
      const bookingDate = new Timestamp(b.date.seconds, b.date.nanoseconds).toDate();
      return (
        b.venueID === selectedVenue &&
        bookingDate.toDateString() === selectedDateStr &&
        b.status === "approved"
      );
    }).map((b) => b.timeSlot);
  
    // Filter out booked time slots
    let availableSlots = allSlots.filter((slot) => !bookedSlots.includes(slot));
  
    // If selected date is today, also filter out past time slots
    if (selectedDateStr === todayStr) {
      const currentHour = now.getHours();
      availableSlots = availableSlots.filter((slot) => {
        const slotHour = parseInt(slot.split(":")[0], 10);
        return slotHour > currentHour;
      });
    }
  
    return availableSlots;
  };
  const isFullyBooked = (dateObj) => {
    const selectedDateStr = dateObj.toDateString();
    const now = new Date();
    const isToday = selectedDateStr === now.toDateString();
  
    const bookedSlots = bookings.filter((b) => {
      const bookingDate = new Timestamp(b.date.seconds, b.date.nanoseconds).toDate();
      return (
        b.venueID === selectedVenue &&
        bookingDate.toDateString() === selectedDateStr &&
        b.status === "approved"
      );
    }).map((b) => b.timeSlot);
  
    let totalSlots = generateHourlySlots();
  
    if (isToday) {
      const currentHour = now.getHours();
      totalSlots = totalSlots.filter((slot) => {
        const slotHour = parseInt(slot.split(":")[0], 10);
        return slotHour > currentHour;
      });
    }
  
    return bookedSlots.length >= totalSlots.length;
  };
  
  const getVenueCapacity = (venueName = selectedVenue) => {
    const venue = venues.find(v => v.Name === venueName);
    if(!venue){
      return 1;
    }
    if(typeof venue.Capacity === "object"){
      const totalCap = Object.values(venue.Capacity).reduce((sum, num) => sum + num, 0);
      return totalCap;
    }
    else{
      return venue.Capacity
    }
  };
  const handleDateChange = (newDate) => {
    setDate(newDate);
    setShowTimePopup(true);
  };
  const handleConfirmBooking = async () => {
    if (isSubmitting){
      return;
    } 
    if (!selectedTime) {
      alert('Please select a time!');
      return; 
    }
    const dateTimestamp = Timestamp.fromDate(date);
    setIsSubmitting(true);
    const bookingData = {
      date:dateTimestamp,
      numPeople: numberOfPeople,
      purpose: purpose,
      timeSlot: selectedTime,
      venueID: selectedVenue,
      status: "pending",
      UUID: user.uid
    };
    try {
      const response = await fetch('https://addbookingdata-mokwbj4tsa-uc.a.run.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
      const result = await response.json();
      if (response.ok) {
      } else {
        console.error('Error confirming booking:', result);
      }
    } catch (error) {
      console.error('Error making the request:', error);
    }
    await fetchBookings();
    setShowTimePopup(false);
    alert(`Booked ${selectedVenue} on ${date.toDateString()} at ${selectedTime} for ${numberOfPeople} people`);
    setSelectedTime(null);
    setPurpose("");
    setNumberOfPeople(1);
    setIsSubmitting(false);
  };
  return (
    <>
    <Toolbar userType={userType} />
    <section id="booking-form">
      <header id="booking-header">
        <h2 id="booking-title">Make a booking</h2>
      </header>
      <main id="booking-main" className style={{ display: 'flex', width: '100%', height: '100%' }}>
        <section id="calendar-section" style={{ width: showTimePopup ? '50%' : '100%', padding: '10px' }}>
          <section id="venue-selector" className="venue-selector">
            <label htmlFor="venue-select">
              Choose a Venue:
              <select
                id="venue-select"
                value={selectedVenue}
                onChange={(e) => {
                  const newVenue = e.target.value;
                  setSelectedVenue(newVenue);
                  const maxCap = getVenueCapacity(newVenue);
                  setNumberOfPeople((prev) => Math.min(prev, maxCap));
                  const availableSlots = getAvailableTimeSlots(newVenue);
                  if (!availableSlots.includes(selectedTime)) {
                    setSelectedTime('');
                  }
                }}>
                {venues.map((venue) => (
                  <option key={venue.id} value={venue.Name}>
                    {venue.Name}
                  </option>
                ))}
              </select>
            </label>
          </section>
          <section id="calendar-container" className="popup-calender-container">
            <section id="calendar" className="calender">
              <Calendar
                id="booking-calendar"
                onChange={handleDateChange}
                value={date}
                minDate={new Date()}
                maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
                tileDisabled={({ date }) => isFullyBooked(date)}/>
            </section>
          </section>
        </section>
        {showTimePopup && (
          <section id="popup-section" style={{ width: '50%', padding: '10px', backgroundColor: '#ffffff' }}>
            <header id="popup-header">
              <h3 id="popup-title">Enter the following details</h3>
            </header>
            <main id="popup-main" className="popup-container">
              <p id="selected-date">
                <strong>Selected Date:</strong> {date.toDateString()}
              </p>
              <label htmlFor="time-dropdown">
                <strong>Time:</strong>
                <select
                  id="time-dropdown"
                  value={selectedTime}
                  className="time-dropdown"
                  onChange={(e) => setSelectedTime(e.target.value)}
                  required>
                  <option value="">Select a time</option>
                  {getAvailableTimeSlots().map((timeSlot, index) => (
                    <option key={index} value={timeSlot}>
                      {timeSlot}
                    </option>
                  ))}
                </select>
              </label>
              <section id="people-section" className="people-container">
                <label htmlFor="people-input">
                  <strong>Number of people:</strong>
                  <input
                    id="people-input"
                    type="number"
                    min="1"
                    max={getVenueCapacity()}
                    value={numberOfPeople}
                    onChange={(e) => setNumberOfPeople(e.target.value)}
                    onBlur={(e) => {
                      const input = parseInt(e.target.value, 10);
                      const max = getVenueCapacity();
                      if (isNaN(input) || input < 1) {
                        setNumberOfPeople(1);
                      } else if (input > max) {
                        alert(`Maximum capacity for this venue is ${max}`);
                        setNumberOfPeople(max);
                      } else {
                        setNumberOfPeople(input);
                      }
                    }}
                    required
                    className="people-input"/>
                </label>
              </section>
              <label htmlFor="purpose-input">
                <strong>Purpose:</strong>
                <textarea
                  id="purpose-input"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  required
                  className="purpose-input"
                  placeholder="e.g., Birthday party, practice, etc."
                  rows="4"/>
              </label>
            </main>
            <footer id="popup-footer" style={{ marginTop: '1rem' }}>
              <button id="confirm-booking-button" onClick={handleConfirmBooking} disabled={isSubmitting}>
                Confirm Booking
              </button>
              <button id="cancel-button" onClick={() => setShowTimePopup(false)}>
                Cancel
              </button>
            </footer>
          </section>
        )}
      </main>
    </section>
  </>
  );
};


export default BookingForm;