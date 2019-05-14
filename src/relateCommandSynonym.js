const commands = require('./taikoCommands.json');

module.exports.getSynonymEntry = ({ mainText, ...entry }) => {
  const synonym = Object
    .entries(commands)
    .filter(([command, { synonyms }]) => synonyms.includes(mainText))
    .map(([command]) => command)[0]
  ;

  return { ...entry, mainText: synonym || mainText };
};
