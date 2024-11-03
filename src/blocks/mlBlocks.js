export const mlBlocks = [
  {
    "type": "ml_start_training",
    "message0": "Start Training %1 Optimizer: %2 Epochs: %3 Layers: %4",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "OPTIMIZER",
        "check": "OPTIMIZER_STATEMENT",
        "align": "RIGHT"
      },
      {
        "type": "input_statement",
        "name": "EPOCHS",
        "check": "EPOCH_STATEMENT",
        "align": "RIGHT"
      },
      {
        "type": "input_statement",
        "name": "LAYERS",
        "check": "LAYER_STATEMENT",
        "align": "RIGHT"
      }
    ],
    "colour": 230,
    "tooltip": "Begin training the model."
  },
  {
    "type": "ml_add_layer",
    "message0": "Add Layer %1 units %2 activation %3",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "LAYER_TYPE",
        "options": [
          ["Dense", "DENSE"],
          ["Conv1D", "CONV1D"],
          ["Conv2D", "CONV2D"],
          ["Conv3D", "CONV3D"],
          ["LSTM", "LSTM"],
          ["GRU", "GRU"],
          ["SimpleRNN", "SIMPLE_RNN"]
        ]
      },
      {
        "type": "field_number",
        "name": "UNITS",
        "value": 128,
        "min": 1,
        "max": 2048
      },
      {
        "type": "field_dropdown",
        "name": "ACTIVATION",
        "options": [
          ["ReLU", "RELU"],
          ["Sigmoid", "SIGMOID"],
          ["Tanh", "TANH"],
          ["Softmax", "SOFTMAX"],
          ["Linear", "LINEAR"]
        ]
      }
    ],
    "previousStatement": "LAYER_STATEMENT",
    "nextStatement": "LAYER_STATEMENT",
    "colour": 230,
    "tooltip": "Add a layer to the model."
  },
  {    "type": "ml_set_optimizer",
    "message0": "Set Optimizer %1",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "OPTIMIZER",
        "options": [
          ["SGD", "SGD"],
          ["Adam", "ADAM"],
          ["RMSprop", "RMSPROP"],
          ["Adadelta", "ADADELTA"],
          ["Adagrad", "ADAGRAD"],
          ["Adamax", "ADAMAX"],
          ["Nadam", "NADAM"],
          ["Ftrl", "FTRL"]
        ]
      }
    ],
    "previousStatement": "OPTIMIZER_STATEMENT",
    "colour": 230,
    "tooltip": "Set the optimizer for the model."
  },
  {
    "type": "ml_set_epochs",
    "message0": "Train for %1 epochs",
    "args0": [
      {
        "type": "field_number",
        "name": "EPOCHS",
        "value": 10,
        "min": 1,
        "max": 100
      }
    ],
    "previousStatement": "EPOCH_STATEMENT",
    "colour": 230,
    "tooltip": "Set the number of epochs for model training."
  }
];
