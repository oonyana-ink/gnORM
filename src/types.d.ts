interface ChangesetInstance {
    [key: string]: ModelDataTypes
    readonly data: ModelData
    readonly isValid: boolean
    readonly isInvalid: boolean
    readonly errors?: FieldErrors
    readonly isDirty: boolean
    readonly changes: ModelData
    set: (data: ModelData, meta?: ChangesetSetMeta) => ChangesetInstance
}

interface ChangesetSetMeta {
    reset?: boolean
}

interface CollectionReferences {
    [key: string]: any
}

interface DatasourceConfig extends DatasourceApi {
    [key: DatasourceApiMethod]: (payload: PayloadInstance) => Promise<PayloadInstance>
    [key: DatasourceApiManyMethod]: (payload: PayloadInstance[]) => Promise<PayloadInstance[]>
    name?: string
}

interface DatasourceApi {
    create: (payload: PayloadInstance) => Promise<PayloadInstance>
    createMany: (payloads: PayloadInstance[]) => Promise<PayloadInstance[]>
    update: (payload: PayloadInstance) => Promise<PayloadInstance>
    updateMany: (payloads: PayloadInstance[]) => Promise<PayloadInstance[]>
    get: (payload: PayloadInstance) => Promise<PayloadInstance>
    getMany: (payload: PayloadInstance) => Promise<PayloadInstance[]>
    delete: (payload: PayloadInstance) => Promise<PayloadInstance>
    deleteMany: (payloads: PayloadInstance[]) => Promise<PayloadInstance[]>
}
type DatasourceApiMethod = 'create' | 'update' | 'get' | 'delete'
type DatasourceApiManyMethod = 'createMany' | 'updateMany' | 'getMany' | 'deleteMany'

interface DatasourceInstance extends DatasourceApi {
    name: string
}

interface DatasourceRegistry {
    [key: string]: DatasourceInstance
}

interface DataState {
    data?: ModelData
    success: boolean
    errors: null | FieldErrors
}

interface FieldError {
    code: string
    message: string
}

interface FieldErrors {
    [key: string]: FieldError
}

interface FieldConfig {
    [key: string]: any
}

interface FieldInstance {
    [key: string]: any
    type: Function
}

interface FieldTypeConfigs {
    [key: string]: (fieldConfig?: FieldConfig) => FieldTypeInstance
}

interface ErrorIssue {
    path: string[]
    code: string
    received: string
    exact: boolean
    type: string
    message: string
    validation: string
}

interface ModelConfig {
    datasource?: string
    collection: string
    schema: SchemaInstance
}

interface ModelConstructor implements DatasourceApi {
    (data: ModelData): ModelInstance
    schema: SchemaInstance
    collection: string
    parse: (data: ModelData) => DataState

    create: (data: ModelData) => Promise<ModelInstance>
    createMany: (dataArray: ModelData[]) => Promise<ModelInstance[]>
    update: (data: ModelData) => Promise<ModelInstance>
    updateMany: (dataArray: ModelData[]) => Promise<ModelInstance[]>
    get: (query: RawQuery | QueryInstance) => Promise<ModelInstance>
    getMany: (query: RawQuery | QueryInstance) => Promise<ModelInstance[]>
    delete: (query: RawQuery | QueryInstance) => Promise<ModelInstance> // Should probably return a state object with success / errors
    deleteMany: (query: RawQuery | QueryInstance) => Promise<ModelInstance[]> // Should probably return a state object with success / errors
}

type ModelDataTypes = string | number | boolean | Object | Array<ModelDataTypes>
interface ModelData {
    [key: string]: ModelDataTypes
}

interface ModelInstance extends ChangesetInstance, RecordInstance {
    collection: string
    schema: SchemaInstance
    changeset: ChangesetInstance
    record: RecordInstance
    datasource: DatasourceInstance
    set: (data: ModelData, meta?: ChangesetSetMeta) => ModelInstance
}

interface ModelProtoInstance {
    [key: string]: SchemaInstance
    schema: SchemaInstance
}

interface ModuleApi {
    [key: string]: Function
}

interface ModuleGetters { // FIXME
    [key: string]: any
}

interface PayloadInstance { // FIXME
    query: QueryInstance
    data: ModelData
    meta: {
        collection: string
        action: string
        [key: string]: any
    }
}

interface PayloadMetaConfig { // FIXME
    [key: string]: any
}

interface QueryInstance { // FIXME
    [key: string]: any
}

interface RawPayload {
    data?: ModelData
    query?: RawQuery | QueryInstance
}

interface RawQuery { // FIXME
    [key: string]: any
}

interface RecordInstance { // FIXME
    [key: string]: any
    fetch: () => Promise<ModelInstance>
    save: () => Promise<ModelInstance>
    delete: () => Promise<ModelInstance>
    create: () => Promise<ModelInstance>
    update: () => Promise<ModelInstance>
}

type SchemaConfig = SchemaInstance | SchemaFieldDefinitions

type SchemaDataTypes = string | number | boolean
interface SchemaDefinition {
    [key: string]: SchemaDataTypes
    fieldKeys: string[]
}

type SchemaFieldDefinition = Schema | {
    type: SchemaDataTypes
}

interface SchemaFieldDefinitions {
    [key: string]: SchemaFieldDefinition
}

interface SchemaField {
    type: Function
    required?: boolean
    [key: string]: boolean | string
}
interface SchemaFields {
    [key: string]: SchemaField
}

interface SchemaInstance {
    [key: string]: SchemaField
    parse: (data: ModelData) => DataState
    hasKey: (key: string) => boolean
    fields: SchemaFields
    // fieldKeys: string[]
}

interface SchemaInstance {
    fieldKeys: string[]
    parse: (data: ModelData) => DataState
}