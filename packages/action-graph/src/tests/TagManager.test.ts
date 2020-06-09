import TagManager from '../TagManager';

describe('TagManager', () => {
  it('adds tags correctly', () => {
    const tagManager = new TagManager();

    expect(tagManager.getTag('my-tag')).toStrictEqual([]);

    tagManager.addToTags(['ADD_ACTIONS', 'MOVE_ACTIONS'], 'actionId');

    expect(tagManager.getTag('ADD_ACTIONS')).toStrictEqual(['actionId']);
    expect(tagManager.getTag('MOVE_ACTIONS')).toStrictEqual(['actionId']);
    expect(tagManager.getTag('actionId')).toStrictEqual([]);
  });

  it('removes tags correctly', () => {
    const tagManager = new TagManager();

    tagManager.addToTags(['ADD_ACTIONS', 'MOVE_ACTIONS'], 'actionId');
    tagManager.addToTags(['ADD_ACTIONS', 'MOVE_ACTIONS'], 'actionId-2');

    tagManager.removeFromTags(['ADD_ACTIONS', 'MOVE_ACTIONS'], 'actionId-2');

    expect(tagManager.getTag('ADD_ACTIONS')).toStrictEqual(['actionId']);
    expect(tagManager.getTag('MOVE_ACTIONS')).toStrictEqual(['actionId']);
  });
});
