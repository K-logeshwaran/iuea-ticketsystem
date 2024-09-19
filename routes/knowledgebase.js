const express = require('express');
const Ticket = require('../schemas/ticket.js');
const router = express.Router();
const mongoose = require('mongoose');

const FLAGS =  {  
    PENDING:"PENDING",
    RESOLVED:"RESOLVED",
    ONPROCESS:"ONPROCESS"
  }
router.get('/', async (req, res) => {
    try {
        const tickets = await Ticket.find({status:FLAGS.RESOLVED});
        let html = '<html><body>';
        tickets.forEach(ticket => {
            html += `<h1>Q: ${ticket.issue}</h1><h2>A: ${ticket.solution}</h2>`;
        });
        html += '</body></html>';
        res.send(html);
    } catch (error) {
        res.status(500).send('Error fetching tickets');
    }
});




module.exports = router;