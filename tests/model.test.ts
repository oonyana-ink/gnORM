import { describe, test, expect, jest } from '@jest/globals'
import { Model, Schema, Field, Datasource } from '../src'
import { mockDatasource } from './mocks/mockDatasource';

describe('Model', () => {
    const datasource = mockDatasource()

    const validData = {
        id: '1',
        name: 'test',
        email: 'test@email.com'
    }

    const invalidData = {
        id: 1,
        email: 'ping'
    }

    const TestSchema = Schema({
        id: Field.String(),
        name: Field.String({ required: true }),
        email: Field.Email(),
    })
    const TestModel = Model({
        schema: TestSchema
    })

    test('should be definable', () => {
        expect(TestModel.schema).toEqual(TestSchema)
    })

    test('should be able to return instances', () => {
        const testInstance = TestModel(validData)
        expect(testInstance).toEqual(validData)
        expect(testInstance.schema).toEqual(TestSchema)
    })

    test('should be able to parse data', () => {
        const validDataState = TestModel.parse(validData)
        expect(validDataState.success).toBe(true)
        expect(validDataState.data).toEqual(validData)
        expect(validDataState.errors).toBe(null)

        const invalidDataState = TestModel.parse(invalidData)
        expect(invalidDataState.success).toBe(false)
        expect(invalidDataState.data).toBe(invalidData)
        expect(invalidDataState.errors?.id.code).toBe('invalid_type')
        expect(invalidDataState.errors?.name.code).toBe('required')
        expect(invalidDataState.errors?.email.code).toBe('invalid_email')
    })

    test('should have status flags on instances', () => {
        const validInstance = TestModel(validData)
        expect(validInstance.isValid).toBe(true)
        expect(validInstance.isInvalid).toBe(false)
        expect(validInstance.isDirty).toBe(false)

        validInstance.id = '2'
        expect(validInstance.isDirty).toBe(true)

        const invalidInstance = TestModel(invalidData)
        expect(invalidInstance.isValid).toBe(false)
        expect(invalidInstance.isInvalid).toBe(true)
    })

    test('should be able to get changes from instance', () => {
        const validInstance = TestModel(validData)
        expect(validInstance.changes).toEqual({})
        validInstance.id = '2'
        expect(validInstance.changes).toEqual({ id: '2' })
        validInstance.id = '1'
        expect(validInstance.changes).toEqual({})
    })

    test('should be able to perform CRUD operations', async () => {
        const validModel = TestModel(validData)
        const createMock = datasource.mocks.create as jest.Mock
        const updateMock = datasource.mocks.update as jest.Mock

        validModel.set({ id: 'abc' })
        expect(validModel.isDirty).toBe(true)
        expect(validModel.isPersisted).toBe(false)

        await validModel.save()
        expect(createMock.mock.calls.length).toBe(1)
        expect(validModel.isPersisted).toBe(true)
        expect(validModel.isDirty).toBe(false)

        validModel.set({ id: 'xyz' })
        expect(validModel.isDirty).toBe(true)

        await validModel.save()
        expect(updateMock.mock.calls.length).toBe(1)
        expect(validModel.isDirty).toBe(false)

        expect(validModel.data).toEqual({
            ...validData,
            id: 'xyz'
        })
    })
})


// import { Datasource, Model, Schema } from '../src'


// describe('Model', () => {
//     class TestDatasource extends Datasource {
//         key = 'primary'

//         async create(collectionName: string, data: ModelData) {
//             return data
//         }
//     }

//     new TestDatasource()

//     @Schema.define
//     class NestedSchema extends Schema {
//         @Schema.field
//         nestedField: string
//     }
//     @Schema.define
//     class TestSchema extends Schema {
//         @Schema.field
//         id: string

//         @Schema.field
//         nested: NestedSchema

//         @Schema.field({ lt: 10 })
//         lowNumber: number
//     }

//     @Model.from(TestSchema)
//     class TestModel extends Model { }

//     @Schema.define
//     class TestSchema2 extends Schema {
//         @Schema.field
//         id: string

//         @Schema.field
//         anotherField: string
//     }

//     @Model.from(TestSchema2)
//     class TestModel2 extends Model { }

//     test('should be definable', () => {
//         expect(TestModel.Schema).toBeDefined()
//         expect(TestModel.Schema.fields).toBeDefined()
//         expect(TestModel.Schema.validator).toBeDefined()
//         expect(TestModel.schema).toBeDefined()
//         expect(TestModel.schema.fields).toBeDefined()
//         expect(TestModel.schema.parse).toBeDefined()
//         expect(TestModel2.Schema).not.toEqual(TestModel.Schema)
//     })

//     test('should be instantiable', () => {
//         const testData = {
//             id: 'test-id',
//             lowNumber: 5,
//             nested: {
//                 nestedField: 'nested-field'
//             }
//         }
//         const testModel = new TestModel(testData)

//         // expect(testModel.Schema.fields).toBeDefined()
//         expect(testModel._schema).toBeDefined()
//         expect(testModel._schema.fields).toBeDefined()
//         expect(testModel).toEqual(testData)

//         // properties from changest
//         expect(testModel._changeset).toBeDefined()
//         expect(testModel.isValid).toBeDefined()
//         expect(testModel.isInvalid).toBeDefined()
//         expect(testModel.isDirty).toBeDefined()
//         expect(testModel.isPristine).toBeDefined()

//         // properties from validator
//         expect(testModel.errors).toBeDefined()

//         // properties from record
//         expect(testModel._record).toBeDefined()
//         expect(testModel.isPending).toBeDefined()
//         expect(testModel.isSaving).toBeDefined()
//         expect(testModel.isDeleted).toBeDefined()
//         expect(testModel.isPersisted).toBeDefined()
//         expect(testModel.isRejected).toBeDefined()
//     })

//     test('should have errors when invalid', () => {
//         const validData = {
//             id: 'test-id',
//             lowNumber: 5,
//             nested: {
//                 nestedField: 'nested-field'
//             }
//         }

//         const invalidData = {
//             ...validData,
//             lowNumber: 100,
//             nested: null
//         }

//         const validModel = new TestModel(validData)
//         const invalidModel = new TestModel(invalidData)

//         expect(validModel.errors).toEqual(null)
//         expect(invalidModel.errors).not.toEqual(null)
//     })

//     test('should be able to set data', () => {
//         const testData = {
//             id: 'test-id',
//             lowNumber: 5,
//             nested: {
//                 nestedField: 'nested-field'
//             }
//         }
//         const testModel = new TestModel(testData)
//         expect(testModel).toEqual(testData)

//         testModel.lowNumber = 10
//         expect(testModel).toEqual({ ...testData, lowNumber: 10 })

//         const updateData = {
//             id: 'updated-id',
//             lowNumber: 3
//         }
//         testModel.set(updateData)
//         expect(testModel).toEqual({ ...testData, ...updateData })
//     })

//     test('should not set undefined field values', () => {
//         const testData = {
//             id: 'test-id',
//             lowNumber: 5,
//             nested: {
//                 nestedField: 'nested-field'
//             }
//         }

//         const testDataWithUndefinedField = {
//             ...testData,
//             undefinedField: 'undefined-field'
//         }

//         const testModel = new TestModel(testDataWithUndefinedField)
//         expect(testModel).toEqual(testData)

//         testModel.undefinedField = 'updated-undefined-field'
//         expect(testModel).toEqual(testData)
//     })

//     test('should have be able to interface with the datastore', () => {
//         // expect(TestModel.datasource).toBeDefined()
//         // expect(TestModel.datasource.collectionName).toBe('TestModels')
//         expect(TestModel.collectionName).toBe('TestModels')
//         expect(TestModel.collection).toBeDefined()
//         expect(typeof TestModel.get).toBe('function')
//         expect(typeof TestModel.getMany).toBe('function')
//         expect(typeof TestModel.create).toBe('function')
//         expect(typeof TestModel.createMany).toBe('function')
//         expect(typeof TestModel.update).toBe('function')
//         expect(typeof TestModel.updateMany).toBe('function')
//         expect(typeof TestModel.delete).toBe('function')
//         expect(typeof TestModel.deleteMany).toBe('function')
//     })

//     test('should be able to create a record', async () => {
//         const testModel = new TestModel({
//             id: 1,
//             nested: {
//                 nestedField: 'nested-field'
//             },
//             lowNumber: 5
//         })
//         console.log(testModel)
//         expect(TestModel.create(testModel)).toBe(true)

//     })

//     test('should not set undefined field values', () => {
//         const testData = {
//             id: 'test-id',
//             lowNumber: 5,
//             nested: {
//                 nestedField: 'nested-field'
//             }
//         }

//         const testDataWithUndefinedField = {
//             ...testData,
//             undefinedField: 'undefined-field'
//         }

//         const testModel = new TestModel(testDataWithUndefinedField)
//         expect(testModel).toEqual(testData)

//         testModel.undefinedField = 'updated-undefined-field'
//         expect(testModel).toEqual(testData)
//     })

//     test('should have be able to interface with the datastore', () => {
//         // expect(TestModel.datasource).toBeDefined()
//         // expect(TestModel.datasource.collectionName).toBe('TestModels')
//         expect(TestModel.collectionName).toBe('TestModels')
//         expect(TestModel.collection).toBeDefined()
//         expect(typeof TestModel.get).toBe('function')
//         expect(typeof TestModel.getMany).toBe('function')
//         expect(typeof TestModel.create).toBe('function')
//         expect(typeof TestModel.createMany).toBe('function')
//         expect(typeof TestModel.update).toBe('function')
//         expect(typeof TestModel.updateMany).toBe('function')
//         expect(typeof TestModel.delete).toBe('function')
//         expect(typeof TestModel.deleteMany).toBe('function')
//     })

//     test('should be able to create a record', async () => {
//         const testModel = new TestModel({
//             id: 1,
//             nested: {
//                 nestedField: 'nested-field'
//             },
//             lowNumber: 5
//         })
//         console.log(testModel)
//         expect(TestModel.create(testModel)).toBe(true)

//     })
// })
