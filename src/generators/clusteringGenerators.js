import { javascriptGenerator } from 'blockly/javascript';

export const initClusteringGenerators = () => {
  javascriptGenerator.forBlock['clustering_start'] = function(block) {
    // Get the algorithm block's output directly
    const algorithm = javascriptGenerator.valueToCode(block, 'ALGORITHM', javascriptGenerator.ORDER_ATOMIC);
    const params = javascriptGenerator.valueToCode(block, 'PARAMETER', javascriptGenerator.ORDER_ATOMIC);
    
    return `
const clustering = new ML.${algorithm}({
  ${params}
});
const labels = clustering.predict(data);
`;
  };

  javascriptGenerator.forBlock['clustering_kmeans'] = function(block) {
    return ['KMeans', javascriptGenerator.ORDER_ATOMIC];
  };

  javascriptGenerator.forBlock['clustering_dbscan'] = function(block) {
    return ['DBSCAN', javascriptGenerator.ORDER_ATOMIC];
  };

  javascriptGenerator.forBlock['clustering_hierarchical'] = function(block) {
    return ['HierarchicalClustering', javascriptGenerator.ORDER_ATOMIC];
  };

  javascriptGenerator.forBlock['clustering_params'] = function(block) {
    const paramName = block.getFieldValue('PARAM_NAME');
    const paramValue = block.getFieldValue('PARAM_VALUE');
    return [`${paramName.toLowerCase()}: ${paramValue}`, javascriptGenerator.ORDER_ATOMIC];
  };
};