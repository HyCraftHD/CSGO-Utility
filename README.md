# CSGO-Utilty

CSGO-Nades Website

## Entry-File

Example on how to create a smoke-file:

```json
{
   "type": "smoke",
   "name": "Target Position", // Name of the position where the smoke lands
   "description": "Description",
   "x": 225, // Target X
   "y": 485, // Target Y
   "entries": [ // List of entries from where you can throw this smoke
      {
         "name": "T Spawn", // Position from where the smoke is thrown
         "description": "Smoke from T Spawn for an outside execute", // Description for the lineup
         "x": 351, // Source X
         "y": 242, // Source Y
         "videos": [ // List of videos
            {
               "ticks": "128",
               "youtube": "2RXt3HWOXmc"
            }
         ]
      }
   ]
}
```
