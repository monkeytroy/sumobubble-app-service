import { Db, MongoClient } from "mongodb";

const MONGO_CONNECT = process.env.MONGO_CONNECT;
const MONGO_DB = process.env.MONGO_DB;

let cachedClient: MongoClient;
let cachedDb: Db;

export const connectToDb = async () => {

  if (cachedClient && cachedDb) {
    // load from cache
    return {
      client: cachedClient,
      db: cachedDb,
    };
  }

  // set the connection options
  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  // check the MongoDB URI
  if (!MONGO_CONNECT) {
    throw new Error("Define the MONGODB_URI environmental variable");
  }
  // check the MongoDB DB
  if (!MONGO_DB) {
    throw new Error("Define the MONGODB_DB environmental variable");
  }

  // Connect to cluster
  let client = new MongoClient(MONGO_CONNECT);
  await client.connect();
  let db = client.db(MONGO_DB);

  // set cache
  cachedClient = client;
  cachedDb = db;

  return {
    client: cachedClient,
    db: cachedDb,
  };

}

