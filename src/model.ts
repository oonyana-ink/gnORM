import { Changeset } from "./changeset"
import { getDatasource } from "./datasource"
import { Record } from "./record"
import { Payload } from "./payload"
import { getFirstDefinedProperty } from "./utils"

export const Model = (...modelConfigs: ModelConfig[]): ModelConstructor => {
    const modelConfig = modelConfigs.pop() as ModelConfig // Last config is the primary config
    const modelMixins = modelConfigs // TODO: All other configs are mixins NOT IMPLEMENTED YET
    const schema = modelConfig.schema

    const modelConstructor = (data: ModelData): ModelInstance => {
        const changeset = Changeset(data, schema)

        const getters: ModuleGetters = {
            get _type() { return "Model" },
            get collection() { return modelConfig.collection },
            get datasource() { return getDatasource(modelConfig.datasource) },
            get schema() { return schema },
        }

        const api: ModuleApi = {
            set: (data: ModelData, meta?: ChangesetSetMeta) => {
                changeset.set(data, meta)
                return model
            }
        }

        const model = new Proxy(changeset, {
            get(target, key: string, receiver) {
                if (schema.hasKey(key)) {
                    return Reflect.get(target, key, receiver)
                } else {
                    return getFirstDefinedProperty(key, getters, api, changeset, record)
                }
            },

            set(target, key: string, value: any, receiver) {
                return schema.hasKey(key) ? changeset[key] = value : false
            }
        }) as unknown as ModelInstance
        const record = Record(model)

        return model
    }

    const getters: ModuleGetters = {
        get _type() { return 'ModelConstructor' },
        get collection() { return modelConfig.collection },
        get datasource() { return getDatasource(modelConfig.datasource) },
        get schema() { return schema },
    }

    const api: ModuleApi = {
        parse: (data: ModelData): DataState => schema.parse(data),
        // TODO: Use the model.save implementation where possible
        create: async (data: ModelData) => {
            const datasource = getters.datasource
            const model = modelConstructor(data)
            const payload = Payload(model)
            return await datasource.create(payload)
        },
        createMany: async (dataArray: ModelData[]) => {
            const datasource = getters.datasource
            const models = dataArray.map(data => modelConstructor(data))
            return await datasource.createMany(models)
        },
        update: async (data: ModelData) => {
            const datasource = getters.datasource
            const model = modelConstructor(data)
            return await datasource.update(model)
        },
        updateMany: async (dataArray: ModelData[]) => {
            const datasource = getters.datasource
            const models = dataArray.map(data => modelConstructor(data))
            return await datasource.updateMany(models)
        },
        get: async (query: RawQuery | QueryInstance) => {
            const datasource = getters.datasource
            return await datasource.get(query)
        },
        getMany: async (query: RawQuery | QueryInstance) => {
            const datasource = getters.datasource
            return await datasource.getMany(query)
        },
        delete: async (query: RawQuery | QueryInstance) => {
            // return await datasource.delete(query)
        }
    }


    const modelConstructorProxy = new Proxy(modelConstructor, {
        get(target, key: string, receiver) {
            if (schema.hasKey(key)) {
                return Reflect.get(target, key, receiver)
            } else {
                return getFirstDefinedProperty(key, getters, api)
            }
        },

        set(target, key: string, value: any, receiver) {
            return false
        }
    }) as unknown as ModelConstructor

    return modelConstructorProxy
}
