import {IOnErrorOptions, ITaskCallable} from '../types';

export function onError<ContextT>(
	callable: ITaskCallable<ContextT>,
	options: IOnErrorOptions,
): ITaskCallable<ContextT> {
	return async (context) => {
		try {
			await callable(context);
		} catch (e) {
			let error = e;
			try {
				await options.onError(e);
			} catch (e1) {
				error = e1;
			}
			throw error;
		}
	}
}
