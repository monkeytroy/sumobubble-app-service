import { Schema, model, models } from 'mongoose';

export enum Membership {
  Preview = 'preview',
  Trial = 'trial',
  Basic = 'basic',
  Plus = 'plus'
}

export enum SubscriptionStatus {
  Active = 'active',
  Inactive = 'inactive',
  Incomplete = 'incomplete'
}

export interface IBeaconCustomer {
  email: string;
  customerId: string;
  name: string;
  subscription: {
    id?: string;
    customerId?: string;
    status: SubscriptionStatus;
  },  
  membership: Membership
}

const customerSchema = new Schema<IBeaconCustomer>({
  email: { type: String, required: true, index: true, unique: true },
  customerId: { type: String, required: true, index: true, unique: true },
  name: { type: String, required: true },
  subscription: {
    id: { type: String, required: false },
    customerId: { type: String, required: false },
    status: { type: String, required: false }
  },
  membership: String
});

const Customer = models?.Customer || model('Customer', customerSchema, 'customers');

export default Customer;