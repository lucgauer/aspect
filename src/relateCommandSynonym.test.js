const { getSynonymEntry } = require('./relateCommandSynonym');

describe('Synonym module', () => {
  it('Relate entries to a proper taiko commmand synonym', () => {
    expect(getSynonymEntry({ text: 'type', mainText: '', type: 'verb', argument: [] }))
      .toBeInstanceOf(Object);
    expect(getSynonymEntry({ text: 'type', mainText: '', type: 'verb', argument: [] }))
      .toEqual({ text: 'write', mainText: '', type: 'verb', argument: [] });
    expect(getSynonymEntry({ text: 'printscreen', mainText: '', type: 'verb', argument: [] }))
      .toEqual({ text: 'screenshot', mainText: '', type: 'verb', argument: [] });
    expect(getSynonymEntry({ text: 'testttt', mainText: '', type: 'verb', argument: [] }))
      .toEqual({ text: 'testttt', mainText: '', type: 'verb', argument: [] });
  });
});
