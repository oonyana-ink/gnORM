import { describe, test, expect } from '@jest/globals'
import { Datasource, getDatasource } from '../src/datasource'

describe('Datasource', () => {
    const datasource = Datasource({
        name: 'primary',
        async create(payload) { return {} },
        async createMany(payloads) { return [] },
        async update(payload) { return {} },
        async updateMany(payloads) { return [] },
        async get(payload) { return {} },
        async getMany(payload) { return [] },
        async delete(payload) { return {} },
        async deleteMany(payloads) { return [] },

    })
    test('should be defined and registered', async () => {
        expect(datasource.create).toBeDefined()
        expect(getDatasource('primary')).toEqual(datasource)
        datasource.create({}).catch(e => {
            expect(e).toBeInstanceOf(Error)
        })
    })
})


