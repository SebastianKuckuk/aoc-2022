module.exports = {
    sumOf: function sumOf(array) {
        return array.reduce((a, b) => a + b, 0)
    },

    minOf: function minOf(array) {
        return array.sort((a, b) => a - b)[0]
    },

    maxOf: function maxOf(array) {
        return array.sort((a, b) => -(a - b))[0]
    },

    range: function range(begin, end, step = 1) {
        return [...Array((end - begin) / step).keys()].map(i => begin + i * step)
    },

    uniqueIn: function uniqueIn(array) {
        return [...(new Set(array))]
    },

    intersection: function intersection(arrays) {
        return module.exports.uniqueIn(
            arrays.reduce((left, right) => left.filter(e => right.includes(e))))
    }
}
