const {readFileSync} = require('node:fs');
//import {day01part01, day01part02} from 'part-00'
const {part01, part02} = require('./day-01.js')

function day01ForFile(inputFile) {
    const input = readFileSync(inputFile, 'utf-8').trim().replaceAll('\r', '')

    console.log('\tAnswer for part 1 is ' + part01(input))
    console.log('\tAnswer for part 2 is ' + part02(input))
}

console.log('Handling dummy input')
day01ForFile('day-01-input-dummy.txt')

console.log('Handling real input')
day01ForFile('day-01-input.txt')
