import React, { useState } from 'react';
import './App.css';
import TicketList from './components/TicketList';
import CreateTicket from './components/CreateTicket';

function App() {
  const [refresh, setRefresh] = useState(0);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Campus Incident Management</h1>
      </header>

      <div className="container">
        <CreateTicket onTicketCreated={() => setRefresh(prev => prev + 1)} />
        <hr style={{opacity: 0.2, margin: '40px 0'}} />
        <TicketList key={refresh} />
      </div>
    </div>
  );
}

export default App;