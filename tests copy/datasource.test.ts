import { describe, test, expect } from '@jest/globals'
import { Datasource, getDatasource } from '../src/datasource'
import { mock } from 'node:test'

describe('Datasource', () => {
    const mockPayload = {
        query: {},
        data: {},
        meta: {
            collection: 'tests',
            action: ''
        }
    }

    const datasource = Datasource({
        name: 'primary',
        async create(payload) { return mockPayload },
        async createMany(payloads) { return [mockPayload] },
        async update(payload) { return mockPayload },
        async updateMany(payloads) { return [mockPayload] },
        async get(payload) { return mockPayload },
        async getMany(payload) { return [mockPayload] },
        async delete(payload) { return mockPayload },
        async deleteMany(payloads) { return [mockPayload] },

    })
    test('should be defined and registered', async () => {
        expect(datasource.create).toBeDefined()
        expect(getDatasource('primary')).toEqual(datasource)
        datasource.create(mockPayload).catch(e => {
            expect(e).toBeInstanceOf(Error)
        })
    })
})


