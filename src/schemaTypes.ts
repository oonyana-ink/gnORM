export const Type = (BaseType: BaseType, baseOptions = {}): TypeDefiner => {
    return (options = {}): TypeDefinition => ({
        base: BaseType,
        validator: () => true,
        default: () => (BaseType as Function)() ,
        ...baseOptions,
        ...options
    })
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const types = {
    ID: Type(String),
    Int: Type(Number),
    Float: Type(Number),
    String: Type(String),
    Boolean: Type(Boolean),
    Date: Type(Date, { validator: (value: string|Date) => value instanceof Date || !isNaN(Date.parse(value)) }),
    DateTime: Type(Date, { validator: (value: string|Date) => value instanceof Date || !isNaN(Date.parse(value)) }),
    Email: Type(String, { validator: (value: string) => emailRegex.test(value) }),
    Object: Type(Object),
    Array: Type(Array),
}