import {ISkippableOptions, ITaskCallable} from "../types";

export function skippable<ContextT, T = any>(
	callable: ITaskCallable<ContextT>,
	options: ISkippableOptions<T>
): ITaskCallable<ContextT> {
	return async (context) => {
		if (!options.skip(options.payload)) {
			await callable(context);
		}
	};
}
