export {}

/**
 * 
 * @param weight weight given to lhs
 * @param lhs vector in R^n
 * @param rhs vector in R^n
 * @returns 
 */
function weightedAverage(weight: number, lhs: number[], rhs: number[]): number[] {
    return lhs.map((x, i) => weight * x + (1 - weight) * rhs[i]);
}

/**
 * 
 * @param lhs unit vector in R^n
 * @param rhs unit vector in R^n
 */
function cosine(lhs: number[], rhs: number[]): number {
    // console.log(18, lhs.reduce((sum, x, i) => sum + x * rhs[i]));
    const dot = lhs.reduce((sum, x, i) => sum + x * rhs[i]);
    if (dot > 1.0) {
        return Math.acos(dot - 1);
    } else {
        return Math.acos(dot);
    }
}

/**
 * Class for subclusters and edges between subclusters.
 */
class Subcluster {
    input_vectors: number[][];
    centroid: number[];
    n_vectors: number;
    store_vectors: boolean;
    connected_subclusters: Set<Subcluster>;

    constructor(initial_vector: number[], store_vectors: boolean = false) {
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
    add(vector: number[]): void {
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
    merge(subcluster_merge: Subcluster): void {
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

        subcluster_merge.connected_subclusters.delete(this);
        this.connected_subclusters.delete(subcluster_merge);

        subcluster_merge.connected_subclusters.forEach(sc => {
            sc.connected_subclusters.delete(subcluster_merge);
            if (!sc.connected_subclusters.has(this) && sc !== this) {
                sc.connected_subclusters.add(this);
            }
        });

        subcluster_merge.connected_subclusters.forEach(sub_cluster => this.connected_subclusters.add(sub_cluster));
    }
}

/**
 * An online clustering algorithm.
 */
class LinksCluster {
    clusters: Subcluster[][];
    cluster_similarity_threshold: number;
    subcluster_similarity_threshold: number;
    pair_similarity_maximum: number;
    store_vectors: boolean;

    constructor(
        cluster_similarity_threshold: number,
        subcluster_similarity_threshold: number,
        pair_similarity_threshold: number,
        store_vectors: boolean = false) {
        this.clusters = [];
        this.cluster_similarity_threshold = cluster_similarity_threshold;
        this.subcluster_similarity_threshold = subcluster_similarity_threshold;
        this.pair_similarity_maximum = pair_similarity_threshold;
        this.store_vectors = store_vectors;
    }

    /**
     * Predict a cluster id for new_vector.
     * @param new_vector 
     * @returns 
     */
    predict(new_vector: number[]): number {
        if (this.clusters.length === 0) {
            this.clusters.push([new Subcluster(new_vector, this.store_vectors)]);
        }

        let best_subcluster: Subcluster | null = null;
        let best_similarity = -Infinity;
        let best_subcluster_cluster_id: number = NaN;
        let best_subcluster_id: number = NaN;

        this.clusters.forEach((cl, cl_idx) => {
            cl.forEach((sc, sc_idx) => {
                // console.log(new_vector, sc.centroid);
                let cossim = 1.0 - cosine(new_vector, sc.centroid);
                // console.log('cossim: ', cossim);
                if (cossim > best_similarity) {
                    best_subcluster = sc;
                    best_similarity = cossim;
                    best_subcluster_cluster_id = cl_idx;
                    best_subcluster_id = sc_idx;
                }
            });
        });

        let assigned_cluster: number;
        console.log('best_similarity: ', best_similarity, 'sub threshd: ', this.cluster_similarity_threshold, this.subcluster_similarity_threshold, this.pair_similarity_maximum);
        if (best_similarity >= this.subcluster_similarity_threshold) { // eq. (20)
            best_subcluster!.add(new_vector);
            this.update_cluster(best_subcluster_cluster_id, best_subcluster_id);
            assigned_cluster = best_subcluster_cluster_id;
        } else {
            let new_subcluster = new Subcluster(new_vector, this.store_vectors);
            let cossim = 1.0 - cosine(new_subcluster.centroid, best_subcluster!.centroid);
            if (cossim >= this.sim_threshold(best_subcluster!.n_vectors, 1)) { // eq. (21)
                // New subcluster is part of existing cluster
                LinksCluster.add_edge(best_subcluster!, new_subcluster);
                this.clusters[best_subcluster_cluster_id].push(new_subcluster);
                assigned_cluster = best_subcluster_cluster_id;
            } else {
                // New subcluster is a new cluster
                this.clusters.push([new_subcluster]);
                assigned_cluster = this.clusters.length - 1;
            }
        }

        return assigned_cluster;
    }

    static add_edge(lhs: Subcluster, rhs: Subcluster): void {
        lhs.connected_subclusters.add(rhs);
        rhs.connected_subclusters.add(lhs);
    }

    /**
     * Compare subclusters sc1 and sc2, remove or add an edge depending on cosine similarity.
     * @param {Subcluster} lhs First subcluster to compare
     * @param {Subcluster} rhs Second subcluster to compare
     * @returns {boolean} true if the edge is valid; false if the edge is not valid
     */
    update_edge(lhs: Subcluster, rhs: Subcluster): boolean {
        let cossim = 1.0 - cosine(lhs.centroid, rhs.centroid);
        let threshold = this.sim_threshold(lhs.n_vectors, rhs.n_vectors);
        if (cossim < threshold) {
            lhs.connected_subclusters.delete(rhs);
            rhs.connected_subclusters.delete(lhs);
            return false;
        } else {
            lhs.connected_subclusters.add(rhs);
            rhs.connected_subclusters.add(lhs);
            return true;
        }
    }

    /**
     * Merge subclusters with id's sc_idx1 and sc_idx2 of cluster with id cl_idx.
     * @param cl_idx 
     * @param lsc_idx 
     * @param rsc_idx 
     */
    merge_subclusters(cl_idx: number, lsc_idx: number, rsc_idx: number): void {
        let rsc = this.clusters[cl_idx][rsc_idx];
        this.clusters[cl_idx][lsc_idx].merge(rsc);
        this.update_cluster(cl_idx, lsc_idx);
        this.clusters[cl_idx].splice(rsc_idx, 1);
        this.clusters[cl_idx].forEach(sc =>
            sc.connected_subclusters.forEach(sc2 =>
                sc.connected_subclusters.delete(sc2)));
    }

    /**
     * Subcluster with id sc_idx has been changed, and we want to
     * update the parent cluster according to the discussion in
     * section 3.4 of the paper.
     * @param {number} cl_idx The index of the cluster to update
     * @param {number} sc_idx The index of the subcluster that has been changed
     */
    update_cluster(cl_idx: number, sc_idx: number): void {
        let updated_sc = this.clusters[cl_idx][sc_idx];
        let severed_subclusters: number[] = [];
        let connected_scs = new Set(updated_sc.connected_subclusters);
        connected_scs.forEach(connected_sc => {
            let connected_sc_idx: number | undefined = undefined;
            this.clusters[cl_idx].forEach((sc, c_sc_idx) => {
                if (sc === connected_sc) {
                    connected_sc_idx = c_sc_idx;
                }
            });
            let cossim = 1.0 - cosine(updated_sc.centroid, connected_sc.centroid);
            if (cossim >= this.subcluster_similarity_threshold) {
                this.merge_subclusters(cl_idx, sc_idx, connected_sc_idx!);
            } else {
                let are_connected = this.update_edge(updated_sc, connected_sc);
                if (!are_connected) {
                    severed_subclusters.push(connected_sc_idx!);
                }
            }
        });
        severed_subclusters.forEach(severed_sc_id => {
            let severed_sc = this.clusters[cl_idx][severed_sc_id];
            if (severed_sc.connected_subclusters.size === 0) {
                this.clusters[cl_idx].forEach(cluster_sc => {
                    if (cluster_sc !== severed_sc) {
                        let cossim = 1.0 - cosine(cluster_sc.centroid, severed_sc.centroid);
                        if (cossim >= this.sim_threshold(cluster_sc.n_vectors, severed_sc.n_vectors)) {
                            LinksCluster.add_edge(cluster_sc, severed_sc);
                        }
                    }
                })
            }
            if (severed_sc.connected_subclusters.size === 0) {
                this.clusters[cl_idx].splice(severed_sc_id, 1);
                this.clusters.push([severed_sc]);
            }
        });
    }

    /**
     * Return all stored vectors from entire history.
     * @returns {number[][]} A list of vectors (Subcluster)
     */
    get_all_vectors(): number[][] {
        return this.clusters.flatMap(cl => cl.flatMap(scl => scl.input_vectors));
    }

    /**
     * Compute the similarity threshold.
     * This is based on equations (16) and (24) of the paper.
     * @param {number} k The number of vectors in a cluster or subcluster
     * @param {number} kp k-prime in the paper, the number of vectors in another cluster or subcluster
     * @returns {nnumber} The similarity threshold for inclusion in a cluster or subcluster.
     */
    sim_threshold(k: number, kp: number): number {
        let s = (1.0 + 1.0 / k * (1.0 / this.cluster_similarity_threshold ** 2 - 1.0));
        s *= (1.0 + 1.0 / kp * (1.0 / this.cluster_similarity_threshold ** 2 - 1.0));
        s = 1.0 / (s ** 0.5);
        s = this.cluster_similarity_threshold ** 2
            + (this.pair_similarity_maximum - this.cluster_similarity_threshold ** 2)
            / (1.0 - this.cluster_similarity_threshold ** 2)
            * (s - this.cluster_similarity_threshold ** 2);
        return s;
    }
}


module.exports = { LinksCluster };
