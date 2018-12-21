describe('Customers page', () => {
  let page
  beforeAll(async () => {
    page = await browser.visitPage('/')
  }, 50000)
  afterAll(async () => {
    await page.close()
  })

  it('renders the customers page', async () => {
    const elStr = await page.html()
    expect(elStr).toBeTruthy()
    const customerOneText = await page.$text('#customer-1')
    expect(customerOneText.indexOf('Customer 1: John Doe')).toBeTruthy()
    const customerTwoText = await page.$text('#customer-2')
    expect(customerTwoText.indexOf('Customer 2: Jane Doe')).toBeTruthy()
    // expect(page.$text('#customer-2')).stringContaining('Customer 1: Jane Doe')
  })
}, 50000)
