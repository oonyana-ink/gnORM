import { jest } from "@jest/globals";
import { Datasource } from "../../src";

const asyncDatasourceMethod = async (payload: PayloadInstance) => payload
const asyncDatasourceManyMethod = async (payloads: PayloadInstance[]) => payloads
const asyncGetManyDatasourceMethod = async (payload: PayloadInstance) => [payload]
const datasourceMocks = {
    create: jest.fn(asyncDatasourceMethod),
    createMany: jest.fn(asyncDatasourceManyMethod),
    get: jest.fn(asyncDatasourceMethod),
    getMany: jest.fn(asyncGetManyDatasourceMethod),
    update: jest.fn(asyncDatasourceMethod),
    updateMany: jest.fn(asyncDatasourceManyMethod),
    delete: jest.fn(asyncDatasourceMethod),
    deleteMany: jest.fn(asyncDatasourceManyMethod),
}
export const mockDatasource = () => {
    return {
        datasource: Datasource({
            name: 'primary',
            ...datasourceMocks
        }),
        mocks: datasourceMocks
    }
}