import { v4 as uuidv4 } from 'uuid';

import Observable from './Observable';
import ActionCancelledError from './ActionCancelledError';

export interface ActionChange {
    actionId: string
    result?: any
}

export default class Action extends Observable<ActionChange> {
    readonly id: string;
    readonly dependencyTags: string[];
    readonly tags: string[];
    public blockingActionIds: string[];
    private command: () => Promise<any>;

    constructor(tags: string[], dependencyTags: string[], command: () => Promise<any>) {
        super();
        this.id = uuidv4();
        this.dependencyTags = dependencyTags;
        this.tags = tags;
        this.blockingActionIds = [];
        this.command = command;
    }

    public execute(): void {
        this.subject.next({
            actionId: this.id,
        });
        this.command()
            .then(result => {
                this.subject.next({
                    actionId: this.id,
                    result: result || {},
                });
                this.subject.complete();
            })
            .catch(e => {
                this.subject.error(e);
            });
    }

    public cancel(): void {
        this.subject.error(new ActionCancelledError(this.id));
    }
}
