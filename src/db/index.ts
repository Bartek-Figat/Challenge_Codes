import { Callback, Collection, Db, MongoClient } from 'mongodb';
import { Index } from '../types/types';

const index: Readonly<Index> = {
  Db: 'test',
  Users: 'user',
};

export class Database {
  static async connect(dbURI: string, dbOptions: Record<string, unknown>): Promise<any> {
    const client: MongoClient = new MongoClient(dbURI, dbOptions);
    await client.connect();
    const col: Collection = client.db(index.Db).collection(index.Users);
    return { col, client };
  }
}
