import { forkJoin } from 'rxjs';

import Action from './Action';
import ActionStore from './ActionStore';

export default class NodeExecutor {
    constructor(action: Action) {
        const actionStore = ActionStore.getInstance();
        action.blockingActionIds = actionStore.getActionIdsOfTags(action.dependencyTags);
        actionStore.addAction(action);
        const blockingActions = action.blockingActionIds.map(actionId => actionStore.getAction(actionId));
        if (blockingActions.length) {
            return forkJoin(blockingActions.map(blockingAction => blockingAction.subject.toPromise()))
                .subscribe({
                    complete: () => {
                        action.execute();
                    },
                });
        }
        action.execute();
    }
}
