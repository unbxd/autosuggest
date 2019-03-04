const assert = require('assert')
const puppeteer = require('puppeteer')
const devices = require('puppeteer/DeviceDescriptors');
let browser
let page

// (async () => {
//   const browser = await puppeteer.launch({headless:false});
//   const page = await browser.newPage();
//   await page.setViewport({ width: 1280, height: 800 })
//   await page.goto('https://www.express.com/',{ waitUntil: 'networkidle0' });
//   await page.waitForSelector('input.search-field')
//   await page.type('input.search-field', 'sho');
//   await page.click('input.search-field')
//   await page.screenshot({path: 'example.png'});
//   //await browser.close();
// })();


/**
 * @name Alibaba product search
 * @desc Searches Alibaba.com for a product and checks if the results show up
 */

// Require the Puppeteer module and the built-in assert module



// In the Mocha "before" hook, create the browser and page objects.
before(async () => {
  browser = await puppeteer.launch({headless:false})
  page = await browser.newPage()
})

// Start a test suite with two tests.
describe('Autosuggest', () => {
  it('has search input', async () => {

    // Set the view port size so we can "see" the whole page
    await page.setViewport({ width: 1280, height: 800 })
    await page.goto('https://www.express.com/', { waitUntil: 'networkidle0' })

    // Assert the search input is there
    const searchInput = await page.$('input.search-field')
    // await page.type('input.search-field', 'sh')
    assert.ok(searchInput)
  }).timeout(40000)

  it('shows autosuggest results after search input', async () => {

    // search for the term "luck cat"
    await page.type('input.search-field', 'sh')
    await page.click('input.search-field')

    // click the first result and assert it returns something
    // await page.click('input.ui-searchbar-submit')
    await page.waitForSelector('[data-type="IN_FIELD"]' || '[data-type="TOP_SEARCH_QUERIES"]' || '[data-type="POPULAR_PRODUCTS"]' || '[data-type="KEYWORD_SUGGESTION"]')
    const firstProduct = await page.$('[data-type="IN_FIELD"]' || '[data-type="TOP_SEARCH_QUERIES"]' || '[data-type="POPULAR_PRODUCTS"]' || '[data-type="KEYWORD_SUGGESTION"]')
    assert.ok(firstProduct)
  }).timeout(20000)

  it('shows single column on mobiles', async () => {

    await page.emulate(devices['iPhone 6'])
    await page.click('a.toolbar-button')
    await page.type('input.search-field', 'sh')
    await page.click('input.search-field')
  }).timeout(20000)

after(async () => {
  await browser.close()
})

})