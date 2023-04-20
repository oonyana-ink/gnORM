import { ZodRawShape, z } from 'zod'
import { Error } from './error'

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

export class Validator {
    private Schema: SchemaClassConstructor
    private validationConfig: ZodRawShape

    constructor(SchemaClass: SchemaClassConstructor) {
        this.Schema = SchemaClass
        this.buildValidationConfig()
    }

    get zSchema() {
        return zRoot.object(this.validationConfig)
    }

    buildValidationConfig() {
        const { Schema } = this
        const validationConfig = {} as ZodRawShape

        Object.entries(Schema.fields).forEach(([fieldKey, field]) => {
            const { fieldConfig } = field
            const typeName: string = field.typeClass.name.toLowerCase()

            if (Object.keys(validationKeywords).includes(typeName)) {
                let fieldZSchema = resolveZValidator(zRoot, typeName)()
                Object.entries(fieldConfig).forEach(([key, value]) => {
                    if (validationKeywords[typeName].includes(key)) {
                        const zValidator = resolveZValidator(fieldZSchema, key)
                        fieldZSchema = value === true ? zValidator() : zValidator(value)
                    }
                })
                if (!fieldConfig.required) {
                    fieldZSchema = fieldZSchema.optional()
                }
                validationConfig[fieldKey] = fieldZSchema
            } else if (field.typeClass.validator) {
                validationConfig[fieldKey] = field.typeClass.validator.zSchema
            }
        })

        this.validationConfig = validationConfig
    }

    parse(rawData: RawData) {
        const { success, data, error } = this.zSchema.safeParse(rawData)
        return { success, data, errors: error ? new Error(error) : error }
    }
}

function resolveZValidator(zSchema: { [key: string]: Function }, key: string): Function {
    return zSchema[key].bind(zSchema)
}
