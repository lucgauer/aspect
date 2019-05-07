const commands = require('./taikoCommands.json');

module.exports.getSynonymEntry = ({ text, ...entry }) => {
  const synonym = Object
    .entries(commands)
    .filter(([command, { synonyms }]) => synonyms.includes(text))
    .map(([command]) => command)[0]
  ;

  return { text: synonym || text, ...entry };
};
