import React, { useState } from 'react';
// import './MainUIComponents/style.css'; // Optional
import Toolbar from '../ToolBar/toolBar';
import { useUser } from '../UserContext';

export default function Issues() {
  const [update, setUpdate] = useState('');
  const [issue_status, setIssue_status] = useState('');
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null); // To store the selected issue for editing

  const [filterDate, setFilterDate] = useState(''); // State for filter by date
  const [filterFacility, setFilterFacility] = useState(''); // State for filter by facility

  const userType = useUser();

  const handleRowClick = (issue) => {
    setSelectedIssue(issue); // Set the clicked issue as the selected one
    setUpdate(issue.update);
    setIssue_status(issue.issue_status);
  };

  const handleUpdate = () => {
    if (!selectedIssue) return;

    const updatedIssue = {
      ...selectedIssue,
      update,
      issue_status,
    };

    setIssues((prev) =>
      prev.map((issue) => (issue.id === selectedIssue.id ? updatedIssue : issue))
    );
    // Clear form fields after updating
    setSelectedIssue(null);
    setUpdate('');
    setIssue_status('');
  };

  // Filter issues based on the selected date and facility
  const filteredIssues = issues.filter((issue) => {
    const matchesDate = filterDate ? new Date(issue.date).toLocaleDateString() === new Date(filterDate).toLocaleDateString() : true;
    const matchesFacility = filterFacility ? issue.facility.toLowerCase().includes(filterFacility.toLowerCase()) : true;
    return matchesDate && matchesFacility;
  });

  // Download issues as a JSON file
  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(filteredIssues, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'issues.json';
    link.click();
  };

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
                <tr
                  key={issue.id}
                  onClick={() => handleRowClick(issue)} // Add click functionality
                  style={{
                    cursor: 'pointer',
                    backgroundColor: selectedIssue?.id === issue.id ? '#f0f0f0' : 'white',
                  }}
                >
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
                    No issues found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Right: Update Form */}
        <section style={{ flex: 2, padding: '1rem', overflowY: 'auto' }}>
          <h2>{selectedIssue ? 'Update Issue' : 'Select an Issue to Update'}</h2>
          {selectedIssue && (
            <>
              <section style={{ marginBottom: '1rem' }}>
                <label htmlFor="update">Update:</label>
                <input
                  id="update"
                  type="text"
                  value={update}
                  onChange={(e) => setUpdate(e.target.value)}
                  style={{ marginTop: '0.5rem', width: '100%', padding: '0.5rem', border: '1px solid #ccc', boxSizing: 'border-box' }}
                />
              </section>
              <section style={{ marginBottom: '1rem' }}>
                <label htmlFor="issue_status">Issue Status:</label>
                <input
                  id="issue_status"
                  type="text"
                  value={issue_status}
                  onChange={(e) => setIssue_status(e.target.value)}
                  style={{ marginTop: '0.5rem', width: '100%', padding: '0.5rem', border: '1px solid #ccc', boxSizing: 'border-box' }}
                />
              </section>
              <button onClick={handleUpdate} style={{ padding: '0.5rem 1rem', width: '100%', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
                Update Issue
              </button>
            </>
          )}
          <button onClick={handleDownload} style={{ padding: '0.5rem 1rem', width: '100%', backgroundColor: '#007BFF', color: 'white', border: 'none', cursor: 'pointer', marginTop: '1rem' }}>
            Download
          </button>
        </section>
      </section>
    </>
  );
}
