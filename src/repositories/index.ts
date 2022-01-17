/* eslint-disable no-undef */
import dotenv from 'dotenv';
import { Document } from 'mongodb';
import { Database } from '../db/index';
import { dbOptionsType } from '../types/types';

dotenv.config();

export const dbOptions: dbOptionsType = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

interface ProcessEnv {
  [key: string]: string;
}

const { dbURI } = process.env as ProcessEnv;

export class UserRepository {
  private db = Database;

  public async insertOne(doc: any) {
    const { col, client } = await this.db.connect(dbURI, dbOptions);
    try {
      return await col.insertOne(doc);
    } catch (e) {
      console.log(e);
    } finally {
      await client.close();
    }
  }

  public async insertMany(doc: any, options: any) {
    const { col, client } = await this.db.connect(dbURI, dbOptions);
    try {
      return await col.insertMany(doc, options);
    } catch (e) {
      console.log(e);
    } finally {
      await client.close();
    }
  }

  public async findOne(query: any, options: {}) {
    const { col, client } = await this.db.connect(dbURI, dbOptions);
    try {
      return await col.findOne(query, options);
    } catch (e) {
      console.log(e);
    } finally {
      await client.close();
    }
  }

  public async find(query: any, options: any) {
    const { col, client } = await this.db.connect(dbURI, dbOptions);
    try {
      return await col.find(query, options).toArray();
    } catch (e) {
      console.log(e);
    } finally {
      await client.close();
    }
  }

  public async updateMany(filter: any, update: any, options: any) {
    const { col, client } = await this.db.connect(dbURI, dbOptions);
    try {
      return await col.updateMany(filter, update, options);
    } catch (e) {
      console.log(e);
    } finally {
      await client.close();
    }
  }

  public async updateOne(filter: any, update: any, options: any) {
    const { col, client } = await this.db.connect(dbURI, dbOptions);
    try {
      return await col.updateOne(filter, update, options);
    } catch (e) {
      console.log(e);
    } finally {
      await client.close();
    }
  }

  public async findOneAndUpdate(filter: any, updateDoc: any) {
    const { col, client } = await this.db.connect(dbURI, dbOptions);
    try {
      return await col.findOneAndUpdate(filter, updateDoc);
    } catch (e) {
      console.log(e);
    } finally {
      await client.close();
    }
  }

  public async deleteOne(filter: any, options: any) {
    const { col, client } = await this.db.connect(dbURI, dbOptions);
    try {
      return await col.deleteOne(filter, options);
    } catch (e) {
      console.log(e);
    } finally {
      await client.close();
    }
  }

  public async deleteMany(filter: any, options: any) {
    const { col, client } = await this.db.connect(dbURI, dbOptions);
    try {
      return await col.deleteMany(filter, options);
    } catch (e) {
      console.log(e);
    } finally {
      await client.close();
    }
  }
}
