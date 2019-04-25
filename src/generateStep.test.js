const {
  getSteps,
  generateCommand,
  generateStep,
} = require('./generateStep');
const fs = require('fs');

describe('Generation test cases steps based on Gauge specs', () => {
  xit('Read gauge specs markdown file', async () => {
    const specFileContent = await fs.readFileSync(
      './specs/maps-routing-example.spec',
      'utf8',
    );

    expect(getSteps(specFileContent)).toEqual([
      'Goto "google maps" page',
      'Write "Berlin" in "Search"',
      'Click on "Routes"',
      'Search for "Munich"',
    ]);
  });

  xit('Create a command based on a text snippet', () => {
    expect(generateCommand({ type: 'verb', text: 'write' })).toEqual({
      isAsync: true,
      command: 'write',
    });
    expect(generateCommand({ type: 'preposition', text: 'in' })).toEqual({
      isAsync: false,
      command: 'textField',
    });
  });

  it('Create a functional test script based on a step', () => {
    expect(generateStep('Click on "submit" and click "abc"')).toEqual(
      [
        {
          text: 'Click on "submit"',
          type: 'verb'
        },
        {
          text: 'and click "abc"',
          type: 'verb'
        },
      ]
// `step("Click on <x1>", async (x1) => {
//   await click(x1);
// });`
    );

//     expect(generateStep('Goto "www.google.com" page')).toBe(
// `step("Goto <x1> page", async (x1) => {
//   await goto(x1);
// });`
//     );
//
//     expect(generateStep('Click on "Routes"')).toBe(
// `step("Click on <x1>", async (x1) => {
//   await click(x1);
// });`
//     );
  });

  xit('Create a functional test script based on a composed step', () => {
    expect(generateStep('Write "Berlin" in "Search"')).toBe(
`step("Write <x1> in <x2>", async (x1, x2) => {
  await textBox(x2);
  await write(x1);
});`
    );
  })
});
