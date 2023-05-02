class BaseRecord {
    model: ModelInstance

    constructor(model: ModelInstance) {
        this.model = model
    }

    get isPending() { return false }
    get isSaving() { return false }
    get isDeleted() { return false }
    get isPersisted() { return false }
    get isRejected() { return false }

    get() { }
    save() { }
    delete() { }
}

const RecordProxy = new Proxy(BaseRecord, {
    construct(target, [model, ...args], receiver: ClassConstructor) {
        const record = new BaseRecord(model) as RecordInstance
        const recordProxy = recordInstanceProxy(record, receiver)
        return recordProxy
    }
})

const recordInstanceProxy = (record: RecordInstance, RecordClass: ClassConstructor) => {
    return new Proxy(record, {
        get(target, key: string, receiver) {
            return Reflect.get(target, key, receiver)
        }
    })
}

export const Record = RecordProxy as unknown as ClassConstructor