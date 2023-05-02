
//             Base Class

import { getDatasource } from "./datasource"

// -------------------------------------
class BaseCollection {
    Model: ModelClassConstructor
    get datasource(): DatasourceInstance { return getDatasource(this.Model.datasource) }
    get collectionName() { return this.Model.name + 's' }
    async create(data: ModelData) {
        this.datasource.create(this.collectionName, data)
    }
    async createMany() { }
    async update() { }
    async updateMany() { }
    async get() { }
    async getMany() { }
    async delete() { }
    async deleteMany() { }

}

//              Proxies
// -------------------------------------
const CollectionProxy = new Proxy(BaseCollection, {
    construct(target, [ModelClass, ...args], receiver: ClassConstructor) {
        receiver.prototype.Model = ModelClass
        console.log('collection:construct', ModelClass.name)
        const collection = new target() as CollectionInstance
        collection.Model = ModelClass
        const collectionProxy = collectionInstanceProxy(collection, receiver)
        return collectionProxy
    }
})
export const Collection = CollectionProxy as unknown as CollectionClassConstructor


const collectionInstanceProxy = (collection: CollectionInstance, CollectionClass: ClassConstructor) => {
    return new Proxy(collection, {
        get(target, key: string, receiver) {
            return Reflect.get(target, key, receiver)
        }
    })
}