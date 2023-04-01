import { Schema, model, models } from 'mongoose';

const funnySchema = new Schema({
  day: Number,
  content: [String]
});

const Funny = models.Funny || model('Funny', funnySchema, 'funnys_dev');

export default Funny;