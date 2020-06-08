import Action from "./Action";
import TagManager from './TagManager';

export default class ActionStore {
    private static instance: ActionStore;
    private tagManager: TagManager;
    private actions: {[key: string]: Action} = {};

    private constructor() {
        this.tagManager = new TagManager();
    }

    public static getInstance(): ActionStore {
        if (!ActionStore.instance) {
            ActionStore.instance = new ActionStore();
        }
        return ActionStore.instance;
    }

    public addAction(action: Action): void {
        this.actions[action.id] = action;
        this.tagManager.addToTags(action.tags, action.id);
        action.subject.subscribe({complete: () => this.removeAction(action.id)});
    }

    private removeAction(actionId: string): void {
        this.tagManager.removeFromTags(this.getAction(actionId).tags, actionId);
        delete this.actions[actionId];
    }

    public getAction(actionId: string): Action {
        return this.actions[actionId];
    }

    public getActionIdsOfTags(tags: string[]): string[] {
        return Object.keys(tags.map(tag => this.tagManager.getTag(tag))
            .reduce((result, current) => {
                const ret: {[key: string]: boolean} = { ...result };
                current.forEach(val => ret[val] = true);
                return ret;
            },{}));
    }

    public reset() {
        // made for testing purpose
        delete ActionStore.instance;
    }
}