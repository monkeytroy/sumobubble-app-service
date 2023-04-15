import { Schema, model, models } from 'mongoose';

const sectionSchema = new Schema<IBeaconSection>({
  title: { type: String, required: true},
  enabled: { type: Boolean, required: true },
  content: { type: String, trim: true },
  urls: {
    type: Array<String>,
    trim: true, 
    required: false
  },
  props: {
    verseRef: String,
    autoFill: Boolean,
    copyright: String,
    translation: {
      type: String,
      max: 3,
      min: 3
    },
    email: {
      type: Array<String>, 
      default: undefined,
      validate: {
        validator: (val: string) => {
          return val.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) && val.length <= 320;
        },
        message: 'Contact is not a valid email failed'
      }
    },
    categories: {
      type: Array<IContactCategory>,
      default: undefined,
      required: false
    }
  }
});

const configSchema = new Schema<IBeaconConfig>({
  customerId: { type: String, required: true, index: true, unique: true },
  pin: { type: String, required: true },
  isDev: Boolean,
  customer: {
    title: { type: String, required: true },
    theme: {
      primary: String
    },
    logo: {
      url: String,
      align: String
    },
    social: {
      youtube: String
    }
  },
  summary: {
    type: {
      content: String,
      special: String
    },
    required: true
  },
  sections: {
    type: Map,
    of: sectionSchema,
    required: true
  }
});

let collectionName = 'configurations';
if (process.env.IS_DEV) {
  collectionName += '_dev';
}

const Configuration = models?.Configuration || model('Configuration', configSchema, collectionName);

export default Configuration;