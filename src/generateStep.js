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
  const args = (spec.match(/".+?"/g) || []).join(', ');
  const command = nlp('it '.concat(spec.charAt(0).toLocaleLowerCase(), spec.slice(1)))
    .verbs(0)
    .out('text')
    .trim()
  ;
  const isAsync = taiko[command].constructor.name === 'AsyncFunction';

  return (isAsync ? 'await ' : '').concat(command, '(', args, ')');
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
