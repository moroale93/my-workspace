import wait from 'waait';

import ActionStore from '../ActionStore';
import Action from '../Action';

beforeEach(() => {
	ActionStore.getInstance().reset();
});

describe('ActionStore', () => {
	it('create a single instance of an action store', () => {
		expect(ActionStore.getInstance()).toBe(ActionStore.getInstance());
	});

	it('stores an action correctly', () => {
		const actionStore = ActionStore.getInstance();
		const action = new Action([], [], jest.fn().mockResolvedValue('Ciao'));
		actionStore.addAction(action);

		expect(actionStore.getAction(action.id)).toBe(action);
	});

	it('gets actions ids of tags', () => {
		const actionStore = ActionStore.getInstance();
		const action = new Action(['MOVE', 'GROUP'], ['ADD', 'DELETE'], jest.fn().mockResolvedValue('Ciao'));
		actionStore.addAction(action);

		expect(actionStore.getActionIdsOfTags(['MOVE'])).toStrictEqual([action.id]);
		expect(actionStore.getActionIdsOfTags(['GROUP'])).toStrictEqual([action.id]);
		expect(actionStore.getActionIdsOfTags(['ADD'])).toStrictEqual([]);
		expect(actionStore.getActionIdsOfTags(['DELETE'])).toStrictEqual([]);
	});

	it('removes actions ids from tags', async () => {
		const actionStore = ActionStore.getInstance();
		const action = new Action(['MOVE', 'GROUP'], ['ADD', 'DELETE'], jest.fn().mockResolvedValue('Ciao'));
		actionStore.addAction(action);

		action.execute();
		await wait(0);

		expect(actionStore.getActionIdsOfTags(['MOVE'])).toStrictEqual([]);
		expect(actionStore.getActionIdsOfTags(['GROUP'])).toStrictEqual([]);
		expect(actionStore.getAction(action.id)).toBeUndefined();
	});
});
