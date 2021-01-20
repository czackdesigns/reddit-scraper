const express = require('express');
const app = express();

const ip = process.env.IP || '0.0.0.0';
const port = process.env.PORT || 3000;

//Import puppeteer function
const { redditScraper } = require('./scraper');
  
//Catches requests made to localhost:3000/search
app.get('/search', (request, response, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Content-Type", "application/x-www-form-urlencoded");
    res.header("Access-Control-Allow-Methods", "GET")
    next()
    //Holds value of the query param 'searchquery'.
    const searchQuery = request.query.searchquery.split('-');

    //Do something when the searchQuery is not null.
    if (searchQuery != null) {

        redditScraper(searchQuery[0], searchQuery[1])
            .then(results => {
                //Returns a 200 Status OK with Results JSON back to the client.
                response.status(200);
                response.json(results);
            })
            .catch(error => console.log(error))
    } else {
        response.end();
    }
});
  

//Initialises the express server on the port 30000
app.listen(port, ip);