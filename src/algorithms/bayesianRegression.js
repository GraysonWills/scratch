export default async function(data, params) {
  const priorMean = params.priorMean || 0;
  const priorPrecision = params.priorPrecision || 1;
  const noisePrecision = params.noisePrecision || 1;

  function standardize(X) {
    const mean = X.reduce((sum, x) => sum + x, 0) / X.length;
    const std = Math.sqrt(X.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / X.length);
    return {
      transformed: X.map(x => (x - mean) / std),
      mean,
      std
    };
  }

  function bayesianUpdate(X, y) {
    const n = X.length;
    const p = X[0].length;
    
    // Compute posterior precision matrix
    const XtX = X[0].map((_, i) => 
      X[0].map((_, j) => 
        X.reduce((sum, row) => sum + row[i] * row[j], 0)
      )
    );
    
    const posteriorPrecision = XtX.map((row, i) => 
      row.map((val, j) => 
        val * noisePrecision + (i === j ? priorPrecision : 0)
      )
    );
    
    // Compute posterior mean
    const Xty = X[0].map((_, i) => 
      X.reduce((sum, row, j) => sum + row[i] * y[j], 0)
    );
    
    const posteriorMeanNum = Xty.map(val => 
      val * noisePrecision + priorMean * priorPrecision
    );
    
    const posteriorMean = solveLinearSystem(posteriorPrecision, posteriorMeanNum);
    
    return {
      mean: posteriorMean,
      precision: posteriorPrecision
    };
  }

  function solveLinearSystem(A, b) {
    const n = A.length;
    const augmented = A.map((row, i) => [...row, b[i]]);
    
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

  // Prepare data
  const X = data.map(point => [1, point[0]]);  // Add intercept term
  const y = data.map(point => point[1]);
  
  // Standardize features
  const { transformed: X_std, mean: xMean, std: xStd } = standardize(X.map(x => x[1]));
  const X_std_matrix = X_std.map(x => [1, x]);
  
  // Perform Bayesian regression
  const posterior = bayesianUpdate(X_std_matrix, y);
  
  // Generate predictions
  const predictions = data.map(point => {
    const x_std = (point[0] - xMean) / xStd;
    return posterior.mean[0] + posterior.mean[1] * x_std;
  });

  return {
    labels: predictions,
    data,
    model: {
      coefficients: posterior.mean,
      precision: posterior.precision,
      equation: `y = ${posterior.mean[0].toFixed(4)} + ${posterior.mean[1].toFixed(4)}x`
    }
  };
}
