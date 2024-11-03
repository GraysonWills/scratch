export default async function(data, params) {
  async function kMeans(points, numClusters, numIterations = 100) {
      const centroids = initializeCentroids(points, numClusters);
      for (let iter = 0; iter < numIterations; iter++) {
          const assignments = assignPointsToClusters(points, centroids);
          updateCentroids(points, assignments, centroids);
      }
      return centroids;
  }

  function initializeCentroids(points, numClusters) {
      const centroids = [];
      for (let i = 0; i < numClusters; i++) {
          centroids.push(points[Math.floor(Math.random() * points.length)]);
      }
      return centroids;
  }

  function assignPointsToClusters(points, centroids) {
      return points.map(point => {
          let minDistance = Infinity;
          let clusterIndex = -1;
          centroids.forEach((centroid, index) => {
              const distance = Math.sqrt(
                  Math.pow(point[0] - centroid[0], 2) +
                  Math.pow(point[1] - centroid[1], 2)
              );
              if (distance < minDistance) {
                  minDistance = distance;
                  clusterIndex = index;
              }
          });
          return clusterIndex;
      });
  }

  function updateCentroids(points, assignments, centroids) {
      const sums = Array(centroids.length).fill(null).map(() => [0, 0]);
      const counts = Array(centroids.length).fill(0);
      points.forEach((point, i) => {
          const clusterIndex = assignments[i];
          sums[clusterIndex][0] += point[0];
          sums[clusterIndex][1] += point[1];
          counts[clusterIndex] += 1;
      });
      centroids.forEach((centroid, i) => {
          if (counts[i] > 0) {
              centroid[0] = sums[i][0] / counts[i];
              centroid[1] = sums[i][1] / counts[i];
          }
      });
  }

  const centroids = await kMeans(data, params.n_clusters);
  const labels = assignPointsToClusters(data, centroids);
  
  return {
    labels,
    data,
    centroids
  };
}