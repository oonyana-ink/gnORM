import { describe, test, expect } from '@jest/globals'

const transformClause = (clause: any) => {
    const [key, value] = Object.entries(clause)[0]
    if (value instanceof Object) {
        const [op, val] = Object.entries(value)[0]
        return [key, op, val]
    }
    return [key, '==', value]
}
const lt_ = (value: any) => ({ '<': value })
const in_ = (value: any[]) => ({ 'in': value })
const queryBuilder = (queryConfig: { [key: string]: any } = {}) => {
    return {
        where: (...clauses: any[]) => {
            queryConfig.where ||= []
            queryConfig.where = queryConfig.where.concat(clauses.map(transformClause))
            return queryBuilder(queryConfig)
        },
        orderBy: (sortKey: string, direction = 'desc') => {
            queryConfig.orderBy = [sortKey, direction]
            return queryBuilder(queryConfig)
        },
        limit: (limit: number) => {
            queryConfig.limit = limit
            return queryBuilder(queryConfig)
        },
        queryConfig
    }
}
const query = queryBuilder()


describe('scratchpad', () => {
    test('first test', () => {

        query.where({ id: 1 }, { id: lt_(2) }, { id: in_([1, 2, 3]) })
            .orderBy('something')
            .limit(10)
        // console.dir(query.queryConfig, { depth: 4 })
        // console.dir(query.queryConfig.where)

        expect(true).toBe(true)
    })
})