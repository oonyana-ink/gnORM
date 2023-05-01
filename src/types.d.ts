interface iSchemaDefinition {
    [key: string]: any
}

interface SchemaConstructor {
    new(): RawSchemaInstance
}

interface RawData {
    [key: string]: any
}

interface ValidatedData {
    [key: string]: any
}

interface ValidateFunction {
    (data: RawData): { success: boolean, errors: any, data: ValidatedData }
}

interface SchemaInstance {
    [key: string]: any,
    fields: SchemaFields
    // parse: (data: RawData) => DataState
    // validationConfg?: {
    //     [key: string]: any
    // }
    // validate: ValidateFunction
}

interface RawSchemaInstance {
    [key: string]: any
}

// interface SchemaField {
//     key: string
//     typeClass: ClassConstructor
//     typeName: string
//     fieldConfig: FieldConfig
// }

interface SchemaField {
    [key: string]: any
}

interface FieldConfig {
    [key: string]: any
}

interface iResolvedFieldConfig {
    [key: string]: any
}

interface SchemaFieldValidators {
    [key: string]: (value: any) => { valid: boolean, message: string }
}
interface iValidators {
    [key: string]: iValidator[]
}

interface ModelAction {
    fields: string[]
    resolver: () => any
}

interface ModelActions {
    [key: string]: ModelAction
}

interface ModelConfigOptions {
    actions: Object
}

// interface ModelClassConstructor {
//     new(data: ModelData, ...args: any[]): ModelInstance
// }

interface ModelClassConstructor extends DatasourceInstance {
    new(data: ModelData, ...args: any[]): any
    name?: string
    pluralName?: string
    collectionName?: string
    Schema: SchemaDefinition
    define: Function
    field: Function
    schema: SchemaInstance
<<<<<<< HEAD
<<<<<<< HEAD
    collection: CollectionInstance
=======
    datasource: DatasourceInstance
>>>>>>> 70c4c09 (More groundwork + more tests)
=======
    collection: CollectionInstance
>>>>>>> 8b11997 (Collections and datasources)
    [key: string]: any
}

interface ClassFactory {
    (ModelClass: ClassConstructor): ModelClassConstructor
}

interface ModelClassFactory<T> {
    (ModelClass: ClassConstructor): ModelClassConstructor<T>
}

type ModelClassConstructorOrFactory<T extends ClassConstructor | ModelConfig> = T extends ClassConstructor
    ? ModelClassConstructor
    : ClassDecorator

interface SchemaValidationConfig {
    zRootSchema: any
    fields: {
        [key: string]: ValidationConfig
    }
    required: {
        [key: string]: boolean
    }
}

interface objectInstance {
    [key: string]: any
}

interface ModelData {
    [key: string]: any
}

interface ProtoModelInstance {
    [key: string]: any
    __data__: ModelData
}

interface ChangesetInstance {
    private _initialData: ModelData
    private _changes: ModelData
    data: ModelData
    isValid: boolean
    isDirty: boolean
    isPristine: boolean
    isInvalid: boolean
    [key: string]: any
}

interface ModelInstance {
    [key: string]: any
}

interface modelDecoratorsMap {
    [key: string]: any
    define: ClassDecorator
}

interface schemaDecoratorsMap {
    [key: string]: any
}

interface SchemaDefinition {
    [key: string]: any
}
interface RawModelInstance {
    [key: string]: any
}

interface ModelProxyInstance {
    [key: string]: any
}

interface ValidationConfig {
    [key: string]: any
}

interface ModelConstructor {
    [key: string]: any
}

interface modelErrors {
    [key: string]: {
        [key: string]: any,
        message: string
    }
}

interface errorParams {
    [key: string]: any
}

interface errorMessagesMap {
    [key: string]: (fieldKey: string, params: errorParams) => string
}

interface ClassConstructor {
    new(...args: any[]): any
    [key: string]: any
    [key: string]: () => any
}

interface SchemaClassConstructor extends ClassConstructor {
    fields: SchemaFields
    validator: ValidatorInstance
    blankDataset: () => ModelData
    parse: (data: ModelData) => DataState
    fieldKeys: string[]
}

interface ValidatorInstance {
    [key: string]: any
}

interface ModelConfig {
    name?: string
    pluralName?: string
    collectionName?: string
}

interface DatasourceInstance {
    [key: string]: any
    get: Function
    getMany: Function
    create: Function
    createMany: Function
    update: Function
    updateMany: Function
    delete: Function
    deleteMany: Function
}

interface DatasourceOrigin {
    [key: string]: any
}

interface DatasourceClassConstructor extends ClassConstructor {

}

interface Datasource {
    [key: string]: any
}

interface DatasourceConfig {
    [key: string]: any
}

interface CollectionClassConstructor extends ClassConstructor { }

interface CollectionInstance {
    [key: string]: any
    get: Function
    getMany: Function
    create: Function
    createMany: Function
    update: Function
    updateMany: Function
    delete: Function
    deleteMany: Function
}

type email = string & { readonly __brand: unique symbol };
// type modelErrors = ModelErrorObject[] | null | undefined;

interface ModelErrorObject {
    keyword: string // validation keyword.
    instancePath: string // JSON Pointer to the location in the data instance (e.g., `"/prop/1/subProp"`).
    schemaPath: string // JSON Pointer to the location of the failing keyword in the schema
    params: object // type is defined by keyword value, see below
    // params property is the object with the additional information about error
    // it can be used to generate error messages
    // (e.g., using [ajv-i18n](https://github.com/ajv-validator/ajv-i18n) package).
    // See below for parameters set by all keywords.
    propertyName?: string // set for errors in `propertyNames` keyword schema.
    // `instancePath` still points to the object in this case.
    message?: string // the error message (can be excluded with option `messages: false`).
    // Options below are added with `verbose` option:
    schema?: any // the value of the failing keyword in the schema.
    parentSchema?: object // the schema containing the keyword.
    data?: any // the data validated by the keyword.
}


interface DecoratorConfig {
    [key: string]: any
}

type ClassDecorator = <TFunction extends Function>(target: TFunction) => TFunction | void;
type ClassDecoratorFactory = (decoratorConfig: DecoratorConfig) => ClassDecorator;
type PropertyDecoratorFactory = (decoratorConfig: DecoratorConfig) => any;



interface ModelRepo {
    [key: string]: any
}

interface DatasourceCollection {
    private name: string
    private ref: any
    private schema: SchemaInstance
    create: (data: ModelData) => Promise<ModelInstance>
    get: (id: string) => Promise<ModelInstance>
    getAll: () => Promise<ModelInstance[]>
    update: (id: string, data: ModelData) => Promise<ModelInstance>
    delete: (id: string) => Promise<ModelInstance>
}

interface ModelActionConfig {
    config: Object
    action: (data: ModelData) => any
}

interface ModelValidator {
    validate: (data: ModelData) => ModelValidationResult
}

interface ModelValidationResult {
    success: boolean
    errors: modelErrors | null
    data: ModelData
}

type ModelSchema<T extends Function | Object> = T extends Function
    ? PropertyDecorator
    : SchemaInstance

interface getProxiedSchemaValueConfig {
    primarySource: objectInstance
    schemaFields: string[]
    fallbackSources: objectInstance[],
    defaultValue: any
}

interface DataState {
    success: boolean
    data: ModelData
    errors: {
        [key: string]: {
            code: string
            message: string
        }
    }
}

interface RecordInstance {
    [key: string]: any
}

interface SchemaFields {
    [key: string]: SchemaField
}