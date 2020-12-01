import { ITaskCallable } from '../../types';
import { retry } from '../retry';

describe('retry', () => {
	it('should let the callable resolve', async (done) => {
		const callable: ITaskCallable = async () => {
			// EMPTY
		};
		await retry(callable)(undefined);
		done();
	});
	it('should retry while the callable fails', async (done) => {
		let tries = 0;
		const callable: ITaskCallable = async () => {
			tries += 1;
			if (tries < 3) {
				throw new Error();
			}
		};
		await retry(callable)(undefined);
		expect(tries).toBe(3);
		done();
	});
	it('should respect retry time', async (done) => {
		let tries = 0;
		let firstCallTime: number;
		let secondCallTime: number;
		const callable: ITaskCallable = async () => {
			tries += 1;
			const timestamp = Date.now();
			if (tries < 2) {
				firstCallTime = timestamp;
				throw new Error();
			} else {
				secondCallTime = timestamp;
			}
		};
		const delay = 500;
		const promise = retry(callable, {
			retryDelay: delay,
		})(undefined);
		setTimeout(async () => {
			expect(tries).toBe(1);
			await promise;
			expect(secondCallTime).toBeGreaterThanOrEqual(firstCallTime + delay);
			expect(tries).toBe(2);
			done();
		}, delay / 2);
	});
	it('should respect retry time getter', async (done) => {
		let tries = 0;
		let firstCallTime: number;
		let secondCallTime: number;
		const callable: ITaskCallable = async () => {
			tries += 1;
			const timestamp = Date.now();
			if (tries < 2) {
				firstCallTime = timestamp;
				throw new Error();
			} else {
				secondCallTime = timestamp;
			}
		};
		const delay = 500;
		const promise = retry(callable, {
			retryDelay: () => {
				expect(tries).toBe(1);
				return delay;
			},
		})(undefined);
		setTimeout(async () => {
			expect(tries).toBe(1);
			await promise;
			expect(secondCallTime).toBeGreaterThanOrEqual(firstCallTime + delay);
			expect(tries).toBe(2);
			done();
		}, delay / 2);
	});
	it('should fail after the max amount of retries', async (done) => {
		let tries = 0;
		const callable: ITaskCallable = async () => {
			tries += 1;
			throw new Error();
		};
		await expect(retry(callable, { maxRetries: 1 })(undefined)).rejects.toThrow();
		expect(tries).toBe(2);
		done();
	});
});
