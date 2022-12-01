function parseInput(input) {
    // const chunkSums = []
    // for (let chunk of input.split('\n\n'))
    //     chunkSums.push(chunk.split('\n').reduce((acc, c) => acc + parseInt(c.toString()), 0))

    const chunkSums = input.split('\n\n').map(chunk =>
        chunk.split('\n').reduce((acc, c) => acc + parseInt(c.toString()), 0))

    chunkSums.sort((a, b) => a - b)

    return chunkSums
}

module.exports = {
    part01: function part01(input) {
        let calorieSums = parseInput(input)
        return calorieSums[calorieSums.length - 1]
        //return calorieSums.reduce((a, b) => Math.max(a, b), -Infinity)
    },

    part02: function part02(input) {
        let calorieSums = parseInput(input)
        return calorieSums.slice(calorieSums.length - 3).reduce((a, b) => a + b, 0)
    }
}
