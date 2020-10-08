import {IOnErrorOptions, ITaskCallable} from '../types';

export function onError<ContextT>(
    callable: ITaskCallable<ContextT>,
    options: IOnErrorOptions,
): ITaskCallable<ContextT> {
    return async (context) => {
        try {
            await callable(context);
        } catch (e) {
            await options.onError(e);
            throw e;
        }
    }
}
