import { getFirstDefinedProperty } from "./utils"

const datasources: DatasourceRegistry = {}

const registerDatasource = (datasource: DatasourceInstance) => {
    const name = datasource.name
    if (datasources[name]) {
        console.warn(`Datasource (${name}) already registered`)
    }
    datasources[name] = datasource
}

export const getDatasource = (key: string = 'primary') => {
    return datasources[key]
}

export const Datasource = (datasourceConfig: DatasourceConfig): DatasourceInstance => {
    const datasource = {
        name: 'primary'
    }

    const getters: ModuleGetters = {}

    const crudMethod = (method: DatasourceApiMethod | DatasourceApiManyMethod, many: boolean = false) => {
        return async (payload: PayloadInstance | PayloadInstance[]) => {
            if (!datasourceConfig.hasOwnProperty(method)) {
                throw new Error(`${method} on datasource (${datasource.name}) not implemented`)
            }

            let response
            if (many) {
                response = await datasourceConfig[method as DatasourceApiManyMethod](payload as PayloadInstance[])
                response.forEach((responseItem: PayloadInstance) => responseItem.meta.persisted = true)
            } else {
                response = await datasourceConfig[method as DatasourceApiMethod](payload as PayloadInstance)
                response.meta.persisted = true // FIXME: check response status
            }
            return response
        }
    }
    const api: ModuleApi = {
        create: crudMethod('create'),
        createMany: crudMethod('createMany', true),
        update: crudMethod('update'),
        updateMany: crudMethod('updateMany', true),
        get: crudMethod('get'),
        getMany: crudMethod('getMany', true),
        delete: crudMethod('delete'),
        deleteMany: crudMethod('deleteMany', true),
    }

    const datasourceProxy = new Proxy(datasource, {
        get(target, key: string, receiver) {
            return Reflect.get(target, key, receiver) || getFirstDefinedProperty(key, getters, api)
        }
    }) as unknown as DatasourceInstance

    registerDatasource(datasourceProxy)
    return datasourceProxy
}


// import { getFirstDefinedProperty, mapProperties } from './utils'

// const datasources = {} as objectInstance
// export const getDatasource = (key: string = 'primary') => {
// <<<<<<< HEAD
// =======
//     console.log('getDatasource', key, datasources)
// >>>>>>> 8b11997 (Collections and datasources)
//     return datasources[key]
// }

// //             Base Class
// // -------------------------------------
// class BaseDatasource {
//     key: string = 'primary'
//     constructor() {
//         datasources[this.key] = this
// <<<<<<< HEAD
//         console.log('datasources', datasources)
//     }
//     async create(collectionName: string, data: ModelData) {
// =======
//         console.dir(this)
//     }
//     async create(collectionName: string, data: ModelData) {
//         console.log('BaseDatasource:get', collectionName, data)
// >>>>>>> 8b11997 (Collections and datasources)
//         return data
//     }
//     async createMany() { }
//     async update() { }
//     async updateMany() { }
//     async get() { }
//     async getMany() { }
//     async delete() { }
//     async deleteMany() { }
// }

// export const Datasource = BaseDatasource as unknown as DatasourceClassConstructor
