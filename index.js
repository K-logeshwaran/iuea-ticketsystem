const express = require('express');
const Ticket = require('./schemas/ticket.js');
const mongoose = require('mongoose');
const ticketHandler = require("./routes/ticket.js")
const knowledgebase = require("./routes/knowledgebase.js");
const solution = require("./routes/solution.js");
const dotenv  = require('dotenv')
const app = express();
//const port = 3000;

app.use(express.json());
app.use("/ticket",ticketHandler);
app.use("/knowledgebase",knowledgebase);
app.use("/solution",solution);
dotenv.config()
app.set('view engine', 'ejs');


const path = require("path");

app.get('/', (req, res) => {
  res.send("<h1>hiii</h1>");
});


app.get('/page', (req, res) => {
  
    res.sendFile(path.join(__dirname, 'test.html'));
});

app.get("/test",async (req,res)=>{
    try {
        const ticket = {
            issue:"Trial",
            ticketNo:"002",
            status:"PENDING" } 
        let ttic = new Ticket(ticket);
        let RR = await ttic.save();
        console.log(RR);
        
        res.status(201).send(ticket);
    } catch (error) {
        res.status(400).send(error);
    }
});



mongoose.connect(process.env.MONGODB_URL, {
})
.then(() =>{
    console.log('MongoDB connected...')

app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
})
.catch(err => console.log(err));


/*
fetch('https://cf62-220-158-156-196.ngrok-free.app/ticket', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    issue: 'Describe the issue here'
  })
})
.then(response => response.json())
.then(data => {
  if (data.error) {
    console.error('Error:', data.error);
  } else {
    console.log('Success:', data.msg);
  }
})
.catch((error) => {
  console.error('Error:', error);
});



curl -X POST http://localhost:3000/ticket \
     -H "Content-Type: application/json" \
     -d '{
           "issue": "Trying to add solution"
         }'






        links 
            
            https://app.botpress.cloud/workspaces/wkspace_01J3MGMPVBV9XHJ040FV3VNH3G/bots/58ee4498-532f-4583-9f9a-6afe1875c299/overview
            https://studio.botpress.cloud/58ee4498-532f-4583-9f9a-6afe1875c299/kb/kb-2f0a7ea639
            ngrok http 3000
 */
``