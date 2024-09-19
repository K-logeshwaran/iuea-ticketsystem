  const express = require('express');
  const nodemailer = require("nodemailer");
  const Ticket = require('../schemas/ticket.js');
  const router = express.Router();
  const mongoose = require('mongoose');

require('dotenv').config()

const mailOption = (userId,userIssuePrompts,date,issueStatus)=> ({
  //server mail id
  from: 'ca225113134@bhc.edu.in',
  //support-team mail-id
  to: process.env.RECIVER_EMAIL,
  subject: 'New Student Issue Raised',
  html: `
    <h2>New Student Issue Raised</h2>
    <p><strong>Issue Details:</strong></p>
    <ul>
      <li><strong> Raised by:</strong> ${userId}</li>
      <li><strong>Issue Description:</strong> ${userIssuePrompts}</li>
      <li><strong>Date Raised:</strong> ${date}</li>
      <li><strong>Current Status:</strong> ${issueStatus}</li>
    </ul>
    <p>
      <a href="https://your-redirect-link.com" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px;">View Issue</a>
    </p>
  `,
});
const FLAGS =  {  
  PENDING:"PENDING",
  RESOLVED:"RESOLVED",
  ONPROCESS:"ONPROCESS"
}

console.log(
  {user: process.env.EMAIL,
  pass: process.env.EMAIL_PASS,});


const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});




async function getPreviousTicketNumber(){
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  // Get tomorrow's date at midnight
  const endOfDay = new Date();
  endOfDay.setHours(24,0,0,0);
  try{
  let allTicket = await Ticket.find({
      created_at: {
          $gte: startOfDay,
          $lt: endOfDay
      }
  })
  return allTicket.length;
  }catch(err){
  console.log(err)
  }
}

function formatter(date,month,year,number){
  const paddedNumber = number.toString().padStart(4, '0');
  let result = date.toString().padStart(2, '0')+month.toString().padStart(2, '0')+year.toString()+paddedNumber;
  return result
}
  
async function generateTicketNumber(){
  let previousTicketNumber = await getPreviousTicketNumber();
  let date = new Date().getDate()
  let month = new Date().getMonth()
  let year = new Date().getFullYear() - 2000
  console.log("yooooooooooooooooovvvvv");
  console.log("prev tic",previousTicketNumber);
   // for time being we not gonna change number 2 as 0002
  // save it for later
  return formatter(date,month,year,previousTicketNumber);
}

// Create a new ticket
router.post('/', async (req, res) => {
  try {
        const ticket = {
            issue:req.body.issue,
            ticketNo:await generateTicketNumber(),
            status:FLAGS.PENDING
        }
        let ttic = new Ticket(ticket);
        let RR = await ttic.save();
        
        //userId,userIssuePrompts,date,issueStatus
        transport.sendMail(mailOption("student-id",
          req.body.issue,new Date().toISOString(),ttic.status ), (err, info) => {
          if (err){
            console.error(err)
            res
              .status(400)
              .json({ error: "some thing went wrong! while sending email" });}
          else res.status(200).json({ msg: "email was sent" });
        });
    } catch (error) {
        res.status(400).send(error);
    }
});



router.post('/:id/solution', async (req, res) => {
  try {     const ticketId = req.params.id;
    const { solution } = req.body;
    console.log(ticketId);


    // Find the ticket by ID
    const ticket = await Ticket.findOne({ticketNo:ticketId});

    if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
    }
console.log(ticket);
    // Update the solution field
    ticket.solution = solution;

    // Update the status field
    ticket.solution = solution;
    ticket.status = FLAGS.RESOLVED

    console.log(ticket);
    // Save the updated ticket
    await ticket.save();

    res.status(200).json({ message: 'Solution updated successfully', ticket });
} catch (error) {
  console.log(error);
    res.status(500).json({ message: 'An error occurred', error });
}

});





// Get all tickets
router.get('/', async (req, res) => {
  
  try {
    const tickets = await Ticket.find();
  
    // for adding dummy solution 
  /*  tickets.forEach((t)=>{
      t.solution = "Trail solution"
      let ff = t.save()  ;     
    })
    */

    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a specific ticket by ID
router.get('/:status', async (req, res) => {
  try {
    const status = req.params.status;
    const tickets = await Ticket.find({ status: status });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a ticket by ID
router.patch('/:id', async (req, res) => {
  try {
    
  } catch (error) {
    
  }
});

// Delete a ticket by ID
router.delete('/:id', async (req, res) => {
  try {
    
  } catch (error) {
    
  }
});




module.exports = router;


/*
curl -X POST http://localhost:3000/ticket/0807240000/solution \
     -H "Content-Type: application/json" \
     -d '{
           "solution": "solution added"
         }'

         0807240000
https://cloud.mongodb.com/v2/66b3662039007104f6e3d924#/metrics/replicaSet/66b36813cd85904468fd28b3/explorer/test/tickets/find
*/
