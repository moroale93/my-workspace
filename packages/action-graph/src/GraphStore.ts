import Graph from './Graph';

export default class GraphStore {
    private static instance: GraphStore;
    private graphs: { [key: string]: Graph } = {};

    private constructor() { }

    public getGraph(graphName: string): Graph {
        if (!this.graphs[graphName]) {
            this.graphs[graphName] = new Graph(graphName);
        }
        return this.graphs[graphName];
    }

    public static getInstance(): GraphStore {
        if (!GraphStore.instance) {
            GraphStore.instance = new GraphStore();
        }
        return GraphStore.instance;
    }
}
