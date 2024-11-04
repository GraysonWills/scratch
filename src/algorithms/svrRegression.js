export default async function(data, params) {
  const C = params.C || 1.0;
  const epsilon = params.epsilon || 0.1;
  const kernelType = params.kernelType || 'rbf';
  const gamma = params.gamma || 0.1;
  const maxIter = params.maxIter || 1000;
  const tolerance = params.tolerance || 1e-3;

  function kernelFunction(x1, x2) {
    switch (kernelType) {
      case 'linear':
        return x1.reduce((sum, val, i) => sum + val * x2[i], 0);
      case 'rbf':
        const diff = x1.map((val, i) => val - x2[i]);
        const squaredNorm = diff.reduce((sum, val) => sum + val * val, 0);
        return Math.exp(-gamma * squaredNorm);
      default:
        return x1.reduce((sum, val, i) => sum + val * x2[i], 0);
    }
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

  function smo(X, y) {
    const n = X.length;
    let alphas = new Array(2 * n).fill(0); // Dual coefficients
    let b = 0; // Bias term

    for (let iter = 0; iter < maxIter; iter++) {
      let numChanged = 0;
      
      for (let i = 0; i < n; i++) {
        const Ei = predict(X[i], X, alphas, b) - y[i];
        
        if ((Ei * alphas[i] < -tolerance && alphas[i] < C) ||
            (Ei * alphas[i] > tolerance && alphas[i] > 0)) {
          
          // Select second alpha randomly
          let j;
          do {
            j = Math.floor(Math.random() * n);
          } while (j === i);
          
          const Ej = predict(X[j], X, alphas, b) - y[j];
          
          const oldAi = alphas[i];
          const oldAj = alphas[j];
          
          // Calculate bounds
          let L = Math.max(0, oldAj + oldAi - C);
          let H = Math.min(C, oldAj + oldAi);
          
          if (Math.abs(L - H) < tolerance) continue;
          
          const eta = 2 * kernelFunction(X[i], X[j]) -
                     kernelFunction(X[i], X[i]) -
                     kernelFunction(X[j], X[j]);
          
          if (eta >= 0) continue;
          
          // Update alphas
          alphas[j] = oldAj - (y[j] * (Ei - Ej)) / eta;
          alphas[j] = Math.min(H, Math.max(L, alphas[j]));
          
          if (Math.abs(alphas[j] - oldAj) < tolerance) continue;
          
          alphas[i] = oldAi + (oldAj - alphas[j]);
          
          // Update bias term
          const b1 = b - Ei - y[i] * (alphas[i] - oldAi) * kernelFunction(X[i], X[i]) -
                    y[j] * (alphas[j] - oldAj) * kernelFunction(X[i], X[j]);
          const b2 = b - Ej - y[i] * (alphas[i] - oldAi) * kernelFunction(X[i], X[j]) -
                    y[j] * (alphas[j] - oldAj) * kernelFunction(X[j], X[j]);
          
          b = (b1 + b2) / 2;
          
          numChanged++;
        }
      }
      
      if (numChanged === 0) break;
    }
    
    return { alphas, b };
  }

  function predict(x, X, alphas, b) {
    return X.reduce((sum, xi, i) => 
      sum + alphas[i] * kernelFunction(x, xi), 0) + b;
  }

  // Prepare data
  const X = data.map(point => [point[0]]);
  const y = data.map(point => point[1]);

  // Standardize features
  const { transformed: X_std, mean: xMean, std: xStd } = standardize(X.map(x => x[0]));
  const X_std_matrix = X_std.map(x => [x]);

  // Train SVR model
  const { alphas, b } = smo(X_std_matrix, y);

  // Generate predictions
  const predictions = data.map(point => {
    const x_std = [(point[0] - xMean) / xStd];
    return predict(x_std, X_std_matrix, alphas, b);
  });

  return {
    labels: predictions,
    data,
    model: {
      alphas,
      b,
      supportVectors: X_std_matrix.filter((_, i) => Math.abs(alphas[i]) > tolerance)
    }
  };
}
