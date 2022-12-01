const {readFileSync} = require('node:fs');

const {part01, part02} = require('./work.js')

function dayForFile(inputFile) {
    const input = readFileSync(inputFile, 'utf-8').trim().replaceAll('\r', '')

    console.log('\tAnswer for part 1 is ' + part01(input))
    console.log('\tAnswer for part 2 is ' + part02(input))
}

console.log('Handling dummy input')
dayForFile('input-dummy.txt')

console.log('Handling real input')
dayForFile('input.txt')
