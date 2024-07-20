/**
 * findkey_ts
 * 
 * Program to compute Helmert 2D transformation parameters.
 * Ported from C to TS by li0ard
 * 
 * Usage: findkey_ts --f1 <coord1> --f2 <coord2>
 * 
 * Input files: coord1 coord2
 * - coord1 - source coordinate 'y1 x1'
 * - coord2 - destination coordinate 'y2 x2' a row per a point; 3+ points
 * 
 * Formulas:
 * - Affine: XT = A0 + A1 * XS + A2 * YS
 *           YT = B0 + B1 * XS + B2 * YS
 * - Helmert: XT = X0 + A * XS - B * YS
 *            YT = Y0 + B * XS + A * YS
 */

import { findKey, reverseH } from "./src/index.js"
import { parseArgs } from "util";

const { values } = parseArgs({
    args: Bun.argv,
    options: {
        print: {
            type: 'boolean',
        },
        f1: {
            type: "string"
        },
        f2: {
            type: "string"
        }
    },
    strict: true,
    allowPositionals: true
})

if(!values.f1 || !values.f2) {
    console.log("Usage: findkey_ts --f1 path/to/sk1.csv --f2 path/to/sk2.csv [--print]")
    process.exit()
}

let fp0 = (await Bun.file(values.f1 as string).text()).split("\n")
let fp1 = (await Bun.file(values.f2 as string).text()).split("\n")

let result = findKey(fp0, fp1)
let a = reverseH(result.formattedH)

let keys_output = `===== AFFINE =====
A0 = ${result.formattedH.A0.toFixed(15)}
A1 = ${result.formattedH.A1.toFixed(15)}
A2 = ${result.formattedH.A2.toFixed(15)}
B0 = ${result.formattedH.B0.toFixed(15)}
B1 = ${result.formattedH.B1.toFixed(15)}
B2 = ${result.formattedH.B2.toFixed(15)}

MapInfo:
${result.formattedH.A1.toFixed(12)} ${result.formattedH.A2.toFixed(12)} ${result.formattedH.A0.toFixed(17)} ${result.formattedH.B1.toFixed(12)} ${result.formattedH.B2.toFixed(12)} ${result.formattedH.B0.toFixed(17)}

Reverse parameters:
A0 = ${a.A0.toFixed(15)}
A1 = ${a.A1.toFixed(15)}
A2 = ${a.A2.toFixed(15)}
B0 = ${a.B0.toFixed(15)}
B1 = ${a.B1.toFixed(15)}
B2 = ${a.B2.toFixed(15)}

===== HELMERT =====
X0 = ${result.formattedH.B0}
Y0 = ${result.formattedH.A0}
A  = ${result.formattedH.A1}
B  = ${result.formattedH.A2}

Reverse parameters:
X0 = ${a.B0}
Y0 = ${a.A0}
A  = ${a.A1}
B  = ${a.A2}

===== OTHER =====

scale = ${result.mu.toFixed(17)}
angle = ${result.theta.toFixed(17)}\n`

let residuals = []

for(let i of result.residuals) {
    residuals.push(`${i[0]};${i[1]}`)
}

console.log(keys_output)
console.log(`Residuals:\n${residuals.join("\n")}`)