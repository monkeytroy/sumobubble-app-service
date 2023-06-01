import mongoose, { mongo } from 'mongoose';

const MONGO_CONNECT = process.env.MONGO_CONNECT;

let mongoConnected = false

const connectMongo = async () => {

  const ready = mongoose?.connection?.readyState;
  mongoConnected = (ready == 1 || ready == 2);

  console.log(`connectMongo:: currently connected ${mongoConnected} readyState ${ready} connection count ${mongoose?.connections?.length}`);
  
  if (MONGO_CONNECT && !mongoConnected) {
    console.log(`Connecting with ${MONGO_CONNECT}`);
    const res = await mongoose.connect(MONGO_CONNECT);
    if (res) {
      mongoConnected = true;
      console.log(`Connected`, res.connection.readyState);
    } else {
      mongoConnected = false;
      console.log(`Failed to connect with ${MONGO_CONNECT}`);
    }
  } 
}

export default connectMongo;
