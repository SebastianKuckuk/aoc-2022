const {readFileSync} = require('node:fs')

const curDay = '24'

let part01, part02
({part01, part02} = require(`./day-${curDay}/work.js`))

function dayForFile(inputFile) {
    const input = readFileSync(inputFile, 'utf-8')/*.trim()*/.replaceAll('\r', '')

    console.log('\tAnswer for part 1 is ' + part01(input))
    console.log('\tAnswer for part 2 is ' + part02(input))
}

console.log('Handling dummy input')
dayForFile(`./day-${curDay}/input-dummy.txt`)

console.log('Handling real input')
dayForFile(`./day-${curDay}/input.txt`)
