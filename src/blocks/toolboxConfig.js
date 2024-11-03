export const toolboxConfig = `
  <xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none">
    <category name="Logic" colour="%{BKY_LOGIC_HUE}">
      <block type="controls_if"></block>
      <block type="logic_compare"></block>
    </category>
    <category name="Loops" colour="%{BKY_LOOPS_HUE}">
      <block type="controls_repeat_ext"></block>
    </category>
    <category name="Math" colour="%{BKY_MATH_HUE}">
      <block type="math_number"></block>
    </category>
    <category name="ML Blocks" colour="#5CA699">
      <block type="ml_start_training"></block>
      <block type="ml_add_layer"></block>
      <block type="ml_set_optimizer"></block>
      <block type="ml_set_epochs"></block>
    </category>
    <category name="Clustering" colour="#9FA55B">
      <block type="clustering_start"></block>
      <block type="clustering_kmeans"></block>
      <block type="clustering_dbscan"></block>
      <block type="clustering_hierarchical"></block>
      <block type="clustering_params"></block>
      <block type="clustering_number"></block>
      
    </category>
  </xml>
`;
