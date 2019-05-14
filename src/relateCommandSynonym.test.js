const { getSynonymEntry } = require('./relateCommandSynonym');

describe('Synonym module', () => {
  it('Relate entries to a proper taiko commmand synonym', () => {
    expect(getSynonymEntry({ text: 'type', mainText: 'type', type: 'verb', argument: [] }))
      .toBeInstanceOf(Object);
    expect(getSynonymEntry({ text: 'type', mainText: 'type', type: 'verb', argument: [] }))
      .toEqual({ text: 'type', mainText: 'write', type: 'verb', argument: [] });
    expect(getSynonymEntry({ text: 'printscreen', mainText: 'printscreen', type: 'verb', argument: [] }))
      .toEqual({ text: 'printscreen', mainText: 'screenshot', type: 'verb', argument: [] });
  });
});
