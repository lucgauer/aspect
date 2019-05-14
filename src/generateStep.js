const nlp = require('compromise');
const taikoCommands = require('./taikoCommands.json');
const { getSynonymEntry } = require('./relateCommandSynonym');

module.exports.getSteps = (specFileContent) => {
  const stepLinePrefix = '* ';

  return specFileContent
    .split('\n')
    .filter(i => i.startsWith(stepLinePrefix))
    // TODO Ignores this hardcoded assert step
    .filter(i => !i.startsWith('* page contains'))
    .map(i => i.slice(stepLinePrefix.length))
  ;
};

module.exports.generateCommand = (entry) => {
  let command;

  switch (entry.type) {
    case 'verb':
      command = entry.mainText;

      // Try to found a synonym
      if (!taikoCommands[command]) {
        command = getSynonymEntry(entry).mainText;
      }

      break;

    case 'preposition':
      command = 'click';
      break;
  }

  const { isAsync } = taikoCommands[command];

  return { command, isAsync };
};

module.exports.generateEntries = (spec) => {
  const argValues = spec.match(/".+?"/g) || [];
  const analysis = nlp('it '.concat(
    spec.charAt(0).toLowerCase(),
    spec.slice(1),
  ));
  const filterText = textList => textList
    .map(({ text }) => text.trim().toLowerCase())
    .filter(text => !text.startsWith('"'))
  ;
  const prepositions = filterText(
    analysis
      .out('tags')
      .filter(({ tags }) => tags.includes('Preposition'))
  );
  let verbs = filterText(analysis.verbs().data());

  if (!verbs.length && !prepositions.length) {
    const faultbackVerb = Object.keys(taikoCommands).find(command => filterText(analysis
        .out()
        .split(' ')
        .map(text => ({ text }))
      ).includes(command),
    );

    if (faultbackVerb) {
      verbs = [faultbackVerb];
    }
  }

  return argValues.map((argValue, index) => {
    if (spec.indexOf(argValue) !== spec.lastIndexOf(argValue)) {
      // TODO Not considered yet
      throw new Error('repeated argument value');
    }

    // Text chunk, since the last argument occurrence
    const text = spec
      .toLowerCase()
      .slice(
        index
          ? spec.indexOf(argValues[index - 1]) + argValues[index - 1].length
          : 0,
        spec.indexOf(argValue)
      )
      .concat(argValue/*.replace(/"/g, '')*/)
      .trim()
    ;

    const { mainText, type } = text
      .split(' ')
      // Make it RTL
      .reverse()
      .reduce(
        (acc, word) => {
          if (verbs.includes(word)) {
            return {
              mainText: word,
              type: 'verb',
            }
          } else if (prepositions.includes(word)) {
            return {
              mainText: word,
              type: 'preposition',
            }
          }

          return acc;
        },
        {},
      )
    ;

    return {
      mainText,
      text,
      type,
      argument: argValue.replace(/"/g, ''),
    };
  });
};

module.exports.generateScript = (entries) => {
  const argKeys = entries.map((value, i) => `x${i + 1}`);
  const stepPattern = entries
    .map(({ text, argument }, i) => text.replace(/".+"/, `<${argKeys[i]}>`))
    .join(' ')
  ;
  const commands = argKeys.map((argKey, i) => {
    const { command, isAsync } = module.exports.generateCommand(entries[i]);

    return `${isAsync ? 'await ' : ''}${command}(${argKeys[i]})`;
  });

  return (
`step("${stepPattern}", async (${argKeys.join(', ')}) => {
  ${commands.reverse().join(';\n  ')};
});`
  );
};

module.exports.generateFile = (fileContent) => (
`/* globals gauge*/
"use strict";
const {
  ${Object.keys(taikoCommands).join(',\n  ')}
} = require("taiko");
const assert = require("assert");
const headless = process.env.headless_chrome.toLowerCase() === "true";

beforeSuite(async () => {
  await openBrowser({
    headless,
    args: ["--lang=en-US"]
  });
});

afterSuite(async () => {
  await closeBrowser();
});
  
${
  [...new Set(
    module.exports
      .getSteps(fileContent)
      .map(spec => module
        .exports
        .generateScript(module.exports.generateEntries(spec))
      )
  )].join('\n'.repeat(2))
}

step('page contains <content>', async content => {
  assert.ok(await text(content).exists());
});
`);
