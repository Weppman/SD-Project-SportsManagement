import React, { useState, useEffect, useMemo } from 'react';
import Toolbar from '../ToolBar/toolBar';
import { useUser } from '../UserContext';
import { Timestamp } from 'firebase/firestore';
import '../Issues/issues.css';

export default function Issues() {
  const [issueType, setIssueType] = useState('Maintenance');
  const [description, setDescription] = useState('');
  const [facility, setFacility] = useState('');
  const [facilities, setFacilities] = useState([]);
  const [issues, setIssues] = useState([]);
  const [filterFacility, setFilterFacility] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { userType } = useUser();

  useEffect(() => {
    const fetchFacilities = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://getvenuedatafull-mokwbj4tsa-uc.a.run.app');
        if (!response.ok) throw new Error('Failed to fetch facilities');
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
        if (!response.ok) throw new Error('Failed to fetch issues');
        const data = await response.json();

        const fixedData = data.map(issue => {
          let date = null;
          if (issue.dateReported?.seconds) {
            date = new Date(issue.dateReported.seconds * 1000);
          }
          if (!date || isNaN(date.getTime())) date = null;

          return {
            id: issue.id || Date.now(),
            date,
            facility: issue.facility || '',
            type: issue.type || '',
            description: issue.description || '',
            update: issue.feedback || '',
            issue_status: issue.status || '',
          };
        });

        setIssues(fixedData);
      } catch (error) {
        console.error('Error fetching issues:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFacilities();
    fetchIssues();
  }, []);

  const handleReport = async () => {
    if (description.trim() === '' || facility.trim() === '') {
      alert('Please fill in both the facility and description fields.');
      return;
    }

    const timestamp = Timestamp.now();
    const newIssue = {
      dateReported: {
        seconds: timestamp.seconds,
        nanoseconds: timestamp.nanoseconds,
      },
      facility,
      type: issueType,
      description,
      feedback: '',
      status: 'Unresolved',
      dateResolved: '',
    };

    try {
      const response = await fetch('https://addissuedata-mokwbj4tsa-uc.a.run.app/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newIssue),
      });

      if (!response.ok) throw new Error('Failed to insert issue');

      const result = await response.json();

      const newIssueWithId = {
        id: result.id,
        date: timestamp.toDate(),
        facility: newIssue.facility,
        type: newIssue.type,
        description: newIssue.description,
        update: '',
        issue_status: newIssue.status,
      };

      setIssues(prev => [newIssueWithId, ...prev]);
      setDescription('');
      setFacility('');
      setIssueType('Maintenance');
    } catch (error) {
      console.error('Error reporting issue:', error);
      alert('Failed to report issue. Please try again later.');
    }
  };

  const filteredIssues = useMemo(() => {
    return issues.filter(issue => {
      const matchesDate = filterDate
        ? new Date(issue.date).toLocaleDateString() === new Date(filterDate).toLocaleDateString()
        : true;
      const matchesFacility = filterFacility
        ? issue.facility.toLowerCase().includes(filterFacility.toLowerCase())
        : true;
      return matchesDate && matchesFacility;
    });
  }, [issues, filterDate, filterFacility]);

  return (
    <>
      <Toolbar userType={userType} />
      <section className="issues-container">
        <section className="issue-list">
          <h2>Issue List</h2>
          <section className="filter-section">
            <label htmlFor="filterDate">Filter by Date:</label>
            <input
              type="date"
              id="filterDate"
              className="filter-input"
              value={filterDate}
              onChange={e => setFilterDate(e.target.value)}
            />
            <label htmlFor="filterFacility" className="filter-label">
              Filter by Facility:
            </label>
            <select
              id="filterFacility"
              className="filter-input"
              value={filterFacility}
              onChange={e => setFilterFacility(e.target.value)}
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
            <table className="issues-table">
              <thead>
                <tr>
                  {['Date', 'Facility', 'Type', 'Description', 'Update', 'Issue Status'].map(header => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredIssues.map(issue => (
                  <tr key={issue.id}>
                    <td>{issue.date ? new Date(issue.date).toLocaleString() : 'Unknown'}</td>
                    <td>{issue.facility}</td>
                    <td>{issue.type}</td>
                    <td>{issue.description}</td>
                    <td>{issue.update}</td>
                    <td>{issue.issue_status}</td>
                  </tr>
                ))}
                {filteredIssues.length === 0 && (
                  <tr>
                    <td colSpan="6" className="no-issues">
                      No issues reported.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </section>

        <section className="report-form">
          <h2>Report an Issue</h2>

          <section className="form-group">
            <label htmlFor="facility">Facility:</label>
            <select
              id="facility"
              value={facility}
              onChange={e => setFacility(e.target.value)}
              className="filter-input"
            >
              <option value="">Select a Facility</option>
              {facilities.map(facility => (
                <option key={facility.id} value={facility.Name}>
                  {facility.Name}
                </option>
              ))}
            </select>
          </section>

          <section className="form-group">
            <label htmlFor="issueType">Issue Type:</label>
            <select
              id="issueType"
              value={issueType}
              onChange={e => setIssueType(e.target.value)}
              className="full-width-select"
            >
              {['Maintenance', 'Booking', 'Access', 'Community', 'Other'].map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </section>

          <section className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              rows="6"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="full-width-textarea"
            />
          </section>

          <button onClick={handleReport} className="submit-button">
            Submit Report
          </button>
        </section>
      </section>
    </>
  );
}
