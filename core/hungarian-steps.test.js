const { test, describe, expect } = require('@jest/globals')

const { rowReduction } = require('./hungarian-steps.js')

describe('row reduction', () => {
    const matrixArrayError = 'the matrix have to be an array'

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