import GraphStore from '../GraphStore';

const graphName = 'test';

describe('ActionStore', () => {
  it('create a single instance of an grapf store', () => {
    expect(GraphStore.getInstance()).toBe(GraphStore.getInstance());
  });

  it('stores a graph', () => {
    expect(GraphStore.getInstance().getGraph(graphName))
      .toBe(GraphStore.getInstance().getGraph(graphName));
  });
});
