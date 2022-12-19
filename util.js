module.exports = {
    sumOf: function sumOf(array) {
        return array.reduce((a, b) => a + b, 0)
    },

    prodOf: function sumOf(array) {
        return array.reduce((a, b) => a * b, 1)
    },

    minOf: function minOf(array) {
        return array.sort((a, b) => a - b)[0]
    },

    maxOf: function maxOf(array) {
        return array.sort((a, b) => -(a - b))[0]
    },

    allOf: function allOf(array) {
        return array.reduce((a, b) => a && b, true)
    },

    anyOf: function anyOf(array) {
        return array.reduce((a, b) => a || b, true)
    },

    range: function range(begin, end, step = 1) {
        return [...Array((end - begin) / step).keys()].map(i => begin + i * step)
    },

    sumOfRange: function sumOfRange(begin, end) {
        return (end - 1) * end / 2 - (begin - 1) * begin / 2
    },

    uniqueIn: function uniqueIn(array) {
        return [...(new Set(array))]
    },

    intersection: function intersection(arrays) {
        return module.exports.uniqueIn(
            arrays.reduce((left, right) => left.filter(e => right.includes(e))))
    }
}
