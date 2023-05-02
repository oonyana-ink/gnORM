import { Schema, ZodRawShape, ZodSchema, z } from 'zod'
import { ValidationError } from './error'

const zRoot = z as unknown as { [key: string]: Function }
const validationKeywords = {
    string: ['max', 'min', 'length', 'email', 'url', 'emoji', 'uuid', 'regex', 'includes', 'startsWith', 'endsWith', 'datetime', 'ip', 'optional', 'nullable'],
    number: ['gt', 'gte', 'lt', 'lte', 'int', 'positive', 'nonnegative', 'negative', 'nonpositive', 'multipleOf', 'finite', 'safe', 'optional', 'nullable'],
    boolean: ['optional', 'nullable'],
    date: ['min', 'max', 'optional', 'nullable'],
    enum: ['optional', 'nullable'],
    nativeEnum: ['optional', 'nullable'],
    symbol: ['optional', 'nullable'],
    array: ['nonempty', 'min', 'max', 'length', 'optional', 'nullable'],
    tuple: ['optional', 'nullable'],
    object: ['optional', 'nullable']
} as { [key: string]: string[] }

export const Validator = (fields: SchemaFields) => {
    const _fields = fields
    const _validationConfig = buildValidationConfig(_fields)

    const getters: ModuleGetters = {
        get validationSchema() { return zRoot.object(_validationConfig) },
    }

    const api: ModuleApi = {
        parse(rawData: ModelData): DataState {
            const { success, data, error } = getters.validationSchema.safeParse(rawData)
            return {
                success,
                data,
                errors: error ? ValidationError(error) : null
            }
        }
    }

    return new Proxy(api, {
        get(target, key: string, receiver) {
            return getters[key] || Reflect.get(target, key, receiver)
        }
    })
}

const resolveZodValidator = (zodSchema: { [key: string]: Function }, key: string): Function => {
    return zodSchema[key].bind(zodSchema)
}

const buildValidationConfig = (_fields: SchemaFields): ZodRawShape => {
    const _validationConfig = {} as ZodRawShape

    Object.entries(_fields).forEach(([fieldKey, field]) => {
        const typeName: string = field.type.name.toLowerCase()
        const validationOptions = validationKeywords[typeName]
        if (validationOptions) {
            let fieldZodSchema = zRoot[typeName]()
            Object.entries(field).forEach(([key, value]) => {
                if (validationOptions.includes(key) && value !== null && value !== false) {
                    const zValidator = resolveZodValidator(fieldZodSchema, key)
                    fieldZodSchema = value === true ? zValidator() : zValidator(value)
                }
            })
            _validationConfig[fieldKey] = fieldZodSchema
        }
    })

    return _validationConfig
}

// export class Validator {
//     private Schema: SchemaClassConstructor
//     private validationConfig: ZodRawShape

//     constructor(SchemaClass: SchemaClassConstructor) {
//         this.Schema = SchemaClass
//         this.buildValidationConfig()
//     }

//     get zSchema() {
//         return zRoot.object(this.validationConfig)
//     }

//     buildValidationConfig() {
//         const { Schema } = this
//         const validationConfig = {} as ZodRawShape

//         Object.entries(Schema.fields).forEach(([fieldKey, field]) => {
//             const { fieldConfig } = field
//             const typeName: string = field.typeClass.name.toLowerCase()
//             if (Object.keys(validationKeywords).includes(typeName)) {
//                 let fieldZSchema = resolveZValidator(zRoot, typeName)()
//                 Object.entries(fieldConfig).forEach(([key, value]) => {
//                     if (validationKeywords[typeName].includes(key)) {
//                         const zValidator = resolveZValidator(fieldZSchema, key)
//                         fieldZSchema = value === true ? zValidator() : zValidator(value)
//                     }
//                 })
//                 if (!fieldConfig.required) {
//                     fieldZSchema = fieldZSchema.optional()
//                 }
//                 validationConfig[fieldKey] = fieldZSchema
//             } else if (field.typeClass.validator) {
//                 validationConfig[fieldKey] = field.typeClass.validator.zSchema
//             }
//         })

//         this.validationConfig = validationConfig
//     }

//     parse(rawData: RawData) {
//         const { success, data, error } = this.zSchema.safeParse(rawData)
//         return { success, data, errors: error ? new Error(error) : error }
//     }
// }


