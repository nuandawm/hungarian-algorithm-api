const validateMatrix = matrix => matrix === undefined || matrix === null || !Array.isArray(matrix)

const transpose = matrix => {
    const transposed = []
    for (let i=0; i<matrix.length; i++) {
        for (let j=0; j<matrix[i].length; j++) {
            if (transposed[j] === undefined) {
                transposed[j] = []
            }
            transposed[j][i] = matrix[i][j]
        }
    }
    return transposed
}

const rowReduction = matrix => {
    if (validateMatrix(matrix)) {
        throw Error('the matrix have to be an array')
    }
    return matrix.map(row => {
        const rowMin = Math.min(...row)
        return row.map(el => el - rowMin)
    })
}

const colReduction = matrix => {
    if (validateMatrix(matrix)) {
        throw Error('the matrix have to be an array')
    }
    const transposed = transpose(matrix)
    const reduced = rowReduction(transposed)
    return transpose(reduced)
}

const hasZeroPercolation = matrix => {
    return true
}

module.exports = {
    rowReduction,
    colReduction,
    transpose,
    hasZeroPercolation
}