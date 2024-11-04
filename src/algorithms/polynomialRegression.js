export default async function(data, params) {
  const degree = params.degree || 2

  function generatePolynomialFeatures(x, degree) {
    return Array.from({length: degree + 1}, (_, i) => Math.pow(x, i))
  }

  function multipleLinearRegression(X, y) {
    // Calculate (X^T * X)^-1 * X^T * y
    const Xt = X[0].map((_, i) => X.map(row => row[i])); // Transpose
    const XtX = Xt.map(row => X[0].map((_, i) => 
      row.reduce((sum, _, k) => sum + row[k] * X[k][i], 0)
    ))
    
    // Matrix inversion (Gaussian elimination)
    const n = XtX.length
    const identity = Array(n).fill().map((_, i) => 
      Array(n).fill().map((_, j) => i === j ? 1 : 0)
    )
    
    // Augment matrix
    const augmented = XtX.map((row, i) => [...row, ...identity[i]])
    
    // Forward elimination
    for (let i = 0; i < n; i++) {
      const pivot = augmented[i][i]
      for (let j = i; j < 2 * n; j++) augmented[i][j] /= pivot
      for (let k = 0; k < n; k++) {
        if (k !== i) {
          const factor = augmented[k][i]
          for (let j = i; j < 2 * n; j++) {
            augmented[k][j] -= factor * augmented[i][j]
          }
        }
      }
    }
    
    const inverse = augmented.map(row => row.slice(n))
    
    // Calculate X^T * y
    const Xty = Xt.map(row => 
      row.reduce((sum, _, i) => sum + row[i] * y[i], 0)
    )
    
    // Calculate final coefficients
    return inverse.map(row => 
      row.reduce((sum, _, i) => sum + row[i] * Xty[i], 0)
    )
  }

  // Generate polynomial features
  const X = data.map(point => generatePolynomialFeatures(point[0], degree))
  const y = data.map(point => point[1])
  
  // Fit polynomial regression
  const coefficients = multipleLinearRegression(X, y)
  
  // Generate predictions
  const predictions = data.map(point => {
    const features = generatePolynomialFeatures(point[0], degree)
    return features.reduce((sum, feature, i) => sum + feature * coefficients[i], 0)
  })

  // Generate equation string
  const equation = coefficients
    .map((coef, i) => `${coef.toFixed(4)}x^${i}`)
    .join(' + ')

  return {
    labels: predictions,
    data,
    model: {
      coefficients,
      degree,
      equation
    }
  }
}