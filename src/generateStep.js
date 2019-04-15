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

module.exports.generateScript = (spec) => {
  const argsValues = spec.match(/".+?"/g) || [];
  const argsKeys = argsValues.map((value, i) => `x${i + 1}`).join(',');
  const command = nlp('it '.concat(spec.charAt(0).toLocaleLowerCase(), spec.slice(1)))
    .verbs(0)
    .out('text')
    .trim()
  ;
  const isAsync = taiko[command].constructor.name === 'AsyncFunction';
  const stepPattern = argsValues.reduce(
    (acc, argValue, index) => acc.replace(argValue, `<x${index + 1}>`),
    spec,
  );

  return (
`step("${stepPattern}", async (${argsKeys}) => {
  ${isAsync ? 'await ' : ''}${command}(${argsKeys});
});`
  );
};

module.exports.handleTaikoCommands = ({ term, type, last }) => {
  let command;

  switch (type) {
    case preposition: {

    }
  }

  switch (term) {
    default:

    // TODO Handle commands looking for synonyms
  }
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
