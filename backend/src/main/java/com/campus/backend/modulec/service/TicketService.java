package com.campus.backend.modulec.service;

import com.campus.backend.modulec.model.Ticket;
import com.campus.backend.modulec.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    // Logic to save a new ticket
    public Ticket createTicket(Ticket ticket) {
        ticket.setStatus("OPEN"); // Ensure every new ticket starts as OPEN
        return ticketRepository.save(ticket);
    }

    // Logic to get all tickets for the Admin/Staff
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    // Logic to change status (e.g., OPEN to IN_PROGRESS)
    public Ticket updateTicketStatus(String id, String status) {
        Ticket ticket = ticketRepository.findById(id).orElseThrow();
        ticket.setStatus(status);
        return ticketRepository.save(ticket);
    }
}