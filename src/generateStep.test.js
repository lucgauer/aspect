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
    expect(generateScript('Click on button')).toBe(
`step("Click on button", async () => {
  await click();
});`
    );

    expect(generateScript('Click on "Routes"')).toBe(
`step("Click on <x1>", async (x1) => {
  await click(x1);
});`
    );

    expect(generateScript('Goto "www.google.com" page')).toBe(
`step("Goto <x1> page", async (x1) => {
  await goto(x1);
});`
    );
  });
});
