[
  {
    "description": "interface ref",
    "properties": {
      "A": {
        "oneOf": [
          {},
          {},
          {},
          {},
        ],
      },
      "B": {
        "type": "number",
      },
      "C": {
        "const": 1,
        "type": "number",
      },
      "E": {},
      "O": {
        "description": "interface ref",
        "properties": {
          "b": {
            "description": "boolean",
            "type": "boolean",
          },
          "n": {
            "description": "number",
            "type": "number",
          },
          "o": {
            "description": "optional string",
            "type": "string",
          },
          "s": {
            "description": "string",
            "type": "string",
          },
        },
        "required": [
          "s",
          "n",
          "b",
        ],
        "type": "object",
      },
    },
    "required": [
      "A",
      "B",
      "O",
    ],
    "type": "object",
  },
  {
    "oneOf": [
      {},
      {},
      {},
      {},
      {
        "description": "interface ref",
        "properties": {
          "A": {
            "oneOf": [
              {},
              {},
              {},
              {},
            ],
          },
          "B": {
            "type": "number",
          },
          "C": {
            "const": 1,
            "type": "number",
          },
          "E": {},
          "O": {
            "description": "interface ref",
            "properties": {
              "b": {
                "description": "boolean",
                "type": "boolean",
              },
              "n": {
                "description": "number",
                "type": "number",
              },
              "o": {
                "description": "optional string",
                "type": "string",
              },
              "s": {
                "description": "string",
                "type": "string",
              },
            },
            "required": [
              "s",
              "n",
              "b",
            ],
            "type": "object",
          },
        },
        "required": [
          "A",
          "B",
          "O",
        ],
        "type": "object",
      },
    ],
  },
]