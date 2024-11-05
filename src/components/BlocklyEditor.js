import React from 'react';
import * as Blockly from 'blockly';
import { useBlocklyWorkspace } from '../context/useBlocklyWorkspace';
import { mlBlocks } from '../blocks/mlBlocks';
import { clusteringBlocks } from '../blocks/clusteringBlocks';
import { regressionBlocks } from '../blocks/regressionBlocks';
import { toolboxConfig } from '../blocks/toolboxConfig';
import { handleClusteringBlock, handleMLBlock, handleRegressionBlock } from '../handlers/algorithmHandling';
import { updateStartBlock } from './updateBlock';
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

      workspace.current.addChangeListener((event) => {
        if (event.type === Blockly.Events.BLOCK_MOVE) {
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
      const topBlocks = workspace.current.getTopBlocks(true);
      topBlocks.forEach(async (block) => {
        switch(block.type) {
          case 'clustering_start':
            await handleClusteringBlock(block, uploadedData, dataUploaderRef);
            break;
          case 'ml_start_training':
            await handleMLBlock(block, uploadedData, dataUploaderRef);
            break;
          case 'regression_start':
            await handleRegressionBlock(block, uploadedData, dataUploaderRef);
            break;
        }
      });
    } catch (e) {
      console.error('Execution error:', e);
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