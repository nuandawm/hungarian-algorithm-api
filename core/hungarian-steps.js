const { range } = require("./tools");
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
            .map(({_, index}) => index)
        )

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

const elaborateRedundancyIndex = percolation => {
    const percolationOccurrencies = percolation.reduce((occurrencies, pos) => {
        if (occurrencies[pos] === undefined) {
            occurrencies[pos] = 1
        } else {
            occurrencies[pos] += 1
        }
        return occurrencies
    }, {})

    const maxOccurrencies = Object.entries(percolationOccurrencies)
      .reduce(
        (max, [_, occurrencies]) => occurrencies > max ? occurrencies : max,
        0
      )

    const nonPercolationColumns = percolation.length - [...new Set(percolation)].length;
    return maxOccurrencies - 1 + nonPercolationColumns / percolation.length
}

// Elaborate redundancy index
const elaboratePercolationsRedundancyIndexes = zeroPercolations => {
    return zeroPercolations.map(percolation => ({
        percolation,
        redundancyIndex: elaborateRedundancyIndex(percolation)
    }))
}

const findMinRIPercolation = zeroPercolations => {
    return elaboratePercolationsRedundancyIndexes(zeroPercolations)
      .reduce(
        (minRIPercolation, currRIPercolation) => currRIPercolation.redundancyIndex > minRIPercolation.redundancyIndex
          ? minRIPercolation
          : currRIPercolation
      )
}

// check if the percolation is a complete one (no duplicated indexes)
const isPercolationComplete = percolation => {
    return [...new Set(percolation)].length === percolation.length
}

// Stop the recursive search when the first zero percolation is found
const recursiveFindFirstCompleteZeroPercolation = (zeroLocations, path) => {
    // TODO add control variable (max number of checked percolations)
    const [rowZeroes, ...rest] = zeroLocations;
    if (rest.length > 0) {
        for (const element of rowZeroes) {
            const foundPath = recursiveFindFirstCompleteZeroPercolation(rest, path.concat([element]))
            if (foundPath !== null) {
                return foundPath
            }
        }
        return null
    } else {
        // last row of the zero locations
        for (const element of rowZeroes) {
            const currentPath = path.concat([element]);
            // if the percolation is complete return the path and stop the iteration
            if (isPercolationComplete(currentPath)) {
                return currentPath
            }
        }
        return null
    }
}

const findFirstCompleteZeroPercolation = matrix => {
    const zeroLocations = findZeroLocations(matrix);
    return recursiveFindFirstCompleteZeroPercolation(zeroLocations, [])
}

// Filter out non-complete percolations
const filterCompletePercolations = (percolations, rowsQuantity) => percolations
    .map(percolation => [...new Set(percolation)])
    .filter(uniqPercolation => uniqPercolation.length === rowsQuantity)

const findCompleteZeroPercolations = matrix => {
    return filterCompletePercolations(
      findZeroPercolations(matrix),
      matrix.length
    )
}

const hasCompleteZeroPercolations = matrix => {
    const completeZeroPercolations = findCompleteZeroPercolations(matrix)
    return completeZeroPercolations.length > 0
}

const findCoveringSegments = (matrix, minRedundancePercolation) => {
    const markedRows = range(matrix.length).map(() => false);
    const markedCols = range(matrix.length).map(() => false);

    const zeroPositions = []
    for (let i=0; i<markedRows.length; i++) {
        for (let j=0; j<matrix[i].length; j++) {
            if (matrix[i][j] === 0) {
                if (!zeroPositions.includes(j)) {
                    zeroPositions.push(j)
                } else {
                    markedRows[i] = true
                }
            }
        }
    }

    let markFlag = true;
    while(markFlag) {
        markFlag = false;
        // mark cols based on marked rows
        for (let i=0; i<markedRows.length; i++) {
            if (markedRows[i]) {
                for (let j=0; j<markedCols.length; j++) {
                    if (!markedCols[j] && matrix[i][j] === 0) {
                        markedCols[j] = true;
                        markFlag = true;
                    }
                }
            }
        }

        // mark rows based on marked cols
        for (let j=0; j<markedCols.length; j++) {
            if (markedCols[j]) {
                for (let i=0; i<markedRows.length; i++) {
                    if (!markedRows[i] && minRedundancePercolation[i] === j) {
                        markedRows[i] = true;
                        markFlag = true;
                    }
                }
            }
        }
    }

    const coveredCols = markedCols;
    const coveredRows = markedRows.map(elem => !elem);

    return {
        coveredCols,
        coveredRows
    }
}

module.exports = {
    rowReduction,
    colReduction,
    transpose,
    findCompleteZeroPercolations,
    hasCompleteZeroPercolations,
    findZeroPercolations,
    findZeroLocations,
    findFirstCompleteZeroPercolation,
    elaborateRedundancyIndex,
    elaboratePercolationsRedundancyIndexes,
    findMinRIPercolation,
    findCoveringSegments
}
