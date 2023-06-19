import mongoose, { mongo } from 'mongoose';
import { log } from './log';

const MONGO_CONNECT = process.env.MONGO_CONNECT;

let mongoConnected = false

const connectMongo = async () => {

  const ready = mongoose?.connection?.readyState;
  mongoConnected = (ready == 1 || ready == 2);

  log(`connectMongo:: currently connected ${mongoConnected} 
    readyState ${ready} connection count ${mongoose?.connections?.length}`);
  
  if (MONGO_CONNECT && !mongoConnected) {
    log(`Connecting with ${MONGO_CONNECT}`);
    const res = await mongoose.connect(MONGO_CONNECT);
    if (res) {
      mongoConnected = true;
      log(`Connected`, res.connection.readyState);
    } else {
      mongoConnected = false;
      log(`Failed to connect with ${MONGO_CONNECT}`);
    }
  } 
}

export const disconnectMongo = async () => {
  mongoose.disconnect();
}

export default connectMongo;
