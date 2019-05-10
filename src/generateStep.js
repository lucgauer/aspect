const nlp = require('compromise');
const taikoCommands = require('./taikoCommands.json');

module.exports.getSteps = (specFileContent) => {
  const stepLinePrefix = '* ';

  return specFileContent
    .split('\n')
    .filter(i => i.startsWith(stepLinePrefix))
    .map(i => i.slice(stepLinePrefix.length))
  ;
};

module.exports.generateCommand = ({ text, type, mainText }) => {
  let command;

  switch (type) {
    case 'verb':
      command = mainText;
      break;

    case 'preposition':
      command = 'textField';
      break;
  }

  const { isAsync } = taikoCommands[command];// || {};

  return { command, isAsync: Boolean(isAsync) };
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
  const verbs = filterText(analysis.verbs().data());
  const prepositions = filterText(
    analysis
      .out('tags')
      .filter(({ tags }) => tags.includes('Preposition'))
  );

  return argValues.map((argValue, index) => {
    if (spec.match(RegExp(argValue, 'g')).length > 1) {
      // TODO Not considered yet
      throw new Error('repeated argument value');
    }

    // Text chunk, since the last argument occurrence
    let text = spec
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

    const mainText = text
      .split(' ')
      .find(word => [...verbs, ...prepositions].includes(word))
    ;

    return {
      mainText,
      text,
      type: 'verb',
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
  ${commands.join(';\n  ')};
});`
    );
};

module.exports.generateFile = (fileContent) => `
/* globals gauge*/
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
  module.exports
    .getSteps(fileContent)
    .map(spec => module
      .exports
      .generateScript(module.exports.generateEntries(spec))
    )
    .join('\n'.repeat(2))
}
`;
