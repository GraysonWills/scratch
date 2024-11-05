import linearRegressionAlgorithm from '../algorithms/linearRegression';
import polynomialRegressionAlgorithm from '../algorithms/polynomialRegression';
import ridgeRegressionAlgorithm from '../algorithms/ridgeRegression';
import lassoRegressionAlgorithm from '../algorithms/lassoRegression';
import elasticNetRegressionAlgorithm from '../algorithms/elasticNetRegression';
import logisticRegressionAlgorithm from '../algorithms/logisticRegression';
import stepwiseRegressionAlgorithm from '../algorithms/stepwiseRegression';
import pcrRegressionAlgorithm from '../algorithms/pcrRegression';
import plsRegressionAlgorithm from '../algorithms/plsRegression';
import bayesianRegressionAlgorithm from '../algorithms/bayesianRegression';
import quantileRegressionAlgorithm from '../algorithms/quantileRegression';
import svrRegressionAlgorithm from '../algorithms/svrRegression';
import decisionTreeRegressionAlgorithm from '../algorithms/decisionTreeRegression';
import randomForestRegressionAlgorithm from '../algorithms/randomForestRegression';
import gradientBoostingRegressionAlgorithm from '../algorithms/gradientBoostingRegression';
import knnRegressionAlgorithm from '../algorithms/knnRegression';

export const regressionBlocks = [
  {
    "type": "regression_start",
    "message0": "Start Regression %1 Algorithm: %2",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "ALGORITHM",
        "check": "REGRESSION_ALGORITHM"
      }
    ],
    "colour": "#7C4DFF",
    "tooltip": "Begin regression analysis"
  },
    {
    "type": "regression_number",
    "message0": "%1",
    "args0": [{
      "type": "field_number",
      "name": "VALUE",
      "value": 3,
      "min": 0,
      "precision": 0.1
    }],
    "output": "Number",
    "colour": "#7C4DFF",
    "tooltip": "Number input for clustering parameters"
  },
  {
    "type": "regression_linear",
    "message0": "Linear Regression",
    "previousStatement": "REGRESSION_ALGORITHM",
    "colour": "#7C4DFF",
    "tooltip": "Simple linear regression",
    "execute": linearRegressionAlgorithm
  },  // Add similar blocks for each regression type
  {
    "type": "regression_polynomial",
    "message0": "Polynomial Regression",
    "previousStatement": "REGRESSION_ALGORITHM",
    "colour": "#7C4DFF",
    "tooltip": "Polynomial regression with configurable degree",
    "execute": polynomialRegressionAlgorithm
  },
  {
    "type": "regression_ridge",
    "message0": "Ridge Regression",
    "previousStatement": "REGRESSION_ALGORITHM",
    "colour": "#7C4DFF",
    "tooltip": "Ridge regression with L2 regularization",
    "execute": ridgeRegressionAlgorithm
  },
  {
    "type": "regression_lasso",
    "message0": "Lasso Regression",
    "previousStatement": "REGRESSION_ALGORITHM",
    "colour": "#7C4DFF",
    "tooltip": "Lasso regression with L1 regularization",
    "execute": lassoRegressionAlgorithm
  },
  {
    "type": "regression_elastic_net",
    "message0": "Elastic Net Regression",
    "previousStatement": "REGRESSION_ALGORITHM",
    "colour": "#7C4DFF",
    "tooltip": "Elastic Net regression combining L1 and L2 regularization",
    "execute": elasticNetRegressionAlgorithm
  },
  {
    "type": "regression_logistic",
    "message0": "Logistic Regression",
    "previousStatement": "REGRESSION_ALGORITHM",
    "colour": "#7C4DFF",
    "tooltip": "Logistic regression for binary classification",
    "execute": logisticRegressionAlgorithm
  },
  {
    "type": "regression_stepwise",
    "message0": "Stepwise Regression",
    "previousStatement": "REGRESSION_ALGORITHM",
    "colour": "#7C4DFF",
    "tooltip": "Stepwise feature selection regression",
    "execute": stepwiseRegressionAlgorithm
  },
  {
    "type": "regression_pcr",
    "message0": "Principal Component Regression",
    "previousStatement": "REGRESSION_ALGORITHM",
    "colour": "#7C4DFF",
    "tooltip": "PCR combining PCA with linear regression",
    "execute": pcrRegressionAlgorithm
  },
  {
    "type": "regression_pls",
    "message0": "Partial Least Squares Regression",
    "previousStatement": "REGRESSION_ALGORITHM",
    "colour": "#7C4DFF",
    "tooltip": "PLS regression for high-dimensional data",
    "execute": plsRegressionAlgorithm
  },
  {
    "type": "regression_bayesian",
    "message0": "Bayesian Regression",
    "previousStatement": "REGRESSION_ALGORITHM",
    "colour": "#7C4DFF",
    "tooltip": "Bayesian linear regression with prior distributions",
    "execute": bayesianRegressionAlgorithm
  },
  {
    "type": "regression_quantile",
    "message0": "Quantile Regression",
    "previousStatement": "REGRESSION_ALGORITHM",
    "colour": "#7C4DFF",
    "tooltip": "Regression for specific quantiles of the response variable",
    "execute": quantileRegressionAlgorithm
  },
  {
    "type": "regression_svr",
    "message0": "Support Vector Regression",
    "previousStatement": "REGRESSION_ALGORITHM",
    "colour": "#7C4DFF",
    "tooltip": "Support Vector Regression with kernel methods",
    "execute": svrRegressionAlgorithm
  },
  {
    "type": "regression_decision_tree",
    "message0": "Decision Tree Regression",
    "previousStatement": "REGRESSION_ALGORITHM",
    "colour": "#7C4DFF",
    "tooltip": "Decision tree-based regression model",
    "execute": decisionTreeRegressionAlgorithm
  },
  {
    "type": "regression_random_forest",
    "message0": "Random Forest Regression",
    "previousStatement": "REGRESSION_ALGORITHM",
    "colour": "#7C4DFF",
    "tooltip": "Ensemble of decision trees for regression",
    "execute": randomForestRegressionAlgorithm
  },
  {
    "type": "regression_knn",
    "message0": "K-Nearest Neighbors Regression",
    "previousStatement": "REGRESSION_ALGORITHM",
    "colour": "#7C4DFF",
    "tooltip": "KNN regression with distance-weighted predictions",
    "execute": knnRegressionAlgorithm
  },
 {
    "type": "regression_gradient_boosting",
    "message0": "Gradient Boosting Regression",
    "previousStatement": "REGRESSION_ALGORITHM",
    "colour": "#7C4DFF",
    "tooltip": "Gradient Boosting regression with decision trees",
    "execute": gradientBoostingRegressionAlgorithm
  }
];