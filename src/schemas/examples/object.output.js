[
  {
    "description": "Object Type",
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
  {
    "description": "Literal Object Type",
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
  {
    "properties": {
      "False": {
        "const": false,
        "type": "boolean",
      },
      "Num": {
        "const": 1111,
        "type": "number",
      },
      "Str": {
        "const": "string",
        "type": "string",
      },
      "TemplateStr": {
        "const": "ssss",
        "type": "string",
      },
      "True": {
        "const": true,
        "type": "boolean",
      },
    },
    "required": [
      "Str",
      "Num",
      "TemplateStr",
      "False",
    ],
    "type": "object",
  },
]