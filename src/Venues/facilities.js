import React, { useEffect, useState, useCallback } from 'react';
import Toolbar from '../ToolBar/toolBar';
import { useUser } from '../UserContext';
import '../CSS/facility.css';

export default function Facilities() {
  const [facilities, setFacilities] = useState([]);
  const { userType } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch facilities data efficiently
  const fetchFacilities = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://getvenuedatafull-mokwbj4tsa-uc.a.run.app');
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      const data = await response.json();
      const transformedData = data.map(doc => ({
        id: doc.id,
        Name: doc.Name || 'Unnamed Facility',
        Quantity: doc.Quantity || 1,
        Capacity: doc.Capacity,
        Description: doc.Description || 'No description available',
        indoorOutdoor: doc.indoorOutdoor || 'Outdoor',
        imagePath: doc.imagePath || '/images/default-facility.png',
      }));
      setFacilities(transformedData);
    } catch (error) {
      console.error('Error fetching facilities:', error);
      setError(`Failed to load facilities: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFacilities();
  }, [fetchFacilities]);

  const openModal = useCallback((imgPath) => {
    setModalImage(imgPath);
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setModalImage("");
  }, []);

  const indoorFacilities = facilities.filter(f => f.indoorOutdoor?.toLowerCase() === 'indoor');
  const outdoorFacilities = facilities.filter(f => f.indoorOutdoor?.toLowerCase() === 'outdoor');

  return (
    <>
      <Toolbar userType={userType} />
      <header className="facility-header">
        <h1>Facilities</h1>
        <p>Explore our wide range of facilities available for various sports and activities.</p>
        <nav className="jump-links">
          <a href="#indoor">Go to Indoor Facilities</a>
          <a href="#outdoor">Go to Outdoor Facilities</a>
          <a href="#summary">View Summary Table</a>
          <a href="#map">Maps</a>
        </nav>

        <main className="facilities-container">
          {isLoading && <p>Loading facilities...</p>}
          {error && <p className="error-message">{error}</p>}

          <section className="facility-list">
            <h2 id="indoor">Indoor Facilities</h2>
            {indoorFacilities.length > 0 ? (
              indoorFacilities.map(facility => (
                <article key={facility.id} className="facility-card">
                  <h3>{facility.Name}</h3>
                  <p><strong>Quantity:</strong> {facility.Quantity}</p>
                  <p>
                    <strong>Capacity:</strong>{' '}
                    {typeof facility.Capacity === 'object' ? (
                      <>
                        Players - {facility.Capacity?.Players ?? 'N/A'}, Spectators - {facility.Capacity?.Spectators ?? 'N/A'}
                      </>
                    ) : (
                      facility.Capacity ?? 'N/A'
                    )}
                  </p>
                  <p><strong>Description:</strong> {facility.Description}</p>
                  {facility.imagePath && (
                    <img
                      src={facility.imagePath}
                      alt={facility.Name}
                      onClick={() => openModal(facility.imagePath)}
                    />
                  )}
                </article>
              ))
            ) : (
              <p>No indoor facilities found.</p>
            )}

            <h2 id="outdoor">Outdoor Facilities</h2>
            {outdoorFacilities.length > 0 ? (
              outdoorFacilities.map(facility => (
                <article key={facility.id} className="facility-card">
                  <h3>{facility.Name}</h3>
                  <p><strong>Quantity:</strong> {facility.Quantity}</p>
                  <p>
                    <strong>Capacity:</strong>{' '}
                    {typeof facility.Capacity === 'object' ? (
                      <>
                        Players - {facility.Capacity?.Players ?? 'N/A'}, Spectators - {facility.Capacity?.Spectators ?? 'N/A'}
                      </>
                    ) : (
                      facility.Capacity ?? 'N/A'
                    )}
                  </p>
                  <p><strong>Description:</strong> {facility.Description}</p>
                  {facility.imagePath && (
                    <img
                      src={facility.imagePath}
                      alt={facility.Name}
                      onClick={() => openModal(facility.imagePath)}
                    />
                  )}
                </article>
              ))
            ) : (
              <p>No outdoor facilities found.</p>
            )}
          </section>

          <aside className="facility-maps">
            <h2 id="map">Facility Maps</h2>
            <figure onClick={() => openModal("/images/indoor.png")}>
              <img src="/images/indoor.png" alt="Indoor Facility Map" />
              <figcaption>Indoor Facilities Map</figcaption>
            </figure>
            <figure onClick={() => openModal("/images/outdoor.png")}>
              <img src="/images/outdoor.png" alt="Outdoor Facility Map" />
              <figcaption>Outdoor Facilities Map</figcaption>
            </figure>
          </aside>

          {showModal && (
            <section className="modal" onClick={closeModal}>
              <img src={modalImage} alt="Enlarged View" />
            </section>
          )}
        </main>

        <section className="summary-table" id="summary">
          <h2>Facility Summary</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th>Players</th>
                <th>Spectators</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {facilities.length > 0 ? (
                facilities.map(facility => (
                  <tr key={facility.id}>
                    <td>{facility.Name}</td>
                    <td>{facility.Quantity}</td>
                    <td>
                      {typeof facility.Capacity === 'object'
                        ? facility.Capacity?.Players ?? 'N/A'
                        : facility.Capacity ?? 'N/A'}
                    </td>
                    <td>
                      {typeof facility.Capacity === 'object'
                        ? facility.Capacity?.Spectators ?? 'N/A'
                        : 'N/A'}
                    </td>
                    <td>{facility.indoorOutdoor}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No facilities data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </header>
      <footer className="facility-footer">
        <p>&copy; {new Date().getFullYear()} Facility Management. All rights reserved.</p>
      </footer>
    </>
  );
}
