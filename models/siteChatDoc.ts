import { Schema, model, models } from 'mongoose';

export interface ISiteChatDoc {
  _id?: string;
  customerId: string;
  origFilename: string;
  filenameKey: string;
  doc: {};
}

const siteChatDocSchema = new Schema<ISiteChatDoc>({
  customerId: { type: String, required: true },
  origFilename: { type: String, required: true },
  filenameKey: { type: String, required: true },
  doc: {
    type: {},
    required: true
  }
});

const SiteChatDoc = models?.SiteChatDoc || model('SiteChatDoc', siteChatDocSchema, 'sitechatdocs');

export default SiteChatDoc;
