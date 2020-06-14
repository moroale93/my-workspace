import Observable from "./Observable";
import Action, { ActionChange } from "./Action";
import { Status } from "./enums";
import ActionCancelledError from "./ActionCancelledError";

export interface StateChange {
    cancellations: number,
    errors: number,
    status: Status,
}

export default class StatusManager extends Observable<StateChange> {
    public status: Status = Status.COMPLETE;
    public cancellations: number = 0;
    public errors: {[key:string]: any } = {};
    private actions: number = 0;

    public observeAction(action: Action): boolean {
        this.actions++;
        action.subject.subscribe({
            error: error => {
                if (error instanceof ActionCancelledError) {
                    this.onActionCancelled();
                    return;
                }
                this.onActionFailed(action, error);
            },
            next: value => this.onActionChanged(action, value),
        });
        return true;
    }

    private onActionChanged(action: Action, { actionId, result }: ActionChange): void {
        delete this.errors[actionId];
        if (result) {
            return this.onActionCompleted(action);
        }
        this.onActionStarted(action);
    }

    private onActionCancelled(): void {
        this.cancellations++;
        this.updateStatus(true);
    }

    private onActionFailed(action: Action, error: any): void {
        this.errors[action.id] = error;
        this.updateStatus(true);
    }

    private onActionStarted(action: Action) {
        delete this.errors[action.id];
        this.updateStatus(false);
    }

    private onActionCompleted(action: Action) {
        delete this.errors[action.id];
        this.updateStatus(true);
    }

    private updateStatus(completed: boolean) {
        if (completed) {
            this.actions--;
        }
        this.status = !this.actions ? Status.COMPLETE : Status.PENDING;
        this.subject.next({
            cancellations: this.cancellations,
            errors: Object.keys(this.errors).length,
            status: this.status,
        });
    }
}
