export default async function(data, params) {
  const quantile = params.quantile || 0.5;
  const learningRate = params.learningRate || 0.01;
  const maxIter = params.maxIter || 1000;
  const tolerance = params.tolerance || 1e-6;

  function standardize(X) {
    const mean = X.reduce((sum, x) => sum + x, 0) / X.length;
    const std = Math.sqrt(X.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / X.length);
    return {
      transformed: X.map(x => (x - mean) / std),
      mean,
      std
    };
  }

  function quantileLoss(y_true, y_pred) {
    return y_true.reduce((sum, yt, i) => {
      const diff = yt - y_pred[i];
      return sum + (diff >= 0 ? quantile : (quantile - 1)) * diff;
    }, 0) / y_true.length;
  }

  function gradientDescent(X, y) {
    const n = X.length;
    const p = X[0].length;
    let coefficients = new Array(p).fill(0);
    let bestLoss = Infinity;
    let bestCoefficients = [...coefficients];

    for (let iter = 0; iter < maxIter; iter++) {
      const predictions = X.map(x => 
        x.reduce((sum, xi, i) => sum + xi * coefficients[i], 0)
      );

      const gradients = X[0].map((_, j) => 
        X.reduce((sum, x, i) => {
          const diff = y[i] - predictions[i];
          const gradient = diff >= 0 ? quantile : (quantile - 1);
          return sum + x[j] * gradient;
        }, 0) / n
      );

      coefficients = coefficients.map((c, j) => c + learningRate * gradients[j]);

      const currentLoss = quantileLoss(y, predictions);
      if (currentLoss < bestLoss) {
        bestLoss = currentLoss;
        bestCoefficients = [...coefficients];
      }

      if (Math.abs(currentLoss - bestLoss) < tolerance) break;
    }

    return bestCoefficients;
  }

  // Prepare data
  const X = data.map(point => [1, point[0]]);
  const y = data.map(point => point[1]);

  // Standardize features
  const { transformed: X_std, mean: xMean, std: xStd } = standardize(X.map(x => x[1]));
  const X_std_matrix = X_std.map(x => [1, x]);

  // Perform quantile regression
  const coefficients = gradientDescent(X_std_matrix, y);

  // Generate predictions
  const predictions = data.map(point => {
    const x_std = (point[0] - xMean) / xStd;
    return coefficients[0] + coefficients[1] * x_std;
  });

  return {
    labels: predictions,
    data,
    model: {
      coefficients,
      quantile,
      equation: `y = ${coefficients[0].toFixed(4)} + ${coefficients[1].toFixed(4)}x (${quantile}th quantile)`
    }
  };
}