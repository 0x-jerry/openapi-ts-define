[
  {
    "oneOf": [
      {
        "type": "string",
      },
      {
        "type": "number",
      },
      {
        "const": false,
        "type": "boolean",
      },
      {
        "const": true,
        "type": "boolean",
      },
    ],
  },
  {
    "oneOf": [
      {
        "const": false,
        "type": "boolean",
      },
      {
        "const": 1,
        "type": "number",
      },
      {
        "const": 3,
        "type": "number",
      },
      {
        "const": "X",
        "type": "string",
      },
      {
        "const": "y",
        "type": "string",
      },
    ],
  },
  {
    "oneOf": [
      {
        "type": "string",
      },
      {
        "properties": {
          "a": {
            "const": 1,
            "type": "number",
          },
        },
        "required": [
          "a",
        ],
        "type": "object",
      },
      {
        "properties": {
          "b": {
            "const": 1,
            "type": "number",
          },
        },
        "required": [
          "b",
        ],
        "type": "object",
      },
    ],
  },
]