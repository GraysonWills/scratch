export default async function(data, params) {
  const maxDepth = params.maxDepth || 5;
  const minSamplesSplit = params.minSamplesSplit || 2;
  const minSamplesLeaf = params.minSamplesLeaf || 1;

  class Node {
    constructor() {
      this.left = null;
      this.right = null;
      this.feature = null;
      this.threshold = null;
      this.value = null;
    }
  }

  function calculateMSE(y) {
    const mean = y.reduce((a, b) => a + b, 0) / y.length;
    return y.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / y.length;
  }

  function findBestSplit(X, y) {
    let bestGain = 0;
    let bestFeature = null;
    let bestThreshold = null;

    for (let feature = 0; feature < X[0].length; feature++) {
      const values = X.map(x => x[feature]).sort((a, b) => a - b);
      
      for (let i = 0; i < values.length - 1; i++) {
        const threshold = (values[i] + values[i + 1]) / 2;
        
        const [leftY, rightY] = y.reduce((acc, yi, idx) => {
          X[idx][feature] <= threshold ? acc[0].push(yi) : acc[1].push(yi);
          return acc;
        }, [[], []]);

        if (leftY.length < minSamplesLeaf || rightY.length < minSamplesLeaf) continue;

        const gain = calculateMSE(y) - 
          (leftY.length * calculateMSE(leftY) + rightY.length * calculateMSE(rightY)) / y.length;

        if (gain > bestGain) {
          bestGain = gain;
          bestFeature = feature;
          bestThreshold = threshold;
        }
      }
    }

    return { feature: bestFeature, threshold: bestThreshold };
  }

  function buildTree(X, y, depth = 0) {
    const node = new Node();

    if (depth >= maxDepth || y.length < minSamplesSplit || new Set(y).size === 1) {
      node.value = y.reduce((a, b) => a + b, 0) / y.length;
      return node;
    }

    const { feature, threshold } = findBestSplit(X, y);

    if (feature === null) {
      node.value = y.reduce((a, b) => a + b, 0) / y.length;
      return node;
    }

    const leftIndices = X.map((x, i) => x[feature] <= threshold ? i : null).filter(i => i !== null);
    const rightIndices = X.map((x, i) => x[feature] > threshold ? i : null).filter(i => i !== null);

    const leftX = leftIndices.map(i => X[i]);
    const leftY = leftIndices.map(i => y[i]);
    const rightX = rightIndices.map(i => X[i]);
    const rightY = rightIndices.map(i => y[i]);

    node.feature = feature;
    node.threshold = threshold;
    node.left = buildTree(leftX, leftY, depth + 1);
    node.right = buildTree(rightX, rightY, depth + 1);

    return node;
  }

  function predict(node, x) {
    if (node.value !== null) return node.value;
    return x[node.feature] <= node.threshold ? 
      predict(node.left, x) : predict(node.right, x);
  }

  // Prepare data
  const X = data.map(point => [point[0]]);
  const y = data.map(point => point[1]);

  // Build decision tree
  const tree = buildTree(X, y);

  // Generate predictions
  const predictions = data.map(point => predict(tree, [point[0]]));

  return {
    labels: predictions,
    data,
    model: {
      tree,
      maxDepth,
      minSamplesSplit,
      minSamplesLeaf
    }
  };
}
