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

const Funny = models.Funny || model<IFunny>('Funny', funnySchema, 'funnys');

export default Funny;