import {ITaskCallable} from '../types';

export function optional<T>(
    callable: ITaskCallable<T>,
): ITaskCallable<T> {
    return async (context: T) => {
        await callable(context).catch(() => null);
    };
}
