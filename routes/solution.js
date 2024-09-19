const express = require('express');
const Ticket = require('../schemas/ticket.js');
const router = express.Router();
const mongoose = require('mongoose');
const path = require("path");



const view  = path.join("..","templates","solutiontable.ejs");

router.get('/', async (req, res) => {
    try {
        const tickets = await Ticket.find().sort({ created_at: -1 });;
        res.render(view, { tickets });
    } catch (error) {
        console.log(error);
        
        res.status(500).send('Error fetching tickets');
    }
});



module.exports = router;