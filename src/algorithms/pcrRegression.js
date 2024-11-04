export default async function(data, params) {
  const numComponents = params.numComponents || 2;

  function standardize(X) {
    const mean = X.reduce((sum, x) => sum + x, 0) / X.length;
    const std = Math.sqrt(X.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / X.length);
    return { 
      transformed: X.map(x => (x - mean) / std),
      mean,
      std
    };
  }

  function computePCA(X, numComponents) {
    const n = X.length;
    const p = X[0].length;
    
    // Compute covariance matrix
    const covMatrix = Array(p).fill().map(() => Array(p).fill(0));
    for (let i = 0; i < p; i++) {
      for (let j = 0; j < p; j++) {
        covMatrix[i][j] = X.reduce((sum, row) => 
          sum + row[i] * row[j], 0) / (n - 1);
      }
    }
    
    // Compute eigenvectors using power iteration
    const components = [];
    let remainingMatrix = covMatrix;
    
    for (let k = 0; k < numComponents; k++) {
      let vector = Array(p).fill(1);
      for (let iter = 0; iter < 100; iter++) {
        const newVector = vector.map((_, i) => 
          remainingMatrix[i].reduce((sum, val, j) => sum + val * vector[j], 0)
        );
        const norm = Math.sqrt(newVector.reduce((sum, v) => sum + v * v, 0));
        vector = newVector.map(v => v / norm);
      }
      components.push(vector);
      
      // Deflate matrix
      remainingMatrix = remainingMatrix.map((row, i) => 
        row.map((val, j) => 
          val - vector[i] * vector[j] * covMatrix[i][j]
        )
      );
    }
    
    return components;
  }

  function projectData(X, components) {
    return X.map(row => 
      components.map(comp => 
        row.reduce((sum, val, i) => sum + val * comp[i], 0)
      )
    );
  }

  // Prepare data
  const X = data.map(point => [point[0]]);
  const y = data.map(point => point[1]);
  
  // Standardize features
  const { transformed: X_std, mean: xMean, std: xStd } = standardize(X.map(x => x[0]));
  const X_std_matrix = X_std.map(x => [x]);
  
  // Compute PCA
  const components = computePCA(X_std_matrix, numComponents);
  
  // Project data onto principal components
  const X_transformed = projectData(X_std_matrix, components);
  
  // Perform linear regression on transformed data
  const Xt = X_transformed[0].map((_, i) => X_transformed.map(row => row[i]));
  const XtX = Xt.map(row => X_transformed[0].map((_, i) => 
    row.reduce((sum, _, k) => sum + row[k] * X_transformed[k][i], 0)
  ));
  const Xty = Xt.map(row => row.reduce((sum, _, i) => sum + row[i] * y[i], 0));
  
  const coefficients = solveLinearSystem(XtX, Xty);
  
  // Generate predictions
  const predictions = data.map(point => {
    const standardized = (point[0] - xMean) / xStd;
    const projected = components.map(comp => standardized * comp[0]);
    return projected.reduce((sum, proj, i) => sum + proj * coefficients[i], 0);
  });

  return {
    labels: predictions,
    data,
    model: {
      coefficients,
      components,
      means: [xMean],
      stds: [xStd]
    }
  };
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
