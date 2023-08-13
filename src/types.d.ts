// ---- Base Types ----

type BaseType = StringConstructor | NumberConstructor | BooleanConstructor | DateConstructor | ObjectConstructor | ArrayConstructor
type TypeDefiner = (options?: any) => TypeDefinition
type TypeDefinition = {
    base: BaseType
    default: () => string | number | boolean | Object | Data | Array<any>
    validator: (value: any) => boolean
}

// ---- Schema Types ----

type SchemaConfig = {
    fields: SchemaFields
}
type SchemaInstance = {
    name: string,
    fields: SchemaFields,
    fieldKeys: string[]
}
type SchemaFields = {
    [key: string]: TypeDefinition
}

type SchemaRegistryCache = {
    [key: string]: SchemaInstance
}


// ---- Model Types ----

type ModelConfig = {
    schema: SchemaInstance
}
type ModelInstance<S> = ModelData<S> | {
    data: ModelData
    schema: S
}
type ModelData<S> = {
    [key: keyof S]: any
}
type ModelConstructor = {
    (data: ModelData): ModelInstance
    modelName: string
    schema: SchemaInstance
}
type ModelRegistryCache = {
    [key: string]: ModelConstructor
}
