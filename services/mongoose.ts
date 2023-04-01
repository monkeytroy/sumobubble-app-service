import mongoose from 'mongoose';

const MONGO_CONNECT = process.env.MONGO_CONNECT;

const connectMongo = async () => {
  console.log(`Connecting with ${MONGO_CONNECT}`);
  if (MONGO_CONNECT) {
    let res = await mongoose.connect(MONGO_CONNECT);
    console.log(`Connecting with ${MONGO_CONNECT} result: `, res);
  } 
}

export default connectMongo;
