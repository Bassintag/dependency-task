import {IDependencyNode} from './types';

export class DependencyNode<T> implements IDependencyNode<T> {

    private readonly _edges: IDependencyNode<T>[];

    constructor(
        readonly id: string,
        readonly value: T,
    ) {
        this._edges = [];
    }

    addEdge(
        node: IDependencyNode<T>,
    ): void {
        this._edges.push(node);
    }

    getEdges(): IDependencyNode<T>[] {
        return this._edges;
    }
}
