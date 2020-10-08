import {IRetryOption, ITask, ITaskCallable} from './types';

export class Task<ContextT> implements ITask {

    private readonly _context: ContextT;
    private readonly _runner: ITaskCallable<ContextT>;

    private _complete: boolean;
    private _runningPromise?: Promise<any>;

    get complete(): boolean {
        return this._complete;
    }

    get running(): boolean {
        return this._runningPromise != null;
    }

    constructor(
        context: ContextT,
        runner: ITaskCallable<ContextT>,
    ) {
        this._complete = false;
        this._runningPromise = undefined;
        this._context = context;
        this._runner = runner;
    }

    async run(): Promise<void> {
        if (!this._complete) {
            if (!this.running) {
                this._runningPromise = this._runner(this._context).then(() => {
                    this._runningPromise = undefined;
                    this._complete = true;
                });
            }
            await this._runningPromise;
        }
    }

    public invalidate() {
        this._complete = false;
    }
}