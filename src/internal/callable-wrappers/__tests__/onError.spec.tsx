import {ITaskCallable} from '../../types';
import {onError} from "../onError";
import {delay} from "../../utils/delay";

describe('onError', () => {
    it('should let the callable resolve', async (done) => {
        const callable: ITaskCallable = async () => {
        };
        await onError(callable, {onError: () => null,})(undefined);
        done();
    });

    it('should call on error', async (done) => {
        let called: boolean = false;
        const error = new Error('TEST ERROR');
        const callable: ITaskCallable = async () => {
            throw error;
        };
        await expect(onError(callable, {
            onError: () => {
                called = true;
            }
        })(undefined)).rejects.toThrow(error);
        expect(called).toBeTruthy();
        done();
    });

    it('should wait for the callback resolution', async (done) => {
        let called: boolean = false;
        const callable: ITaskCallable = async () => {
            throw new Error();
        };
        delay(100).then(() => expect(called).toBeFalsy());
        await expect(onError(callable, {
            onError: async () => {
                expect(called).toBeFalsy();
                await delay(200);
                called = true;
            },
        })(undefined)).rejects.toThrow();
        expect(called).toBeTruthy();
        done();
    });

    it('should propagate the returned error', async (done) => {
        const error1 = new Error('TEST ERROR 1');
        const error2 = new Error('TEST ERROR 2');
        const callable: ITaskCallable = async () => {
            throw error1;
        };
        await expect(onError(callable, {
            onError: (e) => {
                expect(e).toEqual(error1);
                throw error2;
            },
        })(undefined)).rejects.toThrow(error2);
        done();
    });
});
