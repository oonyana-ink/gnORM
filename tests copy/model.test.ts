import { describe, test, expect, jest } from '@jest/globals'
import { Model, Schema, Field, Datasource } from '../src'
import { mockDatasource } from './mocks/mockDatasource';

describe('Model', () => {
    const validData = {
        id: '1',
        name: 'test',
        email: 'test@email.com',
        mixinField: 'mixin value'
    }

    const invalidData = {
        id: 1,
        email: 'ping'
    }

    const MixinSchema = Schema({
        mixinField: Field.String({ required: true })
    })

    const TestSchema = Schema(MixinSchema, {
        id: Field.String(),
        name: Field.String({ required: true }),
        email: Field.Email(),
    })

    const TestModel = Model({
        collection: 'tests',
        schema: TestSchema
    })

    test('should be definable', () => {
        expect(TestModel.collection).toBe('tests')
        expect(TestModel.schema).toEqual(TestSchema)
    })

    test('should be able to return instances', () => {
        const testInstance = TestModel(validData)
        expect(testInstance).toEqual(validData)
        expect(testInstance.collection).toEqual('tests')
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
        const datasource = mockDatasource()
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

    test('should not perform CRUD operations on invalid instances', async () => {
        const datasource = mockDatasource()
        const invalidModel = TestModel(invalidData)
        const validModel = TestModel(validData)
        const createMock = datasource.mocks.create as jest.Mock
        const updateMock = datasource.mocks.update as jest.Mock

        invalidModel.id = 123
        validModel.id = 123

        await invalidModel.save()
        expect(invalidModel.isDirty).toBe(true)
        expect(invalidModel.isPersisted).toBe(false)
        expect(invalidModel.errors).toBeDefined()

        await validModel.save()
        expect(validModel.isDirty).toBe(true)
        expect(validModel.isPersisted).toBe(false)
        expect(validModel.errors).toBeDefined()

        expect(createMock.mock.calls.length).toBe(0)
        expect(updateMock.mock.calls.length).toBe(0)

        validModel.id = '123'
        await validModel.save()
        expect(validModel.isPersisted).toBe(true)
        expect(validModel.isDirty).toBe(false)
        expect(validModel.errors).toBe(null)

        expect(createMock.mock.calls.length).toBe(1)
        expect(updateMock.mock.calls.length).toBe(0)

        validModel.id = 123
        await validModel.save()
        expect(validModel.isDirty).toBe(true)
        expect(validModel.isPersisted).toBe(true)
        expect(validModel.errors).toBeDefined()

        expect(createMock.mock.calls.length).toBe(1)
        expect(updateMock.mock.calls.length).toBe(0)
    })
})
