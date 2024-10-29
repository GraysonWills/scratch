import React from 'react';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import { useBlocklyWorkspace } from '../context/useBlocklyWorkspace';
import { mlBlocks } from '../blocks/mlBlocks';
import { clusteringBlocks } from '../blocks/clusteringBlocks';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { SSRProvider } from 'react-bootstrap';
import { toolboxConfig } from '../blocks/toolboxConfig';

const BlocklyEditor = () => {
  const { blocklyDiv, workspace } = useBlocklyWorkspace(toolboxConfig);

  // Define blocks when workspace is created
  React.useEffect(() => {
    if (workspace.current) {
      // Register all custom blocks
      Blockly.defineBlocksWithJsonArray([...mlBlocks, ...clusteringBlocks]);
    }
  }, [workspace]);

  const runCode = () => {
    const code = javascriptGenerator.workspaceToCode(workspace.current);
    console.log(code);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
    <div ref={blocklyDiv} style={{ height: '480px', width: '600px' }}></div>
    <button onClick={runCode} style={{ marginTop: '20px', padding: '10px 20px' }}>Run Model</button>
  </div>
  );
};

export default BlocklyEditor;