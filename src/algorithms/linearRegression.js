export default async function(data, params) {
  // Calculate means
  const meanX = data.reduce((sum, point) => sum + point[0], 0) / data.length
  const meanY = data.reduce((sum, point) => sum + point[1], 0) / data.length

  // Calculate coefficients
  let numerator = 0
  let denominator = 0
  
  data.forEach(point => {
    const xDiff = point[0] - meanX
    numerator += xDiff * (point[1] - meanY)
    denominator += xDiff * xDiff
  })

  // Calculate slope (m) and y-intercept (b)
  const slope = numerator / denominator
  const intercept = meanY - slope * meanX

  // Calculate predictions and R-squared
  const predictions = data.map(point => slope * point[0] + intercept)
  
  // Calculate R-squared
  const ssTotal = data.reduce((sum, point) => 
    sum + Math.pow(point[1] - meanY, 2), 0)
  const ssResidual = data.reduce((sum, point, i) => 
    sum + Math.pow(point[1] - predictions[i], 2), 0)
  const rSquared = 1 - (ssResidual / ssTotal)

  return {
    slope,
    intercept,
    predictions,
    rSquared,
    equation: `y = ${slope.toFixed(4)}x + ${intercept.toFixed(4)}`,
    metrics: {
      r_squared: rSquared,
      slope: slope,
      intercept: intercept
    }
  }
}