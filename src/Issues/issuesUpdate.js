import React, { useState, useEffect } from 'react';
import Toolbar from '../ToolBar/toolBar';
import { useUser } from '../UserContext';

export default function Issues() {
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState('');
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [filterDate, setFilterDate] = useState('');
  const [facilities, setFacilities] = useState([]);
  const [filterFacility, setFilterFacility] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { userType } = useUser();

  useEffect(() => {
    const fetchFacilities = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://getvenuedatafull-mokwbj4tsa-uc.a.run.app');
        if (!response.ok) {
          throw new Error('Failed to fetch facilities');
        }
        const data = await response.json();
        setFacilities(data);
      } catch (error) {
        console.error('Error fetching facilities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchIssues = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://getresolved3days-mokwbj4tsa-uc.a.run.app');
        if (!response.ok) {
          throw new Error('Failed to fetch issues');
        }
        const data = await response.json();

        const fixedData = data.map(issue => {
          let date = null;
          if (issue.dateReported && typeof issue.dateReported === 'object' && issue.dateReported.seconds) {
            date = new Date(issue.dateReported.seconds * 1000);
          }
          if (!date || isNaN(date.getTime())) {
            date = null;
          }
          return {
            id: issue.id || Date.now(),
            facility: issue.facility || '',
            type: issue.type || '',
            description: issue.description || '',
            feedback: issue.feedback || '',
            status: issue.status || '',
          };
        });

        setIssues(fixedData);
      } catch (error) {
        console.error('Error fetching issues:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFacilities();
    fetchIssues();
  }, []);

  const handleRowClick = (issue) => {
    setSelectedIssue(issue);
    setFeedback(issue.feedback);
    setStatus(issue.status);
  };

  const handleUpdate = async () => {
    if (!selectedIssue) return;
  
    const updatedIssue = {
      ...selectedIssue,
      feedback: feedback,
      status: status,  
      ...(status === 'Resolved' && { 
        dateResolved: {
          seconds: Math.floor(Date.now() / 1000),
          nanoseconds: 0
        }
      })
    };
    
    try {
      const response = await fetch('https://updateissuesdata-mokwbj4tsa-uc.a.run.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedIssue),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update issue');
      }
  
      const updatedIssuesResponse = await fetch('https://getresolved3days-mokwbj4tsa-uc.a.run.app');
      const updatedIssuesData = await updatedIssuesResponse.json();
      
      const fixedData = updatedIssuesData.map(issue => {
        let date = null;
        if (issue.dateReported && typeof issue.dateReported === 'object' && issue.dateReported.seconds) {
          date = new Date(issue.dateReported.seconds * 1000);
        }
        if (!date || isNaN(date.getTime())) {
          date = null;
        }
        return {
          id: issue.id || Date.now(),
          facility: issue.facility || '',
          type: issue.type || '',
          description: issue.description || '',
          feedback: issue.feedback || '',
          status: issue.status || '',  // Keep this if status is needed
        };
      });
  
      setIssues(fixedData);
      setSelectedIssue(null);
      setFeedback('');
      setStatus('');
    } catch (error) {
      console.error('Error updating issue:', error);
    }
  };  

  const filteredIssues = issues.filter(issue => {
    const matchesDate = filterDate
      ? new Date(issue.date).toLocaleDateString() === new Date(filterDate).toLocaleDateString()
      : true;
    const matchesFacility = filterFacility
      ? issue.facility.toLowerCase().includes(filterFacility.toLowerCase())
      : true;
    return matchesDate && matchesFacility;
  });

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
        <section style={{ flex: 3, overflowY: 'auto', borderRight: '1px solid #ccc', paddingRight: '1rem' }}>
          <h2>Issue List</h2>
          <section style={{ marginBottom: '1rem' }}>
            <label htmlFor="filterDate">Filter by Date:</label>
            <input
              type="date"
              id="filterDate"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              style={{ marginLeft: '0.5rem', padding: '0.5rem' }}
            />
            <label htmlFor="filterFacility" style={{ marginLeft: '1rem' }}>
              Filter by Facility:
            </label>
            <select
              id="filterFacility"
              value={filterFacility}
              onChange={e => setFilterFacility(e.target.value)}
              style={{ marginLeft: '0.5rem', padding: '0.5rem' }}
            >
              <option value="">All Facilities</option>
              {facilities.map(facility => (
                <option key={facility.id} value={facility.Name}>
                  {facility.Name}
                </option>
              ))}
            </select>
          </section>
          {isLoading ? (
            <p>Loading issues...</p>
          ) : (    
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
                {filteredIssues.map(issue => (
                  <tr
                    key={issue.id}
                    onClick={() => handleRowClick(issue)}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: selectedIssue?.id === issue.id ? '#f0f0f0' : 'white',
                    }}
                  >
                    <td style={{ padding: '0.5rem' }}>{issue.date ? new Date(issue.date).toLocaleString() : 'Unknown'}</td>
                    <td style={{ padding: '0.5rem' }}>{issue.facility}</td>
                    <td style={{ padding: '0.5rem' }}>{issue.type}</td>
                    <td style={{ padding: '0.5rem' }}>{issue.description}</td>
                    <td style={{ padding: '0.5rem' }}>{issue.feedback}</td>
                    <td style={{ padding: '0.5rem' }}>{issue.status}</td>
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
            </table>)}
        </section>

        <section style={{ flex: 2, padding: '1rem', overflowY: 'auto' }}>
          <h2>{selectedIssue ? 'Update Issue' : 'Select an Issue to Update'}</h2>
          {selectedIssue && (
            <>
              <section style={{ marginBottom: '1rem' }}>
                <label htmlFor="update">Update:</label>
                <input
                  id="update"
                  type="text"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  style={{
                    marginTop: '0.5rem',
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ccc',
                    boxSizing: 'border-box',
                  }}
                />
              </section>

              <section style={{ marginBottom: '1rem' }}>
                <label htmlFor="issue_status">Issue Status:</label>
                <select
                  id="issue_status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  style={{
                    marginTop: '0.5rem',
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ccc',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="Resolved">Resolved</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Unresolved">Unresolved</option>
                </select>
              </section>

              <button
                onClick={handleUpdate}
                style={{
                  padding: '0.5rem 1rem',
                  width: '100%',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Update Issue
              </button>
            </>
          )}

          <button
            onClick={handleDownload}
            style={{
              padding: '0.5rem 1rem',
              width: '100%',
              backgroundColor: '#007BFF',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              marginTop: '1rem',
            }}
          >
            Download
          </button>
        </section>
      </section>
    </>
  );
}
