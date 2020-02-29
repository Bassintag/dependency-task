import {ITask, ITaskCallable} from './types';
import {Observable, ReplaySubject, Subject, Subscribable} from 'rxjs';

export class Task<ContextT> implements ITask {

    private readonly _subject: Subject<void>;
    private readonly _context: ContextT;
    private readonly _runner: ITaskCallable<ContextT>;

    get complete(): Observable<void> {
        return this._subject.asObservable();
    }

    constructor(
        context: ContextT,
        runner: ITaskCallable<ContextT>,
    ) {
        this._subject = new ReplaySubject();
        this._context = context;
        this._runner = runner;
    }

    async run(): Promise<void> {
        await this._runner(this._context);
        this._subject.next();
    }

    dispose(): void {
        this._subject.complete();
    }
}
