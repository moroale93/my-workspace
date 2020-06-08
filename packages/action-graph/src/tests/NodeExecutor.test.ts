import wait from 'waait';

import NodeExecutor from '../NodeExecutor';
import ActionStore from '../ActionStore';
import Action from '../Action';

beforeEach(() => {
	ActionStore.getInstance().reset();
});

describe('NodeExecutor', () => {
	it('executes an action if it has no dependencies and clean up the tag manager', async () => {
		const command = jest.fn().mockResolvedValue('Ciao');
		const action = new Action(['ADD', 'MOVE'], [], command);
		new NodeExecutor(action);
		await wait(0);
		
		expect(command).toHaveBeenCalledTimes(1);
		expect(ActionStore.getInstance().getAction(action.id)).toBeUndefined();
		expect(ActionStore.getInstance()
			.getActionIdsOfTags(['ADD', 'MOVE'])).toStrictEqual([]);
	});

	it('executes an action with dependencies when all of them have been completed', async () => {
		const command2 = jest.fn().mockResolvedValue('Ciao');
		const command3 = jest.fn().mockResolvedValue('Ciao');
		const command = jest.fn().mockResolvedValue('Ciao');
		const action2 = new Action(['FIRST'], [], command2);
		const action3 = new Action(['SECOND'], [], command3);
		const action = new Action([], ['FIRST', 'SECOND'], command);
		
		ActionStore.getInstance().addAction(action2);
		ActionStore.getInstance().addAction(action3);
		new NodeExecutor(action);
		expect(action.blockingActionIds).toStrictEqual([action2.id, action3.id]);
		await wait(0);
		
		expect(command).not.toHaveBeenCalled();
		expect(ActionStore.getInstance().getAction(action.id)).not.toBeUndefined();
		expect(ActionStore.getInstance().getAction(action2.id)).not.toBeUndefined();
		expect(ActionStore.getInstance().getAction(action3.id)).not.toBeUndefined();

		action2.execute();
		await wait(0);
		
		expect(command).not.toHaveBeenCalled();
		expect(ActionStore.getInstance().getAction(action.id)).not.toBeUndefined();
		expect(ActionStore.getInstance().getAction(action2.id)).toBeUndefined();
		expect(ActionStore.getInstance().getAction(action3.id)).not.toBeUndefined();

		action3.execute();
		await wait(0);
		
		expect(command).toHaveBeenCalled();
		expect(ActionStore.getInstance().getAction(action.id)).toBeUndefined();
		expect(ActionStore.getInstance().getAction(action2.id)).toBeUndefined();
		expect(ActionStore.getInstance().getAction(action3.id)).toBeUndefined();
	});

	it('doesn\'t execute an action with dependencies when one of them failed', async () => {
		const command2 = jest.fn().mockRejectedValue('Error');
		const command3 = jest.fn().mockResolvedValue('Ciao');
		const command = jest.fn().mockResolvedValue('Ciao');
		const action2 = new Action(['FIRST'], [], command2);
		const action3 = new Action(['SECOND'], [], command3);
		const action = new Action([], ['FIRST', 'SECOND'], command);
		
		ActionStore.getInstance().addAction(action2);
		ActionStore.getInstance().addAction(action3);
		new NodeExecutor(action);
		await wait(0);
		
		expect(command).not.toHaveBeenCalled();
		
		action2.execute();
		action3.execute();
		await wait(0);
		
		expect(command).not.toHaveBeenCalled();
		expect(ActionStore.getInstance().getAction(action.id)).not.toBeUndefined();
		expect(ActionStore.getInstance().getAction(action2.id)).not.toBeUndefined();
		expect(ActionStore.getInstance().getAction(action3.id)).toBeUndefined();
	});
});
