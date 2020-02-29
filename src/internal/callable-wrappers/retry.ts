import {IRetryOptions, ITaskCallable} from '../types';
import {delay} from '../utils/delay';

export function retry<T>(
    callable: ITaskCallable<T>,
    options: IRetryOptions = {},
): ITaskCallable<T> {
    const maxRetries = options.maxRetries || 0;
    const retryDelay = options.retryDelay || 0;
    return async (context: T) => {
        let tries = 0;
        let success = false;
        while (!success) {
            tries += 1;
            try {
                await callable(context);
                success = true;
            } catch (e) {
                if (maxRetries > 0 && tries > maxRetries) {
                    throw e;
                }
                if (retryDelay > 0) {
                    await delay(retryDelay);
                }
            }
        }
    };
}
