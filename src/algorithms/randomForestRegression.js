export default async function(data, params) {
  const nEstimators = params.nEstimators || 100;
  const maxDepth = params.maxDepth || 5;
  const minSamplesSplit = params.minSamplesSplit || 2;
  const minSamplesLeaf = params.minSamplesLeaf || 1;
  const maxFeatures = params.maxFeatures || 'sqrt';

  class Node {
    constructor() {
      this.left = null;
      this.right = null;
      this.feature = null;
      this.threshold = null;
      this.value = null;
    }
  }

  function bootstrapSample(X, y) {
    const indices = Array(X.length).fill().map(() => 
      Math.floor(Math.random() * X.length));
    return {
      X: indices.map(i => X[i]),
      y: indices.map(i => y[i])
    };
  }

  function getRandomFeatures(n) {
    const numFeatures = maxFeatures === 'sqrt' ? 
      Math.floor(Math.sqrt(n)) : Math.floor(n * maxFeatures);
    const features = Array(n).fill().map((_, i) => i);
    const selected = [];
    while (selected.length < numFeatures) {
      const idx = Math.floor(Math.random() * features.length);
      selected.push(...features.splice(idx, 1));
    }
    return selected;
  }

  function buildTree(X, y, depth = 0) {
    const node = new Node();

    if (depth >= maxDepth || y.length < minSamplesSplit || new Set(y).size === 1) {
      node.value = y.reduce((a, b) => a + b, 0) / y.length;
      return node;
    }

    const features = getRandomFeatures(X[0].length);
    const split = findBestSplit(X, y, features);

    if (!split.feature) {
      node.value = y.reduce((a, b) => a + b, 0) / y.length;
      return node;
    }

    const { leftX, leftY, rightX, rightY } = split;

    node.feature = split.feature;
    node.threshold = split.threshold;
    node.left = buildTree(leftX, leftY, depth + 1);
    node.right = buildTree(rightX, rightY, depth + 1);

    return node;
  }

  function findBestSplit(X, y, features) {
    let bestGain = -Infinity;
    let bestSplit = {};

    for (const feature of features) {
      const values = X.map(x => x[feature]).sort((a, b) => a - b);
      
      for (let i = 0; i < values.length - 1; i++) {
        const threshold = (values[i] + values[i + 1]) / 2;
        
        const [leftIndices, rightIndices] = X.reduce((acc, x, idx) => {
          x[feature] <= threshold ? acc[0].push(idx) : acc[1].push(idx);
          return acc;
        }, [[], []]);

        if (leftIndices.length < minSamplesLeaf || rightIndices.length < minSamplesLeaf) continue;

        const leftY = leftIndices.map(i => y[i]);
        const rightY = rightIndices.map(i => y[i]);
        
        const gain = calculateInformationGain(y, leftY, rightY);

        if (gain > bestGain) {
          bestGain = gain;
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

  function calculateInformationGain(parent, leftChild, rightChild) {
    const parentVar = calculateVariance(parent);
    const leftVar = calculateVariance(leftChild);
    const rightVar = calculateVariance(rightChild);
    
    return parentVar - 
      (leftChild.length * leftVar + rightChild.length * rightVar) / parent.length;
  }

  function calculateVariance(y) {
    const mean = y.reduce((a, b) => a + b, 0) / y.length;
    return y.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / y.length;
  }

  function predict(trees, x) {
    const predictions = trees.map(tree => predictTree(tree, x));
    return predictions.reduce((a, b) => a + b, 0) / predictions.length;
  }

  function predictTree(node, x) {
    if (node.value !== null) return node.value;
    return x[node.feature] <= node.threshold ? 
      predictTree(node.left, x) : predictTree(node.right, x);
  }

  // Prepare data
  const X = data.map(point => [point[0]]);
  const y = data.map(point => point[1]);

  // Build forest
  const trees = Array(nEstimators).fill().map(() => {
    const { X: sampledX, y: sampledY } = bootstrapSample(X, y);
    return buildTree(sampledX, sampledY);
  });

  // Generate predictions
  const predictions = data.map(point => predict(trees, [point[0]]));

  return {
    labels: predictions,
    data,
    model: {
      trees,
      nEstimators,
      maxDepth
    }
  };
}
