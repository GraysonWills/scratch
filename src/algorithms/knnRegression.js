export default async function(data, params) {
  const k = params.k || 3;
  const weightingFunction = params.weighting || 'uniform';

  function euclideanDistance(a, b) {
    return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));
  }

  function standardize(X) {
    const mean = X.reduce((sum, x) => sum + x, 0) / X.length;
    const std = Math.sqrt(X.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / X.length);
    return {
      transformed: X.map(x => (x - mean) / std),
      mean,
      std
    };
  }

  function getWeights(distances) {
    switch (weightingFunction) {
      case 'uniform':
        return distances.map(() => 1);
      case 'distance':
        return distances.map(d => d === 0 ? 1 : 1 / d);
      case 'gaussian':
        return distances.map(d => Math.exp(-d * d));
      default:
        return distances.map(() => 1);
    }
  }

  function predict(x, X, y) {
    // Calculate distances to all points
    const distances = X.map(xi => euclideanDistance(x, xi));
    
    // Get k nearest neighbors
    const nearestIndices = distances
      .map((d, i) => ({ distance: d, index: i }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, k)
      .map(item => item.index);
    
    // Get weights for neighbors
    const neighborDistances = nearestIndices.map(i => distances[i]);
    const weights = getWeights(neighborDistances);
    
    // Calculate weighted average
    const weightedSum = nearestIndices.reduce((sum, idx, i) => 
      sum + weights[i] * y[idx], 0);
    const weightSum = weights.reduce((a, b) => a + b, 0);
    
    return weightedSum / weightSum;
  }

  // Prepare data
  const X = data.map(point => [point[0]]);
  const y = data.map(point => point[1]);

  // Standardize features
  const { transformed: X_std, mean: xMean, std: xStd } = standardize(X.map(x => x[0]));
  const X_std_matrix = X_std.map(x => [x]);

  // Generate predictions
  const predictions = data.map(point => {
    const x_std = [(point[0] - xMean) / xStd];
    return predict(x_std, X_std_matrix, y);
  });

  return {
    labels: predictions,
    data,
    model: {
      k,
      weightingFunction,
      xMean,
      xStd
    }
  };
}
