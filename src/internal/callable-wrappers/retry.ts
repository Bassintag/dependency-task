import { IRetryOptions, ITaskCallable } from '../types';
import { delay } from '../utils/delay';
import { CanceledError } from './cancelable';
import { isRefreshDependencyError } from '../errors/RefreshDependencyError';

export function retry<T, RetryT>(callable: ITaskCallable<T>, options: IRetryOptions<RetryT> = {}): ITaskCallable<T> {
	const maxRetries = options.maxRetries || 0;
	const retryDelay = options.retryDelay || 0;
	return async (context: T) => {
		let tries = 0;
		let success = false;
		while (!success) {
			tries += 1;
			if (options.cancelOptions) {
				const canceled = options.cancelOptions.isCanceled(options.cancelOptions.payload);
				if (canceled) {
					throw new CanceledError(options.cancelOptions.payload);
				}
			}
			try {
				await callable(context);
				success = true;
			} catch (e) {
				let delayAmount: number;
				if (typeof retryDelay === 'number') {
					delayAmount = retryDelay;
				} else {
					delayAmount = retryDelay();
				}
				if (isRefreshDependencyError(e)) {
					await delay(delayAmount);
					throw e;
				}
				if (maxRetries > 0 && tries > maxRetries) {
					throw e;
				}
				if (delayAmount > 0) {
					await delay(delayAmount);
				}
			}
		}
	};
}
