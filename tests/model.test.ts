import { describe, test, expect } from '@jest/globals'
import { Datasource, Model, Schema } from '../src'


describe('Model', () => {
    class TestDatasource extends Datasource {
        key = 'primary'

        async create(collectionName: string, data: ModelData) {
            return data
        }
    }

    new TestDatasource()

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
        nested: NestedSchema

        @Schema.field({ lt: 10 })
        lowNumber: number
    }

    @Model.from(TestSchema)
    class TestModel extends Model { }

    @Schema.define
    class TestSchema2 extends Schema {
        @Schema.field
        id: string

        @Schema.field
        anotherField: string
    }

    @Model.from(TestSchema2)
    class TestModel2 extends Model { }

    @Schema.define
    class TestSchema2 extends Schema {
        @Schema.field
        id: string

        @Schema.field
        anotherField: string
    }

    @Model.from(TestSchema2)
    class TestModel2 extends Model { }

    test('should be definable', () => {
        expect(TestModel.Schema).toBeDefined()
        expect(TestModel.Schema.fields).toBeDefined()
        expect(TestModel.Schema.validator).toBeDefined()
        expect(TestModel.schema).toBeDefined()
        expect(TestModel.schema.fields).toBeDefined()
        expect(TestModel.schema.parse).toBeDefined()
        expect(TestModel2.Schema).not.toEqual(TestModel.Schema)
    })

    test('should be instantiable', () => {
        const testData = {
            id: 'test-id',
            lowNumber: 5,
            nested: {
                nestedField: 'nested-field'
            }
        }
        const testModel = new TestModel(testData)

        // expect(testModel.Schema.fields).toBeDefined()
        expect(testModel._schema).toBeDefined()
        expect(testModel._schema.fields).toBeDefined()
        expect(testModel).toEqual(testData)

        // properties from changest
        expect(testModel._changeset).toBeDefined()
        expect(testModel.isValid).toBeDefined()
        expect(testModel.isInvalid).toBeDefined()
        expect(testModel.isDirty).toBeDefined()
        expect(testModel.isPristine).toBeDefined()

        // properties from validator
        expect(testModel.errors).toBeDefined()

        // properties from record
        expect(testModel._record).toBeDefined()
        expect(testModel.isPending).toBeDefined()
        expect(testModel.isSaving).toBeDefined()
        expect(testModel.isDeleted).toBeDefined()
        expect(testModel.isPersisted).toBeDefined()
        expect(testModel.isRejected).toBeDefined()
    })

    test('should have errors when invalid', () => {
        const validData = {
            id: 'test-id',
            lowNumber: 5,
            nested: {
                nestedField: 'nested-field'
            }
        }

        const invalidData = {
            ...validData,
            lowNumber: 100,
            nested: null
        }

        const validModel = new TestModel(validData)
        const invalidModel = new TestModel(invalidData)

        expect(validModel.errors).toEqual(null)
        expect(invalidModel.errors).not.toEqual(null)
    })

    test('should be able to set data', () => {
        const testData = {
            id: 'test-id',
            lowNumber: 5,
            nested: {
                nestedField: 'nested-field'
            }
        }
        const testModel = new TestModel(testData)
        expect(testModel).toEqual(testData)

        testModel.lowNumber = 10
        expect(testModel).toEqual({ ...testData, lowNumber: 10 })

        const updateData = {
            id: 'updated-id',
            lowNumber: 3
        }
        testModel.set(updateData)
        expect(testModel).toEqual({ ...testData, ...updateData })
    })

    test('should not set undefined field values', () => {
        const testData = {
            id: 'test-id',
            lowNumber: 5,
            nested: {
                nestedField: 'nested-field'
            }
        }

        const testDataWithUndefinedField = {
            ...testData,
            undefinedField: 'undefined-field'
        }

        const testModel = new TestModel(testDataWithUndefinedField)
        expect(testModel).toEqual(testData)

        testModel.undefinedField = 'updated-undefined-field'
        expect(testModel).toEqual(testData)
    })

    test('should have be able to interface with the datastore', () => {
        // expect(TestModel.datasource).toBeDefined()
        // expect(TestModel.datasource.collectionName).toBe('TestModels')
        expect(TestModel.collectionName).toBe('TestModels')
        expect(TestModel.collection).toBeDefined()
        expect(typeof TestModel.get).toBe('function')
        expect(typeof TestModel.getMany).toBe('function')
        expect(typeof TestModel.create).toBe('function')
        expect(typeof TestModel.createMany).toBe('function')
        expect(typeof TestModel.update).toBe('function')
        expect(typeof TestModel.updateMany).toBe('function')
        expect(typeof TestModel.delete).toBe('function')
        expect(typeof TestModel.deleteMany).toBe('function')
    })

    test('should be able to create a record', async () => {
        const testModel = new TestModel({
            id: 1,
            nested: {
                nestedField: 'nested-field'
            },
            lowNumber: 5
        })
        console.log(testModel)
        expect(TestModel.create(testModel)).toBe(true)

    })

    test('should not set undefined field values', () => {
        const testData = {
            id: 'test-id',
            lowNumber: 5,
            nested: {
                nestedField: 'nested-field'
            }
        }

        const testDataWithUndefinedField = {
            ...testData,
            undefinedField: 'undefined-field'
        }

        const testModel = new TestModel(testDataWithUndefinedField)
        expect(testModel).toEqual(testData)

        testModel.undefinedField = 'updated-undefined-field'
        expect(testModel).toEqual(testData)
    })

    test('should have a datasource', () => {
        expect(TestModel.datasource).toBeDefined()
        expect(TestModel.datasource.collectionName).toBe('TestModels')
        expect(TestModel.collectionName).toBe('TestModels')
        expect(typeof TestModel.get).toBe('function')
        expect(typeof TestModel.getMany).toBe('function')
        expect(typeof TestModel.create).toBe('function')
        expect(typeof TestModel.createMany).toBe('function')
        expect(typeof TestModel.update).toBe('function')
        expect(typeof TestModel.updateMany).toBe('function')
        expect(typeof TestModel.delete).toBe('function')
        expect(typeof TestModel.deleteMany).toBe('function')
    })
})
