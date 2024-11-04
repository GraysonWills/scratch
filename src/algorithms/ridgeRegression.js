export default async function(data, params) {
  const alpha = params.alpha || 0.1;

  function standardize(X) {
    const mean = X.reduce((sum, x) => sum + x, 0) / X.length;
    const std = Math.sqrt(X.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / X.length);
    return X.map(x => (x - mean) / std);
  }

  function solveLinearSystem(A, b) {
    const n = A.length;
    const augmented = A.map((row, i) => [...row, b[i]]);

    // Gaussian elimination
    for (let i = 0; i < n; i++) {
      const pivot = augmented[i][i];
      for (let j = i; j <= n; j++) augmented[i][j] /= pivot;
      
      for (let k = 0; k < n; k++) {
        if (k !== i) {
          const factor = augmented[k][i];
          for (let j = i; j <= n; j++) {
            augmented[k][j] -= factor * augmented[i][j];
          }
        }
      }
    }

    return augmented.map(row => row[n]);
  }

  function ridgeRegression(X, y, alpha) {
    const n = X.length;
    const Xt = X[0].map((_, i) => X.map(row => row[i]));
    
    const XtX = Xt.map((row, i) => X[0].map((_, j) => 
      row.reduce((sum, _, k) => sum + row[k] * X[k][j], 0) + (i === j ? alpha : 0)
    ));
    
    const Xty = Xt.map(row => row.reduce((sum, _, i) => sum + row[i] * y[i], 0));
    
    const coefficients = solveLinearSystem(XtX, Xty);
    return coefficients;
  }

  // Prepare data
  const X = data.map(point => [1, point[0]]);  // Add intercept term
  const y = data.map(point => point[1]);
  
  // Standardize features
  const X_std = X.map(row => [row[0], ...standardize(row.slice(1))]);
  
  // Fit ridge regression
  const coefficients = ridgeRegression(X_std, y, alpha);
  
  // Generate predictions
  const predictions = data.map(point => 
    coefficients[0] + coefficients[1] * point[0]
  );

  return {
    labels: predictions,
    data,
    model: {
      coefficients,
      alpha,
      equation: `y = ${coefficients[0].toFixed(4)} + ${coefficients[1].toFixed(4)}x`
    }
  };
}