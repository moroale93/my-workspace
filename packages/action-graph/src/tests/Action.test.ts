import { v4 } from 'uuid';
import wait from 'waait';

import Action from '../Action';

jest.mock('uuid');

(v4 as jest.Mock).mockReturnValue('uuid');

const dependencyTags = [
	'ADD_ELEMENT',
	'DELETE_ELEMENTS',
];
const tags = [
	'ADD_ELEMENT',
	'ELEMENT_ID',
];

describe('Action', () => {
	it('create an action', () => {
		const command = jest.fn().mockResolvedValue('Ciao');
		const action = new Action(tags, dependencyTags, command);

		expect(action.id).toBe('uuid');
		expect(action.dependencyTags).toStrictEqual(dependencyTags);
		expect(action.tags).toStrictEqual(tags);
	});

	it('notifies on action completed', async () => {
		const completeMock = jest.fn();
		const nextMock = jest.fn();
		const command = jest.fn().mockResolvedValue('Ciao');
		const action = new Action(tags, dependencyTags, command);
		action.subject.subscribe({
			complete: completeMock,
			next: nextMock,
		});

		action.execute();
		await wait(0);

		expect(nextMock).toHaveBeenCalledTimes(2);
		expect(nextMock).toHaveBeenNthCalledWith(1, {
			actionId: action.id,
		});
		expect(nextMock).toHaveBeenNthCalledWith(2, {
			actionId: action.id,
			result: 'Ciao',
		});
		expect(completeMock).toHaveBeenCalledTimes(1);
	});

	it('notifies on action error', async () => {
		const completeMock = jest.fn();
		const nextMock = jest.fn();
		const command = jest.fn().mockRejectedValue('Error');
		const action = new Action(tags, dependencyTags, command);
		action.subject.subscribe({
			next: nextMock,
			complete: completeMock,
		});

		action.execute();
		await wait(0);

		expect(completeMock).toHaveBeenCalledTimes(0);
		expect(nextMock).toHaveBeenCalledTimes(2);
		expect(nextMock).toHaveBeenCalledWith({
			actionId: 'uuid',
		});
		expect(nextMock).toHaveBeenCalledWith({
			actionId: 'uuid',
			error: 'Error',
		});
	});
});
