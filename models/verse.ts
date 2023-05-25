import { Schema, model, models } from 'mongoose';

export interface IVod {
  verseRef: string;
  day: number;
  verses: Map<string, string>
}

const verseSchema = new Schema<IVod>({
  verseRef: { type: String, required: true },
  day: Number,
  verses: { type: Map, of: String }
});

const Verse = models.Verse || model('Verse', verseSchema, 'verses');

export default Verse;