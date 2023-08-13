import { describe, test, expect } from '@jest/globals'
import { Schema } from '../src/schema'
import { types } from '../src/schemaTypes'
import { registry } from '../src/registry'


describe('Schema', () => {
    test('should be defined', () => {
        expect(Schema).toBeDefined()
    })

    test('should be able to define a schema', () => {
        const testSchemaFields = {
            id: types.ID(),
            name: types.String(),
            requiredField: types.String({ required: true }),
        } 
        const TestSchema = Schema('TestSchema', {
            fields: testSchemaFields
        })

        expect(TestSchema).toBeDefined()
        expect(TestSchema.fields).toEqual(testSchemaFields)
        expect(TestSchema.fieldKeys).toEqual(Object.keys(testSchemaFields))
        expect(registry.getSchema('TestSchema')).toBe(TestSchema)
    })
});