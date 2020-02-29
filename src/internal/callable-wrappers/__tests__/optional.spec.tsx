import {ITaskCallable} from '../../types';
import {optional} from '../optional';

describe('optional', () => {
    it('should let the callable resolve', async (done) => {
        const callable: ITaskCallable = async () => {
        };
        await optional(callable)(undefined);
        done();
    });
    it('should catch the callable error', async (done) => {
        const callable: ITaskCallable = async () => {
            throw new Error();
        };
        await optional(callable)(undefined);
        done();
    });
});
