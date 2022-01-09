require("dotenv").config();
const { Database } = require("../db/index");

const dbOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

const { dbURI } = process.env;

class UserRepository {
  static db = Database;

  static async insertOne(doc) {
    const { collection, client } = await this.db.connect(dbURI, dbOptions);
    try {
      return await collection.insertOne(doc);
    } catch (e) {
      console.log(e);
    } finally {
      await client.close();
    }
  }

  static async insertMany(docs, options) {
    const { collection, client } = await this.db.connect(dbURI, dbOptions);
    try {
      return await collection.insertMany(docs, options);
    } catch (e) {
      console.log(e);
    } finally {
      await client.close();
    }
  }

  static async findOne(query, options) {
    const { collection, client } = await this.db.connect(dbURI, dbOptions);
    try {
      return await collection.findOne(query, options);
    } catch (e) {
      console.log(e);
    } finally {
      await client.close();
    }
  }

  static async find(query, options) {
    const { collection, client } = await this.db.connect(dbURI, dbOptions);
    try {
      return await collection.find(query, options).toArray();
    } catch (e) {
      console.log(e);
    } finally {
      await client.close();
    }
  }

  static async updateMany(filter, update, options) {
    const { collection, client } = await this.db.connect(dbURI, dbOptions);
    try {
      return await collection.updateMany(filter, update, options);
    } catch (e) {
      console.log(e);
    } finally {
      await client.close();
    }
  }

  static async updateOne(filter, update, options) {
    const { collection, client } = await this.db.connect(dbURI, dbOptions);
    try {
      return await collection.updateOne(filter, update, options);
    } catch (e) {
      console.log(e);
    } finally {
      await client.close();
    }
  }

  static async findOneAndUpdate(filter, updateDoc) {
    const { collection, client } = await this.db.connect(dbURI, dbOptions);
    try {
      return await collection.findOneAndUpdate(filter, updateDoc);
    } catch (e) {
      console.log(e);
    } finally {
      await client.close();
    }
  }

  static async deleteOne(filter, options) {
    const { collection, client } = await this.db.connect(dbURI, dbOptions);
    try {
      return await collection.deleteOne(filter, options);
    } catch (e) {
      console.log(e);
    } finally {
      await client.close();
    }
  }

  static async deleteMany(filter, options) {
    const { collection, client } = await this.db.connect(dbURI, dbOptions);
    try {
      return await collection.deleteMany(filter, options);
    } catch (e) {
      console.log(e);
    } finally {
      await client.close();
    }
  }
}

module.exports = {
  UserRepository,
  dbOptions,
};
