function generateTicketNumber(){
    let day = new Date().getDate()
    let month = new Date().getMonth()+1
   console.log(new Date().getMonth()) 
    let year = new Date().getFullYear() - 2000
    console.log(day+"-"+month+"-"+year);
    return "25-07-24-0001"
}

generateTicketNumber()
