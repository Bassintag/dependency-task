export interface IRunnable<T = any> {
	run(): Promise<T>;
}

export interface IDisposable {
	dispose(): void;
}

export interface IPausable {
	pause(): void;
}

export interface ITask extends IRunnable {
	readonly running: boolean;

	readonly complete: boolean;

	invalidate(): void;
}

export interface IDependencyTask extends ITask, IPausable {
	invalidateById(id: string, recursive?: boolean): void;
}

export interface IDependencyNode<T> {
	readonly id: string;

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

	readonly dependsOn?: IDependencyIds;

	readonly optional?: boolean;

	readonly retry?: IRetryOption;

	readonly retryDelay?: number | (() => number);

	readonly onError?: (error: any) => any;

	readonly meta?: any;

	readonly isCanceled?: (step: IBuildDependencyTaskStepOptions<ContextT>) => boolean;

	readonly skip?: (step: IBuildDependencyTaskStepOptions<ContextT>) => boolean;

	readonly beforeStep?: (step: IBuildDependencyTaskStepOptions<ContextT>) => any;

	readonly afterStep?: (step: IBuildDependencyTaskStepOptions<ContextT>) => any;
}

export interface IBuildDependencyStep<ContextT> {
	options: IBuildDependencyTaskStepOptions<ContextT>;

	node: IDependencyNode<ITask>;
}

export interface IBuildDependencyTaskOptions<ContextT> {
	context: ContextT;

	steps: IBuildDependencyTaskStepOptions<ContextT>[];

	defaults?: Partial<IBuildDependencyTaskStepOptions<ContextT>>;
}

export interface IRetryOptions<T> {
	maxRetries?: number;

	retryDelay?: number | (() => number);

	cancelOptions?: ICancelableOptions<T>;
}

export interface ICancelableOptions<T> {
	isCanceled: (payload: T) => boolean;

	payload: T;
}

export interface ISkippableOptions<T> {
	skip: (payload: T) => boolean;

	payload: T;
}

export interface IOnErrorOptions {
	onError: (error: any) => any;
}

export interface IWrapOptions<T> {
	before?: (param: T) => any;

	after?: (param: T) => any;

	param: T;
}
