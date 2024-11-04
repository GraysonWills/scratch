export default async function(data, params) {
  const learningRate = params.learningRate || 0.01;
  const maxIter = params.maxIter || 1000;
  const tolerance = params.tolerance || 1e-4;

  function sigmoid(z) {
    return 1 / (1 + Math.exp(-z));
  }

  function standardize(X) {
    const mean = X.reduce((sum, x) => sum + x, 0) / X.length;
    const std = Math.sqrt(X.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / X.length);
    return X.map(x => (x - mean) / std);
  }

  function logisticRegression(X, y) {
    const n = X.length;
    const p = X[0].length;
    let coefficients = new Array(p).fill(0);
    
    for (let iter = 0; iter < maxIter; iter++) {
      const oldCoefficients = [...coefficients];
      
      // Calculate predictions
      const predictions = X.map(x => 
        sigmoid(x.reduce((sum, xi, i) => sum + xi * coefficients[i], 0))
      );
      
      // Update coefficients using gradient descent
      for (let j = 0; j < p; j++) {
        const gradient = X.reduce((sum, x, i) => 
          sum + x[j] * (predictions[i] - y[i]), 0) / n;
        coefficients[j] -= learningRate * gradient;
      }
      
      // Check convergence
      if (Math.sqrt(coefficients.reduce((sum, b, i) => 
        sum + Math.pow(b - oldCoefficients[i], 2), 0)) < tolerance) break;
    }
    
    return coefficients;
  }

  // Prepare data
  const X = data.map(point => [1, point[0]]);  // Add intercept term
  const y = data.map(point => point[1]);
  
  // Standardize features
  const X_std = X.map(row => [row[0], ...standardize(row.slice(1))]);
  
  // Fit logistic regression
  const coefficients = logisticRegression(X_std, y);
  
  // Generate predictions
  const predictions = data.map(point => 
    sigmoid(coefficients[0] + coefficients[1] * point[0])
  );

  return {
    labels: predictions,
    data,
    model: {
      coefficients,
      equation: `p(y=1) = sigmoid(${coefficients[0].toFixed(4)} + ${coefficients[1].toFixed(4)}x)`
    }
  };
}
