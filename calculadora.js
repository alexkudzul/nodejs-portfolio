'use strict'

// Recoge parametros y lo transforma en json, ejemplo node calculadora.js 1 2 3
// El numero 2 es el indice que se empezara a mostrar el json, si se pone 1, mostrara la ruta del archivo completa
let params = process.argv.slice(2);

let numero1 = parseFloat(params[0]);
let numero2 = parseFloat(params[1]);

let plantilla = `
La suma es: ${numero1 + numero2}
La resta es: ${numero1 - numero2}
La multiplicacion es: ${numero1 * numero2}
La division es: ${numero1 / numero2}
`;

// Ejemplo de uso en consola o terminal: "node calculadora.js 4 2"
console.log(plantilla);
// console.log(params);

console.log("Hola con NodeJS");

