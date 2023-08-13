import { describe, test, expect } from '@jest/globals'
import { Changeset } from '../src/changeset'
import { Schema } from '../src/schema'
import { Field } from '../src/fields'

describe('Changeset', () => {
    const TestSchema = Schema({
        id: Field.String(),
        name: Field.String(),
        age: Field.Number(),
    })
    test('should be defined', () => {
        const changeset = Changeset({
            id: '1',
            name: 'test'
        }, TestSchema)
        console.log({ ...changeset })

        changeset.id = '2'
        console.log({ ...changeset })

        const { errors, data } = changeset
        console.log({ errors, data })
    })
})