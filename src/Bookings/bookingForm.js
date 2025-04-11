import React, { useState } from 'react'; 

const FacilityBookingForm = () => {
  const [buttonText, setButtonText] = useState('Book');
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add  form submission logic here
    console.log('Form submitted');
    setButtonText('Booking Request Sent');
  };
  
  const goToPage = (path) => {
    window.location.href = path;
  };

  return (
    <main>
      <header>
        <h1>Book a Facility</h1>
      </header>

      <form onSubmit={handleSubmit}>
        <section>
          <label htmlFor="facility">Select a facility:</label>
          <select id="facility" name="facility" required>
            <option value="option_1">Option 1</option>
            <option value="option_2">Option 2</option>
            <option value="option_3">Option 3</option>
            <option value="option_4">Option 4</option>
          </select>
          <br /> <br />
        </section>

        <section>
          <label htmlFor="date">Date:</label>
          <input type="date" id="date" name="date" required />
          <br /><br />
        </section>

        <section>
          <label htmlFor="start_time">Start time:</label>
          <input type="time" id="start_time" name="start_time" required />
          <br /><br />
        </section>

        <section>
          <label htmlFor="end_time">End time:</label>
          <input type="time" id="end_time" name="end_time" required />
          <br /> <br />
        </section>

        <section>
          <label htmlFor="number_of_people">Number of people:</label>
          <input type="number" id="number_of_people" name="number_of_people" min="1" required />
          <br /><br />
        </section>

        <section>
          <label htmlFor="purpose">Purpose:</label>
          <br />
          <textarea
            id="purpose"
            name="purpose"
            placeholder="Optional"
            rows="4"
            cols="50"
          />
          <br /><br />
        </section>

        <section>
          <input type="submit" value={buttonText} />
          <br /><br />
        </section>
      </form>
      {/* Add Issue page location and main page when available this part might change with react now intergrated*/}
      <nav>
        <button type="button" onClick={() => goToPage('/issue.html')}>Go to Issues Page</button>
        <button type="button" onClick={() => goToPage('/main.html')}>Go to Home Page</button>
      </nav>
    </main>
  );
};

export default FacilityBookingForm;
