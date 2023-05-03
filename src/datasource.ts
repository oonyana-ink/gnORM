// import { getFirstDefinedProperty, mapProperties } from './utils'

// const datasources = {} as objectInstance
// export const getDatasource = (key: string = 'primary') => {
// <<<<<<< HEAD
// =======
//     console.log('getDatasource', key, datasources)
// >>>>>>> 8b11997 (Collections and datasources)
//     return datasources[key]
// }

// //             Base Class
// // -------------------------------------
// class BaseDatasource {
//     key: string = 'primary'
//     constructor() {
//         datasources[this.key] = this
// <<<<<<< HEAD
//         console.log('datasources', datasources)
//     }
//     async create(collectionName: string, data: ModelData) {
// =======
//         console.dir(this)
//     }
//     async create(collectionName: string, data: ModelData) {
//         console.log('BaseDatasource:get', collectionName, data)
// >>>>>>> 8b11997 (Collections and datasources)
//         return data
//     }
//     async createMany() { }
//     async update() { }
//     async updateMany() { }
//     async get() { }
//     async getMany() { }
//     async delete() { }
//     async deleteMany() { }
// }

// export const Datasource = BaseDatasource as unknown as DatasourceClassConstructor
