export default async function(data, params) {
  const pValue = params.pValue || 0.05;
  const maxSteps = params.maxSteps || 100;

  function calculateSSE(X, y, coefficients) {
    return y.reduce((sum, yi, i) => {
      const prediction = X[i].reduce((p, xij, j) => p + xij * coefficients[j], 0);
      return sum + Math.pow(yi - prediction, 2);
    }, 0);
  }

  function calculateFStatistic(X, y, coefficients, newFeature) {
    const n = y.length;
    const p = coefficients.length;
    
    const sseReduced = calculateSSE(X, y, coefficients);
    const sseFull = calculateSSE([...X, newFeature], y, [...coefficients, 0]);
    
    const fStat = ((sseReduced - sseFull) / 1) / (sseFull / (n - p - 1));
    return fStat;
  }

  function stepwiseRegression(X, y) {
    const n = X.length;
    const p = X[0].length;
    let selectedFeatures = [0]; // Start with intercept
    let coefficients = [0];
    
    for (let step = 0; step < maxSteps; step++) {
      let bestFeature = -1;
      let bestFStat = 0;
      
      // Forward selection
      for (let j = 1; j < p; j++) {
        if (!selectedFeatures.includes(j)) {
          const fStat = calculateFStatistic(
            selectedFeatures.map(idx => X.map(row => row[idx])),
            y,
            coefficients,
            X.map(row => row[j])
          );
          
          if (fStat > bestFStat) {
            bestFStat = fStat;
            bestFeature = j;
          }
        }
      }
      
      // Check if best feature meets significance threshold
      if (bestFeature === -1 || bestFStat < pValue) break;
      
      selectedFeatures.push(bestFeature);
      
      // Recalculate coefficients with selected features
      const Xselected = selectedFeatures.map(idx => X.map(row => row[idx]));
      coefficients = solveLinearSystem(Xselected, y);
    }
    
    return { selectedFeatures, coefficients };
  }

  function solveLinearSystem(X, y) {
    const n = X.length;
    const Xt = X[0].map((_, i) => X.map(row => row[i]));
    const XtX = Xt.map(row => X[0].map((_, i) => 
      row.reduce((sum, _, k) => sum + row[k] * X[k][i], 0)
    ));
    const Xty = Xt.map(row => row.reduce((sum, _, i) => sum + row[i] * y[i], 0));
    
    return solveGaussian(XtX, Xty);
  }

  function solveGaussian(A, b) {
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
  const X = data.map(point => [1, point[0]]);
  const y = data.map(point => point[1]);
  
  const { selectedFeatures, coefficients } = stepwiseRegression(X, y);
  
  const predictions = data.map(point => 
    selectedFeatures.reduce((sum, feat, i) => sum + point[feat] * coefficients[i], 0)
  );

  return {
    labels: predictions,
    data,
    model: {
      coefficients,
      selectedFeatures,
      equation: `y = ${coefficients.map((c, i) => 
        `${c.toFixed(4)}x${selectedFeatures[i]}`).join(' + ')}`
    }
  };
}
