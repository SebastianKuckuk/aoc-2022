const {sumOf, minOf} = require("../util");

function parseInput(input) {
    let cwd = ['/']
    const dirSizes = new Map()

    for (const row of input.split('\n')) {
        if ('$ cd' === row.substring(0, 4)) {
            // cmd cd
            const targetDir = row.substring(5)
            if ('/' === targetDir)
                cwd = ['/']
            else if ('..' === targetDir)
                cwd.pop()
            else
                cwd.push(cwd[cwd.length - 1] + '/' + targetDir)
        } else if ('$ ls' === row.substring(0, 4)) {
            // cmd ls -- ignored for now
        } else if ('dir ' === row.substring(0, 4)) {
            // dir found -- ignored for now
        } else {
            // data with size
            let [fsize, fname] = row.split(' ')
            fsize = parseInt(fsize)
            for (let dir of cwd) {
                if (!dirSizes.has(dir)) // no update for Map in JS -.-
                    dirSizes.set(dir, 0)
                dirSizes.set(dir, fsize + dirSizes.get(dir))
            }
        }
    }

    return dirSizes
}

module.exports = {
    part01: function part01(input) {
        const dirSizes = parseInput(input)
        return sumOf(Array.from(dirSizes.values()).filter(ds => ds <= 100_000))
    },

    part02: function part02(input) {
        const dirSizes = parseInput(input)
        const toBeFreed = 30000000 - (70000000 - dirSizes.get('/'))
        return minOf(Array.from(dirSizes.values()).filter(ds => ds >= toBeFreed))
    }
}
