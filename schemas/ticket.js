// models/Ticket.js
const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    ticketNo: { type: String, required: true },
    issue: { type: String, required: true },
    status: { type: String, required: true },
    created_at:{type:Date,default:Date.now()},
    solution: { type: String},
});

const Ticket = mongoose.model('tickets', TicketSchema);

module.exports = Ticket;
