export const Changeset = (data: ModelData, model: ModelInstance) => {
    const _initialData: ModelData = { ...data }
    const _model = model
    const _schema = _model.schema
    const _changes: ModelData = {}
    const _dataState: DataState = { success: true, errors: null }
    const _data: ModelData = {}

    const getters: ModuleGetters = {
        get data() { return { ..._initialData, ..._changes } },
        get isValid() { return _dataState.success },
        get isInvalid() { return !_dataState.success },
        get errors() { return _dataState.errors || null }
    }

    const api: ModuleApi = {
        trackChanges(key: string, value: ModelDataTypes) {
            _changes[key] = value
            api.updateDataState()
        },

        updateDataState() {
            const { success, errors } = _schema.parse({
                ..._initialData,
                ..._changes
            })
            _dataState.success = success
            _dataState.errors = errors
        }
    }


    _schema.fieldKeys.forEach(key => {
        Object.defineProperty(_data, key, {
            value: _initialData[key],
            writable: true,
            enumerable: true,
            configurable: false
        })
    })

    Object.seal(_data)
    api.updateDataState()

    const changeset = new Proxy(_data, {
        get(target, key: string, receiver) {
            if (_schema.fieldKeys.includes(key)) {
                return Reflect.get(target, key, receiver)
            } else {
                return getters[key] || api[key]
            }
        },

        set(target, key: string, value: ModelDataTypes, receiver) {
            api.trackChanges(key, value)
            return Reflect.set(target, key, value, receiver)
        }
    })


    return changeset
}
//     const _data = new Proxy({
//         data: {
//             ..._initialData,
//             ..._changes
//         }
//     }, {
//         get(target, key: string, receiver) {
//             console.log('_data:get', key)
//             const _data = {
//                 ..._initialData,
//                 ..._changes
//             } as ModelData
//             if (key === 'data') {
//                 return _data
//             } else {
//                 return _data[key] || Reflect.get(target, key, receiver)
//             }

//         },
//         set(target, key: string, value: ModelDataTypes, receiver) {
//             console.log('_data:set', key)
//             _changes[key] = value
//             // Reflect.set(target, key, value, receiver)
//             return true
//         }
//     })

//     // const getData = (): ModelData => {
//     //     const _data = {
//     //         ..._initialData,
//     //         ..._changes
//     //     }
//     //     const { success, data, errors } = _schema.parse(_data)

//     //     _dataState.success = success
//     //     _dataState.errors = errors

//     //     return data || _data
//     // }

//     // const getDataState = () => _schema.parse(getData())

//     return new Proxy(_data.data, {
//         get(target, key: string, receiver) {
//             console.log('get', key)
//             return Reflect.get(target, key, receiver)
//         },

//         set(target, key: string, value: ModelDataTypes, receiver) {
//             console.log('changeset:set', key)
//             if (_schema.fieldKeys.includes(key)) {
//                 // _data[key] = value
//                 Reflect.set(target, key, value, receiver)
//                 return true
//             } else {
//                 console.warn(`Changeset: Attempted to set invalid field: ${key}`)
//                 return false
//             }
//         }
//     })
// }


// class BaseChangeset {
//     model: ModelInstance
//     schema: SchemaInstance
//     _initialData: ModelData = {}
//     _changes: ModelData = {}
//     _dataState: DataState

//     constructor(data: ModelData, model: ModelInstance) {
//         this._initialData = data
//         this.model = model
//         this.schema = model._schema
//         this.validateSelf()
//     }

//     get data() {
//         return this.parse({
//             ...this._initialData,
//             ...this._changes
//         })
//     }

//     get errors() { return this._dataState.errors?.byField || null }
//     get isValid() {
//         // return this.model.schema.validate(this.data).isValid
//         return this._dataState.success === true
//     }
//     get isInvalid() {
//         return !this.isValid
//     }
//     get isDirty() {
//         return Object.keys(this._changes).length > 0
//     }
//     get isPristine() {
//         return !this.isDirty
//     }

//     parse(data: ModelData) {
//         const parsedData = {} as ModelData
//         this.schema.fieldKeys.forEach((fieldKey: string) => parsedData[fieldKey] = data[fieldKey])
//         return parsedData
//     }

//     validateSelf() {
//         this._dataState = this.schema.parse({
//             ...this._initialData,
//             ...this._changes
//         })
//     }
6
//     set(keyOrData: string | ModelData, value: any, { validate = true } = {}): boolean {
//         if (typeof keyOrData === 'object') {
//             const data = keyOrData as ModelData
//             Object.entries(data).forEach(([key, value]) => this.set(key, value, { validate: false }))
//             this.validateSelf()
//             return true
//         } else {
//             const key = keyOrData as string
//             if (this.schema.fieldKeys.includes(key)) {
//                 this._changes[key] = value
//                 if (validate) { this.validateSelf() }
//                 return true
//             } else {
//                 console.warn(`Changeset: Attempted to set invalid field: ${key}`)
//                 return false
//             }
//         }
//     }

//     // get isPending() {
//     //     return false
//     // }
//     // get isRejected() {
//     //     return false
//     // }
//     // get isFulfilled() {
//     //     return false
//     // }
//     // get isSettled() {
//     //     return false
//     // }
//     // get isSaving() {
//     //     return false
//     // }
//     // get isDeleted() {
//     //     return false
//     // }
// }

// const ChangesetProxy = new Proxy(BaseChangeset, {
//     construct(target, [data, model, ...args], receiver) {
//         const changeset = new target(data, model) as ChangesetInstance
//         const instanceProxy = changesetInstanceProxy(changeset)
//         return instanceProxy
//     }
// })

// const changesetInstanceProxy = (changeset: ChangesetInstance): ModelData => {
//     // return new Proxy(changeset, {
//     //     get(target, key: string, receiver) {
//     //         // return getFirstDefinedProperty(key, changeset.data).or(Reflect.get(target, key, receiver))
//     //         return Reflect.get(target, key, receiver)
//     //     }
//     // })
//     return changeset
// }

// export const Changeset = ChangesetProxy as unknown as ClassConstructor

