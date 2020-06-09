import Action from './Action';
import NodeExecutor from './NodeExecutor';
import StatusManager from './StatusManager';
import Observable from './Observable';

interface GraphChanges {
    nodeAdded?: string,
    nodeDeleted?: string,
}

export default class Graph extends Observable<GraphChanges> {
    public statusManager: StatusManager;

    constructor() {
        super();
        this.statusManager = new StatusManager();
    }

    public addNode(action: Action): void {
        action.subject.subscribe({
            complete: () => this.subject.next({ nodeDeleted: action.id }),
        })
        this.statusManager.observeAction(action);
        new NodeExecutor(action);
        this.subject.next({ nodeAdded: action.id })
    }
}
