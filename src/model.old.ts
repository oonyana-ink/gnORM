import { Changeset } from './changeset'

abstract class BaseModel {
    constructor(data: ModelData) {}
    // static schema: ModelSchema<Function | Object>
    // static collection: DatasourceCollection
    // static validator: ModelValidator
}

export class Model extends BaseModel {
    _changeset: ChangesetInstance
    constructor(data: ModelData) {
        super(data)
        this._changeset = new Changeset(data as ModelData) as unknown as ChangesetInstance
        const modelProxy = new Proxy(this._changeset, {
            get(target, key, receiver) {
                console.log('modelProxy:get', key)

                return Reflect.get(target, key, receiver)
            }
        })
        return modelProxy as unknown as ModelInstance
    }

    // static define: ClassDecorator = buildModelClassProxy
    // static schema: ModelSchema<Function> = instantiateAndBindClassProperty
    // static action = function (modelOrConfig: Object, ...args: any[]): void | any {
    //     const actionKey = args[0]
    //     if (!actionKey) {
    //         const config = modelOrConfig
    //         return (model: Object, actionKey: string | symbol, actionDescriptor: PropertyDescriptor) => {
    //             setupAction(model, actionKey as string, actionDescriptor, config)
    //         }
    //     } else {
    //         const model = modelOrConfig
    //         const actionDescriptor = args[1]
    //         const actionConfig = {}
    //         setupAction(model, actionKey as string, actionDescriptor, actionConfig)
    //     }
    //     return function () { }
    //     // const { value: action } = actionDescriptor
    //     // const BaseModel = parentModel.constructor as typeof ModelBase
    //     // console.log('action >>', actionKey, action)
    //     // console.log('actionMetadata >>')
    //     // // BaseModel[actionKey] = action
    // }
}

function setupAction(model: Object, actionKey: string, actionDescriptor: PropertyDescriptor, actionConfig: Object) {
    // console.dir('setupAction', model)
    // const { value: action } = actionDescriptor
    // const BaseModel = model.constructor as typeof ModelBase
    // const modelActions = getOrDefineProperty(BaseModel, 'actions', {})
    // makePropertyPrivate(BaseModel, 'actions')
    // modelActions[actionKey] = {
    //     config: actionConfig,
    //     action
    // }
    // console.log('action >>', actionKey, action, actionConfig, actionDescriptor)
}

function buildModelDefinitionx<ClassDefinition extends Function>(ModelClassDefinition: ClassDefinition): ClassDefinition {
    const ModelClass = ModelClassDefinition as unknown as ClassConstructor
    class DataModel extends BaseModel {
        static schema = ModelClass.schema
    }
    updateClassName(DataModel, ModelClassDefinition.name)
    console.dir('Model:define > ModelClass', ModelClass)
    return DataModel as unknown as ClassDefinition
}

function buildModelClassProxy<ClassDefinition extends Function | ClassConstructor>(ModelClassDefinition: ClassDefinition): ClassDefinition {
    const ModelClass = ModelClassDefinition as ClassConstructor
    const ModelClassProxy = new Proxy(ModelClass, {
        construct(target, args) {
            console.dir('ModelClassProxy:construct > target', target)
            console.dir('ModelClassProxy:construct > this', this)
            return buildModelInstanceProxy(ModelClass)
        }
    })
    
    return ModelClassProxy as ClassDefinition
}

function buildModelInstanceProxy(ModelClass: ClassConstructor) {
    const data = ModelClass.schema.parse({})
    const modelInstance = new ModelClass()
    modelInstance.schema = ModelClass.schema
    
    const ModelInstanceProxy = new Proxy(data, {
        get (target, prop, receiver) {
            // console.log('ModelInstanceProxy:get > prop', prop)
            let targetProp = Reflect.get(target, prop, receiver)
            console.log('ModelInstanceProxy:get > targetProp', targetProp)
            targetProp ??= Reflect.get(ModelClass, prop, receiver)
            // if (prop === 'prototype') {
            //     return ModelClass
            // }
            return targetProp
        },
        getPrototypeOf(target) {
            return ModelClass
        }
    })
    // ModelInstanceProxy.prototype = ModelClass
    return ModelInstanceProxy
}