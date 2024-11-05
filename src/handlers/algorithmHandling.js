export const handleClusteringBlock = async (block, uploadedData, dataUploaderRef) => {
  const algorithmBlock = block.getInputTargetBlock('ALGORITHM');
  const paramBlock = block.getInputTargetBlock('PARAMETER');
  
  if (algorithmBlock && algorithmBlock.execute && uploadedData && uploadedData.length > 0) {
    const params = {};
    
    switch(algorithmBlock.type) {
      case 'clustering_kmeans':
        const nClustersBlock = block.getInputTargetBlock('N_CLUSTERS');
        const maxIterBlock = block.getInputTargetBlock('MAX_ITER');
        params.n_clusters = nClustersBlock ? parseInt(nClustersBlock.getFieldValue('VALUE')) : 3;
        params.max_iter = maxIterBlock ? parseInt(maxIterBlock.getFieldValue('VALUE')) : 100;
        break;
      case 'clustering_dbscan':
        const epsBlock = block.getInputTargetBlock('EPS');
        const minPtsBlock = block.getInputTargetBlock('MIN_PTS');
        params.eps = epsBlock ? parseFloat(epsBlock.getFieldValue('VALUE')) : 0.5;
        params.minPts = minPtsBlock ? parseInt(minPtsBlock.getFieldValue('VALUE')) : 4;
        break;
      case 'clustering_hierarchical':
        const clustersBlock = block.getInputTargetBlock('N_CLUSTERS');
        params.n_clusters = clustersBlock ? parseInt(clustersBlock.getFieldValue('VALUE')) : 3;
        break;
    }
    
    const columns = Object.keys(uploadedData[0]);
    const selectedX = dataUploaderRef.current.getSelectedX();
    const selectedY = dataUploaderRef.current.getSelectedY();
    const selectedZ = dataUploaderRef.current.getSelectedZ();
    
    const formattedData = uploadedData.map(row => {
      const point = [row[selectedX], row[selectedY]];
      if (selectedZ) point.push(row[selectedZ]);
      return point;
    });
    
    const results = await algorithmBlock.execute(formattedData, params);
    if (results) {
      dataUploaderRef.current.updateClusterResults(results);
    }
  }
};

export const handleMLBlock = async (block, uploadedData, dataUploaderRef) => {
  const algorithmBlock = block.getInputTargetBlock('ALGORITHM');
  const optimizerBlock = block.getInputTargetBlock('OPTIMIZER');
  const epochsBlock = block.getInputTargetBlock('EPOCHS');
  
  if (algorithmBlock && algorithmBlock.execute && uploadedData && uploadedData.length > 0) {
    const params = {
      optimizer: optimizerBlock.getFieldValue('OPTIMIZER'),
      epochs: parseInt(epochsBlock.getFieldValue('EPOCHS')),
      layers: block.getInputTargetBlock('LAYERS')
    };

    const columns = Object.keys(uploadedData[0]);
    const selectedX = dataUploaderRef.current.getSelectedX();
    const selectedY = dataUploaderRef.current.getSelectedY();

    const formattedData = uploadedData.map(row => ({
      x: row[selectedX],
      y: row[selectedY]
    }));

    const results = await algorithmBlock.execute(formattedData, params);
    if (results) {
      dataUploaderRef.current.updateMLResults(results);
    }
  }
};

export const handleRegressionBlock = async (block, uploadedData, dataUploaderRef) => {
  const algorithmBlock = block.getInputTargetBlock('ALGORITHM');
  
  if (algorithmBlock?.execute && uploadedData?.length > 0) {
    const params = {};
    
    switch(algorithmBlock.type) {
      case 'regression_linear':
        const alphaBlock = block.getInputTargetBlock('ALPHA');
        params.alpha = alphaBlock?.getFieldValue('VALUE') || 0.01;
        break;
      case 'regression_polynomial':
        const degreeBlock = block.getInputTargetBlock('DEGREE');
        const degreeValue = degreeBlock ? parseInt(degreeBlock.getFieldValue('VALUE')) : 2;
        console.log(degreeBlock.getFieldValue('DEGREE'));
        params.degree = degreeValue;
        break;    }

    const columns = Object.keys(uploadedData[0]);
    const selectedX = dataUploaderRef.current.getSelectedX();
    const selectedY = dataUploaderRef.current.getSelectedY();

    const formattedData = uploadedData.map(row => [
      parseFloat(row[selectedX]),
      parseFloat(row[selectedY])
    ]);

    const results = await algorithmBlock.execute(formattedData, params);
    if (results) {
      dataUploaderRef.current.updateRegressionResults(results);
    }
  }
};
