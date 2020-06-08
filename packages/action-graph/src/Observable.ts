import { Subject } from 'rxjs';

export default class Observable<T> {
    readonly subject: Subject<T>;

    constructor() {
        this.subject = new Subject<T>();
    }
}
