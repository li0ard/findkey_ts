# findkey_ts

[English version](README.md)

Программа для поиска параметров Аффинного преобразования/Преобразования Гельмерта (с 4 параметрами)

Портировано с C на TS li0ard'ом

**ВНИМАНИЕ: Данная программа совместима только с [Bun](https://bun.sh)**

## CLI

### Использование

```
findkey_ts --f1 <coord1> --f2 <coord2>
```

### Входные файлы

Для работы программы необходимо 2 файла: файл с координатами в исходной СК и файл с координатами в нужной СК (для лучшего результата необходимо 6-7 пар координат)

Пары координат записываются в формате `Y X`

## API

```ts
/** Represents the formatted transformation parameters */
export interface formattedH {
    A0: number,
    A1: number,
    A2: number,
    B0: number,
    B1: number,
    B2: number,
}

/** Represents the transformation parameters with scale (mu), angle (theta), and residuals */
export interface Keys {
    h: formattedH,
    mu: number,
    theta: number,
    residuals: number[][]
}

/**
 * Find parameters
 * @param fp0 Array with coordinates in original CS in the format "Y X"
 * @param fp1 Array with coordinates in desired CS in the format "Y X"
 * @returns 
 */

export const findKey = (fp0: string[], fp1: string[]): Keys => {}

/**
 * Reverse parameters
 * @param h Property `h` of `findKey` function result 
 * @returns 
 */
export const reverseH = (h: formattedH): formattedH => {}
```