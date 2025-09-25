import { MongoClient, Db, Collection, Document, OptionalUnlessRequiredId } from "mongodb";

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
    await this.client.connect(); // no topology check anymore
    console.log(`✅ Connected to MongoDB database: ${this.dbName}`);
    return this.client.db(this.dbName);
  }

  async getCollection<T extends Document>(collectionName: string): Promise<Collection<T>> {
    const db = await this.connect();
    return db.collection<T>(collectionName);
  }

  async insertDocument<T extends Document>(collectionName: string, document: OptionalUnlessRequiredId<T>) {
    const collection = await this.getCollection<T>(collectionName);
    return collection.insertOne(document);
  }

  async findDocuments<T extends Document>(collectionName: string, query: OptionalUnlessRequiredId<T>): Promise<T[]> {
    const collection = await this.getCollection<T>(collectionName);
    return (await collection.find(query).toArray()) as T[];
  }

  async updateDocument<T extends Document>(collectionName: string, query: OptionalUnlessRequiredId<T>, update: Partial<T>) {
    const collection = await this.getCollection<T>(collectionName);
    return collection.updateOne(query, { $set: update });
  }

  async deleteDocument<T extends Document>(collectionName: string, query: OptionalUnlessRequiredId<T>) {
    const collection = await this.getCollection<T>(collectionName);
    return collection.deleteOne(query);
  }

  async getHistoryByUser(userId: string) {
    const collection = await this.getCollection<Document>("history");
    return collection.find({ userId }).toArray();
  }

  async close() {
    await this.client.close();
  }
}

export default MongoService;
