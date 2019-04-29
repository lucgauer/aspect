const nlp = require('compromise');
const taiko = require('taiko');

module.exports.getSteps = (specFileContent) => {
  const stepLinePrefix = '* ';

  return specFileContent
    .split('\n')
    .filter(i => i.startsWith(stepLinePrefix))
    .map(i => i.slice(stepLinePrefix.length))
  ;
};

module.exports.generateCommand = ({ text, type }, nlp /* TODO relate nlp write with textbox */) => {
  let command;

  switch (type) {
    case 'verb':
      command = text;
      break;

    case 'preposition':
      command = 'textField';
      break;
  }

  return {
    command,
    isAsync: taiko[command].constructor.name === 'AsyncFunction',
  };
};

module.exports.generateStep = (spec) => {
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
  const prepositions = filterText(analysis
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
        index ? spec.indexOf(argValues[index - 1]) + argValues[index - 1].length : 0,
        spec.indexOf(argValue)
      )
      .concat(argValue/*.replace(/"/g, '')*/)
      .trim()
    ;

    const mainText = text
      .split(' ')
      .find(word => [...verbs, ...prepositions].includes(word))
    ;

    return ({ mainText, text, type: 'verb' });
  });
};

module.exports.generateScript = () => {
  const argsKeys = argValues.map((value, i) => `x${i + 1}`);
  // const commands = argsKeys.map(argKey => {
  //   const { command, isAsync } = module.exports.generateCommand(argKey);
  //
  //   return `${isAsync ? 'await ' : ''}${command}(${argsKeys})`;
  // });

  // const command = nlp('it '.concat(spec.charAt(0).toLocaleLowerCase(), spec.slice(1)))
  //   .verbs(0)
  //   .out('text')
  //   .trim()
  // ;
  // const stepPattern = 'text <arg>';

  // argsValues.reduce(
  //   (acc, argValue, index) => acc.replace(argValue, `<x${index + 1}>`),
  //   spec,
  // );

  //   return (
  // `step("${stepPattern}", async (${argsKeys}) => {
  //   ;
  // });`
  //   );
};
