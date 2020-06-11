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
    private blockingErrors: boolean;

    constructor(tags: string[], dependencyTags: string[], command: () => Promise<any>, blockingErrors: boolean = true) {
        super();
        this.id = uuidv4();
        this.dependencyTags = dependencyTags;
        this.tags = tags;
        this.blockingActionIds = [];
        this.command = command;
        this.blockingErrors = blockingErrors;
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
            .catch(e => {
                this.subject.next({
                    actionId: this.id,
                    error: e,
                });
                if (!this.blockingErrors) {
                    this.subject.complete();
                }
            });
    }
}
