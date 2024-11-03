import React from 'react';
import * as Blockly from 'blockly';
import { useBlocklyWorkspace } from '../context/useBlocklyWorkspace';
import { mlBlocks } from '../blocks/mlBlocks';
import { clusteringBlocks } from '../blocks/clusteringBlocks';
import { toolboxConfig } from '../blocks/toolboxConfig';
import DataUploader from './DataUploader';

const BlocklyEditor = () => {
  const { blocklyDiv, workspace } = useBlocklyWorkspace(toolboxConfig);
  const [uploadedData, setUploadedData] = React.useState(null);
  const dataUploaderRef = React.useRef(null);

  React.useEffect(() => {
    if (workspace.current) {
      [...mlBlocks, ...clusteringBlocks].forEach(block => {
        Blockly.Blocks[block.type] = {
          init: function() {
            this.jsonInit(block);
            if (block.execute) {
              this.execute = block.execute;
            }
          }
        };
      });
    }
  }, [workspace]);

  const runCode = async () => {
    try {
      // Get all top-level blocks in workspace
      const topBlocks = workspace.current.getTopBlocks(true);
      
      // Process each top block based on its category
      topBlocks.forEach(async (block) => {
        if (block.type === 'clustering_start') {
          await handleClusteringBlock(block);
        }
        // Add other block type handlers here:
        // else if (block.type === 'ml_start_training') {
        //   await handleMLBlock(block);
        // }
      });
    } catch (e) {
      console.error('Execution error:', e);
    }
  };

  const handleClusteringBlock = async (block) => {
    const algorithmBlock = block.getInputTargetBlock('ALGORITHM');
    const paramBlock = block.getInputTargetBlock('PARAMETER');
    
    if (algorithmBlock && algorithmBlock.execute && uploadedData && uploadedData.length > 0) {
      const params = {};
      
      // Get parameters based on algorithm type
      switch(algorithmBlock.type) {
        case 'clustering_kmeans':
          params.n_clusters = parseInt(paramBlock.getFieldValue('PARAM_VALUE'));
          break;
        case 'clustering_dbscan':
          params.eps = parseFloat(paramBlock.getFieldValue('EPS'));
          params.minPts = parseInt(paramBlock.getFieldValue('MIN_SAMPLES'));
          break;
        case 'clustering_hierarchical':
          params.n_clusters = parseInt(paramBlock.getFieldValue('N_CLUSTERS'));
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
      results.ids = ids;
      
      if (results) {
        dataUploaderRef.current.updateClusterResults(results);
      }
    }
  };
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