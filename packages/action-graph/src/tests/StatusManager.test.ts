import wait from 'waait';

import StatusManager from '../StatusManager';
import Action from '../Action';
import { Status } from '../enums';

describe('StatusManager', () => {
  it('get updates on status changes', async () => {
    const command = jest.fn().mockResolvedValue('Ciao');
    const action = new Action([], [], command);
    const statusManager = new StatusManager();
    const onStatusChangeMock = jest.fn();
    const subscription = statusManager.subject.subscribe({
      next: onStatusChangeMock,
    });
    statusManager.observeAction(action);

    action.execute();
    await wait(0);

    expect(onStatusChangeMock).toHaveBeenCalledTimes(2);
    expect(onStatusChangeMock).toHaveBeenNthCalledWith(1, {
      status: Status.PENDING,
      errors: 0,
      cancellations: 0,
    });
    expect(onStatusChangeMock).toHaveBeenNthCalledWith(2, {
      status: Status.COMPLETE,
      errors: 0,
      cancellations: 0,
    });
    subscription.unsubscribe();
  });

  it('get updates on error status changes', async () => {
    const command = jest.fn().mockRejectedValue('Error');
    const action = new Action([], [], command);
    const statusManager = new StatusManager();
    const onStatusChangeMock = jest.fn();
    const subscription = statusManager.subject.subscribe({
      next: onStatusChangeMock,
    });
    statusManager.observeAction(action);

    action.execute();
    await wait(0);

    expect(onStatusChangeMock).toHaveBeenCalledTimes(2);
    expect(onStatusChangeMock).toHaveBeenNthCalledWith(1, {
      status: Status.PENDING,
      errors: 0,
      cancellations: 0,
    });
    expect(onStatusChangeMock).toHaveBeenNthCalledWith(2, {
      status: Status.COMPLETE,
      errors: 1,
      cancellations: 0,
    });
    subscription.unsubscribe();
  });

  it('updates status when there are multiple errors', async () => {
    const command = jest.fn()
      .mockRejectedValue('Error');
    const command2 = jest.fn()
      .mockRejectedValue('Error');
    const command3 = jest.fn()
      .mockResolvedValue('Ciao');
    const action = new Action(['A'], [], command);
    const action2 = new Action(['B'], [], command2);
    const action3 = new Action(['C'], ['A'], command3);
    const statusManager = new StatusManager();
    const onStatusChangeMock = jest.fn();
    const subscription = statusManager.subject.subscribe({
      next: onStatusChangeMock,
    });
    statusManager.observeAction(action);
    statusManager.observeAction(action2);
    statusManager.observeAction(action3);

    action.execute();
    await wait(0);

    expect(onStatusChangeMock).toHaveBeenCalledTimes(2);

    expect(onStatusChangeMock).toHaveBeenNthCalledWith(1, {
      status: Status.PENDING,
      errors: 0,
      cancellations: 0,
    });
    expect(onStatusChangeMock).toHaveBeenNthCalledWith(2, {
      status: Status.PENDING,
      errors: 1,
      cancellations: 0,
    });

    action2.execute();
    await wait(0);

    expect(onStatusChangeMock).toHaveBeenCalledTimes(4);

    expect(onStatusChangeMock).toHaveBeenNthCalledWith(3, {
      status: Status.PENDING,
      errors: 1,
      cancellations: 0,
    });
    expect(onStatusChangeMock).toHaveBeenNthCalledWith(4, {
      status: Status.PENDING,
      errors: 2,
      cancellations: 0,
    });

    action3.cancel();
    await wait(0);

    expect(onStatusChangeMock).toHaveBeenCalledTimes(5);
    expect(onStatusChangeMock).toHaveBeenNthCalledWith(5, {
      status: Status.COMPLETE,
      errors: 2,
      cancellations: 1,
    });

    subscription.unsubscribe();
  });
});
