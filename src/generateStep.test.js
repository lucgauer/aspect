const { getSteps, generateScript } = require('./generateStep');
const fs = require('fs');

describe('Generation test cases steps based on Gauge specs', () => {
  it('Read gauge specs markdown file', async () => {
    const specFileContent = await fs.readFileSync('./specs/maps-routing-example.spec', 'utf8');

    expect(getSteps(specFileContent)).toEqual([
      'Goto "google maps" page',
      'Search for "Berlin"',
      'Click on "Routes"',
      'Search for "Munich"',
    ]);
  });

  it('Create a functional test script based on a step', () => {
    expect(generateScript('Click on button')).toBe('await click()');
    expect(generateScript('Click on "Routes"')).toBe('await click("Routes")');
    expect(generateScript('Goto "www.google.com" page')).toBe('await goto("www.google.com")');
  });
});
