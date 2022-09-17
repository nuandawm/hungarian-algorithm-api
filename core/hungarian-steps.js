const rowReduction = (matrix) => {
    if (matrix === undefined || matrix === null || !Array.isArray(matrix)) {
        throw Error('the matrix have to be an array')
    }
    return matrix.map(row => {
        const rowMin = Math.min(...row)
        return row.map(el => el - rowMin)
    })
}

module.exports = {
    rowReduction
}