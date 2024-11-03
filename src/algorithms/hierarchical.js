export default async function(data, params) {
  function calculateDistance(point1, point2) {
    return Math.sqrt(
      point1.reduce((sum, value, i) => sum + Math.pow(value - point2[i], 2), 0)
    );
  }

  function findClosestClusters(clusters, distances) {
    let minDistance = Infinity;
    let cluster1 = 0;
    let cluster2 = 0;

    for (let i = 0; i < clusters.length; i++) {
      for (let j = i + 1; j < clusters.length; j++) {
        const distance = calculateClusterDistance(clusters[i], clusters[j], distances);
        if (distance < minDistance) {
          minDistance = distance;
          cluster1 = i;
          cluster2 = j;
        }
      }
    }
    return [cluster1, cluster2];
  }

  function calculateClusterDistance(cluster1, cluster2, distances) {
    let maxDistance = -Infinity;
    for (let point1 of cluster1) {
      for (let point2 of cluster2) {
        maxDistance = Math.max(maxDistance, distances[point1][point2]);
      }
    }
    return maxDistance;
  }

  const { n_clusters = 3 } = params;
  const distances = data.map(point1 => 
    data.map(point2 => calculateDistance(point1, point2))
  );

  let clusters = data.map((_, index) => [index]);
  console.log(clusters);
  let labels = new Array(data.length).fill(0);

  while (clusters.length > n_clusters) {
    const [cluster1, cluster2] = findClosestClusters(clusters, distances);
    const newCluster = [...clusters[cluster1], ...clusters[cluster2]];
    clusters = clusters.filter((_, i) => i !== cluster1 && i !== cluster2);
    clusters.push(newCluster);
  }

  clusters.forEach((cluster, clusterIndex) => {
    cluster.forEach(pointIndex => {
      labels[pointIndex] = clusterIndex;
    });
  });

  return {
    labels,
    data,
    numberOfClusters: clusters.length
  };
}
