// export const privatePropertyConfig = {
//     enumerable: false,
//     configurable: false,
//     writable: false
// }

export function splitCamelCase(str: string): string[] {
    return str.split(/(?=[A-Z])/);
}

export function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


export function getFirstDefinedProperty(key: string, ...objects: any[]) {
    for (const obj of objects) {
        if (obj[key] !== undefined) {
            return obj[key]
        }
    }
}

// export function updateClassName(target: any, className: string) {
//     Object.defineProperty(target, 'name', {
//         value: className,
//         writable: false
//     });
// }

// export function getOrDefineProperty(target: Object, propName: string, propDefault: any) {
//     const existingDesc = Object.getOwnPropertyDescriptor(target, propName);
//     if (existingDesc) {
//         return existingDesc.value;
//     } else {
//         Object.defineProperty(target, propName, {
//             value: propDefault,
//             writable: true
//         });
//         return propDefault;
//     }
// }

// export function makePropertyPrivate(target: Object, propName: string) {
//     const existingDesc = Object.getOwnPropertyDescriptor(target, propName);
//     if (existingDesc) {
//         Object.defineProperty(target, propName, {
//             ...existingDesc,
//             enumerable: false,
//             configurable: false,
//         });
//     }
// }

// export function addHiddenProperties(target: Object, props: Object) {
//     Object.entries(props).forEach(([key, value]) => {
//         Object.defineProperty(target, key, {
//             value,
//             ...privatePropertyConfig
//         })
//     })
// }

// export function mapDataToFields(data: ModelData, fields: SchemaField[]) {
//     const mappedData: ModelData = {}
//     Object.entries(data).forEach(([key, value]) => {
//         const field = fields.find(field => field.key === key)
//         if (field) {
//             mappedData[key] = value
//         }
//     })
//     return mappedData
// }

// export function getAllDesignMetadata(target: any, key: string | symbol) {
//     const metadata = {
//         designType: Reflect.getMetadata('design:type', target, key),
//         designParamtypes: Reflect.getMetadata('design:paramtypes', target, key),
//         designReturnType: Reflect.getMetadata('design:returntype', target, key),
//     }
//     return metadata
// }

// export function instantiateAndBindClassProperty(Class: any, key: string | symbol) {
//     const { designType: PropertyClass } = getAllDesignMetadata(Class, key)
//     const property = new PropertyClass()
//     const ClassConstructor = Class.constructor as ClassConstructor
//     addHiddenProperties(ClassConstructor, {
//         [key as string]: property
//     })

// }

// export function defineAndDecorateClass(BaseClass: ClassConstructor) {
//     return function <ClassDefinition extends Function>(ModelClassDefinition: ClassDefinition): ClassDefinition {
//         const classObj = {
//             [ModelClassDefinition.name]: class extends BaseClass { }
//         }
//         return classObj[ModelClassDefinition.name] as unknown as ClassDefinition
//     }
// }

// export function isClass(fn: Function) {
//     return typeof fn === 'function'
//         && /^class\s/.test(Function.prototype.toString.call(fn));
// }

// export function getBoundObjectProperty(object: objectInstance, propKey: string) {
//     let objectProperty = object[propKey]
//     if (typeof objectProperty === 'function' && !isClass(objectProperty)) {
//         const objectFunction = objectProperty
//         objectProperty = (...args: any[]) => objectFunction.apply(object, args)
//     }
//     return objectProperty
// }

// export function getFirstDefinedProperty(propKey: string, ...objects: Object[]) {
//     const objectWithProp = objects.find((object: objectInstance) => object[propKey] !== undefined) as objectInstance
//     return {
//         or: (defaultProperty: any) => objectWithProp !== undefined ? getBoundObjectProperty(objectWithProp, propKey) : defaultProperty
//     }
// }

// export function getProxiedSchemaValue(propKey: string, conifg: getProxiedSchemaValueConfig) {
//     const { primarySource, schemaFields, fallbackSources, defaultValue } = conifg
//     if (schemaFields.includes(propKey)) {
//         return primarySource[propKey]
//     } else {
//         return getFirstDefinedProperty(propKey, ...fallbackSources).or(defaultValue)
//     }
// }


// export function mapProperties(propKeys: string[], source: objectInstance) {
//     const mappedProperties = {} as objectInstance
//     propKeys.forEach(propKey => mappedProperties[propKey] = source[propKey])
//     return mappedProperties
// }