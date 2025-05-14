import React, { useState, useEffect } from 'react';
import Toolbar from '../ToolBar/toolBar';
import { useUser } from '../UserContext';
import '../Issues/issuesUpdate.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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
        const fixedData = data.map(issue => ({
          id: issue.id || Date.now(),
          facility: issue.facility || '',
          type: issue.type || '',
          description: issue.description || '',
          feedback: issue.feedback || '',
          status: issue.status || '',
          dateReported: issue.dateReported || '', 
        }));
        
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

  const handleRowClick = (issue) => {
    setSelectedIssue(issue);
    setFeedback(issue.feedback);
    setStatus(issue.status);
  };

  const handleUpdate = async () => {
    if (!selectedIssue) return;
  
    const updatedIssue = {
      ...selectedIssue,
      feedback,
      status,
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedIssue),
      });
      if (!response.ok) throw new Error('Failed to update issue');
  
      const updatedIssues = issues.map(issue => 
        issue.id === updatedIssue.id ? { ...issue, feedback, status } : issue
      );
      setIssues(updatedIssues);
  
      setSelectedIssue(null);
      setFeedback('');
      setStatus('');
    } catch (error) {
      console.error('Error updating issue:', error);
    }
  };
  
  const filteredIssues = issues.filter(issue => {
    const matchesDate = filterDate
      ? issue.date?.toLocaleDateString() === new Date(filterDate).toLocaleDateString()
      : true;
    const matchesFacility = filterFacility
      ? issue.facility.toLowerCase().includes(filterFacility.toLowerCase())
      : true;
    return matchesDate && matchesFacility;
  });

const handleDownload = async () => {
  try {
    const response = await fetch('https://getissuesdatafull-mokwbj4tsa-uc.a.run.app');
    if (!response.ok) throw new Error('Failed to fetch issues');
    const rawData = await response.json();

    const formattedData = rawData.map(issue => ({
      ...issue,
      dateReported: issue.dateReported?.seconds
        ? new Date(issue.dateReported.seconds * 1000)
        : null,
      dateResolved: issue.dateResolved?.seconds
        ? new Date(issue.dateResolved.seconds * 1000)
        : null,
    }));

    const grouped = {};
    formattedData.forEach(issue => {
      const date = issue.dateReported || new Date(0); // fallback to epoch
      const year = date.getFullYear();
      const month = date.toLocaleString('default', { month: 'long' });
      const key = `${year}-${month}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(issue);
    });

    const sortedKeys = Object.keys(grouped).sort((a, b) => {
      const [yearA, monthA] = a.split('-');
      const [yearB, monthB] = b.split('-');
      const dateA = new Date(`${monthA} 1, ${yearA}`);
      const dateB = new Date(`${monthB} 1, ${yearB}`);
      return dateA - dateB;
    });

    const doc = new jsPDF('landscape');

    sortedKeys.forEach((key, index) => {
      const [year, month] = key.split('-');
      const issues = grouped[key];

      if (index > 0) doc.addPage();
      doc.setFontSize(14);
      doc.text(`${month} ${year}`, 14, 20);

      const headers = [
        '#',
        'Facility',
        'Type',
        'Description',
        'Status',
        'Feedback',
        'Date Reported',
        'Date Resolved',
      ];

      const rows = issues.map((issue, i) => [
        i + 1,
        issue.facility,
        issue.type,
        issue.description,
        issue.status,
        issue.feedback || '',
        issue.dateReported ? issue.dateReported.toLocaleString() : '',
        issue.dateResolved ? issue.dateResolved.toLocaleString() : '',
      ]);

      doc.autoTable({
        startY: 30,
        head: [headers],
        body: rows,
        theme: 'grid',
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 30 },
          2: { cellWidth: 25 },
          3: { cellWidth: 60 },
          4: { cellWidth: 20 },
          5: { cellWidth: 25 },
          6: { cellWidth: 30 },
          7: { cellWidth: 30 },
        },
        styles: {
          cellPadding: 2,
          fontSize: 10,
          halign: 'center',
        },
        margin: { horizontal: 10 },
      });
    });

    doc.save('issues_report.pdf');
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};


  return (
    <>
      <Toolbar userType={userType} />
      <section className="issues-container">
        <section className="issues-list">
          <h2>Issue List</h2>
          <section className="filters">
            <label htmlFor="filterDate">Filter by Date:</label>
            <input
              type="date"
              id="filterDate"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="filter-input"
            />
            <label htmlFor="filterFacility" className="facility-label">
              Filter by Facility:
            </label>
            <select
              id="filterFacility"
              value={filterFacility}
              onChange={e => setFilterFacility(e.target.value)}
              className="filter-select"
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
                  <th>Date</th>
                  <th>Facility</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Update</th>
                  <th>Issue Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredIssues.map(issue => (
                  <tr
                    key={issue.id}
                    onClick={() => handleRowClick(issue)}
                    className={`issues-table-row ${selectedIssue?.id === issue.id ? 'selected' : ''}`}
                  >
                    <td>{issue.dateReported?.seconds ? new Date(issue.dateReported.seconds * 1000).toLocaleString()   : 'Unknown'}</td>
                    <td>{issue.facility}</td>
                    <td>{issue.type}</td>
                    <td>{issue.description}</td>
                    <td>{issue.feedback}</td>
                    <td>{issue.status}</td>
                  </tr>
                ))}
                {filteredIssues.length === 0 && (
                  <tr>
                    <td colSpan="6" className="no-issues">No issues found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </section>

        <section className="update-section">
          <h2>{selectedIssue ? 'Update Issue' : 'Select an Issue to Update'}</h2>
          {selectedIssue && (
            <>
              <section className="update-group">
                <label htmlFor="update">Update:</label>
                <input
                  id="update"
                  type="text"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="update-input"
                />
              </section>
              <section className="update-group">
                <label htmlFor="issue_status">Issue Status:</label>
                <select
                  id="issue_status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="update-select"
                >
                  <option value="Resolved">Resolved</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Unresolved">Unresolved</option>
                </select>
              </section>
              <button onClick={handleUpdate} className="update-button">Update Issue</button>
            </>
          )}
          <button onClick={handleDownload} className="download-button">Download</button>
        </section>
      </section>
    </>
  );
}
