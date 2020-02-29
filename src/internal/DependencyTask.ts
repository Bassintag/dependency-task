import {IDependencyNode, ITask} from './types';
import {forkJoin, Observable, of, ReplaySubject, Subject} from 'rxjs';
import {flatMap, share, take, tap} from 'rxjs/operators';

export class DependencyTask implements ITask {

    private readonly _complete: Subject<void>;

    get complete(): Observable<void> {
        return this._complete.asObservable();
    }

    constructor(
        private readonly _nodes: IDependencyNode<ITask>[],
    ) {
        this._complete = new ReplaySubject<void>();
    }

    public run(): Promise<any> {
        const arr = this._nodes.map((n) => forkJoin([
            of(null), ...n.getEdges().map((e) => e.value.complete.pipe(take(1)))
        ]).pipe(
            tap(() => n.value.run()),
            flatMap(() => n.value.complete),
            take(1),
            share(),
        ));
        const obs = forkJoin(arr);
        obs.subscribe(() => {
            this._complete.next();
        });
        return obs.toPromise();
    }

    public dispose(): void {
        this._complete.complete();
    }

}
