const assert = require('assert')
const puppeteer = require('puppeteer')
const devices = require('puppeteer/DeviceDescriptors');
let browser
let page


// In the Mocha "before" hook, create the browser and page objects.
before(async () => {
  browser = await puppeteer.launch({ headless: true })
  page = await browser.newPage()
})

describe('Autosuggest Mobile View', () => {

  it('shows single column on mobiles', async () => {
    await page.emulate(devices['iPhone 6'])
    await page.goto('http://localhost:7000/tests/index.html', { waitUntil: 'networkidle0' })
    await page.waitForSelector('input#search_field')
    await page.type('input#search_field', 'bul')
    await page.waitFor(2000)
    await page.waitForSelector('div.unbxd-as-wrapper')
    await page.screenshot({ path: 'tests/screenshots/mobile_view.png' })
  }).timeout(40000)

  after(async () => {
    await browser.close()
  })

})
