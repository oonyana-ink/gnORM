import { Changeset } from "./changeset"
import { getDatasource } from "./datasource"
import { Record } from "./record"
import { Payload } from "./payload"
import { getFirstDefinedProperty } from "./utils"

export const Model = (...modelConfigs: ModelConfig[]): ModelConstructor => {
    const modelConfig = modelConfigs.pop() as ModelConfig // Last config is the primary config
    const modelMixins = modelConfigs // All other configs are mixins NOT IMPLEMENTED YET
    const schema = modelConfig.schema

    const modelConstructor = (data: ModelData): ModelInstance => {
        const changeset = Changeset(data, schema)

        const getters: ModuleGetters = {
            get _type() { return "Model" },
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


// import { set } from "zod"
// import { Changeset } from "./changeset"
// import { Record } from "./record"
// import { addHiddenProperties, getFirstDefinedProperty, getProxiedSchemaValue, updateClassName } from "./utils"
// import { Datasource } from "./datasource"
// import { Collection } from "./collection"


// //             Base Class
// // -------------------------------------
// class BaseModel {
//     _schema: SchemaInstance
//     _record: RecordInstance
//     _changeset: ChangesetInstance

//     get data() {
//         return this._changeset.data
//     }

//     static get collectionName() {
//         return this.name + 's'
//     }

//     static datasource: string = 'primary'
//     static Schema: SchemaDefinition
//     static schema: SchemaInstance
//     static collection: DatasourceInstance
// }


// //              Proxies
// // -------------------------------------

// const ModelProxy = new Proxy(BaseModel, {
//     construct(target, [data, ...args], receiver: ClassConstructor) {
//         const schema = receiver.prototype.schema
//         const collection = receiver.prototype.collection
//         const model = new target() as ModelInstance

//         model.name = receiver.prototype.name
//         model._schema = schema
//         model._collection = collection
//         model._changeset = new Changeset(data, model)
//         model._record = new Record(model)

//         const modelProxy = modelInstanceProxy(model)
//         return modelProxy
//     },

//     get(target: ClassConstructor, key: string, receiver) {
//         const collection = (
//             typeof key === 'string' &&
//             key !== 'prototype'
//         ) ? receiver.prototype.collection : {}

//         return Reflect.get(target, key, receiver) || getFirstDefinedProperty(key, modelDecorators, collection, (key !== 'prototype' ? receiver.prototype : {})).or(null)
//     }
// })
// export const Model = ModelProxy as unknown as ModelClassConstructor

// const modelInstanceProxy = (model: ModelInstance) => {
//     return new Proxy(model.data, {
//         get(target, key: string, receiver) {
//             return getProxiedSchemaValue(key, {
//                 primarySource: model.data,
//                 schemaFields: model._schema.fieldKeys,
//                 fallbackSources: [model, model._changeset, model._schema, model._record],
//                 defaultValue: Reflect.get(target, key, receiver)
//             })
//         },

//         set(target, key: string, value, receiver) {
//             model._changeset.set(key, value)
//             return true
//         }
//     })
// }


// //              Decorators
// // -------------------------------------

// const modelDecorators: modelDecoratorsMap = {
//     define: <TModel extends Function | ClassConstructor>(ModelClass: TModel) => { },
//     from: (SchemaClass: SchemaClassConstructor) => <TModel extends Function | ClassConstructor>(ModelClass: TModel) => {
//         updateClassName(ModelClass.prototype, ModelClass.name)
//         addHiddenProperties(ModelClass.prototype, {
//             Schema: SchemaClass,
//             schema: new SchemaClass(),
//             collection: new Collection(ModelClass)
//         })
//     }
// }
