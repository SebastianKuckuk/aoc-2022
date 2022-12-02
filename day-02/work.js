const [ROCK, PAPER, SCISSOR] = [1, 2, 3]
const [DRAW, WIN, LOOSE] = [3, 6, 0]

function parseInput(input) {
    const replaced = input.replaceAll(/[ABCXYZ]/g, c => {
        return {
            'A': ROCK, 'B': PAPER, 'C': SCISSOR,
            'X': ROCK, 'Y': PAPER, 'Z': SCISSOR
        }[c]
    })

    return replaced.split('\n').map(row => row.split(' '))
}

module.exports = {
    part01: function part01(input) {
        const games = parseInput(input)
        return games.map(game => {
            let a = parseInt(game[0])
            let b = parseInt(game[1])

            let drawWinLoose = [DRAW, WIN, LOOSE][(b + 3 - a) % 3]
            return drawWinLoose + b
        }).reduce((a, b) => a + b, 0)
    },

    part02: function part02(input) {
        const games = parseInput(input)
        return games.map(game => {
            let a = parseInt(game[0])
            let b = parseInt(game[1])

            switch (b) {
                case ROCK:
                    return LOOSE + [SCISSOR, ROCK, PAPER][a - 1]
                case PAPER:
                    return DRAW + a
                case SCISSOR:
                    return WIN + [PAPER, SCISSOR, ROCK][a - 1]
            }
        }).reduce((a, b) => a + b, 0)
    }
}
