import Ajv, { ValidateFunction } from 'ajv'
import addFormats from 'ajv-formats'
import { getOrDefineProperty } from './utils';

const validationKeywords = [
    "type",

    // numbers
    "exclusiveMaximum",
    "exclusiveMinimum",
    "maximum",
    "minimum",
    "multipleOf",

    // strings
    "maxLength",
    "minLength",
    "format",
    "pattern",

    // arrays
    "additionalItems",
    "contains",
    "items",
    "maxContains",
    "maxItems",
    "minContains",
    "minItems",
    "prefixItems",
    "uniqueItems",

    // objects
    "additionalProperties",
    "dependentRequired",
    "dependentSchemas",
    "discriminator",
    "maxProperties",
    "minProperties",
    "patternProperties",
    "properties",
    "propertyNames",
    "unevaluatableProperties",

    // all types
    "const",
    "enum",

    // compound keywords
    "allOf",
    "anyOf",
    "else",
    "if",
    "not",
    "oneOf",
    "then",
];


const ajv = new Ajv({ allErrors: true, strict: true })
addFormats(ajv)

export function getSchemaValidator(schema: SchemaInstance): ValidateFunction {
    const schemaValidator = ajv.compile(schema.validationConfig)
    return schemaValidator
}

export function attachFieldValidators(schemaPrototype: SchemaInstance, field: SchemaField) {
    const { fieldConfig } = field
    const schemaValidationConfig = getOrDefineProperty(schemaPrototype, 'validationConfig', {
        type: "object",
        properties: {},
        required: []
    })

    let fieldValidationConfig = {
        type: field.typeClass.name.toLowerCase(),
    } as ValidationConfig

    Object.entries(fieldConfig).forEach(([key, value]) => {
        if (validationKeywords.includes(key)) {
            fieldValidationConfig[key] = value
        }
    })

    schemaValidationConfig.properties[field.key] = fieldValidationConfig

    if (fieldConfig.required) {
        schemaValidationConfig.required.push(field.key)
    }
}

const errorMessages: errorMessagesMap = {
    required: (fieldLabel: string) => `${fieldLabel} is required`,
    type: (fieldLabel: string, params: errorParams) => `${fieldLabel} must be a ${params.type}`,
    format: (fieldLabel: string, params: errorParams) => `${fieldLabel} must be a valid ${params.format}`,
    maximum: (fieldLabel: string, params: errorParams) => `${fieldLabel} must be greater than, or equal to, ${params.limit}`,
    enum: (fieldLabel: string, params: errorParams) => `${fieldLabel} must be one of the following: ${params.allowedValues.join(', ')}`,
    minimum: (fieldLabel: string, params: errorParams) => `${fieldLabel} must be less than, or equal to, ${params.limit}`,
    maxLength: (fieldLabel: string, params: errorParams) => `${fieldLabel} must be less than, or equal to, ${params.limit} characters`,
    minLength: (fieldLabel: string, params: errorParams) => `${fieldLabel} must be greater than, or equal to, ${params.limit} characters`,
    pattern: (fieldLabel: string, params: errorParams) => `${fieldLabel} must match the pattern ${params.pattern}`,
    multipleOf: (fieldLabel: string, params: errorParams) => `${fieldLabel} must be a multiple of ${params.multipleOf}`,
    maxItems: (fieldLabel: string, params: errorParams) => `${fieldLabel} must have less than, or equal to, ${params.limit} items`,
    minItems: (fieldLabel: string, params: errorParams) => `${fieldLabel} must have more than, or equal to, ${params.limit} items`,
    uniqueItems: (fieldLabel: string, params: errorParams) => `${fieldLabel} must have unique items`,
    maxProperties: (fieldLabel: string, params: errorParams) => `${fieldLabel} must have less than, or equal to, ${params.limit} properties`,
    minProperties: (fieldLabel: string, params: errorParams) => `${fieldLabel} must have more than, or equal to, ${params.limit} properties`,
    additionalProperties: (fieldLabel: string, params: errorParams) => `${fieldLabel} must not have additional properties`,
    additionalItems: (fieldLabel: string, params: errorParams) => `${fieldLabel} must not have additional items`,
    contains: (fieldLabel: string, params: errorParams) => `${fieldLabel} must contain at least one item that matches the schema`,
    propertyNames: (fieldLabel: string, params: errorParams) => `${fieldLabel} must have valid property names`,
    dependencies: (fieldLabel: string, params: errorParams) => `${fieldLabel} must have valid dependencies`,
}

function processErrors(errors: any[], fields: SchemaField[]): modelErrors {
    const parsedErrors: modelErrors = {}
    errors.forEach((error) => {
        const { instancePath, keyword, params } = error
        const fieldKey = keyword === 'required'
            ? params.missingProperty
            : instancePath.split('/').pop()
        const fieldLabel = fields.find(field => field.key === fieldKey)?.label

        parsedErrors[fieldKey] = {
            keyword,
            message: errorMessages[keyword](fieldLabel, params)
        }
    })
    return parsedErrors
}

// export function setupSchemaValidation(schema: RawSchemaInstance): SchemaInstance {
//     console.log('setupSchemaValidation', schema)
//     schema.fields.forEach((field: SchemaField) => {
//         const fieldConfig = schema[field.key] || {}
//         Object.assign(field.fieldConfig, fieldConfig)
//         attachFieldValidators(schema.__proto__, field)
//     })
//     console.log('schema.validationConfig --->')
//     console.dir(schema.validationConfig)
//     schema.__proto__.validator = {
//         validate: ajv.compile(schema.validationConfig)
//     }
//     schema.validate = function (data: ModelData) {
//         console.log('schema.validate', data)
//         const valid = this.validator.validate(data)
//         const { errors } = this.validator.validate
//         this.errors = processErrors(errors || [], this.fields)
//         return valid
//     }

//     return schema as SchemaInstance
// }