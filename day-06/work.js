function parseInput(input) {
    return input.split('\n').map(row => row)
}

function findMarker(row, markerSize) {
    for (let i = 0; i < row.length - markerSize; ++i)
        if ((new Set(row.slice(i, i + markerSize))).size === markerSize)
            return i + markerSize
    return null
}

module.exports = {
    part01: function part01(input) {
        return parseInput(input).map(row => findMarker(row, 4))
    },

    part02: function part02(input) {
        return parseInput(input).map(row => findMarker(row, 14))
    }
}
