const { getSynonymEntry } = require('./relateCommandSynonym');

describe('Synonym module', () => {
  it('Relate entries to a proper taiko commmand synonym', () => {
    expect(getSynonymEntry({ text: '', mainText: '', type: 'verb', arguments: [] }))
      .toInstanceOf(Object);
  });
});
