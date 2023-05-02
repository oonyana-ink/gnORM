import { set } from "zod"
import { Changeset } from "./changeset"
import { Record } from "./record"
import { addHiddenProperties, getFirstDefinedProperty, getProxiedSchemaValue, updateClassName } from "./utils"
import { Datasource } from "./datasource"
import { Collection } from "./collection"


//             Base Class
// -------------------------------------
class BaseModel {
    _schema: SchemaInstance
    _record: RecordInstance
    _changeset: ChangesetInstance

    get data() {
        return this._changeset.data
    }

    static get collectionName() {
        return this.name + 's'
    }

    static datasource: string = 'primary'
    static Schema: SchemaDefinition
    static schema: SchemaInstance
    static collection: DatasourceInstance
}


//              Proxies
// -------------------------------------

const ModelProxy = new Proxy(BaseModel, {
    construct(target, [data, ...args], receiver: ClassConstructor) {
        const schema = receiver.prototype.schema
        const collection = receiver.prototype.collection
        const model = new target() as ModelInstance

        model.name = receiver.prototype.name
        model._schema = schema
        model._collection = collection
        model._changeset = new Changeset(data, model)
        model._record = new Record(model)

        const modelProxy = modelInstanceProxy(model)
        return modelProxy
    },

    get(target: ClassConstructor, key: string, receiver) {
        const collection = (
            typeof key === 'string' &&
            key !== 'prototype'
        ) ? receiver.prototype.collection : {}

        return Reflect.get(target, key, receiver) || getFirstDefinedProperty(key, modelDecorators, collection, (key !== 'prototype' ? receiver.prototype : {})).or(null)
    }
})
export const Model = ModelProxy as unknown as ModelClassConstructor

const modelInstanceProxy = (model: ModelInstance) => {
    return new Proxy(model.data, {
        get(target, key: string, receiver) {
            return getProxiedSchemaValue(key, {
                primarySource: model.data,
                schemaFields: model._schema.fieldKeys,
                fallbackSources: [model, model._changeset, model._schema, model._record],
                defaultValue: Reflect.get(target, key, receiver)
            })
        },

        set(target, key: string, value, receiver) {
            model._changeset.set(key, value)
            return true
        }
    })
}


//              Decorators
// -------------------------------------

const modelDecorators: modelDecoratorsMap = {
    define: <TModel extends Function | ClassConstructor>(ModelClass: TModel) => { },
    from: (SchemaClass: SchemaClassConstructor) => <TModel extends Function | ClassConstructor>(ModelClass: TModel) => {
        updateClassName(ModelClass.prototype, ModelClass.name)
        addHiddenProperties(ModelClass.prototype, {
            Schema: SchemaClass,
            schema: new SchemaClass(),
            collection: new Collection(ModelClass)
        })
    }
}
