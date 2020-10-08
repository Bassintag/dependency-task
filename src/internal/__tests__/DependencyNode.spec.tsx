import {DependencyNode} from '../DependencyNode';

describe('DependencyNode', () => {
    it('should save value', () => {
        const value = Math.random();
        const node = new DependencyNode('', value);
        expect(node.value).toBe(value);
    });

    it('should have no edge when constructed', () => {
        const node = new DependencyNode('', undefined);
        expect(node.getEdges()).toStrictEqual([]);
    });

    test('should save added edges', () => {
        const node1 = new DependencyNode('', undefined);
        const node = new DependencyNode('', undefined);
        node.addEdge(node1);
        expect(node.getEdges()).toStrictEqual([node1]);
    });
});
