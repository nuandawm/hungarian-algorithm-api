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

// Find the locations of the zeros for each row
const findZeroLocations = matrix => matrix
        .map(row => row
        .map((value, index) => ({value, index}))
        .filter(({value, _}) => value === 0)
        .map(({_, index}) => index))

// Recursively find all the zero-percolations based on zero locations
const recursiveZeroPercolationFinder = (zeroLocations, path) => {
    // TODO add control variable (percolations max quantity)
    const [firstElements, ...rest] = zeroLocations
    if (rest.length > 0) {
        return firstElements
            .flatMap(element => recursiveZeroPercolationFinder(rest, path.concat([element])))
    } else {
        return firstElements.map(element => path.concat([element]))
    }
}

// Find all the zero-percolations
const findZeroPercolations = matrix => {
    const zeroLocations = findZeroLocations(matrix)
    return recursiveZeroPercolationFinder(zeroLocations, [])
}

// Filter out non-complete percolations
const filterCompletePercolations = (percolations, rowsQuantity) => percolations
    .map(percolation => [...new Set(percolation)])
    .filter(uniqPercolation => uniqPercolation.length === rowsQuantity)

const hasCompleteZeroPercolations = matrix => {
    const completeZeroPercolations = filterCompletePercolations(
        findZeroPercolations(matrix),
        matrix.length
    )
    return completeZeroPercolations.length > 0
}

module.exports = {
    rowReduction,
    colReduction,
    transpose,
    hasCompleteZeroPercolations,
    findZeroPercolations
}