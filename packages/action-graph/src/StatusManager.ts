import Observable from "./Observable";
import Action, { ActionChange } from "./Action";
import { Status } from "./enums";

export interface StateChange {
    status: Status,
}

export default class StatusManager extends Observable<StateChange> {
    public status: Status = Status.COMPLETE;
    public errors: {[key:string]: any } = {};
    private actions: number = 0;

    public observeAction(action: Action): boolean {
        if (!this.actions) {
            this.status = Status.PENDING;
            this.notifyObservers(Status.COMPLETE);
        }
        this.actions += 1;
        action.subject.subscribe({
            next: value => this.onActionChanged(action, value),
        });
        return true;
    }

    private onActionChanged(action: Action, { error, result, actionId }: ActionChange): void {
        const previousStatus = this.status;
        if (error) {
            this.errors[actionId] = error;
            this.status = Status.ERROR;
            this.notifyObservers(previousStatus);
            return;
        }
        delete this.errors[actionId];
        if (result) {
            this.onActionCompleted(action);
            return;
        }
        if (!Object.keys(this.errors).length) {
            this.status = Status.PENDING;
            this.notifyObservers(previousStatus);
        }
    }

    private onActionCompleted(action: Action) {
        this.actions -= 1;
        delete this.errors[action.id];
        if (!this.actions) {
            const previousStatus = this.status;
            this.status = Status.COMPLETE;
            this.notifyObservers(previousStatus);
        }
    }

    private notifyObservers(oldState: Status) {
        if (oldState !== this.status) {
            this.subject.next({
                status: this.status,
            });
        }
    }
}
