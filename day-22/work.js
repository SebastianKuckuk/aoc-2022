const {maxOf, range, allOf} = require("../util");
const ndarray = require("ndarray");

const dirVec = [[0, 1], [1, 0], [0, -1], [-1, 0]]

function parseInput(input) {
    const tileMapping = {' ': -1, '.': 0, '#': 1}

    let [mapInput, movesInput] = input.split('\n\n')
    mapInput = mapInput.split('\n')

    const [numRows, numCols] = [mapInput.length, maxOf(mapInput.map(r => r.length))]
    const map = ndarray(Array((numRows + 2) * (numCols + 2)).fill(-1), [numRows + 2, numCols + 2])

    for (let [rowIdx, row] of mapInput.entries())
        for (let [colIdx, c] of [...row].entries())
            map.set(rowIdx + 1, colIdx + 1, tileMapping[c])

    let moves = []
    let moveBuf = ''
    for (let c of movesInput) {
        if ('R' === c || 'L' === c) {
            moves.push(Number(moveBuf))
            moveBuf = ''
            moves.push(c)
        } else {
            moveBuf += c
        }
    }
    moves.push(Number(moveBuf))

    return [map, moves]
}

module.exports = {
    part01: function part01(input) {
        const [grid, moves] = parseInput(input)

        let [row, col, dir] = [1, 1, 0]
        while (grid.get(row, col) < 0)
            col++

        for (let move of moves) {
            if ('R' === move) {
                dir = (dir + 1) % 4
            } else if ('L' === move) {
                dir = (dir + 4 - 1) % 4
            } else {
                for (let _ of range(0, move)) {
                    let [nextRow, nextCol] = [row + dirVec[dir][0], col + dirVec[dir][1]]
                    while (grid.get(nextRow, nextCol) < 0) {
                        nextRow = (nextRow + dirVec[dir][0] + grid.shape[0]) % grid.shape[0]
                        nextCol = (nextCol + dirVec[dir][1] + grid.shape[1]) % grid.shape[1]
                    }
                    if (1 === grid.get(nextRow, nextCol))
                        break
                    row = nextRow
                    col = nextCol
                }
            }
        }

        return 1000 * row + 4 * col + dir
    },

    part02: function part02(input) {
        const [grid, moves] = parseInput(input)

        const sideLen = grid.shape[0] < 150 ? 4 : 50

        const cube = [null, null, null, null, null, null]

        const sideNumRow = Math.floor(grid.shape[0] / sideLen)
        const sideNumCol = Math.floor(grid.shape[1] / sideLen)
        const sideGrid = ndarray(Array(sideNumRow * sideNumCol).fill(-1), [sideNumRow, sideNumCol])
        const s = sideLen - 1 // side length in coordinate space
        const hs = s / 2 // half side length in coordinate space

        function getSide(sideRow, sideCol) {
            if (sideRow < 0 || sideCol < 0 || sideRow >= sideNumRow || sideCol >= sideNumCol)
                return -1
            return sideGrid.get(sideRow, sideCol)
        }

        // find sides in input
        let sideIdx = 0
        let sides = []
        for (let sideRow of range(0, sideNumRow))
            for (let sideCol of range(0, sideNumCol))
                if (grid.get(sideRow * sideLen + 1, sideCol * sideLen + 1) >= 0) {
                    sideGrid.set(sideRow, sideCol, sideIdx++)
                    sides.push([sideRow, sideCol])
                }

        // map sides to cube
        function fillCube(curSide, curTrafo) {
            if (null != cube[curSide]) return

            // add transformation, its inverse and application functions
            const curTrafoInv = [
                [curTrafo[0][0], curTrafo[1][0], curTrafo[2][0], (curTrafo[0][0] + curTrafo[1][0] + curTrafo[2][0]) === 1 ? 0 : s],
                [curTrafo[0][1], curTrafo[1][1], curTrafo[2][1], (curTrafo[0][1] + curTrafo[1][1] + curTrafo[2][1]) === 1 ? 0 : s]
            ]

            const [sideRow, sideCol] = sides[curSide]
            const curFace = grid.hi(sideRow * sideLen + sideLen + 1, sideCol * sideLen + sideLen + 1).lo(sideRow * sideLen + 1, sideCol * sideLen + 1)
            cube[curSide] = {toWorldTrafo: curTrafo, toFaceTrafo: curTrafoInv, face: curFace}

            cube[curSide].toWorld = (r, c) => {
                const t = cube[curSide].toWorldTrafo
                return range(0, 3).map(i => t[i][0] * r + t[i][1] * c + t[i][2])
            }
            cube[curSide].toFace = (x, y, z) => {
                const t = cube[curSide].toFaceTrafo
                return range(0, 2).map(i => t[i][0] * x + t[i][1] * y + t[i][2] * z + t[i][3])
            }

            // look for (direct) neighbors
            for (let [dirIdx, dir] of dirVec.entries())
                if (getSide(sideRow + dir[0], sideCol + dir[1]) >= 0) {
                    const newSide = getSide(sideRow + dir[0], sideCol + dir[1])
                    if (null != cube[newSide]) continue // skip already known sides

                    // check for invariant, wrapped and constant dimensions in world space
                    let transformed = cube[curSide].toWorld(hs + hs * dir[0], hs + hs * dir[1])
                    let curInvariantDim = hs === transformed[0] ? 0 : (hs === transformed[1] ? 1 : 2)

                    transformed = cube[curSide].toWorld(hs, hs)
                    let curConstDim = hs !== transformed[0] ? 0 : (hs !== transformed[1] ? 1 : 2)

                    let curWrapDim = range(0, 3).filter(i => i !== curInvariantDim && i !== curConstDim)[0]

                    const [newInvariantDim, newConstDim, newWrapDim] = [curInvariantDim, curWrapDim, curConstDim]
                    const newTrafo = [[], [], []]

                    newTrafo[newInvariantDim] = curTrafo[curInvariantDim]

                    const curClamp = cube[curSide].toWorld(hs + hs * dir[0], hs + hs * dir[1])[curWrapDim]
                    newTrafo[newConstDim] = [0, 0, curClamp]

                    const newStart = cube[curSide].toWorld(hs + hs * dir[0], hs + hs * dir[1])[newWrapDim]
                    if ((s === newStart && dir[0] + dir[1] > 0) || (0 === newStart && dir[0] + dir[1] < 0))
                        newTrafo[newWrapDim] = [-1 * Math.abs(dir[0]), -1 * Math.abs(dir[1]), s]
                    else
                        newTrafo[newWrapDim] = [Math.abs(dir[0]), Math.abs(dir[1]), 0]

                    fillCube(newSide, newTrafo)
                }
        }

        fillCube(0, [
            [0, 1, 0],
            [0, 0, s],
            [-1, 0, s]
        ])

        // connect cube sides
        let neighbors = Array(cube.length).fill(0).map(_ => Array(4).fill(-1))
        for (let [cIdx, c] of cube.entries()) {
            for (let [dirIdx, dir] of dirVec.entries()) {
                let testCoord = [hs + dir[0] * hs, hs + dir[1] * hs]
                let testWorld = c.toWorld(...testCoord)

                for (let [cCmpIdx, cCmp] of cube.entries()) {
                    if (cIdx !== cCmpIdx) {
                        const reconstructed = cCmp.toWorld(...cCmp.toFace(...testWorld))
                        if (allOf(range(0, 3).map(i => reconstructed[i] === testWorld[i])))
                            neighbors[cIdx][dirIdx] = cCmpIdx
                    }
                }
            }
        }

        // start trace
        let [side, row, col, dir] = [0, 0, 0, 0]

        for (let move of moves) {
            if ('R' === move) {
                dir = (dir + 1) % 4
            } else if ('L' === move) {
                dir = (dir + 4 - 1) % 4
            } else {
                for (let _ of range(0, move)) {
                    let [nextSide, nextDir, nextRow, nextCol] = [side, dir, row + dirVec[dir][0], col + dirVec[dir][1]]
                    if (nextRow < 0 || nextRow >= sideLen || nextCol < 0 || nextCol >= sideLen) {
                        nextSide = neighbors[side][dir];
                        [nextRow, nextCol] = cube[nextSide].toFace(...cube[side].toWorld(row, col))
                        nextDir = (neighbors[nextSide].indexOf(side) + 2) % 4 // opposite direction
                    }

                    if (1 === cube[nextSide].face.get(nextRow, nextCol))
                        break

                    [row, col, dir, side] = [nextRow, nextCol, nextDir, nextSide]
                }
            }
        }

        const [worldRow, worldCol] = [row + sides[side][0] * sideLen + 1, col + sides[side][1] * sideLen + 1]

        return 1000 * worldRow + 4 * worldCol + dir
    }
}
