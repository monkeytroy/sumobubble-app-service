import mongoose from 'mongoose';

const MONGO_CONNECT = process.env.MONGO_CONNECT;

const connectMongo = async () => {
  if (MONGO_CONNECT) {
    mongoose.connect(MONGO_CONNECT);
  }
}

export default connectMongo;
