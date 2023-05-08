import { Validator } from "./validation.zod"
import { getFirstDefinedProperty } from "./utils"
import { Field } from "./fields"

// TODO: Add support for mixin schemas
export const Schema = (...SchemaConfigs: SchemaConfig[]): SchemaInstance => {
    const fields = SchemaConfigs.pop() as SchemaFieldDefinitions
    const mixins = SchemaConfigs as SchemaInstance[] // TODO: All other configs are mixins NOT IMPLEMENTED YET
    const _fields: SchemaFields = {}

    mixins.forEach(mixin => {
        Object.entries(mixin.fields).forEach(([fieldKey, fieldConfig]) => {
            _fields[fieldKey] = fieldConfig
        })
    })

    Object.entries(fields).forEach(([fieldKey, fieldConfig]) => {
        let _fieldConfig = fieldConfig
        if (fieldConfig === Field[fieldKey]) {
            _fieldConfig = fieldConfig()
        }

        if (typeof fieldConfig === 'function') {
            _fieldConfig = {
                type: fieldConfig
            }
        }

        _fields[fieldKey] = _fieldConfig
    })
    Object.freeze(_fields)

    const _fieldKeys = new Set(Object.keys(_fields))
    const _validator = Validator(_fields)

    const getters: ModuleGetters = {
        get fields() { return _fields },
        get fieldKeys() { return Array.from(_fieldKeys) }
    }

    const api: ModuleApi = {
        parse: (data: ModelData): DataState => {
            const { success, data: parsedData, errors } = _validator.parse(data)
            return {
                success,
                data: parsedData || data,
                errors
            }
        },
        hasKey: (key: string): boolean => _fieldKeys.has(key)
    }

    const proxy = new Proxy(_fields, {
        get(target, key: string, receiver) {
            if (_fieldKeys.has(key)) {
                return Reflect.get(target, key, receiver)
            } else {
                return getFirstDefinedProperty(key, getters, api)
            }
        },

        set(target, key: string, value: SchemaFieldDefinition, receiver) {
            return Reflect.set(target, key, value, receiver)
        }
    })

    return proxy as SchemaInstance
}
