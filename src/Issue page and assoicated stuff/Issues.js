import React, { useState } from 'react';
import '../CSS/generalStyle.css';

export default function Issues() {
  const [activeSection, setActiveSection] = useState(null);
  const [issueType, setIssueType] = useState('Maintenance');
  const [description, setDescription] = useState('');

  const handleReport = () => {
    console.log('Reported:', { issueType, description });
  };

  return (
    <main className="issues-page">
      <header>
        <h1>Report Issues</h1>
        <nav>
          <button onClick={() => setActiveSection('report')}>Report</button>
          <button onClick={() => setActiveSection('view')}>Reported</button>
        </nav>
      </header>

      <br /><br />

      {activeSection === 'report' && (
        <section id="report">
          <form onSubmit={(e) => { e.preventDefault(); handleReport(); }}>
            <label htmlFor="options">Type of issue:</label>
            <select
              id="options"
              name="options"
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
            >
              <option value="Maintenance">Maintenance</option>
              <option value="Booking">Booking</option>
              <option value="Access">Access</option>
              <option value="Community">Community</option>
            </select>

            <br /><br /><br />

            <label htmlFor="issue-description">Describe the issue:</label><br />
            <textarea
              id="issue-description"
              name="issue-description"
              rows="6"
              cols="50"
              placeholder="Please describe the problem in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <br /><br /><br /><br />
            <button type="submit" id="reportButton">Report</button>
          </form>
        </section>
      )}

      {activeSection === 'view' && (
        <section id="view">
          <label>Reported:</label>
          <article>
            <table border="1">
              <thead>
                <tr>
                  <th>Issue Type</th>
                  <th>Issue</th>
                  <th>Status</th>
                  <th>Feedback</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Row 1, Cell 1</td>
                  <td>Row 1, Cell 2</td>
                  <td>Row 1, Cell 3</td>
                  <td>Row 1, Cell 4</td>
                </tr>
                <tr>
                  <td>Row 2, Cell 1</td>
                  <td>Row 2, Cell 2</td>
                  <td>Row 2, Cell 3</td>
                  <td>Row 2, Cell 4</td>
                </tr>
                <tr>
                  <td>Row 3, Cell 1</td>
                  <td>Row 3, Cell 2</td>
                  <td>Row 3, Cell 3</td>
                  <td>Row 3, Cell 4</td>
                </tr>
              </tbody>
            </table>
          </article>
        </section>
      )}
    </main>
  );
}
