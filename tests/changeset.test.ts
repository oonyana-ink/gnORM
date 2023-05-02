import { describe, test, expect } from '@jest/globals'
import { Changeset } from '../src/changeset'
import { mockModel } from './mocks/mockModel'

describe('Changeset', () => {
    test('should be defined', () => {
        const changeset = Changeset({
            id: '1',
            name: 'test'
        }, mockModel)
        console.log({ ...changeset })

        changeset.id = '2'
        console.log({ ...changeset })

        const { errors, data } = changeset
        console.log({ errors, data })
    })
})