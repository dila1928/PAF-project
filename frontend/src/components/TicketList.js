import React, { useState, useEffect } from 'react';

const TicketList = () => {
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        // This calls your Spring Boot Backend
        fetch('http://localhost:8081/api/tickets')
            .then(response => response.json())
            .then(data => setTickets(data))
            .catch(error => console.error('Error fetching tickets:', error));
    }, []);

   // Replace your return statement with this:
   return (
       <div className="ticket-container">
           <h2>Active Incident Reports</h2>
           <table className="ticket-table">
               <thread>
                   <tr>
                       <th>Title</th>
                       <th>Description</th>
                       <th>Status</th>
                   </tr>
               </thread>
               <body>
                   {tickets.map(ticket => (
                       // Inside your map function:
                       <tr key={ticket.id}>
                           <td><strong>{ticket.title}</strong></td>
                           <td>{ticket.description}</td>
                           <td>
                               <span className={`status-badge ${ticket.status.toLowerCase()}`}>
                                   {ticket.status}
                               </span>
                           </td>
                       </tr>
                   ))}
               </body>
           </table>
       </div>
   );
};
export default TicketList;