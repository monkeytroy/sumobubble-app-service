import { Schema, model, models } from 'mongoose';

export interface IFunny {
  day: number,
  content: string,
  urls: string[]
}

const funnySchema = new Schema({
  day: Number,
  content: {type: String, required: true },
  urls: [String]
});

let collectionName = 'funnys';
if (process.env.IS_DEV) {
  collectionName += '_dev';
}

const Funny = models.Funny || model<IFunny>('Funny', funnySchema, collectionName);

export default Funny;