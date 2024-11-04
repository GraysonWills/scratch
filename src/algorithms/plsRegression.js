export default async function(data, params) {
  const numComponents = params.numComponents || 2;
  const maxIter = params.maxIter || 100;
  const tolerance = params.tolerance || 1e-8;

  function standardize(X) {
    const mean = X.reduce((sum, x) => sum + x, 0) / X.length;
    const std = Math.sqrt(X.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / X.length);
    return {
      transformed: X.map(x => (x - mean) / std),
      mean,
      std
    };
  }

  function nipals(X, y, numComponents) {
    const n = X.length;
    const p = X[0].length;
    const T = Array(n).fill().map(() => Array(numComponents).fill(0));
    const P = Array(p).fill().map(() => Array(numComponents).fill(0));
    const Q = Array(numComponents).fill(0);
    const W = Array(p).fill().map(() => Array(numComponents).fill(0));
    
    let E = X.map(row => [...row]);
    let f = [...y];
    
    for (let h = 0; h < numComponents; h++) {
      let w = E.reduce((acc, row, i) => 
        acc.map((v, j) => v + row[j] * f[i]), Array(p).fill(0));
      let wNorm = Math.sqrt(w.reduce((sum, v) => sum + v * v, 0));
      w = w.map(v => v / wNorm);
      
      let t = E.map(row => row.reduce((sum, v, j) => sum + v * w[j], 0));
      let q = f.reduce((sum, v, i) => sum + v * t[i], 0) / 
              t.reduce((sum, v) => sum + v * v, 0);
      
      let p = E.reduce((acc, row, i) => 
        acc.map((v, j) => v + row[j] * t[i]), Array(p).fill(0))
        .map(v => v / t.reduce((sum, tv) => sum + tv * tv, 0));
      
      // Store components
      t.forEach((v, i) => T[i][h] = v);
      p.forEach((v, i) => P[i][h] = v);
      Q[h] = q;
      w.forEach((v, i) => W[i][h] = v);
      
      // Deflate matrices
      E = E.map((row, i) => 
        row.map((v, j) => v - t[i] * p[j]));
      f = f.map((v, i) => v - t[i] * q);
    }
    
    return { T, P, Q, W };
  }

  // Prepare data
  const X = data.map(point => [point[0]]);
  const y = data.map(point => point[1]);
  
  // Standardize features
  const { transformed: X_std, mean: xMean, std: xStd } = standardize(X.map(x => x[0]));
  const { transformed: y_std, mean: yMean, std: yStd } = standardize(y);
  
  const X_std_matrix = X_std.map(x => [x]);
  
  // Perform PLS regression
  const { T, P, Q, W } = nipals(X_std_matrix, y_std, numComponents);
  
  // Calculate regression coefficients
  const coefficients = W.map((row, i) => 
    row.reduce((sum, w, j) => sum + w * Q[j], 0) * yStd / xStd);
  
  const intercept = yMean - coefficients[0] * xMean;
  
  // Generate predictions
  const predictions = data.map(point => 
    intercept + coefficients[0] * point[0]);

  return {
    labels: predictions,
    data,
    model: {
      coefficients,
      intercept,
      equation: `y = ${intercept.toFixed(4)} + ${coefficients[0].toFixed(4)}x`
    }
  };
}
