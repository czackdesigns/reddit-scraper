const express = require('express');
const app = express();

const ip = process.env.IP || '0.0.0.0';
const port = process.env.PORT || 8080;

//Import puppeteer function
const { redditScraper } = require('./scraper');

//Import constant
const { excludedWords } = require('./excludedWords')

//Allows CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });
  
//Catches requests made to localhost:3000/search
app.get('/search', (request, response) => {

    //Holds value of the query param 'searchquery'.
    const searchQuery = request.query.searchquery.split('-');

    //Do something when the searchQuery is not null.
    if (searchQuery != null) {

        redditScraper(searchQuery[0], searchQuery[1])
            .then(results => {
                const setWordCount = (comments) => {
                    let words = []
                    comments.forEach((comment) => {
                        words.push(comment.commentText.toLowerCase().split(' '))
                    })
            
                    let wordCount = []
                    words.forEach((arrOfWords) => {
                        arrOfWords.forEach((word) => {
                            wordCount.push(word.trim().toLowerCase())
                        })
                    })
            
                    let matches = []
                    wordCount.forEach((word) => {
                        !matches.includes(word) && !excludedWords.includes(word) && matches.push(word)
                    })
                    
                    let matchCount = []
                    matches.forEach((match) => {
                        matchCount.push({
                            word: match,
                            wordCount: 0
                        })
                    })
            
                    matchCount.forEach((word) => {
                        wordCount.forEach((match) => {
                            word.word === match && word.wordCount++
                        })
                    })
                    
                    matchCount.sort((a, b) => {
                        return b.wordCount - a.wordCount
                    })
            
                    matchCount.splice(50)
            
                    return matchCount       
                }
                return setWordCount(results)
            })
            .then(results => {
                //Returns a 200 Status OK with Results JSON back to the client.
                response.status(200);
                response.json(results);
            });
    } else {
        response.end();
    }
});

//Catches requests made to localhost:3000/
app.get('/', (req, res) => res.send('Hello World!'));

//Initialises the express server on the port 30000
app.listen(port, ip);