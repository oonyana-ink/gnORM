import { getFirstDefinedProperty, mapProperties } from './utils'

const datasources = {} as objectInstance
export const getDatasource = (key: string = 'primary') => {
    return datasources[key]
}

//             Base Class
// -------------------------------------
class BaseDatasource {
    key: string = 'primary'
    constructor() {
        datasources[this.key] = this
        console.log('datasources', datasources)
    }
    async create(collectionName: string, data: ModelData) {
        return data
    }
    async createMany() { }
    async update() { }
    async updateMany() { }
    async get() { }
    async getMany() { }
    async delete() { }
    async deleteMany() { }
}

export const Datasource = BaseDatasource as unknown as DatasourceClassConstructor
