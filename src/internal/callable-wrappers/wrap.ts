import {ITaskCallable, IWrapOptions} from '../types';

export function wrap<ContextT, T>(
    callable: ITaskCallable<ContextT>,
    options: IWrapOptions<T>,
): ITaskCallable<ContextT> {
    const {before, after} = options;
    return async (context) => {
        if (before) {
            before(options.param);
        }
        await callable(context);
        if (after) {
            after(options.param);
        }
    }
}
