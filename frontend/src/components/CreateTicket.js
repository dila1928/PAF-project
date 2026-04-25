import React, { useState } from 'react';

const CreateTicket = ({ onTicketCreated }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const newTicket = { title, description, status: 'OPEN' };

        fetch('http://localhost:8081/api/tickets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTicket),
        })
        .then(response => response.json())
        .then(data => {
            alert('Ticket Created!');
            setTitle('');
            setDescription('');
            onTicketCreated(); // This refreshes the list
        });
    };

  return (
      <div className="form-section">
          <h3>Report a New Incident</h3>
          <form onSubmit={handleSubmit}>
              <div className="input-group">
                  <label>Issue Title</label>
                  <input
                      type="text"
                      placeholder="e.g. WiFi not working"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                  />
              </div>
              <div className="input-group">
                  <label>Details</label>
                  <textarea
                      placeholder="Describe the problem..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                  />
              </div>
              <button type="submit" className="submit-btn">Submit Report</button>
          </form>
      </div>
  );

};
export default CreateTicket;