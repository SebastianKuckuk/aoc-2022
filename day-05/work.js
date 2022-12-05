function parseInput(input) {
    let [stackInput, moves] = input.split('\n\n').map(b => b.split('\n'))

    const numStacks = (stackInput.pop().length + 2) / 4
    const stacks = Array(numStacks).fill(null).map(() => [])
    /// fill([]) will copy by reference -.-
    /// Array(numStacks).map(() => []) will skip uninitialized entries -.-
    /// Alternative: const stacks = range(0, numStacks).map(() => [])

    for (let row of stackInput) {
        for (let col = 0; col < numStacks; ++col) {
            const container = row.slice(4 * col, 4 * (col + 1)).match(/\[([A-Z])]/)
            if (container)
                stacks[col].unshift(container[1])
        }
    }

    moves = moves.map(move => move.match(/move (\d+) from (\d+) to (\d+)/).slice(1, 4).map(n => parseInt(n.toString())))

    return [stacks, moves]
}

module.exports = {
    part01: function part01(input) {
        const [stacks, moves] = parseInput(input)

        for (const [num, src, dest] of moves)
            for (let i = 0; i < num; ++i)
                stacks[dest - 1].push(stacks[src - 1].pop())

        return stacks.map(stack => stack.pop()).join('')
    },

    part02: function part02(input) {
        const [stacks, moves] = parseInput(input)

        for (const [num, src, dest] of moves)
            stacks[dest - 1].push(...stacks[src - 1].splice(stacks[src - 1].length - num))

        return stacks.map(stack => stack.pop()).join('')
    }
}
