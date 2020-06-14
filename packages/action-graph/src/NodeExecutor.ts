import { forkJoin } from 'rxjs';

import Action from './Action';
import ActionStore from './ActionStore';

export default class NodeExecutor {
  constructor(action: Action, graphName: string) {
    const actionStore = ActionStore.getInstance(graphName);
    action.blockingActionIds = actionStore.getActionIdsOfTags(action.dependencyTags);
    actionStore.addAction(action);
    const blockingActions = action.blockingActionIds.map(actionId => actionStore.getAction(actionId));
    if (blockingActions.length) {
      blockingActions.forEach(blockingAction => blockingAction.subject.subscribe({
        error: () => action.cancel(),
        complete: () => action.blockingActionIds = action.blockingActionIds.filter(id => id !== blockingAction.id),
      }));
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
