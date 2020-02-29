import {Observable} from 'rxjs';

export interface IRunnable<T = any> {

    run(): Promise<T>;
}

export interface IDisposable {

    dispose(): void;
}

export interface ITask extends IDisposable, IRunnable {

    readonly complete: Observable<void>;
}

export interface IDependencyNode<T> {

    readonly value: T;

    addEdge(node: IDependencyNode<T>): void;

    getEdges(): IDependencyNode<T>[];
}

export type ITaskCallable<ContextT = any> = (context: ContextT) => Promise<void>;

export type IDependencyIds = string | string[];

export type IRetryOption = true | number;

export interface IBuildDependencyTaskStepOptions<ContextT> {

    readonly id: string;

    readonly run: ITaskCallable<ContextT>;

    readonly dependsOn: IDependencyIds;

    readonly optional?: boolean;

    readonly retry?: IRetryOption;

    readonly retryDelay?: number;
}

export interface IBuildDependencyStep<ContextT> {
    options: IBuildDependencyTaskStepOptions<ContextT>;
    node: IDependencyNode<ITask>;
}

export interface IBuildDependencyTaskOptions<ContextT> {

    context: ContextT;

    steps: IBuildDependencyTaskStepOptions<ContextT>[];

    beforeStep?: (step: IBuildDependencyTaskStepOptions<ContextT>) => any;

    afterStep?: (step: IBuildDependencyTaskStepOptions<ContextT>) => any;
}

export interface IRetryOptions {

    maxRetries?: number;

    retryDelay?: number;
}

export interface IWrapOptions<T> {

    before?: (param: T) => any;

    after?: (param: T) => any;

    param: T;
}
