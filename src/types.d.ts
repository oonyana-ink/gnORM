interface DataState {
    data?: ModelData
    success: boolean
    errors: null | FieldIssues
}

interface FieldIssue {
    code: string
    message: string
}

interface FieldIssues {
    [key: string]: FieldIssue
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

type ModelDataTypes = string | number | boolean | Object | Array<ModelDataTypes>
interface ModelData {
    [key: string]: ModelDataTypes
}

interface ModelInstance {
    schema: SchemaInstance
}

interface ModuleApi {
    [key: string]: Function
}

interface ModuleGetters {
    [key: string]: any
}

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
    fields: SchemaFields
    fieldKeys: string[]
}

interface SchemaInstance {
    fieldKeys: string[]
    parse: (data: ModelData) => DataState
}