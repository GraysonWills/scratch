import React from 'react';
import * as Blockly from 'blockly';
import { useBlocklyWorkspace } from '../context/useBlocklyWorkspace';
import { mlBlocks } from '../blocks/mlBlocks';
import { clusteringBlocks } from '../blocks/clusteringBlocks';
import { regressionBlocks } from '../blocks/regressionBlocks';
import { toolboxConfig } from '../blocks/toolboxConfig';
import DataUploader from './DataUploader';

const BlocklyEditor = () => {
  const { blocklyDiv, workspace } = useBlocklyWorkspace(toolboxConfig);
  const [uploadedData, setUploadedData] = React.useState(null);
  const dataUploaderRef = React.useRef(null);

  React.useEffect(() => {
    if (workspace.current) {
      [...mlBlocks, ...clusteringBlocks, ...regressionBlocks].forEach(block => {
        Blockly.Blocks[block.type] = {
          init: function() {
            this.jsonInit(block);
            if (block.execute) {
              this.execute = block.execute;
            }
          }
        };
      });

      // Add back the change listener for dynamic block updates
      workspace.current.addChangeListener((event) => {
        if (event.type === Blockly.Events.BLOCK_MOVE) {
          // Get all blocks that end with '_start'
          const startBlocks = workspace.current.getAllBlocks().filter(block => 
            block.type.endsWith('_start')
          );
          
          startBlocks.forEach(startBlock => {
            const algorithmBlock = startBlock.getInputTargetBlock('ALGORITHM');
            updateStartBlock(startBlock, algorithmBlock);
          });
        }
      });
    }
  }, [workspace]);
  const runCode = async () => {
    try {
      // Get all top-level blocks in workspace
      const topBlocks = workspace.current.getTopBlocks(true);
      // Process each top block based on its category
      topBlocks.forEach((block) => {
        switch(block.type) {
          case 'clustering_start':
            handleClusteringBlock(block);
            break;
          case 'ml_start_training':
            //await handleMLBlock(block);
            break;
          // Add more cases for other types of start blocks
        }
      });
    } catch (e) {
      console.error('Execution error:', e);
    }
  };

  // Rest of the component code...
  const updateStartBlock = (startBlock, algorithmBlock) => {
    const previousType = startBlock.algorithmType;
    const newType = algorithmBlock?.type;

    // Remove existing inputs if algorithm changed or was removed
    if (previousType !== newType) {
      ['N_CLUSTERS', 'MAX_ITER', 'EPS', 'MIN_PTS'].forEach(input => {
        if (startBlock.getInput(input)) {
          startBlock.removeInput(input);
        }
      });
    }

    // Store current algorithm type
    startBlock.algorithmType = newType;

    if (!algorithmBlock) return;

    // Add appropriate inputs if they don't exist yet
    switch(algorithmBlock.type) {
      case 'clustering_kmeans':
        if (!startBlock.getInput('N_CLUSTERS')) {
          startBlock.appendValueInput('N_CLUSTERS')
              .setCheck('Number')
              .appendField('Number of clusters');
        }
        if (!startBlock.getInput('MAX_ITER')) {
          startBlock.appendValueInput('MAX_ITER')
              .setCheck('Number')
              .appendField('Max iterations (default: 100)');
        }
        break;
      case 'clustering_dbscan':
        if (!startBlock.getInput('EPS')) {
          startBlock.appendValueInput('EPS')
              .setCheck('Number')
              .appendField('Epsilon (radius)');
        }
        if (!startBlock.getInput('MIN_PTS')) {
          startBlock.appendValueInput('MIN_PTS')
              .setCheck('Number')
              .appendField('Minimum points');
        }
        break;
      case 'clustering_hierarchical':
        if (!startBlock.getInput('N_CLUSTERS')) {
          startBlock.appendValueInput('N_CLUSTERS')
              .setCheck('Number')
              .appendField('Number of clusters');
        }
        break;
    }
  };
    const handleClusteringBlock = async (block) => {
      const children = block.getChildren();
      const algorithmBlock = children[0];

      if (algorithmBlock?.execute && uploadedData?.length > 0) {
        const params = {};
        console.log("here")
        // Get parameters based on algorithm type
        switch(algorithmBlock.type) {
          case 'clustering_kmeans':
            const nClustersBlock = block.getInputTargetBlock('N_CLUSTERS');
            const maxIterBlock = block.getInputTargetBlock('MAX_ITER');
            params.n_clusters = nClustersBlock ? parseInt(nClustersBlock.getFieldValue('VALUE')) : 3;
            params.max_iter = maxIterBlock ? parseInt(maxIterBlock.getFieldValue('VALUE')) : 100;
            console.log('KMeans params:', params);
            break;
          case 'clustering_dbscan':
            const epsBlock = block.getInputTargetBlock('EPS');
            const minPtsBlock = block.getInputTargetBlock('MIN_PTS');
            params.eps = epsBlock ? parseFloat(epsBlock.getFieldValue('VALUE')) : 0.5;
            params.minPts = minPtsBlock ? parseInt(minPtsBlock.getFieldValue('VALUE')) : 4;
            console.log('DBSCAN params:', params);
            break;
          case 'clustering_hierarchical':
            const clustersBlock = block.getInputTargetBlock('N_CLUSTERS');
            params.n_clusters = clustersBlock ? parseInt(clustersBlock.getFieldValue('VALUE')) : 3;
            console.log('Hierarchical params:', params);
            break;
        }

        const columns = Object.keys(uploadedData[0]);
        const idColumn = columns[0];
        const selectedX = dataUploaderRef.current.getSelectedX();
        const selectedY = dataUploaderRef.current.getSelectedY();
        const selectedZ = dataUploaderRef.current.getSelectedZ();

        const formattedData = uploadedData.map(row => {
          const point = [row[selectedX], row[selectedY]];
          if (selectedZ) point.push(row[selectedZ]);
          return point;
        });

        const ids = uploadedData.map(row => row[idColumn]);

        const results = await algorithmBlock.execute(formattedData, params);

        if (results) {
          results.ids = ids;
          dataUploaderRef.current.updateClusterResults(results);
        }
      }
    } 
    return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      <button 
        onClick={runCode} 
        style={{ 
          position: 'absolute',
          top: '10px',
          right: '80px',
          zIndex: 100,
          padding: '10px 20px'
        }}
      >
        Run Model
      </button>
      <DataUploader 
        ref={dataUploaderRef}
        onDataLoad={setUploadedData}
      />
      <div 
        ref={blocklyDiv} 
        style={{ 
          height: '100%', 
          width: '100%'
        }}
      />
    </div>
  );
};
export default BlocklyEditor;