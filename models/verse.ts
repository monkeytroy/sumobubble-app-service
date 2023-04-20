import { Schema, model, models } from 'mongoose';

const verseSchema = new Schema<IVod>({
  verseRef: { type: String, required: true },
  day: Number,
  verses: { type: Map, of: String }
});

let collectionName = 'verses';
if (process.env.IS_DEV) {
  collectionName += '_dev';
}

const Verse = models.Verse || model('Verse', verseSchema, collectionName);

export default Verse;