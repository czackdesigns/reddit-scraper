const puppeteer = require('puppeteer')
const { getSearchResults } = require('./getSearchResults')

const url = 'bad_cop_no_donut'
const minutes = 5


const redditScraper = async (url, minutes) => {
    const now = Date.now()
    const minutesAgo = now - (minutes * 1000 * 60)
    //Creates a Headless Browser Instance in the Background
    const browser = await puppeteer.launch()

    //Creates a Page Instance, similar to creating a new Tab
    const page = await browser.newPage()

    //Blocks all requests except for HTML doc
    await page.setRequestInterception(true)
        page.on('request', (request) => {
            if (request.resourceType() === 'document') {
                    request.continue();
            } else {
                request.abort()
            }
        })

    //Navigate the page to url
    await page.goto(`https://old.reddit.com/r/${url}/comments`);

    //Stores comments in results variable
    const results = await getSearchResults(page)

    //Gets the url for the next button
    let nextPageUrl = await page.$$eval('span[class=next-button] > a', button => {
        return button[0].href
    })

    //Checks if the last result in the array was posted after time specified
    while(results[results.length - 1].postedAt > minutesAgo) {
        await page.goto(nextPageUrl)
        const newResults = await getSearchResults(page)
        results.push(...newResults)
        nextPageUrl = await page.$$eval('span[class=next-button] > a', button => {
            return button[0].href
        })
    }

    //Closes the Browser Instance
    await browser.close()

    //Returns array of results
    return results
};

module.exports.redditScraper = redditScraper