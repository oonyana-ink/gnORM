import { describe, test, expect } from '@jest/globals'
import { Schema } from '../src'

describe('Schema', () => {
    @Schema.define
    class NestedSchema extends Schema {
        @Schema.field
        nestedField: string
    }

    @Schema.define
    class TestSchema extends Schema {
        @Schema.field
        id: string

        @Schema.field
        name: string

        @Schema.field({ required: true })
        requiredField: string

        @Schema.field
        nestedField: NestedSchema
    }

    const validData = {
        id: 'id-123',
        name: 'James',
        requiredField: 'required',
        nestedField: {
            nestedField: 'nested'
        }
    }

    const invalidData = {
        id: 123,
        name: []
    }

    const validDataState = {
        success: true,
        data: validData,
        error: undefined
    }

    const invalidDataState = {
        success: false,
        data: undefined,
        errors: {
            id: {
                code: "invalid_type",
                message: "Id seems to be invalid."
            },
            name: {
                code: "invalid_type",
                message: "Name seems to be invalid."
            },
            requiredField: {
                code: "required",
                message: "Required Field is required."
            },
            nestedField: {
                code: "required",
                message: "Nested Field is required."
            }
        }
    }

    test('should be definable', () => {
        expect(TestSchema.fields).toBeDefined()
        expect(TestSchema.blankDataset).toBeDefined()
        expect(TestSchema.validator).toBeDefined()
        expect(TestSchema.fieldKeys).toEqual(['id', 'name', 'requiredField', 'nestedField'])
    })

    test('should be able to create blank dataset', () => {
        const blankDataset = {
            id: '',
            name: '',
            requiredField: '',
            nestedField: {
                nestedField: ''
            }
        }
        expect(TestSchema.blankDataset()).toEqual(blankDataset)
        expect(TestSchema.parse(validData)).toEqual(validDataState)
    })

    test('should be instantiable', () => {
        const testSchema = new TestSchema()
        expect(testSchema.fields).toEqual(TestSchema.fields)
        expect(testSchema.fieldKeys).toEqual(TestSchema.fieldKeys)
        expect(testSchema.parse(validData)).toEqual(validDataState)
        expect(testSchema.blankDataset).toBeDefined()
        const invalidDataParsedState = testSchema.parse(invalidData)
        expect(invalidDataParsedState.success).toBe(false)
        expect(invalidDataParsedState.errors.byField).toEqual(invalidDataState.errors)
    })


    test('should validate various field types', () => {
        @Schema.define
        class ValidationSchema extends Schema {
            @Schema.field({ required: true })
            required: string

            @Schema.field
            number: number

            @Schema.field
            string: string

            @Schema.field
            boolean: boolean
            
            @Schema.field({ max: 5 })
            shortString: string

            @Schema.field({ min: 10 })
            longString: string

            @Schema.field({ length: 5 })
            exactString: string

            @Schema.field({ length: 5 })
            exactString2: string

            @Schema.field({ email: true })
            email: string

            @Schema.field({ url: true })
            url: string

            @Schema.field({ gt: 5 })
            greaterThan: number

            @Schema.field({ lt: 5 })
            lessThan: number
        }

        const dataState = ValidationSchema.parse({
            number: '123',
            string: 123,
            boolean: 'true',
            shortString: '123456',
            longString: '123',
            exactString: '123456',
            exactString2: '123',
            email: 'invalid-email',
            url: 'invalid-url',
            greaterThan: 3,
            lessThan: 6
        })

        expect(dataState.success).toBe(false)
        
    })
})
