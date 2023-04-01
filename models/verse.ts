import { Schema, model, models } from 'mongoose';

const verseSchema = new Schema({
  verseRef: { type: String, required: true },
  day: Number,
  verses: { type: Map, of: String }
});

const Verse = models.Verse || model('Verse', verseSchema, 'verses_dev');

export default Verse;