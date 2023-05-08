export const Field: FieldTypeConfigs = {
    String: (fieldConfig = {}) => ({ ...fieldConfig, type: String }),
    Email: (fieldConfig = {}) => ({ ...fieldConfig, type: String, email: true }),
    Number: (fieldConfig = {}) => ({ ...fieldConfig, type: Number })
}