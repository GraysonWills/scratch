import { javascriptGenerator } from 'blockly/javascript';

export const initMLGenerators = () => {
  javascriptGenerator.forBlock['ml_start_training'] = function(block) {
    const optimizer = javascriptGenerator.valueToCode(block, 'OPTIMIZER', javascriptGenerator.ORDER_ATOMIC);
    const epochs = javascriptGenerator.valueToCode(block, 'EPOCHS', javascriptGenerator.ORDER_ATOMIC);
    const layers = javascriptGenerator.valueToCode(block, 'LAYERS', javascriptGenerator.ORDER_ATOMIC);
    
    return `
const model = tf.sequential();
${layers}
${optimizer}
await model.fit(x_train, y_train, { epochs: ${epochs} });
`;
  };

  javascriptGenerator.forBlock['ml_add_layer'] = function(block) {
    const layerType = block.getFieldValue('LAYER_TYPE');
    const units = block.getFieldValue('UNITS');
    return [`model.add(tf.layers.${layerType.toLowerCase()}({ units: ${units} }))`, javascriptGenerator.ORDER_ATOMIC];
  };

  javascriptGenerator.forBlock['ml_set_optimizer'] = function(block) {
    const optimizer = block.getFieldValue('OPTIMIZER');
    return [`model.compile({optimizer: '${optimizer.toLowerCase()}', loss: 'meanSquaredError'})`, javascriptGenerator.ORDER_ATOMIC];
  };

  javascriptGenerator.forBlock['ml_set_epochs'] = function(block) {
    const epochs = block.getFieldValue('EPOCHS');
    return [epochs, javascriptGenerator.ORDER_ATOMIC];
  };
};