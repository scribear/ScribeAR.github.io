/**
 * 
 * @param weight 
 * @param lhs 
 * @param rhs 
 * @returns 
 */
const weightedAverage = (weight: number, lhs: number[], rhs: number[]) =>
    lhs.map((x, i) => weight * x + (1 - weight) * rhs[i]);

/**
 * Class for subclusters and edges between subclusters.
 */
class Subcluster {
    input_vectors: number[][];
    centroid: number[];
    n_vectors: number;
    store_vectors: boolean;
    connected_subclusters: Set<Subcluster>;

    constructor(initial_vector: number[], n_vectors: number, store_vectors: boolean = false) {
        this.input_vectors = [initial_vector];
        this.centroid = initial_vector;
        this.n_vectors = 1;
        this.store_vectors = store_vectors;
        this.connected_subclusters = new Set<Subcluster>();
    }

    /**
     * Add a new vector to the subcluster, update the centroid.
     * @param {number[]} vector 
     */
    add(vector: number[]) {
        if (this.store_vectors) {
            this.input_vectors.push(vector);
        }
        this.n_vectors++;
        if (this.centroid === undefined) {
            this.centroid = vector;
        } else {
            this.centroid = weightedAverage(
                (this.n_vectors - 1) / this.n_vectors,
                this.centroid,
                vector,
            );
        }
    }

    /**
     * Merge subcluster_merge into self. Update centroids.
     * @param subcluster_merge 
     * @param delete_merged 
     */
    merge(subcluster_merge: Subcluster, delete_merged: boolean = true) {
        if (this.store_vectors) {
            this.input_vectors = this.input_vectors.concat(subcluster_merge.input_vectors);
        }

        // Update centroid and n_vectors
        this.centroid = weightedAverage(
            this.n_vectors / (this.n_vectors + subcluster_merge.n_vectors),
            this.centroid,
            subcluster_merge.centroid,
        );
        this.n_vectors += subcluster_merge.n_vectors;
        
        const res1 = subcluster_merge.connected_subclusters.delete(this);
        const res2 = this.connected_subclusters.delete(subcluster_merge);
        if (!res1 || !res2) {
            console.log("Attempted to merge unconnected subclusters. Merging anyway.");
        }

        subcluster_merge.connected_subclusters.forEach(sc => {
            sc.connected_subclusters.delete(subcluster_merge);
            if (!sc.connected_subclusters.has(this) && sc !== this) {
                sc.connected_subclusters.add(this);
            }
        });
        
        this.connected_subclusters.add(subcluster_merge.connected_subclusters);
        if (delete_merged) {
            delete subcluster_merge;
        }
    }
}
