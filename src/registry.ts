const Registry = () => {
    const schemas: SchemaRegistryCache = {}
    const models: ModelRegistryCache = {}
    return {
        registerSchema: (schema: SchemaInstance) => {
            schemas[schema.name] = schema
        },
        registerModel: (model: ModelConstructor) => {
            models[model.modelName] = model
        },
        getSchema: (name: string): SchemaInstance => {
            return schemas[name]
        },
        getModel: (name: string): ModelConstructor => {
            return models[name]
        }
    }
}

export const registry = Registry()

// class Registry {
//     models: { [key: string]: ModelConstructor } = {}
//     constructor() { }
//     addModel (model: ModelConstructor) {
//         this.models[model.name] = model
//     }
//     getModel (name: string) {
//         return this.models[name]
//     }
// }

// export const registry = new Registry()
