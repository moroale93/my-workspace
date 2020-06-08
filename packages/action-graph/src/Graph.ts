import Action from './Action';
import NodeExecutor from './NodeExecutor';
import StatusManager from './StatusManager';

export default class Graph {
    public statusManager: StatusManager;

    constructor() {
        this.statusManager = new StatusManager();
    }

    public addNode(action: Action): void {
        this.statusManager.observeAction(action);
        new NodeExecutor(action);
    }
}
