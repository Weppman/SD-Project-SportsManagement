import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Firebase/firebaseApp';
import Toolbar from '../ToolBar/toolBar';
import { useUser } from '../UserContext';
import '../CSS/facility.css';

export default function Facilities() {
  const [facilities, setFacilities] = useState([]);
  const { userType } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState("");

  const fetchFacilities = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'venueData'));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFacilities(data);
    } catch (error) {
      console.error('Error fetching facilities:', error);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  const openModal = (imgPath) => {
    setModalImage(imgPath);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalImage("");
  };

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
        <section className="facility-list">
          <h2 id="indoor">Indoor Facilities</h2>
          {indoorFacilities.map(facility => (
            <article key={facility.id} className="facility-card">
              <h3>{facility.Name}</h3>
              <p><strong>Quantity:</strong> {facility.Quantity}</p>
              <p>
                <strong>Capacity:</strong> 
                {typeof facility.Capacity === 'object' ? (
                  <>
                    Players - {facility.Capacity?.Players ?? 'N/A'}, Spectators - {facility.Capacity?.Spectators ?? 'N/A'}
                  </>
                ) : (
                  facility.Capacity ?? 'N/A'
                )}
              </p>
              <p><strong>Description:</strong> {facility.Description}</p>
              <img
                src={facility.imagePath}
                alt={facility.Name}
                onClick={() => openModal(facility.imagePath)}
              />
            </article>
          ))}

          <h2 id="outdoor">Outdoor Facilities</h2>
          {outdoorFacilities.map(facility => (
            <article key={facility.id} className="facility-card">
              <h3>{facility.Name}</h3>
              <p><strong>Quantity:</strong> {facility.Quantity}</p>
              <p>
                <strong>Capacity:</strong> 
                {typeof facility.Capacity === 'object' ? (
                  <>
                    Players - {facility.Capacity?.Players ?? 'N/A'}, Spectators - {facility.Capacity?.Spectators ?? 'N/A'}
                  </>
                ) : (
                  facility.Capacity ?? 'N/A'
                )}
              </p>
              <p><strong>Description:</strong> {facility.Description}</p>
              <img
                 src={facility.imagePath}
                 alt={facility.Name}
                 onClick={() => openModal(facility.imagePath)}
              />
            </article>
          ))}
        </section>

        <aside className="facility-maps">
          <h2 id="map"> Facility Maps</h2>
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
            {facilities.map(facility => (
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
            ))}
          </tbody>
        </table>
      </section>
    </header>
    <footer className="facility-footer">
      <p>&copy; 2025 Facility Management. All rights reserved.</p>
    </footer>
    </>
  );
}
