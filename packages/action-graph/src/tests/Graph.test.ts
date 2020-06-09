import wait from 'waait';

import Graph from '../Graph';
import Action from '../Action';
import { Status } from '../enums';
import ActionStore from '../ActionStore';

const graphName = 'test';

beforeEach(() => {
  ActionStore.getInstance(graphName).reset(graphName);
});

describe('Graph', () => {
  it('execute an action correctly and updates status changes', async () => {
    const graph = new Graph(graphName);
    const onStatusChangeMock = jest.fn();
    graph.statusManager.subject.subscribe({
      next: onStatusChangeMock,
    });
    const command = jest.fn().mockResolvedValue('Ciao');
    const action = new Action([], [], command);
    graph.addNode(action);

    await wait(0);

    expect(onStatusChangeMock).toHaveBeenCalledTimes(2);
    expect(onStatusChangeMock).toHaveBeenNthCalledWith(1, {
      status: Status.PENDING,
    });
    expect(onStatusChangeMock).toHaveBeenNthCalledWith(2, {
      status: Status.COMPLETE,
    });

    graph.statusManager.subject.unsubscribe();
  });

  it('execute 2 depenedent actions correctly and updates status changes', async () => {
    const graph = new Graph(graphName);
    const onStatusChangeMock = jest.fn();
    graph.statusManager.subject.subscribe({
      next: onStatusChangeMock,
    });
    const command = jest.fn().mockResolvedValue('Ciao');
    const command2 = jest.fn().mockResolvedValue('Ciao');
    const action = new Action(['ADD'], [], command);
    const action2 = new Action([], ['ADD'], command2);
    graph.addNode(action);
    graph.addNode(action2);

    await wait(0);

    expect(onStatusChangeMock).toHaveBeenCalledTimes(2);
    expect(onStatusChangeMock).toHaveBeenNthCalledWith(1, {
      status: Status.PENDING,
    });
    expect(onStatusChangeMock).toHaveBeenNthCalledWith(2, {
      status: Status.COMPLETE,
    });
    expect(command).toHaveBeenCalledTimes(1);
    expect(command2).toHaveBeenCalledTimes(1);

    graph.statusManager.subject.unsubscribe();
  });

  it('doesn\'t execute the depenedent actions if the dependency action fails', async () => {
    const graph = new Graph(graphName);
    const onStatusChangeMock = jest.fn();
    graph.statusManager.subject.subscribe({
      next: onStatusChangeMock,
    });
    const command = jest.fn().mockRejectedValue('Error');
    const command2 = jest.fn().mockResolvedValue('Ciao');
    const command3 = jest.fn().mockResolvedValue('Ciao');
    const action = new Action(['ADD', 'MOVE'], [], command);
    const action2 = new Action(['MOVE'], ['ADD'], command2);
    const action3 = new Action(['DELETE'], ['MOVE'], command3);
    graph.addNode(action);
    graph.addNode(action2);
    graph.addNode(action3);

    await wait(0);

    expect(onStatusChangeMock).toHaveBeenCalledTimes(2);
    expect(onStatusChangeMock).toHaveBeenNthCalledWith(1, {
      status: Status.PENDING,
    });
    expect(onStatusChangeMock).toHaveBeenNthCalledWith(2, {
      status: Status.ERROR,
    });
    expect(command).toHaveBeenCalledTimes(1);
    expect(command2).not.toHaveBeenCalled();
    expect(command3).not.toHaveBeenCalled();
    expect(graph.statusManager.status).toBe(Status.ERROR);
    expect(graph.statusManager.errors).toStrictEqual({
      [action.id]: 'Error',
    });

    graph.statusManager.subject.unsubscribe();
  });

  it('notifies on graph changes', async () => {
    const graph = new Graph(graphName);
    const graphChangesMock = jest.fn();
    graph.subject.subscribe({
      next: graphChangesMock,
    });
    const command = jest.fn().mockResolvedValue('Ciao');
    const action = new Action(['ADD'], [], command);
    const command2 = jest.fn().mockResolvedValue('Ciao');
    const action2 = new Action([], ['ADD'], command2);
    graph.addNode(action);
    graph.addNode(action2);

    await wait(0);
    await wait(0);

    expect(graphChangesMock).toHaveBeenCalledTimes(4);
    expect(graphChangesMock).toHaveBeenNthCalledWith(1, {
      nodeAdded: action.id,
    });
    expect(graphChangesMock).toHaveBeenNthCalledWith(2, {
      nodeAdded: action2.id,
    });
    expect(graphChangesMock).toHaveBeenNthCalledWith(3, {
      nodeDeleted: action.id,
    });
    expect(graphChangesMock).toHaveBeenNthCalledWith(4, {
      nodeDeleted: action2.id,
    });

    graph.subject.unsubscribe();
  });
});
