const { it, describe, expect } = require('@jest/globals')
const {
    rowReduction, colReduction, hasCompleteZeroPercolations,
    findZeroLocations, findFirstCompleteZeroPercolation, findCompleteZeroPercolations,
    elaboratePercolationsRedundancyIndexes, findMinRIPercolation, findCoveringSegments
} = require('./hungarian-steps')

const matrixArrayError = 'the matrix have to be an array'

describe('row reduction', () => {
    it('should fail when a null matrix is given', () => {
        expect(() => {
            rowReduction(null)
        }).toThrow(matrixArrayError)
    })

    it('should fail when a non-array matrix is given', () => {
        expect(() => {
            rowReduction(42)
        }).toThrow(matrixArrayError)

        expect(() => {
            rowReduction('42')
        }).toThrow(matrixArrayError)
    })

    it('should return an empty array when an empty array is given', () => {
        expect(rowReduction([])).toEqual([])
    })

    it('should return a matrix with the same quantity of elements of the input matrix', () => {
        const result = rowReduction([[1,2,3], [6,5,4], [8,8,9]])
        expect(result.map(row => row.length)).toEqual([3, 3, 3])
    })

    it('should return a matrix with at least one zero for each row', () => {
        const result = rowReduction([[1,2,3], [6,5,4], [8,8,9]])
        const hasEachRowAtLeastOneZero = result
            .map(row => row.reduce((prev, next) => next === 0 ? prev + 1 : prev, 0))
            .every(rowZeros => rowZeros > 0)
        expect(hasEachRowAtLeastOneZero).toBeTruthy()
    })

    it('should row-reduce the [[1,2,3], [6,5,4], [8,8,9]] matrix', () => {
        const m = [[1,2,3], [6,5,4], [8,8,9]]
        const reducedM = [[0,1,2], [2,1,0], [0,0,1]]
        expect(rowReduction(m)).toEqual(reducedM)
    })
    
    it('should row-reduce the [[1,2], [6,5], [8,8]] matrix', () => {
        const m = [[1,2], [6,5], [8,8]]
        const reducedM = [[0,1], [1,0], [0,0]]
        expect(rowReduction(m)).toEqual(reducedM)
    })
})

describe('col reduction', () => {
    it('should fail when a null matrix is given', () => {
        expect(() => {
            colReduction(null)
        }).toThrow(matrixArrayError)
    })

    it('should fail when a non-array matrix is given', () => {
        expect(() => {
            colReduction(42)
        }).toThrow(matrixArrayError)

        expect(() => {
            colReduction('42')
        }).toThrow(matrixArrayError)
    })

    it('should return an empty array when an empty array is given', () => {
        expect(colReduction([])).toEqual([])
    })

    it('should return a matrix with the same quantity of elements of the input matrix', () => {
        const result = colReduction([[1,6,8], [2,5,4], [3,8,9]])
        expect(result.map(row => row.length)).toEqual([3, 3, 3])
    })

    it('should return a matrix with at least one zero for each column', () => {
        const result = colReduction([[1,6,8], [2,5,4], [3,8,9]])

        const zeros = []
        for (let i=0; i<3; i++) {
            zeros[i] = 0
            for (let j=0; j<3; j++) {
                if (result[j][i] === 0) {
                    zeros[i] += 1
                }
            }
        }

        const hasEachColAtLeastOneZero = zeros
            .every(colZeros => colZeros > 0)
        expect(hasEachColAtLeastOneZero).toBeTruthy()
    })
})

describe('find zero locations', () => {
    it('should return a list of empty elements when there\'s no zeros in the matrix', () => {
        expect(findZeroLocations([[1,2,3], [4,5,6], [7,8,9]]).every(rowZeroes => rowZeroes.length === 0))
          .toBeTruthy()
    })
})

describe('find complete zero percolations', () => {
    it('should return an empty list given a matrix with only non-zero elements', () => {
        expect(findCompleteZeroPercolations([[1,2,3], [4,5,6], [7,8,9]]).length).toEqual(0)
        expect(findCompleteZeroPercolations([[42,42,42,42], [42,42,42,42], [42,42,42,42], [42,42,42,42]]).length).toEqual(0)
        expect(findCompleteZeroPercolations([[42,42,42], [42,42,42], [42,42,42], [42,42,42]]).length).toEqual(0)
    })

    it('should return an empty list given a matrix with less non-zero elements than the number of rows', () => {
        expect(findCompleteZeroPercolations([[0,42,42], [42,0,42], [42,42,42]]).length).toEqual(0)
        expect(findCompleteZeroPercolations([[0,0,42], [42,42,42], [42,42,42]]).length).toEqual(0)
    })

    it('should return an empty list given a matrix with one zero element for each row but some have the same index', () => {
        expect(findCompleteZeroPercolations([[0,42,42], [0,42,42], [0,42,42]]).length).toEqual(0)
        expect(findCompleteZeroPercolations([[0,42,42], [0,42,42], [42,42,0]]).length).toEqual(0)
    })

    it('should return an empty list given a matrix with all the rows but one containing zeros', () => {
        expect(findCompleteZeroPercolations([[0,0,0], [42,42,42], [0,0,0]]).length).toEqual(0)
        expect(findCompleteZeroPercolations([[0,0,0,0,0], [42,42,42,42,42], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0]]).length).toEqual(0)
    })

    it('should return one percolation given a matrix with one zero for each column and none have the same index', () => {
        expect(findCompleteZeroPercolations([[1,2,0], [0,4,5], [6,0,8]])).toEqual([[2,0,1]])
        expect(findCompleteZeroPercolations([
          [0,42,42,42,42], [42,42,0,42,42], [42,42,42,42,0], [42,0,42,42,42], [42,42,42,0,42]
        ])).toEqual([[0,2,4,1,3]])
    })

    it('should return all the permutations of N given a matrix of size N with all zero elements', () => {
        expect(findCompleteZeroPercolations([[0,0,0], [0,0,0], [0,0,0]])).toEqual([
          [0,1,2], [0,2,1],
          [1,0,2], [1,2,0],
          [2,0,1], [2,1,0]
        ])
    })
})

describe('has complete zero percolations', () => {
    it('should return false when the matrix has only non-zero elements', () => {
        expect(hasCompleteZeroPercolations([[1,2,3], [4,5,6], [7,8,9]])).toBeFalsy()
        expect(hasCompleteZeroPercolations([[42,42,42,42], [42,42,42,42], [42,42,42,42]])).toBeFalsy()
        expect(hasCompleteZeroPercolations([[42,42,42], [42,42,42], [42,42,42], [42,42,42]])).toBeFalsy()
    })

    it('should return false when the number of non-zero elements is lesser than the number of rows', () => {
        expect(hasCompleteZeroPercolations([[0,42,42], [42,0,42], [42,42,42]])).toBeFalsy()
        expect(hasCompleteZeroPercolations([[0,0,42], [42,42,42], [42,42,42]])).toBeFalsy()
    })

    it('should return false when there is one zero element for each row but some have the same index', () => {
        expect(hasCompleteZeroPercolations([[0,42,42], [0,42,42], [0,42,42]])).toBeFalsy()
        expect(hasCompleteZeroPercolations([[0,42,42], [0,42,42], [42,42,0]])).toBeFalsy()
    })

    it('should return false when all the rows but one contain zeros', () => {
        expect(hasCompleteZeroPercolations([[0,0,0], [42,42,42], [0,0,0]])).toBeFalsy()
        expect(hasCompleteZeroPercolations([[0,0,0,0,0], [42,42,42,42,42], [0,0,0,0,0]])).toBeFalsy()
    })

    it('should return true when there is one zero for each column and none have the same index', () => {
        expect(hasCompleteZeroPercolations([[1,2,0], [0,4,5], [6,0,8]])).toBeTruthy()
        expect(hasCompleteZeroPercolations([[0,42,42,42,42], [42,42,0,42,42], [42,42,42,42,0]])).toBeTruthy()
    })

    it('should return true when all the elements are zeros', () => {
        expect(hasCompleteZeroPercolations([[0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0]])).toBeTruthy()
    })
})

describe('find first complete zero percolation', () => {
    it('should return null given a matrix with only non-zero elements', () => {
        expect(findFirstCompleteZeroPercolation([[1,2,3], [4,5,6], [7,8,9]])).toBeNull()
        expect(findFirstCompleteZeroPercolation([
          [42,42,42,42], [42,42,42,42], [42,42,42,42], [42,42,42,42]
        ])).toBeNull()
        expect(findFirstCompleteZeroPercolation([[42,42,42], [42,42,42], [42,42,42], [42,42,42]])).toBeNull()
    })

    it('should return null given a matrix with less non-zero elements than the number of rows', () => {
        expect(findFirstCompleteZeroPercolation([[0,42,42], [42,0,42], [42,42,42]])).toBeNull()
        expect(findFirstCompleteZeroPercolation([[0,0,42], [42,42,42], [42,42,42]])).toBeNull()
    })

    it('should return null given a matrix with one zero element for each row but some have the same index', () => {
        expect(findFirstCompleteZeroPercolation([[0,42,42], [0,42,42], [0,42,42]])).toBeNull()
        expect(findFirstCompleteZeroPercolation([[0,42,42], [0,42,42], [42,42,0]])).toBeNull()
    })

    it('should return null given a matrix with all the rows but one containing zeros', () => {
        expect(findFirstCompleteZeroPercolation([[0,0,0], [42,42,42], [0,0,0]])).toBeNull()
        expect(findFirstCompleteZeroPercolation([
          [0,0,0,0,0], [42,42,42,42,42], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0]
        ])).toBeNull()
    })

    it('should return the right percolation given a matrix with one zero for each column and none have the same index', () => {
        expect(findFirstCompleteZeroPercolation([[1,2,0], [0,4,5], [6,0,8]])).toEqual([2,0,1])
        expect(findFirstCompleteZeroPercolation([
            [0,42,42,42,42], [42,42,0,42,42], [42,42,42,42,0], [42,0,42,42,42], [42,42,42,0,42]
        ])).toEqual([0,2,4,1,3])
    })

    it('should return the first permutations of N given a matrix of size N with all zero elements', () => {
        expect(findFirstCompleteZeroPercolation([[0,0,0], [0,0,0], [0,0,0]])).toEqual([0,1,2])
    })
})

describe('elaborate redundancy index', function () {
    it('should return a list with one zero redundancy index given a complete zero percolation', function () {
        expect(
          elaboratePercolationsRedundancyIndexes([[0,1,2,3,4]])
            .filter(result => result.redundancyIndex === 0).length
        ).toBeGreaterThan(0)
    });

    it('should return a list with no zero redundancy indexes given a list of non-complete zero percolations', function () {
        expect(
          elaboratePercolationsRedundancyIndexes([
            [0,1,1,3,4],
            [0,0,0,0,0],
            [0,1,4,4,4]
          ])
            .filter(result => result.redundancyIndex === 0).length
        ).toBe(0)
    });
});

describe('find min redundancy index percolation', function () {
    it('should return the percolation with the minimum redundancy index', function () {
        expect(
          findMinRIPercolation([
              [0,1,1,3,4],
              [0,0,0,0,0],
              [0,1,4,4,4]
          ]).percolation
        ).toEqual([0,1,1,3,4])
    });

    it('should return the zero redundancy index percolation given a list of percolations containing a complete one', () => {
        expect(
          findMinRIPercolation([
              [0,1,2,3,4],
              [0,1,1,3,4],
              [0,0,0,0,0],
              [0,1,4,4,4]
          ])
        ).toEqual({
            percolation: [0,1,2,3,4],
            redundancyIndex: 0
        })
    })
});

describe('find covering segments', function () {
    it('should return four covering segments given the example matrix and its min redundancy percolation', function () {
        const matrix =[
            [0,42,42,42,42],
            [42,0,42,42,42],
            [42,0,42,42,0],
            [42,0,42,42,42],
            [42,42,42,0,42]
        ];

        const { coveredRows, coveredCols } = findCoveringSegments(
          matrix,
          [0,1,4,1,3])

        expect(
          coveredRows.map(covered => covered ? 1 : 0).reduce((sum, num) => sum + num)
          + coveredCols.map(covered => covered ? 1 : 0).reduce((sum, num) => sum + num)
        ).toBe(4)
    });
});
