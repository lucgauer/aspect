const types = require('./taiko-command-types.json');

module.exports.getSynonymEntry = (entry) => {
  const types =  Object
    .values(types)
    .reduce((acc, type) => acc.concat(type), [])
  ;
};
