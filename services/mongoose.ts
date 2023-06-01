import mongoose, { mongo } from 'mongoose';

const MONGO_CONNECT = process.env.MONGO_CONNECT;

let mongoConnected = false

const connectMongo = async () => {
  console.log(`Connecting with ${MONGO_CONNECT}`);
  if (MONGO_CONNECT && !mongoConnected) {
    const res = await mongoose.connect(MONGO_CONNECT);
    if (res) {
      mongoConnected = true;
      console.log(`Connected with ${MONGO_CONNECT}`);
    } else {
      mongoConnected = false;
      console.log(`Failed to connect with ${MONGO_CONNECT}`);
    }
  } 
}

export default connectMongo;
