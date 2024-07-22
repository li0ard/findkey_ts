let x: number[] = new Array(2).fill(0),
    y: number[] = new Array(2).fill(0),
    s: number[] = new Array(7).fill(0),
    h: number[] = new Array(6).fill(0),
    xc: number[] = new Array(2).fill(0),
    yc: number[] = new Array(2).fill(0),
    dx: number[] = new Array(2).fill(0),
    dy: number[] = new Array(2).fill(0),
    yh: number[] = new Array(2).fill(0)

interface formattedH {
    A0: number,
    A1: number,
    A2: number,
    B0: number,
    B1: number,
    B2: number,
}

interface Keys {
    h: formattedH,
    mu: number,
    theta: number,
    residuals: number[][]
}

/**
 * Поиск параметров
 * @param fp0 Файл c координатами в исходной СК в формате "Y X"
 * @param fp1 Файл с координатами в нужной СК в формате "Y X"
 * @returns 
 */
export const findKey = (fp0: string[], fp1: string[]): Keys => {
    /* coordinate sums */
    for(let i = 0; i < fp0.length; i++) {
        x = fp0[i].split(" ").map(i => parseFloat(i))
        y = fp1[i].split(" ").map(i => parseFloat(i))
        s[0] += x[0];
        s[1] += x[1];
        s[2] += y[0];
        s[3] += y[1];
        s[4] += 1;
    }

    /* centrum gravitatis */
    for (let i = 0; i < 2; i++) {
        xc[i] = s[i] / s[4];
        yc[i] = s[2 + i] / s[4];
    }
    /* sums of products */
    for (let i = 0; i < 7; i++) {
        s[i] = 0;
    }

    for(let i = 0; i < fp0.length; i++) {
        x = fp0[i].split(" ").map(i => parseFloat(i))
        y = fp1[i].split(" ").map(i => parseFloat(i))
        /* coordinate differences */
        dx[0] = x[0] - xc[0];
        dx[1] = x[1] - xc[1];
        dy[0] = y[0] - yc[0];
        dy[1] = y[1] - yc[1];
        /* summation */
        s[0] += dx[0] * dx[0];
        /*s[1] += dx[0] * dx[1];*/
        s[2] += dx[1] * dx[1];
        s[3] += dx[0] * dy[0];
        s[4] += dx[1] * dy[0];
        s[5] += dx[0] * dy[1];
        s[6] += dx[1] * dy[1];
    }

    /* Helmert parameters */
    let det = s[0] + s[2];
    h[0] = (s[3] + s[6]) / det;
    h[1] = (s[4] - s[5]) / det;
    h[2] = yc[0] - h[0] * xc[0] - h[1] * xc[1];
    h[3] = -h[1];
    h[4] = h[0];
    h[5] = yc[1] - h[3] * xc[0] - h[4] * xc[1];

    let mu = Math.hypot(h[0], h[1]);
    let theta = Math.atan2(h[1], h[0]) / Math.PI * 180;

    let residuals = []

    for(let i = 0; i < fp0.length; i++) {
        x = fp0[i].split(" ").map(i => parseFloat(i))
        y = fp1[i].split(" ").map(i => parseFloat(i))
        /* model y */
        yh[0] = h[0] * x[0] + h[1] * x[1] + h[2];
        yh[1] = h[3] * x[0] + h[4] * x[1] + h[5];

        //residuals.push(`${(yh[0] - y[0]).toFixed(15)};${(yh[1] - y[1]).toFixed(15)}`)
        residuals.push([
            parseFloat((yh[0] - y[0]).toFixed(15)),
            parseFloat((yh[1] - y[1]).toFixed(15))
        ])
    }

    return {
        //h: h,
        h: {
            A0: h[2],
            A1: h[0],
            A2: h[1],
            B0: h[5],
            B1: h[3],
            B2: h[4],
        },
        mu: mu,
        theta: theta,
        residuals: residuals
    }
}

export const reverseH = (h: formattedH): formattedH => {
    let D = h.A1 * h.B2 - h.A2 * h.B1
    return {
        A0: (h.A2 * h.B0 - h.B2 * h.A0) / D,
        A1: +h.B2 / D,
        A2: -h.A2 / D,
        B0: (h.B1 * h.A0 - h.A1 * h.B0) / D,
        B1: -h.B1 / D,
        B2: +h.A1 / D
    }
}