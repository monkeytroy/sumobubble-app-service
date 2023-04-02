import { Schema, model, models } from 'mongoose';

const funnySchema = new Schema({
  day: Number,
  content: {type: String, required: true }
});

let collectionName = 'funnys';
if (process.env.IS_DEV) {
  collectionName += '_dev';
}

const Funny = models.Funny || model('Funny', funnySchema, collectionName);

export default Funny;