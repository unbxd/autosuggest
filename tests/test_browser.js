const assert = require('assert')
const puppeteer = require('puppeteer')
let browser
let page

// In the Mocha "before" hook, create the browser and page objects.
before(async () => {
    browser = await puppeteer.launch({ headless: true })
    page = await browser.newPage()
})


describe('Autosuggest', () => {
    it('has search input', async () => {

        // Set the view port size so we can "see" the whole page
        await page.setViewport({ width: 1280, height: 800 })
        await page.goto('http://localhost:7000/tests/', { waitUntil: 'networkidle0' })

        // Assert the search input is there
        const searchInput = await page.$('input#search_field')
        assert.ok(searchInput)
    }).timeout(40000)

    it('shows autosuggest results after search input', async () => {
        // search for the term "bul"
        await page.waitForSelector('input#search_field')
        await page.focus('input#search_field')
        await page.keyboard.type('bul')
        await page.waitForSelector('ul.unbxd-as-maincontent')
        const products = await page.$$('[data-type="IN_FIELD"]' || '[data-type="TOP_SEARCH_QUERIES"]' || '[data-type="POPULAR_PRODUCTS"]' || '[data-type="KEYWORD_SUGGESTION"]')
        assert.ok(products[0])
        await page.waitFor(2000)
        await page.screenshot({ path: 'tests/screenshots/results.png' })
    }).timeout(20000)

    it('changes results on hover', async () => {
        await page.waitForSelector('ul.unbxd-as-sidecontent')
        await page.waitFor(2000)
        await page.screenshot({ path: 'tests/screenshots/beforeHover.png' })
        const firstProduct = await page.$$('[data-type="IN_FIELD"]' || '[data-type="TOP_SEARCH_QUERIES"]' || '[data-type="POPULAR_PRODUCTS"]' || '[data-type="KEYWORD_SUGGESTION"]')
        await firstProduct[1].hover()
        await page.screenshot({ path: 'tests/screenshots/afterHover.png' })
    }).timeout(20000)

    it('Shows no results found when no results returned', async () => {
        await page.click("input#search_field", { clickCount: 3 })
        await page.type("input#search_field", "slkdjs")
        await page.waitFor(2000)
        await page.waitForSelector('ul.unbxd-as-maincontent')
        const elements = await page.$$('ul.unbxd-as-maincontent li')
        const element = elements[0]
        const text = await page.evaluate(element => element.textContent, element)
        assert.equal(text, 'No results found.', 'no results returned');
        await page.screenshot({ path: 'tests/screenshots/noResults.png' })
    }).timeout(20000)

    after(async () => {
        await browser.close()
    })

})