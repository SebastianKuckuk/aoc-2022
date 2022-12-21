const algebra = require("algebra.js");

function parseInput(input) {
    return new Map(input.split('\n').map(row => [row.substring(0, 4), row.substring(6)]))
}

const regex = /([a-z]{4}) ([+\-*\/]) ([a-z]{4})/

function buildMonkeyExpr(monkeys, name, humanIsX = false) {
    let expr = monkeys.get(name)

    if (regex.test(expr)) {
        const [a, op, b] = expr.match(regex).slice(1, 4)
        return `(${buildMonkeyExpr(monkeys, a, humanIsX)} ${op} ${buildMonkeyExpr(monkeys, b, humanIsX)})`
    }

    if (humanIsX && 'humn' === name)
        return 'x'

    return Number(expr)
}

module.exports = {
    part01: function part01(input) {
        const monkeys = parseInput(input)
        return eval(buildMonkeyExpr(monkeys, 'root'))
    },

    part02: function part02(input) {
        const monkeys = parseInput(input)

        const [leftMonkey, _, rightMonkey] = monkeys.get('root').match(regex).slice(1, 4)
        let equation = new algebra.Equation(
            algebra.parse(buildMonkeyExpr(monkeys, leftMonkey, true)),
            algebra.parse(buildMonkeyExpr(monkeys, rightMonkey, true)))

        return Math.round(equation.solveFor('x'))
    }
}
