import { Schema, models, model } from "mongoose";

export enum ChatbaseSeedState {
  unseeded = 'unseeded',            // set to this state when chatsite changes
  seeded = 'seeded',                // next step is setup and seeded with chatsite
  seedfail = 'seedfail'             // attempted to seed but failed.  must try again.
}

export interface ISiteState {
  siteId: string;
  provisioned: Boolean;
  seeded: ChatbaseSeedState;
}

const siteStateSchema = new Schema<ISiteState>({
  siteId: { type: String, required: true, unique: true },
  provisioned: Boolean,
  seeded: String
});

const SiteState = models?.SiteState || model('SiteState', siteStateSchema, 'siteStates');

export default SiteState;