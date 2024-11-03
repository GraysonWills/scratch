export default async function(data, params) {
  function calculateDistance(point1, point2) {
    return Math.sqrt(
      point1.reduce((sum, value, i) => sum + Math.pow(value - point2[i], 2), 0)
    );
  }

  function getNeighbors(point, points, eps) {
    return points.reduce((neighbors, other, index) => {
      if (calculateDistance(point, other) <= eps) {
        neighbors.push(index);
      }
      return neighbors;
    }, []);
  }

  const { eps = 0.5, minPts = 4 } = params;
  const labels = new Array(data.length).fill(-1);
  let clusterLabel = 0;

  for (let i = 0; i < data.length; i++) {
    if (labels[i] !== -1) continue;

    const neighbors = getNeighbors(data[i], data, eps);
    if (neighbors.length < minPts) {
      labels[i] = -1; // Noise point
      continue;
    }

    labels[i] = clusterLabel;
    let seedSet = [...neighbors];

    while (seedSet.length > 0) {
      const currentPoint = seedSet.shift();
      if (labels[currentPoint] === -1) {
        labels[currentPoint] = clusterLabel;
      }
      if (labels[currentPoint] !== undefined) continue;

      labels[currentPoint] = clusterLabel;
      const currentNeighbors = getNeighbors(data[currentPoint], data, eps);

      if (currentNeighbors.length >= minPts) {
        seedSet.push(...currentNeighbors.filter(n => !seedSet.includes(n)));
      }
    }
    clusterLabel++;
  }

  return {
    labels,
    data,
    numberOfClusters: clusterLabel
  };
}
