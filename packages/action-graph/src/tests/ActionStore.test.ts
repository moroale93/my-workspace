import wait from 'waait';

import ActionStore from '../ActionStore';
import Action from '../Action';

const graphName = "test";

beforeEach(() => {
	ActionStore.getInstance(graphName).reset(graphName);
});

describe('ActionStore', () => {
	it('create a single instance of an action store', () => {
		expect(ActionStore.getInstance(graphName)).toBe(ActionStore.getInstance(graphName));
	});

	it('isolates instances of action stores', () => {
		const action = new Action([], [], jest.fn().mockResolvedValue('Ciao'));
		ActionStore.getInstance(graphName).addAction(action);
		const action2 = new Action([], [], jest.fn().mockResolvedValue('Ciao'));
		ActionStore.getInstance(`${graphName}2`).addAction(action2);

		expect(ActionStore.getInstance(graphName).getAction(action.id))
			.toBe(action);
		expect(ActionStore.getInstance(graphName).getAction(action2.id))
			.toBeUndefined();
	});

	it('stores an action correctly', () => {
		const actionStore = ActionStore.getInstance(graphName);
		const action = new Action([], [], jest.fn().mockResolvedValue('Ciao'));
		actionStore.addAction(action);

		expect(actionStore.getAction(action.id)).toBe(action);
	});

	it('gets actions ids of tags', () => {
		const actionStore = ActionStore.getInstance(graphName);
		const action = new Action(['MOVE', 'GROUP'], ['ADD', 'DELETE'], jest.fn().mockResolvedValue('Ciao'));
		actionStore.addAction(action);

		expect(actionStore.getActionIdsOfTags(['MOVE'])).toStrictEqual([action.id]);
		expect(actionStore.getActionIdsOfTags(['GROUP'])).toStrictEqual([action.id]);
		expect(actionStore.getActionIdsOfTags(['ADD'])).toStrictEqual([]);
		expect(actionStore.getActionIdsOfTags(['DELETE'])).toStrictEqual([]);
	});

	it('removes actions ids from tags', async () => {
		const actionStore = ActionStore.getInstance(graphName);
		const action = new Action(['MOVE', 'GROUP'], ['ADD', 'DELETE'], jest.fn().mockResolvedValue('Ciao'));
		actionStore.addAction(action);

		action.execute();
		await wait(0);

		expect(actionStore.getActionIdsOfTags(['MOVE'])).toStrictEqual([]);
		expect(actionStore.getActionIdsOfTags(['GROUP'])).toStrictEqual([]);
		expect(actionStore.getAction(action.id)).toBeUndefined();
	});
});
