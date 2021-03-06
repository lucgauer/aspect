const {
  getSteps,
  generateCommand,
  generateEntries,
  generateScript,
  generateFile,
} = require('./generateStep');
const fs = require('fs');

describe('Generation test cases steps based on Gauge specs', () => {
  it('Read gauge specs markdown file', async () => {
    const specFileContent = await fs.readFileSync(
      './specs/gzh-auth.spec',
      'utf8',
    );

    expect(getSteps(specFileContent)).toMatchSnapshot();
  });

  it('Create a command based on a text snippet', () => {
    expect(generateCommand({ type: 'verb', mainText: 'write' }))
      .toEqual({
        isAsync: true,
        command: 'write',
      });

    expect(generateCommand({ type: 'preposition', mainText: 'in' }))
      .toEqual({
        isAsync: true,
        command: 'click',
      });
  });

  it('Split steps into small understandable chunks of steps', () => {
    expect(generateEntries('Goto "www.google.com" page')).toEqual(
      [
        {
          mainText: 'goto',
          text: 'goto "www.google.com" page',
          argument: 'www.google.com',
          type: 'verb',
        },
      ],
    );
    expect(generateEntries('Click on "submit" and click "abc"')).toEqual(
      [
        {
          mainText: 'click',
          text: 'click on "submit"',
          argument: 'submit',
          type: 'verb',
        },
        {
          mainText: 'click',
          text: 'and click "abc"',
          argument: 'abc',
          type: 'verb',
        },
      ],
    );
    expect(generateEntries('Write "Berlin" text in "Search"')).toEqual([
      {
        mainText: 'write',
        text: 'write "Berlin"',
        argument: 'Berlin',
        type: 'verb',
      },
      {
        argument: 'Search',
        mainText: 'in',
        text: 'text in \"Search\"',
        type: 'preposition',
      },
    ]);
    expect(generateEntries('Write "Istanbul" in "city" field')).toEqual([
      {
        mainText: 'write',
        text: 'write "Istanbul"',
        argument: 'Istanbul',
        type: 'verb',
      },
      {
        argument: 'city',
        mainText: 'in',
        text: 'in \"city\" field',
        type: 'preposition',
      },
    ]);
    expect(generateEntries('Press "enter"')).toEqual([
      {
        mainText: 'press',
        text: 'press "enter"',
        argument: 'enter',
        type: 'verb',
      },
    ]);
  });

  it('a functional test script based on a step', () => {
    expect(generateScript(
      [
        {
          mainText: 'goto',
          text: 'goto "www.google.com"',
          argument: 'www.google.com',
          type: 'verb',
        },
      ],
    )).toBe(
`step("goto <x1>", async (x1) => {
  await goto(x1);
});`);

    expect(generateScript(
      [
        {
          mainText: 'click',
          text: 'click on "submit"',
          argument: 'submit',
          type: 'verb',
        },
        {
          mainText: 'click',
          text: 'and click "abc"',
          argument: 'abc',
          type: 'verb',
        },
      ],
    )).toBe(
`step("click on <x1> and click <x2>", async (x1, x2) => {
  await click(x2);
  await click(x1);
});`);
  });

  it('Create a functional test file', async () => {
    const specFileContent = await fs.readFileSync(
      './specs/gzh-auth.spec',
      'utf8',
    );

    expect(generateFile(specFileContent)).toMatchSnapshot();
  });
});
