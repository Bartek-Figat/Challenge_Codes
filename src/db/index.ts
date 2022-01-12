import { Collection, MongoClient, MongoClientOptions, MongoOptions } from 'mongodb'
import { Index } from '../types/types';

const index: Index = {
    Db: 'test',
    Users: 'user',
}

export class Database {
    static async connect(dbURI: string, dbOptions: {}) {
        const client: MongoClient = new MongoClient(dbURI, dbOptions)
        await client.connect()
        const collection = client.db(index.Db).collection(index.Users)
        return { collection, client }
    }
}
