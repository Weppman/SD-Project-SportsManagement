import React, { useEffect, useState } from 'react';
import Toolbar from '../ToolBar/toolBar';
import { useUser } from '../UserContext';
import AdminToolbar from '../Admin/adminToolBar';
import { Timestamp } from 'firebase/firestore';
import '../CSS/events.css';

export default function Events() {
  const { userType } = useUser();
  const [events, setEvents] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [location, setLocation] = useState('');
  const [maxAttendees, setMaxAttendees] = useState(50);
  const [imageUrl, setImageUrl] = useState('');
  const [formMessage, setFormMessage] = useState('');

  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://geteventdata-mokwbj4tsa-uc.a.run.app');
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStartDate(new Date());
    setEndDate(new Date());
    setLocation('');
    setMaxAttendees(50);
    setImageUrl('');
    setEditingEvent(null);
    setFormMessage('');
  };

  const openCreateForm = () => {
    resetForm();
    setShowCreateForm(true);
  };

  const openEditForm = (event) => {
    setEditingEvent(event);
    setTitle(event.title);
    setDescription(event.description);
    setStartDate(event.startDate ? new Date(event.startDate.seconds * 1000) : new Date());
    setEndDate(event.endDate ? new Date(event.endDate.seconds * 1000) : new Date());
    setLocation(event.location);
    setMaxAttendees(event.maxAttendees);
    setImageUrl(event.imageUrl);
    setShowCreateForm(true);
  };

  const handleSaveEvent = async () => {
    if (!title || !description) {
      setFormMessage('Please fill in all required fields.');
      return;
    }
    setFormMessage('');

    const eventData = {
      title,
      description,
      startDate: Timestamp.fromDate(startDate),
      endDate: Timestamp.fromDate(endDate),
      location,
      maxAttendees: parseInt(maxAttendees, 10),
      imageUrl,
      createdAt: editingEvent?.createdAt || Timestamp.now(),
      status: 'active',
    };

    
    if (editingEvent) {
      eventData.id = editingEvent.id;
    }

    try {
      const response = await fetch('https://getupdateevent-mokwbj4tsa-uc.a.run.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save event: ${errorText}`);
      }

      setFormMessage('Event saved successfully!');
      setShowCreateForm(false);
      resetForm();
      fetchEvents(); 
    } catch (err) {
      console.error('Error saving event:', err);
      setFormMessage(err.message || 'Failed to save event. Please try again.');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      
      const response = await fetch('https://getupdateevent-mokwbj4tsa-uc.a.run.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: eventId, status: 'deleted' }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete event: ${errorText}`);
      }

      setFormMessage('Event deleted successfully!');
      fetchEvents(); 
    } catch (err) {
      console.error('Error deleting event:', err);
      setFormMessage(err.message || 'Failed to delete event. Please try again.');
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp?.seconds) return 'N/A';
    return new Date(timestamp.seconds * 1000).toLocaleString();
  };

  return (
    <>
      <main className="events-container">
        <Toolbar userType={userType} />
        {userType === 'admin' && <AdminToolbar />}
        <header className="events-header">
          <h1>Upcoming Events</h1>
          {userType === 'admin' && (
            <button className="create-event-btn" onClick={openCreateForm}>
              Create New Event
            </button>
          )}
        </header>

        {isLoading ? (
          <p className="loading">Loading events...</p>
        ) : error ? (
          <article className="error">
            {error}
            <button onClick={fetchEvents}>Retry</button>
          </article>
        ) : (
          <main className="events-list">
            {events.length === 0 ? (
              <p className="no-events">No upcoming events scheduled.</p>
            ) : (
              events
                .filter(event => event.status !== 'deleted') 
                .map((event) => (
                  <article key={event.id} className="event-card">
                    {event.imageUrl && (
                      <img src={event.imageUrl} alt={event.title} className="event-image" />
                    )}
                    <section className="event-details">
                      <h3>{event.title}</h3>
                      <p className="event-date">
                        {formatDate(event.startDate)} - {formatDate(event.endDate)}
                      </p>
                      <p className="event-location">Location: {event.location}</p>
                      <p className="event-description">{event.description}</p>
                      <p className="event-attendees">Max attendees: {event.maxAttendees}</p>
                      {userType === 'admin' && (
                        <section className="event-actions">
                          <button className="edit-btn" onClick={() => openEditForm(event)}>
                            Edit
                          </button>
                          <button className="delete-btn" onClick={() => handleDeleteEvent(event.id)}>
                            Delete
                          </button>
                        </section>
                      )}
                    </section>
                  </article>
                ))
            )}
          </main>
        )}

        {showCreateForm && (
          <article className="modal-overlay">
            <section className="create-event-form">
              <h2>{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
              {formMessage && <p className={formMessage.includes('success') ? 'success-message' : 'error-message'}>{formMessage}</p>}
              <section className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </section>
              <section className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </section>
              <section className="form-row">
                <section className="form-group">
                  <label htmlFor="startDate">Start Date</label>
                  <input
                    type="datetime-local"
                    id="startDate"
                    value={startDate.toISOString().slice(0, 16)}
                    onChange={(e) => setStartDate(new Date(e.target.value))}
                    required
                  />
                </section>
                <section className="form-group">
                  <label htmlFor="endDate">End Date</label>
                  <input
                    type="datetime-local"
                    id="endDate"
                    value={endDate.toISOString().slice(0, 16)}
                    onChange={(e) => setEndDate(new Date(e.target.value))}
                    required
                  />
                </section>
              </section>
              <section className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </section>
              <section className="form-row">
                <section className="form-group">
                  <label htmlFor="maxAttendees">Max Attendees</label>
                  <input
                    type="number"
                    id="maxAttendees"
                    min="1"
                    value={maxAttendees}
                    onChange={(e) => setMaxAttendees(parseInt(e.target.value))}
                  />
                </section>
                <section className="form-group">
                  <label htmlFor="imageUrl">Image URL</label>
                  <input
                    type="text"
                    id="imageUrl"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </section>
              </section>
              <section className="form-actions">
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setShowCreateForm(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button className="submit-btn" onClick={handleSaveEvent}>
                  {editingEvent ? 'Save Changes' : 'Create Event'}
                </button>
              </section>
            </section>
          </article>
        )}
      </main>
    </>
  );
}
