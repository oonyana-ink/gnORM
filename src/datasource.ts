import { getFirstDefinedProperty } from "./utils"

const datasources: DatasourceRegistry = {}

const registerDatasource = (datasource: DatasourceInstance) => {
    const name = datasource.name
    if (datasources[name]) {
        console.warn(`Datasource (${name}) is already registered and will be overwritten.`)
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
        return async (payload: any) => {
            if (!datasourceConfig.hasOwnProperty(method)) {
                throw new Error(`${method} on datasource (${datasource.name}) not implemented`)
            }
            payload = many ? payload as PayloadInstance[] : payload as PayloadInstance

            let response
            if (many) {
                response = await datasourceConfig[method as DatasourceApiManyMethod](payload)
                response.forEach((responseItem: PayloadInstance) => responseItem.meta.persisted = true)
            } else {
                response = await datasourceConfig[method as DatasourceApiMethod](payload)
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
        deleteMany: crudMethod('deleteMany', true)
    }

    const datasourceProxy = new Proxy(datasource, {
        get(target, key: string, receiver) {
            return Reflect.get(target, key, receiver) || getFirstDefinedProperty(key, getters, api)
        }
    }) as unknown as DatasourceInstance

    registerDatasource(datasourceProxy)
    return datasourceProxy
}
