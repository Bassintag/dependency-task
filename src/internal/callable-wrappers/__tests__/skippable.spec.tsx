import {ITaskCallable} from '../../types';
import {optional} from '../optional';
import {skippable} from "../skippable";

describe('skippable', () => {
    it('should let the callable resolve', async (done) => {
        let called = false;
        expect(called).toBeFalsy();
        const callable: ITaskCallable = async () => {
            expect(called).toBeFalsy();
            called = true;
        };
        await skippable(callable, {
            skip: () => false,
            payload: null,
        })(undefined);
        expect(called).toBeTruthy();
        done();
    });
    it('should skip if function is true', async (done) => {
        let called = false;
        expect(called).toBeFalsy();
        const callable: ITaskCallable = async () => {
            called = true
        };
        await skippable(callable, {
            skip: () => true,
            payload: null,
        })(undefined);
        expect(called).toBeFalsy();
        done();
    });
});
