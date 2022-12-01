const {readFileSync} = require('fs');

// const inputFile = 'part-00-dummy-input.txt'
const inputFile = 'part-00-input.txt'

const input = readFileSync(inputFile, 'utf-8').trim().replaceAll('\r', '')

const calorieSums = []
for (let chunk of input.split('\n\n')) {
    let calories = chunk.split('\n')
    calorieSums.push(calories.reduce((acc, c) => acc + parseInt(c), 0))
}

calorieSums.sort((a, b) => a - b)

maxSum = calorieSums[calorieSums.length - 1] //calorieSums.reduce((a, b) => Math.max(a, b), -Infinity)
console.log('Answer for part 1 is ' + maxSum)

topThree = calorieSums.slice(calorieSums.length - 3)
topThreeSum = topThree.reduce((a, b) => a + b, 0)
console.log('Answer for part 2 is ' + topThreeSum)
