import { getFirstDefinedProperty } from "./utils"

export const Changeset = (data: ModelData, schema: SchemaInstance): ChangesetInstance => {
    const _initialData: ModelData = { ...data }
    const _schema = schema
    const _dataState: DataState = { success: true, errors: null }
    const _data: ModelData = {}

    let _changes: ModelData = {}

    const getters: ModuleGetters = {
        get data() { return { ..._initialData, ..._changes } },
        get isValid() {
            api.updateDataState()
            return _dataState.success
        },
        get isInvalid() { return !getters.isValid },
        get errors() { return _dataState.errors || null },
        get isDirty() { return Object.keys(_changes).length > 0 },
        get changes() { return _changes }
    }

    const api: ModuleApi = {
        trackChanges(key: string, value: ModelDataTypes) {
            if (_initialData[key] !== value) {
                _changes[key] = value
            } else {
                delete _changes[key]
            }
            api.updateDataState()
        },

        updateDataState() {
            const { success, errors } = _schema.parse({
                ..._initialData,
                ..._changes
            })
            _dataState.success = success
            _dataState.errors = errors
        },

        set(data: ModelData, meta?: ChangesetSetMeta) {
            if (!data) { return } // FIXME: Should probably throw an error here
            Object.keys(data).forEach(key => {
                changeset[key] = data[key]
            })
            if (meta?.reset) { api.reset() }
            return changeset
        },

        reset() {
            Object.assign(_initialData, _changes)
            _changes = {}
            api.updateDataState()
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
            if (_schema.hasKey(key)) {
                return Reflect.get(target, key, receiver)
            } else {
                return getFirstDefinedProperty(key, getters, api)
            }
        },

        set(target, key: string, value: ModelDataTypes, receiver) {
            api.trackChanges(key, value)
            return Reflect.set(target, key, value, receiver)
        }
    })


    return changeset as unknown as ChangesetInstance
}
