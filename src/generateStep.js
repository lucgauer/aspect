const nlp = require('compromise');
const taiko = require('taiko');
// const bayes = require('bayes');
// const taikoCommands = require('./taiko-command-types');

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
  const argsKeys = argValues.map((value, i) => `x${i + 1}`);
  const analysis = nlp(
    'it '.concat(
      spec.charAt(0).toLocaleLowerCase(),
      spec.slice(1),
    ),
  );
  const analisysText = analysis.out('text');
  const filterText = ({ text }) => text.trim();
  const verbs = analysis.verbs().data().map(filterText);
  const prepositions = analysis
    .out('tags')
    .filter(({ tags }) => tags.includes('Preposition'))
    .map(filterText)
  ;

  console.log(argValues);
  console.log(verbs, prepositions);

  const entries = argValues.map((argValue, index) => {
    if (spec.match(RegExp(argValue, 'g')).length > 1) {
      // TODO Not considered
      throw new Error('repeated argument value');
    }

    const type = analisysText.slice(
      index ? analisysText.indexOf(argValue) : 0,
      analisysText.lastIndexOf(argValue)
    );

    return ({
      text: argValue.replace(/"/g, ''),
      type,
    });
  });

  // console.log('verbs >', verbs);
  // console.log('prep >', prepositions);

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

// module.exports.bayes = () => {
//   var classifier = bayes()
//
//   // teach it positive phrases
//   classifier.learn('amazing, awesome movie!! Yeah!! Oh boy.', 'positive')
//   classifier.learn('Sweet, this is incredibly, amazing, perfect, great!!', 'positive')
//
//   // teach it a negative phrase
//   classifier.learn('terrible, shitty thing. Damn. Sucks!!', 'negative')
//
//   // now ask it to categorize a document it has never seen before
//   classifier.categorize('awesome, cool, amazing!! Yay.')
//   // => 'positive'
//
//   // serialize the classifier's state as a JSON string.
//   var stateJson = classifier.toJson()
//
//   // load the classifier back from its JSON representation.
//   var revivedClassifier = bayes.fromJson(stateJson)
// };
