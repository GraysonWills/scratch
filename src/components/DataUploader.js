import React, { forwardRef, useImperativeHandle, useState } from 'react';
import * as XLSX from 'xlsx';
import Plot from 'react-plotly.js';

const DataUploader = forwardRef(({ onDataLoad }, ref) => {
  const [data, setData] = useState(null);
  const [columns, setColumns] = useState([]);
  const [selectedX, setSelectedX] = useState('');
  const [selectedY, setSelectedY] = useState('');
  const [selectedZ, setSelectedZ] = useState('');
  const [clusterResults, setClusterResults] = useState(null);
  const [regressionResults, setRegressionResults] = useState(null);

  useImperativeHandle(ref, () => ({
    updateClusterResults: (results) => {
      setClusterResults(results);
    },
    updateRegressionResults: (results) => {
      setRegressionResults(results);
    },
    getSelectedX: () => selectedX,
    getSelectedY: () => selectedY,
    getSelectedZ: () => selectedZ
  }));



  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      setData(jsonData);
      setColumns(Object.keys(jsonData[0]).filter(col => col !== 'CustomerID'));
      onDataLoad(jsonData);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div style={{ margin: '20px' }}>
      <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} />

      {columns.length > 0 && (
        <div>
          <div style={{ marginTop: '20px' }}>
            <label>Select X Variable: </label>
            <select value={selectedX} onChange={(e) => setSelectedX(e.target.value)}>
              <option value="">Select column...</option>
              {columns
                .filter(col => col !== selectedY && col !== selectedZ)
                .map(col => <option key={col} value={col}>{col}</option>)}
            </select>
          </div>
          
          <div style={{ marginTop: '10px' }}>
            <label>Select Y Variable: </label>
            <select value={selectedY} onChange={(e) => setSelectedY(e.target.value)}>
              <option value="">Select column...</option>
              {columns
                .filter(col => col !== selectedX && col !== selectedZ)
                .map(col => <option key={col} value={col}>{col}</option>)}
            </select>
          </div>

          <div style={{ marginTop: '10px' }}>
            <label>Select Z Variable (Optional): </label>
            <select value={selectedZ} onChange={(e) => setSelectedZ(e.target.value)}>
              <option value="">None</option>
              {columns
                .filter(col => col !== selectedX && col !== selectedY)
                .map(col => <option key={col} value={col}>{col}</option>)}
            </select>
          </div>
          {clusterResults && clusterResults.data && (
            <Plot
              data={[{
                x: clusterResults.data.map(point => point[0]),
                y: clusterResults.data.map(point => point[1]),
                z: selectedZ ? clusterResults.data.map(point => point[2]) : undefined,
                mode: 'markers',
                type: selectedZ ? 'scatter3d' : 'scatter',
                marker: {
                  color: clusterResults.labels,
                  colorscale: 'Viridis'
                },
                text: clusterResults.ids?.map(id => `ID: ${id}`),
                hoverinfo: 'text+x+y+z'
              }]}
              layout={{
                title: 'Clustering Results',
                xaxis: { title: selectedX },
                yaxis: { title: selectedY },
                zaxis: selectedZ ? { title: selectedZ } : undefined,
                hovermode: 'closest'
              }}
            />
          )}
            {regressionResults && (
    <Plot
      data={[
        {
          x: data.map(d => d[selectedX]),
          y: data.map(d => d[selectedY]),
          mode: 'markers',
          type: 'scatter',
          name: 'Data Points'
        },
        {
          x: data.map(d => d[selectedX]),
          y: regressionResults.predictions,
          mode: 'lines',
          type: 'scatter',
          name: 'Regression Line'
        }
      ]}
      layout={{
        title: 'Regression Results',
        xaxis: { title: selectedX },
        yaxis: { title: selectedY }
      }}
    />
  )}

          <div style={{ marginTop: '20px' }}>
            <h3>Data Preview:</h3>
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                <tr>
                  {columns.map(col => (
                    <th key={col} style={{ border: '1px solid #ddd', padding: '8px' }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 5).map((row, idx) => (
                  <tr key={idx}>
                    {columns.map(col => (
                      <td key={col} style={{ border: '1px solid #ddd', padding: '8px' }}>{row[col]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
});

export default DataUploader;