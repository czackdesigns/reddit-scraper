const getSearchResults = async (page) => {
    const results = await page.$$eval('div[id=siteTable] > div[data-type=comment]', results => {
        let data = []
        results.forEach(parent => {
            const title = parent.querySelector('p[class=parent] > a[class=title]').innerText
            const url = parent.querySelector('p[class=parent] > a[class=title]').href
            const comment = parent.querySelectorAll('div > form > div > div[class=md] > p')
            let commentText = ''
            comment.forEach(p => {
                const text = p.innerText
                commentText += text
            })
            const postedAt = Date.parse(parent.querySelector('div > p[class=tagline] > time').getAttribute('datetime'))
            data.push({ title, url, commentText, postedAt })
        })
        return data
    })
    return results
}

module.exports.getSearchResults = getSearchResults