import { v4 as uuidv4 } from 'uuid';

import Observable from './Observable';

export interface ActionChange {
    actionId: string
    error?: any
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
                    result,
                });
                this.subject.complete();
            })
            .catch(e => this.subject.next({
               actionId: this.id,
               error: e,
            }));
    }
}
