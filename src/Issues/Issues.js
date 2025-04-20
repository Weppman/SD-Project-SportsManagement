import React, { useState } from 'react';
// import './MainUIComponents/style.css'; // Optional
import Toolbar from '../ToolBar/toolBar';
import { useUser } from '../UserContext';

export default function Issues() {
  const [issueType, setIssueType] = useState('Maintenance');
  const [description, setDescription] = useState('');
  const [facility, setFacility] = useState(''); // Added state for facility
  const [issues, setIssues] = useState([]);
  //const [update, setUpdate] = useState('');
  //const [issue_status, setIssue_status] = useState('');

  const [filterDate, setFilterDate] = useState(''); // State for filter by date
  const [filterFacility, setFilterFacility] = useState(''); // State for filter by facility

  const userType = useUser();

  const handleReport = () => {
    if (description.trim() === '' || facility.trim() === '') return; // Ensure both fields are filled

    const newIssue = {
      id: '',
      date: Date.now(), // unique ID
      facility,
      type: issueType,
      description,
      //update,
      //issue_status,
    };

    setIssues((prev) => [newIssue, ...prev]);
    setDescription('');
    setFacility(''); // Clear the facility field after submission
  };

  // Filter issues based on the selected date and facility
  const filteredIssues = issues.filter((issue) => {
    const matchesDate = filterDate ? new Date(issue.date).toLocaleDateString() === new Date(filterDate).toLocaleDateString() : true;
    const matchesFacility = filterFacility ? issue.facility.toLowerCase().includes(filterFacility.toLowerCase()) : true;
    return matchesDate && matchesFacility;
  });

  return (
    <>
      <Toolbar userType={userType} />
      <section style={{ display: 'flex', height: 'calc(100vh - 60px)', padding: '1rem' }}>
        {/* Left: Scrolling Table */}
        <section style={{ flex: 3, overflowY: 'auto', borderRight: '1px solid #ccc', paddingRight: '1rem' }}>
          <h2>Issue List</h2>
          {/* Filters */}
          <section style={{ marginBottom: '1rem' }}>
            <label htmlFor="filterDate">Filter by Date:</label>
            <input
              type="date"
              id="filterDate"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              style={{ marginLeft: '0.5rem', padding: '0.5rem' }}
            />
            <label htmlFor="filterFacility" style={{ marginLeft: '1rem' }}>Filter by Facility:</label>
            <input
              type="text"
              id="filterFacility"
              value={filterFacility}
              onChange={(e) => setFilterFacility(e.target.value)}
              style={{ marginLeft: '0.5rem', padding: '0.5rem' }}
              placeholder="Facility"
            />
          </section>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: '0.5rem' }}>Date</th>
                <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: '0.5rem' }}>Facility</th>
                <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: '0.5rem' }}>Type</th>
                <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: '0.5rem' }}>Description</th>
                <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: '0.5rem' }}>Update</th>
                <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: '0.5rem' }}>Issue Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredIssues.map((issue) => (
                <tr key={issue.id}>
                  <td style={{ padding: '0.5rem' }}>{new Date(issue.date).toLocaleString()}</td>
                  <td style={{ padding: '0.5rem' }}>{issue.facility}</td>
                  <td style={{ padding: '0.5rem' }}>{issue.type}</td>
                  <td style={{ padding: '0.5rem' }}>{issue.description}</td>
                  <td style={{ padding: '0.5rem' }}>{issue.update}</td>
                  <td style={{ padding: '0.5rem' }}>{issue.issue_status}</td>
                </tr>
              ))}
              {filteredIssues.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '1rem', textAlign: 'center', color: '#777' }}>
                    No issues reported.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Right: Report Form */}
        <section style={{ flex: 2, padding: '1rem', overflowY: 'auto' }}>
          <h2>Report an Issue</h2>
          <section style={{ marginBottom: '1rem' }}>
            <label htmlFor="facility">Facility:</label>
            <input
              id="facility"
              type="text"
              value={facility}
              onChange={(e) => setFacility(e.target.value)}
              style={{ marginTop: '0.5rem', width: '100%', padding: '0.5rem', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </section>
          <section style={{ marginBottom: '1rem' }}>
            <label htmlFor="issueType">Issue Type:</label>
            <select
              id="issueType"
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              style={{ marginTop: '0.5rem', width: '100%', padding: '0.5rem', border: '1px solid #ccc', boxSizing: 'border-box' }}
            >
              <option value="Maintenance">Maintenance</option>
              <option value="Booking">Booking</option>
              <option value="Access">Access</option>
              <option value="Community">Community</option>
              <option value="Other">Other</option>
            </select>
          </section>
          <section style={{ marginBottom: '1rem' }}>
            <label htmlFor="description">Description:</label>
            <br />
            <textarea
              id="description"
              rows="6"
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.5rem', border: '1px solid #ccc', boxSizing: 'border-box' }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </section>
          <button onClick={handleReport} style={{ padding: '0.5rem 1rem', width: '100%', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
            Submit Report
          </button>
        </section>
      </section>
    </>
  );
}
