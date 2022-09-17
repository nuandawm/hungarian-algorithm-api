const { test, describe, expect } = require('@jest/globals')
const { rowReduction, colReduction, hasZeroPercolation } = require('./hungarian-steps.js')

const matrixArrayError = 'the matrix have to be an array'

describe('row reduction', () => {
    test('should fail when a null matrix is given', () => {
        expect(() => {
            rowReduction(null)
        }).toThrow(matrixArrayError)
    })

    test('should fail when a non-array matrix is given', () => {
        expect(() => {
            rowReduction(42)
        }).toThrow(matrixArrayError)

        expect(() => {
            rowReduction('42')
        }).toThrow(matrixArrayError)
    })

    test('should return an empty array when an empty array is given', () => {
        expect(rowReduction([])).toEqual([])
    })

    test('should return a matrix with the same quantity of elements of the input matrix', () => {
        const result = rowReduction([[1,2,3], [6,5,4], [8,8,9]])
        expect(result.map(row => row.length)).toEqual([3, 3, 3])
    })

    test('should return a matrix with at least one zero for each row', () => {
        const result = rowReduction([[1,2,3], [6,5,4], [8,8,9]])
        const hasEachRowAtLeastOneZero = result
            .map(row => row.reduce((prev, next) => next === 0 ? prev + 1 : prev, 0))
            .every(rowZeros => rowZeros > 0)
        expect(hasEachRowAtLeastOneZero).toBeTruthy()
    })

    test('should row-reduce the [[1,2,3], [6,5,4], [8,8,9]] matrix', () => {
        const m = [[1,2,3], [6,5,4], [8,8,9]]
        const reducedM = [[0,1,2], [2,1,0], [0,0,1]]
        expect(rowReduction(m)).toEqual(reducedM)
    })
    
    test('should row-reduce the [[1,2], [6,5], [8,8]] matrix', () => {
        const m = [[1,2], [6,5], [8,8]]
        const reducedM = [[0,1], [1,0], [0,0]]
        expect(rowReduction(m)).toEqual(reducedM)
    })
})

describe('col reduction', () => {
    test('should fail when a null matrix is given', () => {
        expect(() => {
            colReduction(null)
        }).toThrow(matrixArrayError)
    })

    test('should fail when a non-array matrix is given', () => {
        expect(() => {
            colReduction(42)
        }).toThrow(matrixArrayError)

        expect(() => {
            colReduction('42')
        }).toThrow(matrixArrayError)
    })

    test('should return an empty array when an empty array is given', () => {
        expect(colReduction([])).toEqual([])
    })

    test('should return a matrix with the same quantity of elements of the input matrix', () => {
        const result = colReduction([[1,6,8], [2,5,4], [3,8,9]])
        expect(result.map(row => row.length)).toEqual([3, 3, 3])
    })

    test('should return a matrix with at least one zero for each column', () => {
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

describe('percolation finder', () => {
    test('should return false when the matrix has only non-zero elements', () => {
        expect(hasZeroPercolation([[1,2,3], [4,5,6], [7,8,9]])).toBeFalsy()
        expect(hasZeroPercolation([[42,42,42,42], [42,42,42,42], [42,42,42,42]])).toBeFalsy()
        expect(hasZeroPercolation([[42,42,42], [42,42,42], [42,42,42], [42,42,42]])).toBeFalsy()
    })

    test('should return false when the number of non-zero elements is lesser than the number of rows', () => {
        expect(hasZeroPercolation([[0,42,42], [42,0,42], [42,42,42]])).toBeFalsy()
        expect(hasZeroPercolation([[0,0,42], [42,42,42], [42,42,42]])).toBeFalsy()
    })

    test('should return false when there is one zero element for each row but some have the same index', () => {
        expect(hasZeroPercolation([[0,42,42], [0,42,42], [0,42,42]])).toBeFalsy()
        expect(hasZeroPercolation([[0,42,42], [0,42,42], [42,42,0]])).toBeFalsy()
    })

    test('should return false when all the rows but one contain zeros', () => {
        expect(hasZeroPercolation([[0,0,0], [42,42,42], [0,0,0]])).toBeFalsy()
        expect(hasZeroPercolation([[0,0,0,0,0], [42,42,42,42,42], [0,0,0,0,0]])).toBeFalsy()
    })

    test('should return true when there is one zero for each column and none have the same index', () => {
        expect(hasZeroPercolation([[1,2,0], [0,4,5], [6,0,8]])).toBeTruthy()
        expect(hasZeroPercolation([[0,42,42,42,42], [42,42,0,42,42], [42,42,42,42,0]])).toBeTruthy()
    })

    test('should return true when all the elements are zeros', () => {
        expect(hasZeroPercolation([[0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0]])).toBeTruthy()
    })
})