const express = require('express');
const app = express();
const cors = require('cors')

const ip = process.env.IP || '0.0.0.0';
const port = process.env.PORT || 3000;

//Import puppeteer function
const { redditScraper } = require('./scraper');

//Allows CORS
const corsOptions = {
    origin: 'https://reddit-word-counter.herokuapp.com',
    optionsSuccessStatus: 200
}
  
//Catches requests made to localhost:3000/search
app.get('/search', cors(corsOptions), (request, response) => {

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
            .catch(console.log)
    } else {
        response.end();
    }
});

//Catches requests made to localhost:3000/
app.get('/', (req, res) => res.send('Hello World!'));

//Initialises the express server on the port 30000
app.listen(port, ip);