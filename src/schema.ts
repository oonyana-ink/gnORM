import 'reflect-metadata'
import { getFirstDefinedProperty, getOrDefineProperty, splitCamelCase } from "./utils"
import { Validator } from "./validation.zod"


//             Base Class
// -------------------------------------
class BaseSchema {
    static fields: SchemaFields
    static validator: ValidatorInstance
    static fieldKeys: string[]

    static blankDataset(): ModelData {
        const blankData: ModelData = {}
        Object.entries(this.fields).forEach(([fieldKey, field]) => {
            blankData[fieldKey] = field.emptyValue()
        })
        return blankData
    }

    static parse(data: ModelData): DataState {
        const schemaData: ModelData = {}
        Object.entries(this.fields).forEach(([fieldKey, field]) => {
            schemaData[fieldKey] = data[fieldKey]
        })
        return this.validator.parse(schemaData)
    }
}


//              Proxies
// -------------------------------------
const SchemaProxy = new Proxy(BaseSchema, {
    construct(target, args, receiver: ClassConstructor) {
        const schema = new target() as SchemaInstance
        const schemaProxy = schemaInstanceProxy(schema, receiver)
        return schemaProxy
    },

    get(target: ClassConstructor, key: string, receiver) {
        return getFirstDefinedProperty(key, schemaDecorators, (key !== 'prototype' && receiver.prototype)).or(Reflect.get(target, key, receiver))
    }
})

const schemaInstanceProxy = (schema: SchemaInstance, SchemaClass: ClassConstructor) => {
    return new Proxy(schema, {
<<<<<<< HEAD
        get(target, key: string, receiver) {
=======
        get (target, key: string, receiver) {
>>>>>>> 70c4c09 (More groundwork + more tests)
            return getFirstDefinedProperty(key, SchemaClass).or(Reflect.get(target, key, receiver))
        }
    })
}


//              Decorators
// -------------------------------------
const schemaDecorators: schemaDecoratorsMap = {
    define: <TSchema extends Function | SchemaClassConstructor>(SchemaClass: SchemaClassConstructor) => {
        SchemaClass.validator = new Validator(SchemaClass)
    },

    field: function (schemaOrConfig: Object, ...args: any[]): void | any {
        const fieldKey = args[0]
        if (!fieldKey) {
            const config = schemaOrConfig as FieldConfig
            return (schema: Object, fieldKey: string | symbol) => processField(schema, fieldKey as string, config)
        } else {
            const schema = schemaOrConfig as SchemaConstructor
            processField(schema as RawSchemaInstance, fieldKey as string)
        }
    }
}


function processField(SchemaClass: RawSchemaInstance, fieldKey: string, fieldConfig: FieldConfig = {}) {
    const FieldType = fieldConfig.typeClass || Reflect.getMetadata('design:type', SchemaClass, fieldKey)
    const typeName = fieldConfig.typeName || FieldType.name
    const fields = getOrDefineProperty(SchemaClass, 'fields', {})
    const fieldKeys = getOrDefineProperty(SchemaClass, 'fieldKeys', [])
    const label = splitCamelCase(fieldKey).map(word => word[0].toUpperCase() + word.slice(1)).join(' ')

    fieldKeys.push(fieldKey)
    fields[fieldKey] = {
        typeClass: FieldType,
        type: FieldType as Function,
        emptyValue: () => FieldType.blankDataset
            ? FieldType.blankDataset()
            : FieldType(),
        typeName,
        label,
        fieldConfig
    }
}


export const Schema = SchemaProxy as unknown as SchemaClassConstructor
