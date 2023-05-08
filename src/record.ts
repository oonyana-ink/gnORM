import { getFirstDefinedProperty } from "./utils"
import { Payload } from "./payload"

export const Record = (model: ModelInstance): RecordInstance => {
    const record = {}
    const _recordState = {
        persisted: false
    }

    const updateRecordState = (response: PayloadInstance) => {
        _recordState.persisted = response.meta.persisted
    }

    const getters: ModuleGetters = {
        get isPersisted() { return _recordState.persisted },
    }

    const api: ModuleApi = {
        async fetch() { },
        async create() { },
        async save() {
            console.log('record:save > model.isValid', model.isValid)
            if (model.isValid) {
                console.log('>>> saving', model)
                const datasource = model.datasource
                const payload = Payload({ data: model.changes })
                const response = model.isPersisted ? await datasource.update(payload) : await datasource.create(payload)
                model.set(response.data, { reset: true })
                updateRecordState(response)
            }
            return model
        },
        async update() { },
        async delete() { }
    }

    const recordProxy = new Proxy(record, {
        get(target, key: string, receiver) {
            return Reflect.get(target, key, receiver) || getFirstDefinedProperty(key, getters, api)
        }
    })
    return recordProxy as unknown as RecordInstance
}

// class BaseRecord {
//     model: ModelInstance

//     constructor(model: ModelInstance) {
//         this.model = model
//     }

//     get isPending() { return false }
//     get isSaving() { return false }
//     get isDeleted() { return false }
//     get isPersisted() { return false }
//     get isRejected() { return false }

//     get() { }
//     save() { }
//     delete() { }
// }

// const RecordProxy = new Proxy(BaseRecord, {
//     construct(target, [model, ...args], receiver: ClassConstructor) {
//         const record = new BaseRecord(model) as RecordInstance
//         const recordProxy = recordInstanceProxy(record, receiver)
//         return recordProxy
//     }
// })

// // const recordInstanceProxy = (record: RecordInstance, RecordClass: ClassConstructor) => {
//     return new Proxy(record, {
//         get(target, key: string, receiver) {
//             return Reflect.get(target, key, receiver)
//         }
//     })
// }

// export const Record = RecordProxy as unknown as ClassConstructor