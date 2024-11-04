export default async function(data, params) {
  const nEstimators = params.nEstimators || 100;
  const learningRate = params.learningRate || 0.1;
  const maxDepth = params.maxDepth || 3;
  const minSamplesSplit = params.minSamplesSplit || 2;
  const subsampleRate = params.subsampleRate || 1.0;

  class Node {
    constructor() {
      this.left = null;
      this.right = null;
      this.feature = null;
      this.threshold = null;
      this.value = null;
    }
  }

  function buildTree(X, y, depth = 0) {
    const node = new Node();

    if (depth >= maxDepth || y.length < minSamplesSplit) {
      node.value = y.reduce((a, b) => a + b, 0) / y.length;
      return node;
    }

    const split = findBestSplit(X, y);
    if (!split.feature) {
      node.value = y.reduce((a, b) => a + b, 0) / y.length;
      return node;
    }

    node.feature = split.feature;
    node.threshold = split.threshold;
    node.left = buildTree(split.leftX, split.leftY, depth + 1);
    node.right = buildTree(split.rightX, split.rightY, depth + 1);

    return node;
  }

  function findBestSplit(X, y) {
    let bestMSE = Infinity;
    let bestSplit = {};

    for (let feature = 0; feature < X[0].length; feature++) {
      const values = X.map(x => x[feature]).sort((a, b) => a - b);
      
      for (let i = 0; i < values.length - 1; i++) {
        const threshold = (values[i] + values[i + 1]) / 2;
        
        const [leftIndices, rightIndices] = X.reduce((acc, x, idx) => {
          x[feature] <= threshold ? acc[0].push(idx) : acc[1].push(idx);
          return acc;
        }, [[], []]);

        if (leftIndices.length < minSamplesSplit || rightIndices.length < minSamplesSplit) continue;

        const leftY = leftIndices.map(i => y[i]);
        const rightY = rightIndices.map(i => y[i]);
        
        const mse = calculateMSE(leftY) + calculateMSE(rightY);

        if (mse < bestMSE) {
          bestMSE = mse;
          bestSplit = {
            feature,
            threshold,
            leftX: leftIndices.map(i => X[i]),
            leftY,
            rightX: rightIndices.map(i => X[i]),
            rightY
          };
        }
      }
    }

    return bestSplit;
  }

  function calculateMSE(y) {
    const mean = y.reduce((a, b) => a + b, 0) / y.length;
    return y.reduce((a, b) => a + Math.pow(b - mean, 2), 0);
  }

  function predictTree(node, x) {
    if (node.value !== null) return node.value;
    return x[node.feature] <= node.threshold ? 
      predictTree(node.left, x) : predictTree(node.right, x);
  }

  function subsample(X, y) {
    const sampleSize = Math.floor(X.length * subsampleRate);
    const indices = new Set();
    while (indices.size < sampleSize) {
      indices.add(Math.floor(Math.random() * X.length));
    }
    return {
      X: Array.from(indices).map(i => X[i]),
      y: Array.from(indices).map(i => y[i])
    };
  }

  // Prepare data
  const X = data.map(point => [point[0]]);
  const y = data.map(point => point[1]);

  // Initial prediction
  let predictions = Array(y.length).fill(y.reduce((a, b) => a + b, 0) / y.length);
  const trees = [];

  // Build boosted trees
  for (let i = 0; i < nEstimators; i++) {
    const residuals = y.map((yi, idx) => yi - predictions[idx]);
    const { X: sampledX, y: sampledResiduals } = subsample(X, residuals);
    
    const tree = buildTree(sampledX, sampledResiduals);
    trees.push(tree);

    // Update predictions
    predictions = predictions.map((pred, idx) => 
      pred + learningRate * predictTree(tree, X[idx]));
  }

  return {
    labels: predictions,
    data,
    model: {
      trees,
      learningRate,
      nEstimators
    }
  };
}
