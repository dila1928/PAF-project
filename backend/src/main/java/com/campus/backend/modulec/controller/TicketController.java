package com.campus.backend.modulec.controller;

import com.campus.backend.modulec.model.Ticket;
import com.campus.backend.modulec.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = {"http://localhost:3000", "*"})
@RestController
@RequestMapping("/api/tickets")
// Crucial for React to connect
public class TicketController {

    @Autowired
    private TicketService ticketService;

    // 1. Create Ticket (POST)
    @PostMapping
    public Ticket create(@RequestBody Ticket ticket) {
        return ticketService.createTicket(ticket);
    }

    // 2. Get All Tickets (GET)
    @GetMapping
    public List<Ticket> getAll() {
        return ticketService.getAllTickets();
    }

    // 3. Update Status (PUT)
    @PutMapping("/{id}/status")
    public Ticket updateStatus(@PathVariable String id, @RequestParam String status) {
        return ticketService.updateTicketStatus(id, status);
    }
}