# findkey_ts

[🇷🇺 Версия на русском](README_ru.md)

Program to compute Affine/Helmert 2D transformation parameters.

Ported from C to TS by li0ard

**ATTENTION: This program is only compatible with [Bun](https://bun.sh)**

## CLI

### Usage

```
findkey_ts --f1 <coord1> --f2 <coord2>
```

### Input files

For the program to work, 2 files are needed: a file with coordinates in the original coordinate system and a file with coordinates in the desired coordinate system (6-7 pairs of coordinates are needed for the best result)

Coordinate pairs are written in the `Y X` format

## API

```ts
/**
 * Find parameters
 * @param fp0 Array with coordinates in original CS in the format "Y X"
 * @param fp1 Array with coordinates in desired CS in the format "Y X"
 * @returns 
 */

export const findKey = (fp0: string[], fp1: string[]) => {}

/**
 * Reverse parameters
 * @param h Property `h` of `findKey` function result 
 * @returns 
 */
export const reverseH = (h: formattedH) => {}
```