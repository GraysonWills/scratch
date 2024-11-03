import kmeans from '../algorithms/kmeans';
import dbscan from '../algorithms/dbscan';
import hierarchical from '../algorithms/hierarchical';

export const clusteringBlocks = [
  {
    "type": "clustering_start",
    "message0": "Start Clustering %1 Algorithm: %2 Parameter: %3",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "ALGORITHM",
        "check": "CLUSTERING_ALGORITHM"
      },
      {
        "type": "input_statement",
        "name": "PARAMETER",
        "check": "CLUSTERING_PARAM"
      }
    ],
    "colour": 160,
    "tooltip": "Begin clustering analysis"
  },
  {
    "type": "clustering_kmeans",
    "message0": "K-Means Clustering",
    "previousStatement": "CLUSTERING_ALGORITHM",
    "colour": 160,
    "tooltip": "K-Means clustering algorithm",
    "execute": kmeans
  },
  {
    "type": "clustering_dbscan",
    "message0": "DBSCAN Clustering",
    "previousStatement": "CLUSTERING_ALGORITHM",
    "colour": 160,
    "tooltip": "Density-based spatial clustering",
    "execute": dbscan
  },
  {
    "type": "clustering_hierarchical",
    "message0": "Hierarchical Clustering",
    "previousStatement": "CLUSTERING_ALGORITHM",
    "colour": 160,
    "tooltip": "Hierarchical clustering algorithm",
    "execute": hierarchical
  },
  {
    "type": "clustering_params",
    "message0": "Set %1 to %2",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "PARAM_NAME",
        "options": [
          ["number of clusters", "N_CLUSTERS"],
          ["max iterations", "MAX_ITER"],
          ["epsilon", "EPS"],
          ["minimum samples", "MIN_SAMPLES"]
        ]
      },
      {
        "type": "field_number",
        "name": "PARAM_VALUE",
        "value": 3,
        "min": 1
      }
    ],
    "previousStatement": "CLUSTERING_PARAM",
    "colour": 160,
    "tooltip": "Set clustering parameter"
  }
];