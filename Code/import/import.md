<h1>Import Subalias<img align="right" src="../../Data/image.png" width="100px"></h1>

Allows administrators (requires administrative privileges) to import organizations from generated JSONs to SVAR

## Organization Import
[Reputation Organization Generator](https://shadow-draconic-development.github.io/Avrae-Organization-Reputation-Manager-Redux/) is where you go to generate reputation organizations.

It merges the dictionaries together at the organization level. If you import an organization, it will overwrite all the thresholds for that organization, leaving other organizations you did not import untouched.

I.e. you have the Narnia org that has the thresholds 0, 10, 20, 30, and 40. If you import Narnia again with the thresholds 50, 60, and 70. The new import will overwrite the old and you will be left with thresholds 50, 60, and 70 (with thresholds 0-40 missing).


- `Organization Name`: Name of the organization
    - `Delete Organization`: This is used to delete existing organizations (name is case sensitive)
    - `Image URL`: URL of the thumbnail you would like to use
    - `Color Hex Code`: Color hex code of border
    - `Add Threshold`: Add points reward threshold
        - `Add reward`: You are allowed to add multiple rewards per threshold
- `Add organization`: Add organization
- `Copy to clipboard`: Copy JSON string to clipboard

## Usage
`!rep import [JSON string]`
- `JSON string`
    - Required
    - Simply paste the output of the JSON provided from generator

## Subalias Markdown
`old`: [Markdown](https://github.com/Shadow-Draconic-Development/Avrae-Organization-Reputation-Manager-Redux/blob/main/Code/import/old/old.md)