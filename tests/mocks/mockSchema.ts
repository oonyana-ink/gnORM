export const mockSchema = {
    fieldKeys: ['id', 'name'],
    emptyDataset: () => ({
        id: '',
        name: ''
    }),

    parse(data) {
        return {
            success: true,
            data,
            errors: {
                id: {
                    code: 'mockError',
                    message: 'mockError'
                }
            }
        }
    }
} as SchemaInstance