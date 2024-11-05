import * as Blockly from 'blockly';
import { useBlocklyWorkspace } from '../context/useBlocklyWorkspace';

export const updateStartBlock = (startBlock, algorithmBlock) => {
    // Get existing values before removal
    const existingValues = {};
    ['N_CLUSTERS', 'MAX_ITER', 'EPS', 'MIN_PTS', 'ALPHA', 'L1_RATIO', 'K', 'WEIGHTING', 'MAX_DEPTH', 'N_ESTIMATORS', 'DEGREE'].forEach(input => {
      if (startBlock.getInput(input)) {
        const targetBlock = startBlock.getInputTargetBlock(input);
        if (targetBlock) {
          existingValues[input] = targetBlock;
        }
      }
    });

    // Remove inputs that don't match the current algorithm
    ['N_CLUSTERS', 'MAX_ITER', 'EPS', 'MIN_PTS', 'ALPHA', 'L1_RATIO', 'K', 'WEIGHTING', 'MAX_DEPTH', 'N_ESTIMATORS', 'DEGREE'].forEach(input => {
      if (startBlock.getInput(input)) {
        startBlock.removeInput(input);
      }
    });

    // Add inputs based on algorithm and restore values
    if (algorithmBlock) {
      switch(algorithmBlock.type) {
        case 'clustering_kmeans':
          startBlock.appendValueInput('N_CLUSTERS')
              .setCheck('Number')
              .appendField('Number of clusters');
          if (existingValues['N_CLUSTERS']) {
            startBlock.getInput('N_CLUSTERS').connection.connect(existingValues['N_CLUSTERS'].outputConnection);
          }
          startBlock.appendValueInput('MAX_ITER')
              .setCheck('Number')
              .appendField('Max iterations (default: 100)');
          if (existingValues['MAX_ITER']) {
            startBlock.getInput('MAX_ITER').connection.connect(existingValues['MAX_ITER'].outputConnection);
          }
          break;
        case 'clustering_dbscan':
          startBlock.appendValueInput('EPS')
              .setCheck('Number')
              .appendField('Epsilon (radius)');
          if (existingValues['EPS']) {
            startBlock.getInput('EPS').connection.connect(existingValues['EPS'].outputConnection);
          }
          startBlock.appendValueInput('MIN_PTS')
              .setCheck('Number')
              .appendField('Minimum points');
          if (existingValues['MIN_PTS']) {
            startBlock.getInput('MIN_PTS').connection.connect(existingValues['MIN_PTS'].outputConnection);
          }
          break;
        case 'clustering_hierarchical':
          startBlock.appendValueInput('N_CLUSTERS')
              .setCheck('Number')
              .appendField('Number of clusters');
          if (existingValues['N_CLUSTERS']) {
            startBlock.getInput('N_CLUSTERS').connection.connect(existingValues['N_CLUSTERS'].outputConnection);
          }
          break;
        case 'regression_linear':
          startBlock.appendValueInput('ALPHA')
          .setCheck('Number')
          .appendField('Alpha (regularization)');
          if (existingValues['ALPHA']) {
            startBlock.getInput('ALPHA').connection.connect(existingValues['ALPHA'].outputConnection);
          }
          break;
        case 'regression_ridge':
          startBlock.appendValueInput('ALPHA')
              .setCheck('Number')
              .appendField('Alpha (regularization)');
          if (existingValues['ALPHA']) {
            startBlock.getInput('ALPHA').connection.connect(existingValues['ALPHA'].outputConnection);
          }
          break;
        case 'regression_elastic_net':
          startBlock.appendValueInput('ALPHA')
              .setCheck('Number')
              .appendField('Alpha');
          if (existingValues['ALPHA']) {
            startBlock.getInput('ALPHA').connection.connect(existingValues['ALPHA'].outputConnection);
          }
          startBlock.appendValueInput('L1_RATIO')
              .setCheck('Number')
              .appendField('L1 ratio');
          if (existingValues['L1_RATIO']) {
            startBlock.getInput('L1_RATIO').connection.connect(existingValues['L1_RATIO'].outputConnection);
          }
          break;
        case 'regression_knn':
          startBlock.appendValueInput('K')
              .setCheck('Number')
              .appendField('Number of neighbors');
          if (existingValues['K']) {
            startBlock.getInput('K').connection.connect(existingValues['K'].outputConnection);
          }
          startBlock.appendValueInput('WEIGHTING')
              .setCheck('String')
              .appendField('Weight function');
          if (existingValues['WEIGHTING']) {
            startBlock.getInput('WEIGHTING').connection.connect(existingValues['WEIGHTING'].outputConnection);
          }
          break;
        case 'regression_random_forest':
        case 'regression_gradient_boosting':
          startBlock.appendValueInput('N_ESTIMATORS')
              .setCheck('Number')
              .appendField('Number of estimators');
          if (existingValues['N_ESTIMATORS']) {
            startBlock.getInput('N_ESTIMATORS').connection.connect(existingValues['N_ESTIMATORS'].outputConnection);
          }
          startBlock.appendValueInput('MAX_DEPTH')
              .setCheck('Number')
              .appendField('Maximum depth');
          if (existingValues['MAX_DEPTH']) {
            startBlock.getInput('MAX_DEPTH').connection.connect(existingValues['MAX_DEPTH'].outputConnection);
          }
          break;
          case 'regression_polynomial':
            startBlock.appendValueInput('DEGREE')
              .setCheck('Number')
              .appendField('Polynomial degree')
            if (existingValues['DEGREE']) {
              startBlock.getInput('DEGREE').connection.connect(existingValues['DEGREE'].outputConnection)
            }
            break
        
          }
};    
};