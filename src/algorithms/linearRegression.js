export default async function(data, params) {
  // Main linear regression function
  async function linearRegression(points) {
    const meanX = points.reduce((sum, point) => sum + point[0], 0) / points.length
    const meanY = points.reduce((sum, point) => sum + point[1], 0) / points.length

    let numerator = 0
    let denominator = 0
    
    points.forEach(point => {
      const xDiff = point[0] - meanX
      numerator += xDiff * (point[1] - meanY)
      denominator += xDiff * xDiff
    })

    const slope = numerator / denominator
    const intercept = meanY - slope * meanX

    return { slope, intercept }
  }

  // Calculate predictions
  function calculatePredictions(points, model) {
    return points.map(point => model.slope * point[0] + model.intercept)
  }

  // Perform regression and get predictions
  const model = await linearRegression(data)
  const predictions = calculatePredictions(data, model)

  return {
    labels: predictions,
    data,
    model: {
      slope: model.slope,
      intercept: model.intercept,
      equation: `y = ${model.slope.toFixed(4)}x + ${model.intercept.toFixed(4)}`
    }
  }
}