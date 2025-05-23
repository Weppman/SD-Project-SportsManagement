import { useState, useEffect } from "react";
import './adminBooking.css';
import 'font-awesome/css/font-awesome.min.css';
import { Timestamp } from 'firebase/firestore';
import Toolbar from '../ToolBar/toolBar';
import { useUser} from '../UserContext';
import { useCallback } from "react";
import AdminToolbar from '../Admin/adminToolBar';

export default function AdminBookings() {
  const userType = useUser();
  const [bookings, setBookings] = useState([]);
  const [isAscending, setIsAscending] = useState(true); 
  const [isVenueAscending, setIsVenueAscending] = useState(true);
  const [selectedVenue, setSelectedVenue] = useState(""); 
  const fetchBookings = useCallback(async () => {
    try {
      const response = await fetch('https://getpendingfuturebookings-mokwbj4tsa-uc.a.run.app');
      const data = await response.json();
      setBookings(data.bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  }, []); 
  
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]); 
   const formatDate = (timestamp) => {
    const date = new Date(new Timestamp(timestamp.seconds, timestamp.nanoseconds).toDate());
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const day = date.getDate().toString().padStart(2, '0'); 
    
    return `${year}-${month}-${day}`; 
  };
  const handleSortByVenueName = () => {
    const sortedBookings = [...bookings];
    sortedBookings.sort((a, b) => {
      const venueA = a.venueID.toLowerCase(); 
      const venueB = b.venueID.toLowerCase();
      return isVenueAscending ? venueA.localeCompare(venueB) : venueB.localeCompare(venueA);
    });
    setBookings(sortedBookings);
    setIsVenueAscending(!isVenueAscending);
  };
  const handleSortByDate = () => {
    const sortedBookings = [...bookings];
    sortedBookings.sort((a, b) => {
      const dateA =new Date(new Timestamp(a.date.seconds, a.date.nanoseconds).toDate());
      const dateB =new Date(new Timestamp(b.date.seconds, b.date.nanoseconds).toDate());
      return isAscending ? dateA - dateB : dateB - dateA;
    });
    setBookings(sortedBookings);
    setIsAscending(!isAscending); 
  };
  const handleApprove = async (id, date, timeSlot, venueID) => {
    const now = new Date();
    const bookingDate = new Timestamp(date.seconds, date.nanoseconds).toDate();
    const isToday = bookingDate.toDateString() === now.toDateString();
    const bookingHour = parseInt(timeSlot.split(":")[0], 10);
    const currentHour = now.getHours();
    if (isToday && bookingHour <= currentHour) {
      await handleDecline(id);
      return; 
    }
  
    try {
      const response = await fetch('https://updatebookingdata-mokwbj4tsa-uc.a.run.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id,
          status: 'approved', 
        }),
      });
      const result = await response.json();
      await triggerEmailNotification();
      if (response.ok) {
        setBookings(prevBookings => 
          prevBookings.map(booking => {
            const bookingDate = new Date(new Timestamp(booking.date.seconds, booking.date.nanoseconds).toDate());
            const approvedDate = new Date(new Timestamp(date.seconds, date.nanoseconds).toDate());
            if (bookingDate.toDateString() === approvedDate.toDateString() && booking.timeSlot === timeSlot && booking.venueID === venueID && booking.id !== id) {
              handleDecline(booking.id); 
              return { ...booking }; 
            }
            return booking;
          })
        );
        setBookings(prevBookings => 
          prevBookings.filter(booking => booking.id !== id) 
        );
      } else {
        console.error('Error updating booking:', result.message);
      }
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };
  
  const handleDecline = async (id) => {
    try {
      const response = await fetch('https://updatebookingdata-mokwbj4tsa-uc.a.run.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id,
          status: 'declined',
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        setBookings(prevBookings => prevBookings.filter(booking => booking.id !== id));
      } else {
        console.error('Error updating booking:', result.message);
      }
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };
  const handleAutoAccept = async () => {
    const seen = new Set();
    for (const booking of bookings) {
      const dateKey = new Timestamp(booking.date.seconds, booking.date.nanoseconds).toDate().toDateString();
      const key = `${dateKey}_${booking.timeSlot}_${booking.venueID}`;
  
      if (!seen.has(key)) {
        seen.add(key);
        await handleApprove(booking.id, booking.date, booking.timeSlot, booking.venueID);
      } else {
        await handleDecline(booking.id);
      }
    }
  };
  const filteredBookings = selectedVenue
  ? bookings.filter(booking => booking.venueID === selectedVenue)
  : bookings;
const triggerEmailNotification = async () => {
  try {
    const response = await fetch('https://sendemailnotification-mokwbj4tsa-uc.a.run.app', {
      method: 'POST',
    });

    if (!response.ok) {
      console.error('Failed to trigger email notification');
    }
  } catch (error) {
    console.error('Error triggering email notification:', error);
  }
};



  return (
    <>
     <Toolbar userType={userType} />
     <AdminToolbar />
     {userType === 'admin' && <AdminToolbar />}
      <section id="admin-bookings-section">
        <button id="auto-accept-button" data-testid="accept-all" onClick={handleAutoAccept}>Accept All Bookings</button>
        <label htmlFor="venue-filter" id="venue-filter-label">Filter by Venue:</label>
        <select 
          id="venue-filter" 
          value={selectedVenue} 
          onChange={(e) => setSelectedVenue(e.target.value)}
        >
          <option value="">All Venues</option>
          {[...new Set(bookings.map(booking => booking.venueID))].map((venue, index) => (
            <option key={index} value={venue}>{venue}</option>
          ))}
        </select>
        <table id="bookings-table">
          <thead>
            <tr>
              <th 
                id="date-header" 
                onClick={handleSortByDate} 
                style={{ cursor: 'pointer' }} 
                aria-sort={isAscending ? 'ascending' : 'descending'}
              >
                Date
                <i className={`fa ${isAscending ? 'fa-sort-up' : 'fa-sort-down'}`}/>
              </th>
              <th 
                id="venue-header" 
                onClick={handleSortByVenueName} 
                style={{ cursor: 'pointer' }} 
                aria-sort={isVenueAscending ? 'ascending' : 'descending'}
              >
                Venue
                <i className={`fa ${isVenueAscending ? 'fa-sort-up' : 'fa-sort-down'}`}/>
              </th>
              <th id="time-header">Time</th>
              <th id="num-people-header">Number of People</th>
              <th id="purpose-header">Purpose</th>
              <th id="actions-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking.id}>
                <td>{formatDate(booking.date)}</td>
                <td>{booking.venueID}</td>
                <td>{booking.timeSlot}</td>
                <td>{booking.numPeople}</td>
                <td>{booking.purpose}</td>
                <td>
                  <button 
                    id={"approve-button-booking"}
                    data-testid="approve" 
                    onClick={() => handleApprove(booking.id, booking.date, booking.timeSlot, booking.venueID)}
                  >
                    Approve
                  </button>
                  <button 
                    id={"decline-button-booking"}
                    data-testid="decline" 
                    onClick={() => handleDecline(booking.id)}
                  >
                    Decline
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
