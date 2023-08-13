import { describe, test, expect } from '@jest/globals'

const specialOperators = new Set(['or'])
const transformClause = (clause: any) => {
    console.log('transformClause', clause)
    const [key, value] = Object.entries(clause)[0]
    console.log(key, value)
    // console.log('transformClause', key, value)
    if (specialOperators.has(key)) {
        return [key].concat(value as any[])
    } else if (value instanceof Object) {
        const [op, val] = Object.entries(value)[0]
        return [key, op, val]
    }
    return [key, '==', value]
}
const lt_ = (value: any) => ({ '<': value })
const lessThan_ = lt_
const in_ = (value: any[]) => ({ 'in': value })
const or_ = (...clauses: any[]) => {
    console.log('or:clauses', clauses);
    return { 'or': clauses.map(transformClause) }
}
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

        query.where(
            { id: 1 },
            { id: lt_(2) },
            { id: in_([1, 2, 3]) },
            or_(
                { field: 'ping' },
                { field: 'pong', id: in_([2, 3, 4]) }
            ))
            .where(or_({ field: 'value' }, { field: 'value2' }))
            .orderBy('something')
            .limit(10)
        console.log('------ query ------')
        console.dir(query.queryConfig, { depth: 4 })
        console.dir(query.queryConfig.where)
        console.log('-------------------')

        expect(true).toBe(true)
    })
})