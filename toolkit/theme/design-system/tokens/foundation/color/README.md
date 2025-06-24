# Generated Tokens for Figma Sync Plugin

```json
// input with alpha generator

{
  "kda": {
    "foundation": {
      "color": {
        "neutral": {
          "$description": "Neutral Gray colors",
          "n0": {
            "$type": "color",
            "$value": "#FFFFFF",
            "$extensions": {
              "mode": {
                "dark": "#000000"
              }
            }
          },
          "n100": {
            "$type": "color",
            "$value": "#000000",
            "$extensions": {
              "mode": {
                "dark": "#FFFFFF"
              },
              "generators": [
                {
                  "type": "alpha",
                  "value": {
                    "@alpha5": 5,
                    "@alpha10x": 11,
                    "@alpha20y": 21
                  }
                }
              ]
            }
          }
        }
      }
    }
  }

```

```json
// output for Figma PlugIn
{
  "kda": {
    "foundation": {
      "color": {
        "neutral": {
          "$description": "Neutral Gray colors",
          "n0": {
            "$type": "color",
            "$value": "#FFFFFF",
            "$extensions": {
              "mode": {
                "dark": "#000000"
              }
            }
          },
          "n100": {
            "$type": "color",
            "$value": "#000000",
            "$extensions": {
              "mode": {
                "dark": "#FFFFFF"
              }
            }
          },
          "n100@alpha5": {
            "$type": "color",
            "$value": "{kda.foundation.color.neutral.n100}",
            "$extensions": {
              "alpha": 5
            }
          },
          "n100@alpha10": {
            "$type": "color",
            "$value": "{kda.foundation.color.neutral.n100}",
            "$extensions": {
              "alpha": 10
            }
          },
          "n100@alpha20": {
            "$type": "color",
            "$value": "{kda.foundation.color.neutral.n100}",
            "$extensions": {
              "alpha": 20
            }
          }
        }
      }
    }
  }
}
```
