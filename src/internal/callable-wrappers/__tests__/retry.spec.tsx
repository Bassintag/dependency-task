import {ITaskCallable} from '../../types';
import {retry} from '../retry';

describe('retry', () => {
    it('should let the callable resolve', async (done) => {
        const callable: ITaskCallable = async () => {
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

    it('should fail after the max amount of retries', async (done) => {
        let tries = 0;
        const callable: ITaskCallable = async () => {
            tries += 1;
            throw new Error();
        };
        await expect(retry(callable, {maxRetries: 1})(undefined)).rejects.toThrow();
        expect(tries).toBe(2);
        done();
    });
});
