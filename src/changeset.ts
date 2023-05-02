class BaseChangeset {
    model: ModelInstance
    schema: SchemaInstance
    _initialData: ModelData = {}
    _changes: ModelData = {}
    _dataState: DataState

    constructor(data: ModelData, model: ModelInstance) {
        this._initialData = data
        this.model = model
        this.schema = model._schema
        this.validateSelf()
    }

    get data() {
        return this.parse({
            ...this._initialData,
            ...this._changes
        })
    }

    get errors() { return this._dataState.errors?.byField || null }
    get isValid() {
        // return this.model.schema.validate(this.data).isValid
        return this._dataState.success === true
    }
    get isInvalid() {
        return !this.isValid
    }
    get isDirty() {
        return Object.keys(this._changes).length > 0
    }
    get isPristine() {
        return !this.isDirty
    }

    parse(data: ModelData) {
        const parsedData = {} as ModelData
        this.schema.fieldKeys.forEach((fieldKey: string) => parsedData[fieldKey] = data[fieldKey])
        return parsedData
    }

    validateSelf() {
        this._dataState = this.schema.parse({
            ...this._initialData,
            ...this._changes
        })
    }

    set(keyOrData: string | ModelData, value: any, { validate = true } = {}): boolean {
        if (typeof keyOrData === 'object') {
            const data = keyOrData as ModelData
            Object.entries(data).forEach(([key, value]) => this.set(key, value, { validate: false }))
            this.validateSelf()
            return true
        } else {
            const key = keyOrData as string
            if (this.schema.fieldKeys.includes(key)) {
                this._changes[key] = value
                if (validate) { this.validateSelf() }
                return true
            } else {
                console.warn(`Changeset: Attempted to set invalid field: ${key}`)
                return false
            }
        }
    }

    // get isPending() {
    //     return false
    // }
    // get isRejected() {
    //     return false
    // }
    // get isFulfilled() {
    //     return false
    // }
    // get isSettled() {
    //     return false
    // }
    // get isSaving() {
    //     return false
    // }
    // get isDeleted() {
    //     return false
    // }
}

const ChangesetProxy = new Proxy(BaseChangeset, {
    construct(target, [data, model, ...args], receiver) {
        const changeset = new target(data, model) as ChangesetInstance
        const instanceProxy = changesetInstanceProxy(changeset)
        return instanceProxy
    }
})

const changesetInstanceProxy = (changeset: ChangesetInstance): ModelData => {
    // return new Proxy(changeset, {
    //     get(target, key: string, receiver) {
    //         // return getFirstDefinedProperty(key, changeset.data).or(Reflect.get(target, key, receiver))
    //         return Reflect.get(target, key, receiver)
    //     }
    // })
    return changeset
}

export const Changeset = ChangesetProxy as unknown as ClassConstructor

