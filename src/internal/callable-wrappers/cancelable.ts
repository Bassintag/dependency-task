import {ICancelableOptions, ITaskCallable} from "../types";

export class CanceledError<T = any> extends Error {

	constructor(
		readonly payload: T,
	) {
		super('Task canceled');
	}
}

export function cancelable<ContextT, T = any>(
	callable: ITaskCallable<ContextT>,
	options: ICancelableOptions<T>,
): ITaskCallable<ContextT> {
	return async (context) => {
		if (options.isCanceled(options.payload)) {
			throw new CanceledError(options.payload);
		} else {
			await callable(context);
		}
	};
}