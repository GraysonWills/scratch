import { useEffect, useRef } from 'react';
import * as Blockly from 'blockly';

export const useBlocklyWorkspace = (toolboxConfig) => {
  const blocklyDiv = useRef(null);
  const workspace = useRef(null);

  useEffect(() => {
    if (!workspace.current) {
      workspace.current = Blockly.inject(blocklyDiv.current, {
        toolbox: toolboxConfig,
      });
    }

    return () => {
      if (workspace.current) {
        workspace.current.dispose();
        workspace.current = null;
      }
    };
  }, [toolboxConfig]);

  return { blocklyDiv, workspace };
};
