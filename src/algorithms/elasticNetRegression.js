export default async function(data, params) {
  const alpha = params.alpha || 0.1;
  const l1_ratio = params.l1_ratio || 0.5;
  const maxIter = params.maxIter || 1000;
  const tolerance = params.tolerance || 1e-4;

  function softThreshold(x, lambda) {
    if (x > lambda) return x - lambda;
    if (x < -lambda) return x + lambda;
    return 0;
  }

  function standardize(X) {
    const mean = X.reduce((sum, x) => sum + x, 0) / X.length;
    const std = Math.sqrt(X.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / X.length);
    return X.map(x => (x - mean) / std);
  }

  function elasticNet(X, y, alpha, l1_ratio) {
    const n = X.length;
    const p = X[0].length;
    let coefficients = new Array(p).fill(0);
    
    for (let iter = 0; iter < maxIter; iter++) {
      const oldCoefficients = [...coefficients];
      
      for (let j = 0; j < p; j++) {
        let r = y.map((yi, i) => yi - X[i].reduce((sum, xij, k) => 
          sum + (k !== j ? xij * coefficients[k] : 0), 0));
        
        let xj = X.map(row => row[j]);
        let rho = xj.reduce((sum, xji, i) => sum + xji * r[i], 0);
        let denominator = xj.reduce((sum, xji) => sum + xji * xji, 0) + 
                         alpha * (1 - l1_ratio);
        
        coefficients[j] = softThreshold(rho, alpha * l1_ratio) / denominator;
      }
      
      if (Math.sqrt(coefficients.reduce((sum, b, i) => 
        sum + Math.pow(b - oldCoefficients[i], 2), 0)) < tolerance) break;
    }
    
    return coefficients;
  }

  const X = data.map(point => [1, point[0]]);
  const y = data.map(point => point[1]);
  const X_std = X.map(row => [row[0], ...standardize(row.slice(1))]);
  
  const coefficients = elasticNet(X_std, y, alpha, l1_ratio);
  const predictions = data.map(point => 
    coefficients[0] + coefficients[1] * point[0]
  );

  return {
    labels: predictions,
    data,
    model: {
      coefficients,
      alpha,
      l1_ratio,
      equation: `y = ${coefficients[0].toFixed(4)} + ${coefficients[1].toFixed(4)}x`
    }
  };
}