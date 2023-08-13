import { describe, test, expect } from '@jest/globals'
import { Schema } from '../src/schema'
import { types } from '../src/schemaTypes'
import { Model } from '../src/model'
import { registry } from '../src/registry'

describe('Model', () => {
    test('should be defined', () => {
        expect(Model).toBeDefined()
    })

    test('should be able to define a model', () => {
        const TestSchema = Schema('TestSchema', {
            fields: {
                id: types.ID(),
                name: types.String(),
                requiredField: types.String({ required: true }),
                age: types.Int(),
            }
        });

        const TestModel = Model('TestModel', {
            schema: TestSchema
        })

        expect(TestModel).toBeDefined()
        expect(TestModel.schema).toBe(TestSchema)
        expect(TestModel.modelName).toBe('TestModel')
        expect(registry.getModel('TestModel')).toBe(TestModel)
        
        const testModel = TestModel({
            name: 'Test',
            lastName: 'ping'
        })
        expect(testModel).toBeDefined()
        expect(testModel.data).toBeDefined()
        expect(testModel.schema).toBe(TestSchema)

        console.log(testModel.data)
        expect(testModel.data.id).toBe('')
        expect(testModel.name).toBe('Test')
        expect(testModel.data.name).toBe(testModel.name)
    })
})