import wait from 'waait';

import StatusManager from '../StatusManager';
import Action from '../Action';
import { Status } from '../enums';

describe('StatusManager', () => {
	it('get updates on status changes', async () => {
		const command = jest.fn()
			.mockRejectedValueOnce('Error')
			.mockResolvedValue('Ciao');
		const action = new Action([], [], command);
		const statusManager = new StatusManager();
		const onStatusChangeMock = jest.fn();
		statusManager.subject.subscribe({
			next: onStatusChangeMock,
		});
		statusManager.observeAction(action);

		action.execute();
		await wait(0);

		expect(onStatusChangeMock).toHaveBeenCalledTimes(2);
		expect(onStatusChangeMock).toHaveBeenNthCalledWith(1, {
			status: Status.PENDING,
		});
		expect(onStatusChangeMock).toHaveBeenNthCalledWith(2, {
			status: Status.ERROR,
		});

		action.execute();
		await wait(0);

		expect(onStatusChangeMock).toHaveBeenCalledTimes(4);
		expect(onStatusChangeMock).toHaveBeenNthCalledWith(3, {
			status: Status.PENDING,
		});
		expect(onStatusChangeMock).toHaveBeenNthCalledWith(4, {
			status: Status.COMPLETE,
		});
	});

	it('updates status when there are multiple errors', async () => {
		const command = jest.fn()
			.mockRejectedValueOnce('Error')
			.mockResolvedValue('Ciao');
		const command2 = jest.fn()
			.mockRejectedValueOnce('Error')
			.mockResolvedValue('Ciao');
		const action = new Action([], [], command);
		const action2 = new Action([], [], command2);
		const statusManager = new StatusManager();
		const onStatusChangeMock = jest.fn();
		statusManager.subject.subscribe({
			next: onStatusChangeMock,
		});
		statusManager.observeAction(action);
		statusManager.observeAction(action2);

		action.execute();
		await wait(0);

		expect(onStatusChangeMock).toHaveBeenCalledTimes(2);
		expect(onStatusChangeMock).toHaveBeenNthCalledWith(1, {
			status: Status.PENDING,
		});
		expect(onStatusChangeMock).toHaveBeenNthCalledWith(2, {
			status: Status.ERROR,
		});

		action2.execute();
		await wait(0);
		
		expect(onStatusChangeMock).toHaveBeenCalledTimes(2);

		action.execute();
		await wait(0);

		expect(onStatusChangeMock).toHaveBeenCalledTimes(2);

		action2.execute();
		await wait(0);
		
		expect(onStatusChangeMock).toHaveBeenCalledTimes(4);

		expect(onStatusChangeMock).toHaveBeenNthCalledWith(3, {
			status: Status.PENDING,
		});
		expect(onStatusChangeMock).toHaveBeenNthCalledWith(4, {
			status: Status.COMPLETE,
		});
	});
});
