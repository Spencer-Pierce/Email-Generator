import { MongoClient, Db, Collection } from "mongodb";

class MongoService {
  private client: MongoClient;
  private dbName: string;

  constructor(uri: string, dbName: string) {
    if (!uri) {
      throw new Error("❌ MongoDB URI is missing. Did you load .env?");
    }
    this.client = new MongoClient(uri);
    this.dbName = dbName;
  }

  async connect(): Promise<Db> {
    // In v4+, just connect() — MongoClient handles pooling
    if (!this.client.topology?.isConnected()) {
      await this.client.connect();
      console.log(`✅ Connected to MongoDB database: ${this.dbName}`);
    }
    return this.client.db(this.dbName);
  }

  async getCollection<T>(collectionName: string): Promise<Collection<T>> {
    const db = await this.connect();
    return db.collection<T>(collectionName);
  }

  async insertDocument<T>(collectionName: string, document: any) {
    const collection = await this.getCollection(collectionName);
    return collection.insertOne(document);
  }

  async findDocuments<T>(collectionName: string, query: any): Promise<T[]> {
    const collection = await this.getCollection(collectionName);
    // Use `as T[]` to tell TypeScript the documents are of type T
    return (await collection.find(query).toArray()) as T[];
  }

  async updateDocument(collectionName: string, query: any, update: any) {
    const collection = await this.getCollection(collectionName);
    return collection.updateOne(query, { $set: update });
  }

  async deleteDocument(collectionName: string, query: any) {
    const collection = await this.getCollection(collectionName);
    return collection.deleteOne(query);
  }

  async getHistoryByUser(userId: string) {
    if (!this.client) throw new Error("MongoDB not connected");
    return this.client
      .db(this.dbName)
      .collection("history")
      .find({ userId })
      .toArray();
  }


  async close() {
    await this.client.close();
  }
}

export default MongoService;
