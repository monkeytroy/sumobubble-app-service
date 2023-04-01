import mongoose from 'mongoose';

const MONGO_CONNECT = process.env.MONGO_CONNECT;

const connectMongo = async () => {
  console.log(`Connecting with ${MONGO_CONNECT}`);
  if (MONGO_CONNECT) {
    let res = await mongoose.connect(MONGO_CONNECT);
    if (res) {
      console.log(`Connected with ${MONGO_CONNECT}`);
    } else {
      console.log(`Failed to connect with ${MONGO_CONNECT}`);
    }
  } 
}

export default connectMongo;
